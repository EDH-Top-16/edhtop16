// entry-server.tsx - Updated with minimal optimizations
import {listRoutes} from '#genfiles/river/router';
import {createRiverServerApp} from '#genfiles/river/server_router';
import {usePersistedOperations} from '@graphql-yoga/plugin-persisted-operations';
import {
  createHead,
  transformHtmlTemplate,
  UnheadProvider,
} from '@unhead/react/server';
import express from 'express';
import {createYoga, GraphQLParams} from 'graphql-yoga';
import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import type {Manifest} from 'vite';
import {createServerEnvironment} from './lib/server/relay_server_environment';
import {getPreferencesFromRequest} from './lib/server/cookies';
import {schema} from './lib/server/schema';
import {App} from './pages/_app';
// NEW IMPORTS:
import {createSimpleDataLoaders} from './lib/server/simple-dataloaders'; // You'll create this
import {DEFAULT_PREFERENCES} from './lib/shared/preferences-types';
import {LoadingShell} from './components/loading_shell'; // You'll create this

export function CreateHandler(
  template: string,
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  // UPDATED: Enhanced Yoga setup with minimal optimizations
  const graphqlHandler = createYoga({
    schema,
    
    // NEW: Enable batching (built-in optimization)
    batching: true,
    graphiql: process.env.NODE_ENV === 'development',
    
    context: async (context) => {
      const request = context.request;
      return {
        request,
        // NEW: Add DataLoaders to context
        dataloaders: createSimpleDataLoaders(),
        // Add simple cache if you want
        cache: new Map(),
      };
    },
    plugins: [
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
    const head = createHead();

    const webRequest = new Request(
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      {
        method: req.method,
        headers: Object.entries(req.headers).reduce(
          (acc, [key, value]) => {
            if (typeof value === 'string') {
              acc[key] = value;
            } else if (Array.isArray(value)) {
              acc[key] = value.join(', ');
            }
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    );

    // NEW: Check if user has custom preferences
    const preferences = getPreferencesFromRequest(webRequest);
    const hasUserPreferences = Object.keys(preferences).some(key => 
      JSON.stringify(preferences[key as keyof typeof preferences]) !== 
      JSON.stringify(DEFAULT_PREFERENCES[key as keyof typeof DEFAULT_PREFERENCES])
    );

    // NEW: Conditional rendering based on preferences
    let RiverApp: Awaited<ReturnType<typeof createRiverServerApp>> | undefined;
    let env: ReturnType<typeof createServerEnvironment> | undefined;
    let shouldRenderWithData = false;

    if (hasUserPreferences) {
      // User has custom preferences, do full SSR
      const serverEnv = createServerEnvironment(schema, persistedQueries, webRequest);
      env = serverEnv;
      RiverApp = await createRiverServerApp(
        {getEnvironment: () => serverEnv},
        req.originalUrl,
      );
      shouldRenderWithData = true;
    } else {
      // No custom preferences, render loading shell
      shouldRenderWithData = false;
    }

    function evaluateRiverDirective(match: string, directive: string) {
      switch (directive) {
        case 'render':
          if (shouldRenderWithData && RiverApp && env) {
            // Full SSR with data
            return renderToString(
              <StrictMode>
                <UnheadProvider value={head}>
                  <RelayEnvironmentProvider environment={env}>
                    <App>
                      <RiverApp />
                    </App>
                  </RelayEnvironmentProvider>
                </UnheadProvider>
              </StrictMode>,
            );
          } else {
            // Just render loading shell
            return renderToString(
              <StrictMode>
                <UnheadProvider value={head}>
                  <App>
                    <LoadingShell />
                  </App>
                </UnheadProvider>
              </StrictMode>,
            );
          }
        case 'bootstrap':
          return shouldRenderWithData && RiverApp ? (RiverApp.bootstrap?.(manifest) ?? match) : match;
        // NEW: Add this directive to your HTML template
        case 'preload-state':
          return `<script>window.__SHOULD_WAIT_FOR_PREFERENCES__ = ${!shouldRenderWithData};</script>`;
        default:
          return match;
      }
    }

    const renderedHtml = await transformHtmlTemplate(
      head,
      template.replace(/<!--\s*@river:(\w+)\s*-->/g, evaluateRiverDirective),
    );

    res.status(200).set({'Content-Type': 'text/html'}).end(renderedHtml);
  };

  const r = express.Router();
  r.use('/api/graphql', graphqlHandler);
  for (const route of listRoutes()) {
    r.get(route, entryPointHandler);
  }

  return r;
}
