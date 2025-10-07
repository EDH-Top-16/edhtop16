import {usePersistedOperations} from '@graphql-yoga/plugin-persisted-operations';
import express from 'express';
import {GraphQLSchema} from 'graphql';
import {createYoga, GraphQLParams} from 'graphql-yoga';
import {ComponentType, PropsWithChildren} from 'react';
import {renderToPipeableStream} from 'react-dom/server';
import {
  createOperationDescriptor,
  GraphQLResponse,
  GraphQLSingularResponse,
  OperationDescriptor,
  PayloadData,
  PreloadableQueryRegistry,
} from 'relay-runtime';
import serialize from 'serialize-javascript';
import type {Manifest} from 'vite';
import {
  AnyPreloadedEntryPoint,
  AnyPreloadedQuery,
  EnvironmentProvider,
  RouterOps,
} from '../relay_client_environment';
import {createServerEnvironment} from './relay_server_environment';

type SrcOfModuleId = (id: string) => string | null;
type AppComponent = ComponentType<PropsWithChildren<{}>>;
type RouterRootComponent = ComponentType<{
  preloadModules?: string[];
  preloadStylesheets?: string[];
  App?: AppComponent | null;
}>;
type CreateRouterRootFn = (
  initialEntryPoint: AnyPreloadedEntryPoint | null,
  provider: EnvironmentProvider,
  initialPath?: string,
) => RouterRootComponent;
type LoadEntryPointFn = (
  provider: EnvironmentProvider,
  initialPath?: string,
) => Promise<AnyPreloadedEntryPoint | null>;
type CreateContextFn = (req: Request) => unknown;

function createGraphqlHandler(
  schema: GraphQLSchema,
  createContext: CreateContextFn,
  persistedQueries: Record<string, string>,
) {
  return createYoga({
    schema,
    context: ({request}) => createContext(request),
    plugins: [
      // eslint-disable-next-line react-hooks/rules-of-hooks
      usePersistedOperations({
        allowArbitraryOperations: true,
        extractPersistedOperationId: (
          params: GraphQLParams & {id?: unknown},
        ) => (typeof params.id === 'string' ? params.id : null),
        getPersistedOperation: (key) => persistedQueries[key] ?? null,
      }),
    ],
  });
}

function createReactHandler(
  srcOfModuleId: SrcOfModuleId,
  loadEntryPoint: LoadEntryPointFn,
  createAppFromEntryPoint: CreateRouterRootFn,
  App: AppComponent | null,
  schema: GraphQLSchema,
  createContext: CreateContextFn,
  persistedQueries: Record<string, string>,
  manifest?: Manifest | null,
): express.Handler {
  return async (req, res) => {
    // TODO: Unify the GraphQL Yoga request with this one.
    // Do we even need GraphQL yoga at this point?
    const context = createContext(null!);
    const provider = createServerEnvironment(
      req,
      schema,
      persistedQueries,
      context,
    );

    const ep = await loadEntryPoint(provider, req.originalUrl);
    const ops = ep == null ? [] : await loadQueries(ep);
    const RouterApp = createAppFromEntryPoint(ep, provider, req.originalUrl);

    const {
      preloadModules,
      preloadStylesheets,
      bootstrapScriptContent,
      bootstrapModules,
    } = bootstrapScripts(srcOfModuleId, ep, ops, manifest);

    const {pipe} = renderToPipeableStream(
      <RouterApp
        App={App}
        preloadModules={preloadModules}
        preloadStylesheets={preloadStylesheets}
      />,
      {
        bootstrapScriptContent,
        bootstrapModules,
        onShellReady() {
          res.setHeader('Content-Type', 'text/html');
          pipe(res);
        },
      },
    );
  };
}

export function createRouterHandler(
  routes: string[],
  srcOfModuleId: SrcOfModuleId,
  loadEntryPoint: LoadEntryPointFn,
  createAppFromEntryPoint: CreateRouterRootFn,
  App: AppComponent | null,
  schema: GraphQLSchema,
  createContext: CreateContextFn,
  persistedQueries: Record<string, string>,
  manifest?: Manifest | null,
): express.Router {
  const r = express.Router();

  r.use(
    '/api/graphql',
    createGraphqlHandler(schema, createContext, persistedQueries),
  );

  r.get(
    routes,
    createReactHandler(
      srcOfModuleId,
      loadEntryPoint,
      createAppFromEntryPoint,
      App,
      schema,
      createContext,
      persistedQueries,
      manifest,
    ),
  );

  return r;
}

async function loadQueries(entryPoint: AnyPreloadedEntryPoint) {
  const preloadedQueryOps: [OperationDescriptor, PayloadData][] = [];
  for (const query of Object.values(
    entryPoint?.queries ?? {},
  ) as AnyPreloadedQuery[]) {
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

async function ensureQueryFlushed(
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

interface RouterBootstrap {
  preloadModules: string[];
  preloadStylesheets: string[];
  bootstrapScriptContent: string;
  bootstrapModules: string[];
}

function bootstrapScripts(
  srcOfModuleId: SrcOfModuleId,
  entryPoint: AnyPreloadedEntryPoint | null,
  ops: RouterOps,
  manifest?: Manifest | null,
): RouterBootstrap {
  const bootstrap: RouterBootstrap = {
    preloadModules: [],
    preloadStylesheets: [],
    bootstrapModules: [],
    bootstrapScriptContent: `window.__router_ops = ${serialize(ops)};`,
  };

  function crawlImports(moduleName: string) {
    const chunk = manifest?.[moduleName];
    if (!chunk) return;

    chunk.imports?.forEach(crawlImports);
    bootstrap.preloadModules.push('/' + chunk.file);
    if (chunk?.css) {
      bootstrap.preloadStylesheets.push(...chunk.css.map((css) => '/' + css));
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    bootstrap.preloadStylesheets.push('/src/globals.css');
    bootstrap.bootstrapModules.push(
      '/@vite/client',
      '/@id/virtual:pastoria-entry-client.tsx',
    );
  } else if (entryPoint != null) {
    const rootModuleSrc = srcOfModuleId(entryPoint.rootModuleID);
    if (rootModuleSrc == null) return bootstrap;

    const mainChunk = manifest?.[rootModuleSrc];
    if (mainChunk) {
      bootstrap.bootstrapModules.push('/' + mainChunk.file);
    }

    crawlImports(rootModuleSrc);
  }

  return bootstrap;
}
