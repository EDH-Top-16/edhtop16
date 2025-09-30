import {listRoutes} from '#genfiles/router/router';
import {createRouterServerApp} from '#genfiles/router/server_router';
import {getSchema} from '#genfiles/schema/schema';
import {usePersistedOperations} from '@graphql-yoga/plugin-persisted-operations';
import express from 'express';
import {createYoga, GraphQLParams} from 'graphql-yoga';
import {StrictMode} from 'react';
import {renderToPipeableStream, renderToString} from 'react-dom/server';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import type {Manifest} from 'vite';
import {Context} from './lib/server/context';
import {createServerEnvironment} from './lib/server/relay_server_environment';
import {App} from './pages/_app';
import {GraphQLSchema, specifiedDirectives} from 'graphql';

const schemaConfig = getSchema().toConfig();
const schema = new GraphQLSchema({
  ...schemaConfig,
  directives: [...specifiedDirectives, ...schemaConfig.directives],
});

export function createHandler(
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const context = new Context();

  const graphqlHandler = createYoga({
    schema,
    context,
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

  const entryPointHandler: express.Handler = async (req, res) => {
    const env = createServerEnvironment(req, schema, persistedQueries);
    const RouterApp = await createRouterServerApp(
      {getEnvironment: () => env},
      req.originalUrl,
    );

    const {
      preloadModules,
      preloadStylesheets,
      bootstrapScriptContent,
      bootstrapModules,
    } = RouterApp.bootstrap(manifest);

    const app = (
      <StrictMode>
        <RelayEnvironmentProvider environment={env}>
          <RouterApp.Shell
            preloadModules={preloadModules}
            preloadStylesheets={preloadStylesheets}
          >
            <App>
              <RouterApp />
            </App>
          </RouterApp.Shell>
        </RelayEnvironmentProvider>
      </StrictMode>
    );

    const {pipe} = renderToPipeableStream(app, {
      bootstrapScriptContent,
      bootstrapModules,
      onShellReady() {
        res.setHeader('Content-Type', 'text/html');
        pipe(res);
      },
    });
  };

  const r = express.Router();
  r.use('/api/graphql', graphqlHandler);
  for (const route of listRoutes()) {
    r.get(route, entryPointHandler);
  }

  return r;
}
