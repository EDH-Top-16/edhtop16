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
  RouterBootstrap,
} from './router';

type AnyPreloadedQuery = PreloadedQuery<OperationType>;

function router__bootstrapScripts(
  entryPoint: AnyPreloadedEntryPoint,
  ops: RouterOps,
  manifest?: Manifest,
): RouterBootstrap {
  const bootstrap: RouterBootstrap = {
    preloadModules: [],
    preloadStylesheets: [],
    bootstrapModules: [],
    bootstrapScriptContent: `window.__router_ops = ${serialize(ops)};`,
  };

  const rootModuleSrc = JSResource.srcOfModuleId(entryPoint.rootModuleID);
  if (rootModuleSrc == null) return bootstrap;

  if (process.env.NODE_ENV !== 'production') {
    bootstrap.bootstrapModules.push('/@vite/client', '/src/entry-client.tsx');
    bootstrap.preloadStylesheets.push('/src/globals.css');
  } else {
    const mainChunk = manifest?.[rootModuleSrc];
    if (mainChunk) {
      bootstrap.bootstrapModules.push('/' + mainChunk.file);
    }
  }

  function crawlImports(moduleName: string) {
    const chunk = manifest?.[moduleName];
    if (!chunk) return;

    chunk.imports?.forEach(crawlImports);
    bootstrap.preloadModules.push('/' + chunk.file);
    if (chunk?.css) {
      bootstrap.preloadStylesheets.push(...chunk.css.map((css) => '/' + css));
    }
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
