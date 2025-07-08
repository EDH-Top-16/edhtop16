import dotenv from 'dotenv';
import express from 'express';
import {readFile} from 'node:fs/promises';
import pc from 'picocolors';
import type {Manifest} from 'vite';

const INDEX_HTML = 'dist/client/index.html';
const MANIFEST_JSON = 'dist/client/.vite/manifest.json';
const QUERIES_JSON = '__generated__/persisted_queries.json';
const ENTRY_SERVER = './dist/server/entry-server.mjs';

dotenv.config();

async function createServer() {
  const template = await readFile(INDEX_HTML, 'utf-8');
  const manifest: Manifest = JSON.parse(await readFile(MANIFEST_JSON, 'utf-8'));
  const persistedQueries = JSON.parse(await readFile(QUERIES_JSON, 'utf-8'));
  const {createHandler} = (await import(
    ENTRY_SERVER
  )) as typeof import('./src/entry-server');

  const handler = createHandler(template, persistedQueries, manifest);

  const app = express();
  app.use(handler);
  app.use(express.static('dist/client'));

  app.listen(8000, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(pc.cyan('Listening on port 8000!'));
    }
  });
}

createServer().catch(console.error);
