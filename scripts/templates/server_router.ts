import {
  EnvironmentProviderOptions,
  IEnvironmentProvider,
  PreloadedQuery,
} from "react-relay/hooks";
import {
  createOperationDescriptor,
  GraphQLResponse,
  GraphQLSingularResponse,
  OperationDescriptor,
  OperationType,
  PayloadData,
  PreloadableQueryRegistry,
} from "relay-runtime";
import serialize from "serialize-javascript";
import type { Manifest } from "vite";
import { JSResource } from "./js_resource";
import { AnyPreloadedEntryPoint, RiverOps, Router } from "./router";

export class ServerRouter extends Router {
  async createApp(env: IEnvironmentProvider<EnvironmentProviderOptions>) {
    const ep = await this.loadEntryPoint(env);
    const ops = await this.loadQueries(ep);
    const RiverApp = this.createRiverAppFromEntryPoint(env, ep);
    RiverApp.bootstrap = (manifest) => this.bootstrapScripts(ep, ops, manifest);

    return RiverApp;
  }

  private async loadQueries(entryPoint: AnyPreloadedEntryPoint) {
    const preloadedQueryOps: [OperationDescriptor, PayloadData][] = [];
    for (const query of Object.values(
      entryPoint?.queries ?? {},
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

    return preloadedQueryOps;
  }

  private bootstrapScripts(
    entryPoint: AnyPreloadedEntryPoint,
    ops: RiverOps,
    manifest?: Manifest,
  ) {
    let bootstrap = `
      <script type="text/javascript">
        window.__river_ops = ${serialize(ops)};
      </script>`;

    const rootModuleSrc = JSResource.srcOfModuleId(entryPoint.rootModuleID);
    if (rootModuleSrc == null) return bootstrap;

    const chunk = manifest?.[rootModuleSrc];
    if (chunk == null) return bootstrap;

    bootstrap =
      `<link rel="modulepreload" href="${chunk.file}" />\n` + bootstrap;

    return bootstrap;
  }
}

type AnyPreloadedQuery = PreloadedQuery<OperationType>;
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
