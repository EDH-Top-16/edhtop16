import {listRoutes} from '#genfiles/router/router';
import {createRouterServerApp} from '#genfiles/router/server_router';
import {getSchema} from '#genfiles/schema/schema';
import {Context} from '#src/lib/server/context';
import {App} from '#src/pages/_app';
import {usePersistedOperations} from '@graphql-yoga/plugin-persisted-operations';
import express from 'express';
import {GraphQLSchema, specifiedDirectives} from 'graphql';
import {createYoga, GraphQLParams} from 'graphql-yoga';
import {renderToPipeableStream} from 'react-dom/server';
import type {Manifest} from 'vite';

const schemaConfig = getSchema().toConfig();
const schema = new GraphQLSchema({
  ...schemaConfig,
  directives: [...specifiedDirectives, ...schemaConfig.directives],
});

export function createHandler(
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const graphqlHandler = createYoga<{req: express.Request}>({
    schema,
    context: ({req}) => {
      console.log(req);
      return new Context(req);
    },
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
    const RouterApp = await createRouterServerApp(
      req,
      schema,
      persistedQueries,
      () => new Context(req),
    );

    const {
      preloadModules,
      preloadStylesheets,
      bootstrapScriptContent,
      bootstrapModules,
    } = RouterApp.bootstrap(manifest);

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

  const r = express.Router();
  r.use('/api/graphql', graphqlHandler);
  for (const route of listRoutes()) {
    r.get(route, entryPointHandler);
  }

  return r;
}
