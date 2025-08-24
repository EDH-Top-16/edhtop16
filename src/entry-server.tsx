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
import {DEFAULT_PREFERENCES} from './lib/shared/preferences-types';
import {LoadingShell} from './components/loading_shell';
import {createRelayContext} from './lib/server/context';

export function CreateHandler(
  template: string,
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const graphqlHandler = createYoga({
    schema,

    batching: true,
    graphiql: process.env.NODE_ENV === 'development',

    context: async (context) => {
      const request = context.request;
//      
      // Use the new context creation function
      const serverContext = createRelayContext(request, context.params);

      return {
        ...serverContext,
        cache: new Map(),
      };

      // Add dataloaders
      //return {
      //  ...serverContext,
//        dataloaders: createSimpleDataLoaders(),
      //  cache: new Map(),
      //};
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

    // Get preferences for SSR decision - this logic remains the same
    const preferences = getPreferencesFromRequest(webRequest);
    const hasUserPreferences = Object.keys(preferences).some(
      (key) =>
        JSON.stringify(preferences[key as keyof typeof preferences]) !==
        JSON.stringify(
          DEFAULT_PREFERENCES[key as keyof typeof DEFAULT_PREFERENCES],
        ),
    );

    let RiverApp: Awaited<ReturnType<typeof createRiverServerApp>> | undefined;
    let env: ReturnType<typeof createServerEnvironment> | undefined;
    let shouldRenderWithData = false;

    if (hasUserPreferences) {
      const serverEnv = createServerEnvironment(
        schema,
        persistedQueries,
        webRequest,
      );
      env = serverEnv;
      RiverApp = await createRiverServerApp(
        {getEnvironment: () => serverEnv},
        req.originalUrl,
      );
      shouldRenderWithData = true;
      
      console.debug('🚀 SSR with user preferences:', {
        hasUserPreferences,
        preferences: Object.keys(preferences),
      });
    } else {
      shouldRenderWithData = false;
      console.debug('🚀 SSR without preferences - client will hydrate');
    }

    function evaluateRiverDirective(match: string, directive: string) {
      switch (directive) {
        case 'render':
          if (shouldRenderWithData && RiverApp && env) {
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
          return shouldRenderWithData && RiverApp
            ? (RiverApp.bootstrap?.(manifest) ?? match)
            : match;

        case 'preload-state':
          // Enhanced preload state to include context info
          const contextInfo = shouldRenderWithData 
            ? `window.__RELAY_CONTEXT__ = ${JSON.stringify(preferences)};` 
            : '';
          return `<script>
            window.__SHOULD_WAIT_FOR_PREFERENCES__ = ${!shouldRenderWithData};
            ${contextInfo}
          </script>`;
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
  
  // Properly wrap Yoga handler for Express
  r.all('/api/graphql', async (req, res) => {
    // Create a proper Request object from Express req
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const request = new Request(url, {
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
      body: req.method !== 'GET' && req.method !== 'HEAD' 
        ? JSON.stringify(req.body)
        : undefined,
    });

    // Call Yoga handler with proper Request
    const response = await graphqlHandler.fetch(request, {
      req,
      res,
    });

    // Forward response to Express
    res.status(response.status);
    
    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send body
    if (response.body) {
      const body = await response.text();
      res.send(body);
    } else {
      res.end();
    }
  });
  
  for (const route of listRoutes()) {
    r.get(route, entryPointHandler);
  }

  return r;
}
