#!/usr/bin/env node --experimental-strip-types

import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import {readFile} from 'node:fs/promises';
import * as path from 'node:path';
import pc from 'picocolors';
import type {Manifest} from 'vite';

interface PersistedQueries {
  [hash: string]: string;
}

interface ServerEntry {
  createHandler(
    persistedQueries: PersistedQueries,
    manifest?: Manifest,
  ): express.Router;
}

const MANIFEST_JSON = 'dist/client/.vite/manifest.json';
const QUERIES_JSON = '__generated__/persisted_queries.json';
const ENTRY_SERVER = path.join(
  process.cwd(),
  'dist/server/virtual_pastoria-entry-server.mjs',
);

async function createServer() {
  dotenv.config();

  const manifest: Manifest = JSON.parse(await readFile(MANIFEST_JSON, 'utf-8'));
  const persistedQueries = JSON.parse(await readFile(QUERIES_JSON, 'utf-8'));
  const {createHandler} = (await import(ENTRY_SERVER)) as ServerEntry;

  const handler = createHandler(persistedQueries, manifest);

  const app = express();
  app.use(cookieParser());
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
