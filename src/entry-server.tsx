import { usePersistedOperations } from "@graphql-yoga/plugin-persisted-operations";
import express from "express";
import { createYoga, GraphQLParams } from "graphql-yoga";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { RelayEnvironmentProvider } from "react-relay";
import type { Manifest } from "vite";
import { ServerRouter } from "./lib/river/server_router";
import { createServerEnvironment } from "./lib/server/relay_server_environment";
import { schema } from "./lib/server/schema";
import { App } from "./pages/_app";

export function createHandler(
  template: string,
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const graphqlHandler = createYoga({
    schema,
    plugins: [
      usePersistedOperations({
        allowArbitraryOperations: true,
        extractPersistedOperationId: (
          params: GraphQLParams & { id?: unknown },
        ) => (typeof params.id === "string" ? params.id : null),
        getPersistedOperation: (key) => persistedQueries[key] ?? null,
      }),
    ],
  });

  const entryPointHandler: express.Handler = async (req, res) => {
    const env = createServerEnvironment();
    const router = new ServerRouter(req.originalUrl);
    const RiverApp = await router.createApp({ getEnvironment: () => env });

    function evaluateRiverDirective(match: string, directive: string) {
      switch (directive) {
        case "render":
          return renderToString(
            <StrictMode>
              <RelayEnvironmentProvider environment={env}>
                <App>
                  <RiverApp />
                </App>
              </RelayEnvironmentProvider>
            </StrictMode>,
          );
        case "bootstrap":
          return RiverApp.bootstrap(manifest) ?? match;
        default:
          return match;
      }
    }

    res
      .status(200)
      .set({ "Content-Type": "text/html" })
      .end(
        template.replace(/<!--\s*@river:(\w+)\s*-->/g, evaluateRiverDirective),
      );
  };

  const r = express.Router();
  r.use("/api/graphql", graphqlHandler);
  for (const route of ServerRouter.routes) {
    r.get(route, entryPointHandler);
  }

  return r;
}
