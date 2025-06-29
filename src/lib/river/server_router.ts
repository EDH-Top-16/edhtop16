import {
  EnvironmentProviderOptions,
  IEnvironmentProvider,
  PreloadedEntryPoint,
  PreloadedQuery,
} from "react-relay";
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
import { Router } from "./router";

type AnyPreloadedEntryPoint = PreloadedEntryPoint<any>;
type RiverOps = [OperationDescriptor, PayloadData][];

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
    const rootModule = entryPoint.rootModuleID;
    const preloadModuleFile =
      Object.values(manifest ?? {}).find((s) => s.name === rootModule)?.file ??
      null;

    return `
      <!-- I SHOULD PRELOAD THESE: ${JSON.stringify(preloadModuleFile)} -->
      <script type="text/javascript">
        window.__river_ops = ${serialize(ops)};
      </script>`;
  }
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
