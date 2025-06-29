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
import serialize from "serialize-javascript";
import { Manifest } from "vite";
import { Router } from "./router";

export class ServerRouter extends Router {
  async createApp() {
    await this.loadEntryPoint();
    await this.loadQueries();
    return this.RiverApp;
  }

  readonly preloadedQueryOps: [OperationDescriptor, PayloadData][] = [];
  private async loadQueries() {
    for (const query of Object.values(
      this.initialEntryPoint?.queries ?? {},
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

          this.preloadedQueryOps.push([
            desc,
            (payload as GraphQLSingularResponse).data!,
          ]);
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }

  bootstrapScripts(manifest?: Manifest) {
    const rootModule = this.initialEntryPoint?.rootModuleID;
    const preloadModuleFile =
      Object.values(manifest ?? {}).find((s) => s.name === rootModule)?.file ??
      null;

    return `
    <!-- I SHOULD PRELOAD THESE: ${JSON.stringify(preloadModuleFile)} -->
    <script type="text/javascript">
      window.__river_ops = ${serialize(this.preloadedQueryOps)};
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
