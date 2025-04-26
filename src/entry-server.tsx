import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { PreloadedQuery } from "react-relay";
import { GraphQLResponse, OperationType } from "relay-runtime";
import { createRiverApp } from "./lib/river/create_app";
import { Router } from "./lib/river/router";
import { createServerEnvironment } from "./lib/server/relay_server_environment";

export async function render(url: string) {
  const router = new Router(url);
  const env = createServerEnvironment();
  const { App, entrypoint } = createRiverApp(router, env);

  for (const query of Object.values(entrypoint?.queries ?? {})) {
    try {
      await ensureQueryFlushed(query);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // TODO render to node stream
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  console.log("Entrypoint:", entrypoint);

  return {
    html,
    rootModule: entrypoint?.rootModuleID,
    records: env.getStore().getSource().toJSON(),
  };
}

export type AnyPreloadedQuery = PreloadedQuery<OperationType>;
async function ensureQueryFlushed(
  query: AnyPreloadedQuery,
): Promise<GraphQLResponse> {
  return new Promise((resolve, reject) => {
    if (query.source == null) {
      resolve({ data: {} });
    } else {
      query.source.subscribe({
        next: resolve,
        error: reject,
      });
    }
  });
}
