import dotenv from "dotenv";
import express from "express";
import { readFile } from "node:fs/promises";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function createServer() {
  const vite = await createViteServer();

  const app = express();
  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    const persistedQueries = JSON.parse(
      await readFile("src/queries/persisted_queries.json", "utf-8"),
    );

    let template = await readFile("index.html", "utf-8");
    template = await vite.transformIndexHtml(req.originalUrl, template);

    const { createHandler } = (await vite.ssrLoadModule(
      "/src/entry-server.tsx",
    )) as typeof import("./src/entry-server");

    const handler = createHandler(template, persistedQueries);
    handler(req, res, next);
  });

  app.listen(5173);
}

createServer().catch(console.error);
