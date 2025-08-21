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

export function createHandler(
  template: string,
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const graphqlHandler = createYoga({
    schema,
    context: async (context) => {
      // Extract request for cookie parsing
      const request = context.request;
      return {
        request,
        // The createContext function will be called with this request
      };
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
    const head = createHead();
    
    // Convert Express request to Web API Request for cookie parsing
    //console.log('Express req.headers.cookie:', req.headers.cookie);
    //console.log('Express req.headers:', Object.keys(req.headers));

    const webRequest = new Request(`${req.protocol}://${req.get('host')}${req.originalUrl}`, {
      method: req.method,
      headers: Object.entries(req.headers).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value;
        } else if (Array.isArray(value)) {
          acc[key] = value.join(', ');
        }
        return acc;
      }, {} as Record<string, string>),
    });
    
    //console.log('Web request cookie header:', webRequest.headers.get('cookie'));

    // Create server environment with request to read cookies
    const env = createServerEnvironment(schema, persistedQueries, webRequest);
    
    const RiverApp = await createRiverServerApp(
      {getEnvironment: () => env},
      req.originalUrl,
    );

    function evaluateRiverDirective(match: string, directive: string) {
      switch (directive) {
        case 'render':
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
        case 'bootstrap':
          return RiverApp.bootstrap(manifest) ?? match;
        default:
          return match;
      }
    }

    let renderedHtml = await transformHtmlTemplate(
      head,
      template.replace(/<!--\s*@river:(\w+)\s*-->/g, evaluateRiverDirective),
    );

    // Inject server preferences into the HTML for client hydration
    const preferences = getPreferencesFromRequest(webRequest);
    //console.log('Server preferences being injected:', preferences);
    //console.log('Raw cookie header:', webRequest.headers.get('cookie'));
    
    const preferencesScript = `
      <script>
        window.__SERVER_PREFERENCES__ = ${JSON.stringify(preferences)};
        console.log('Server preferences injected into page:', ${JSON.stringify(preferences)});
      </script>
    `;
    renderedHtml = renderedHtml.replace('</head>', `${preferencesScript}</head>`);

    res.status(200).set({'Content-Type': 'text/html'}).end(renderedHtml);
  };

  const r = express.Router();
  r.use('/api/graphql', graphqlHandler);
  for (const route of listRoutes()) {
    r.get(route, entryPointHandler);
  }

  return r;
}
