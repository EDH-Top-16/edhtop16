import {
  EnvironmentProviderOptions,
  IEnvironmentProvider,
  OperationDescriptor,
  PreloadedQuery,
} from 'react-relay/hooks';
import {
  createOperationDescriptor,
  GraphQLResponse,
  GraphQLSingularResponse,
  OperationType,
  PayloadData,
  PreloadableQueryRegistry,
} from 'relay-runtime';
import serialize from 'serialize-javascript';
import type {Manifest} from 'vite';
import {JSResource} from './js_resource';
import {
  AnyPreloadedEntryPoint,
  router__createAppFromEntryPoint,
  router__loadEntryPoint,
  RouterOps,
} from './router';

type AnyPreloadedQuery = PreloadedQuery<OperationType>;

function router__bootstrapScripts(
  entryPoint: AnyPreloadedEntryPoint,
  ops: RouterOps,
  manifest?: Manifest,
) {
  let bootstrap = `
      <script type="text/javascript">
        window.__router_ops = ${serialize(ops)};
      </script>`;

  const rootModuleSrc = JSResource.srcOfModuleId(entryPoint.rootModuleID);
  if (rootModuleSrc == null) return bootstrap;

  function crawlImports(moduleName: string) {
    const chunk = manifest?.[moduleName];
    if (!chunk) return;

    chunk.imports?.forEach(crawlImports);
    bootstrap =
      `<link rel="modulepreload" href="${chunk.file}" />\n` + bootstrap;
  }

  crawlImports(rootModuleSrc);
  return bootstrap;
}

async function router__ensureQueryFlushed(
  query: AnyPreloadedQuery,
): Promise<GraphQLResponse> {
  return new Promise((resolve, reject) => {
    if (query.source == null) {
      resolve({data: {}});
    } else {
      query.source.subscribe({
        next: resolve,
        error: reject,
      });
    }
  });
}

async function router__loadQueries(entryPoint: AnyPreloadedEntryPoint) {
  const preloadedQueryOps: [OperationDescriptor, PayloadData][] = [];
  for (const query of Object.values(
    entryPoint?.queries ?? {},
  ) as PreloadedQuery<OperationType>[]) {
    try {
      const payload = await router__ensureQueryFlushed(query);
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

export async function createRouterServerApp(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
  initialPath: string,
) {
  const ep = await router__loadEntryPoint(provider, initialPath);
  const ops = ep != null ? await router__loadQueries(ep) : [];
  const RouterApp = router__createAppFromEntryPoint(provider, ep, initialPath);

  if (ep != null) {
    RouterApp.bootstrap = (manifest) =>
      router__bootstrapScripts(ep, ops, manifest);
  }

  return RouterApp;
}
