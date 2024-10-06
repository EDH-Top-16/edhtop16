/**
 * @fileoverview This is a custom Next.js server only intended for use in
 * production. It overrides Next.js's usage of the http module to integrate
 * with unit-http, but otherwise adds no additional behavior.
 */

const { createServer } = require("unit-http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";

// These variables are overridden at runtime by unit-http.
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
