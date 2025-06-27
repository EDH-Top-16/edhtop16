/* eslint-disable react-hooks/rules-of-hooks */
import { usePersistedOperations } from "@graphql-yoga/plugin-persisted-operations";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import express from "express";
import { createYoga, type GraphQLParams } from "graphql-yoga";
import { readFile } from "node:fs/promises";
import serialize from "serialize-javascript";
import { createServer as createViteServer, Manifest } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";

dotenv.config();

async function createServer() {
  let manifest: Manifest = {};
  if (process.env.NODE_ENV === "production") {
    const manifestJson = await readFile("./dist/.vite/manifest.json");
    manifest = JSON.parse(manifestJson.toString("utf-8"));
  }

  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    build: {
      manifest: true,
      ssrManifest: true,
    },
    plugins: [
      tailwindcss(),
      react({ babel: { plugins: ["relay"] } }),
      cjsInterop({ dependencies: ["react-relay", "relay-runtime"] }),
    ],
  });

  app.use(vite.middlewares);

  app.use("/api/graphql", async (req, res) => {
    const { schema } = await vite.ssrLoadModule("/src/lib/server/schema");
    const middleware = createYoga({
      schema,
      plugins: [
        usePersistedOperations({
          allowArbitraryOperations: true,
          extractPersistedOperationId(
            params: GraphQLParams & { id?: unknown },
          ) {
            return typeof params.id === "string" ? params.id : null;
          },
          getPersistedOperation(key: string) {
            return getPersistedQuery(key);
          },
        }),
      ],
    });

    return middleware(req, res);
  });

  app.use("*all", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = await readFile("index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);

      const { render } = (await vite.ssrLoadModule(
        "/src/entry-server.tsx",
      )) as typeof import("./src/entry-server");

      console.log("Loaded module, rendering, ", url);
      const { html, ops, rootModule } = await render(url);
      const preloadModuleFile =
        Object.values(manifest).find((s) => s.name === rootModule)?.file ??
        null;

      const renderedPage = template
        .replace(`<!--app-html-->`, () => html)
        .replace(
          "<!--app-head-->",
          `
                  <!-- I SHOULD PRELOAD THESE: ${JSON.stringify(
                    preloadModuleFile,
                  )} -->

      <script type="text/javascript">
        window.__river_ops = ${serialize(ops)};
      </script>`,
        );

      res.status(200).set({ "Content-Type": "text/html" }).end(renderedPage);
    } catch (e) {
      vite.ssrFixStacktrace(e as any);
      next(e);
    }
  });

  app.listen(5173);
}

let persistedQueryCache: Promise<Record<string, string>> | null = null;
async function getPersistedQuery(id: string) {
  if (persistedQueryCache == null || process.env.NODE_ENV !== "production") {
    persistedQueryCache = (async () => {
      const persistedQueriesSource = await readFile(
        "src/queries/persisted_queries.json",
      );

      return JSON.parse(persistedQueriesSource.toString("utf-8"));
    })();
  }

  const persistedQueries = await persistedQueryCache;
  return persistedQueries[id] ?? null;
}

createServer();
