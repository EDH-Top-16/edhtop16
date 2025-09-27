import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import {readFile} from 'node:fs/promises';
import pc from 'picocolors';
import {createRsbuild} from '@rsbuild/core';
import rsbuildConfig from './rsbuild.config';

dotenv.config();

async function createServer() {
  const rsbuild = await createRsbuild({
    cwd: process.cwd(),
    rsbuildConfig,
  });
  const {devServer} = await rsbuild.startDevServer();

  const app = express();
  app.use(cookieParser());
  app.use(devServer.middlewares);
  app.use(async (req, res, next) => {
    const persistedQueries = JSON.parse(
      await readFile('__generated__/persisted_queries.json', 'utf-8'),
    );

    let template = await readFile('index.html', 'utf-8');
    if (typeof devServer.transformIndexHtml === 'function') {
      template = await devServer.transformIndexHtml(req.originalUrl, template);
    }

    if (typeof devServer.ssrLoadModule !== 'function') {
      throw new Error('Rsbuild dev server does not expose ssrLoadModule.');
    }

    const {createHandler} = (await devServer.ssrLoadModule(
      '/src/entry-server.tsx',
    )) as typeof import('./src/entry-server');

    const handler = createHandler(template, persistedQueries);
    handler(req, res, next);
  });

  app.listen(3000, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(pc.cyan('Listening on port 3000!'));
    }
  });
}

createServer().catch(console.error);
