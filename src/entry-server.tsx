import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { PreloadedQuery } from "react-relay";
import {
  createOperationDescriptor,
  GraphQLResponse,
  GraphQLSingularResponse,
  OperationDescriptor,
  OperationType,
  PayloadData,
  PreloadableQueryRegistry,
} from "relay-runtime";
import { createRiverApp } from "./lib/river/create_app";
import { Router } from "./lib/river/router";
import { createServerEnvironment } from "./lib/server/relay_server_environment";

export async function render(url: string) {
  const router = new Router(url);
  const env = createServerEnvironment();

  await router.route()?.entrypoint?.root.load();
  const { App, entrypoint } = createRiverApp(router, env);

  const preloadedQueryOps: [OperationDescriptor, PayloadData][] = [];
  for (const query of Object.values(
    entrypoint?.queries ?? {},
  ) as PreloadedQuery<OperationType>[]) {
    try {
      const payload = await ensureQueryFlushed(query);
      const concreteRequest =
        query.id == null ? null : PreloadableQueryRegistry.get(query.id);

      if (concreteRequest != null) {
        const desc = createOperationDescriptor(
          concreteRequest,
          query.variables,
        );

        preloadedQueryOps.push([
          desc,
          (payload as GraphQLSingularResponse).data!,
        ]);
      }
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

  return {
    html,
    rootModule: entrypoint?.rootModuleID,
    ops: preloadedQueryOps,
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
