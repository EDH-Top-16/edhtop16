import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import {readFile} from 'node:fs/promises';
import pc from 'picocolors';
import {createServer as createViteServer, type Manifest} from 'vite';
import {CLIENT_BUILD, createBuildConfig} from './build.mts';

interface PersistedQueries {
  [hash: string]: string;
}

interface ServerEntry {
  createHandler(
    persistedQueries: PersistedQueries,
    manifest?: Manifest,
  ): express.Router;
}

export async function startDevserver(opts: {port: string}) {
  dotenv.config();

  const buildConfig = createBuildConfig(CLIENT_BUILD);
  const vite = await createViteServer({
    ...buildConfig,
    configFile: false,
    server: {middlewareMode: true},
  });

  const app = express();
  app.use(cookieParser());
  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    const persistedQueries = JSON.parse(
      await readFile('__generated__/persisted_queries.json', 'utf-8'),
    );

    const {createHandler} = (await vite.ssrLoadModule(
      'virtual:pastoria-entry-server.tsx',
    )) as ServerEntry;

    const handler = createHandler(persistedQueries);
    handler(req, res, next);
  });

  app.listen(Number(opts.port), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(pc.cyan(`Listening on port ${opts.port}!`));
    }
  });
}
