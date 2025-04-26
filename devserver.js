const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const { createServer: createViteServer } = require("vite");
const react = require("@vitejs/plugin-react");
const { cjsInterop } = require("vite-plugin-cjs-interop");

require("dotenv").config();

let manifest = {};
if (process.env.NODE_ENV === "production") {
  manifest = require("./dist/.vite/manifest.json");
}

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    build: {
      manifest: true,
      ssrManifest: true,
    },
    plugins: [
      react({ babel: { plugins: ["relay"] } }),
      cjsInterop({ dependencies: ["react-relay", "relay-runtime"] }),
    ],
  });

  app.use(vite.middlewares);

  app.use("*all", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8",
      );

      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      console.log("Loaded module, rendering, ", url);
      const { html: appHtml, rootModule, records } = await render(url);

      const preloadModuleFile = Object.entries(manifest).find(
        (s) => s.name === rootModule,
      )?.file;

      const html = template
        .replace(`<!--app-html-->`, () => appHtml)
        .replace(
          "<!--app-head-->",
          `<!-- I SHOULD PRELOAD THESE:

          ${JSON.stringify(preloadModuleFile)}
          
          AND I SHOULD SET THIS __river_records =

          ${JSON.stringify(records, null, 2)}
          -->`,
        );
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173);
}

createServer();
