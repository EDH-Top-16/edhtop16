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
import {schema} from './lib/server/schema';
import {App} from './pages/_app';
import type {CommanderPreferences} from './lib/client/cookies';

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}

export function createHandler(
  template: string,
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const graphqlHandler = createYoga({
    schema,
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
    context: async ({ request }) => {
      const req = request as any;
      const res = request as any;
      
      let commanderPreferences: CommanderPreferences = {};
      
      try {
        const body = await request.clone().text();
        const parsed = JSON.parse(body);
        
        if (parsed.extensions?.commanderPreferences) {
          commanderPreferences = parsed.extensions.commanderPreferences;
        } else {
          const cookies = parseCookies(req.headers.cookie || '');
          const cookiePrefs = cookies.commanderPreferences;
          
          if (cookiePrefs) {
            commanderPreferences = JSON.parse(cookiePrefs);
          }
        }
      } catch (error) {
        console.warn('Failed to parse commander preferences:', error);
      }

      const setCommanderPreferences = (prefs: CommanderPreferences) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
        
        res.setHeader('Set-Cookie', [
          `commanderPreferences=${encodeURIComponent(JSON.stringify(prefs))}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
        ]);
      };

      return {  // Add context properties as we have more
        commanderPreferences,
        setCommanderPreferences,
      };
    },
  });

  const entryPointHandler: express.Handler = async (req, res) => {
    const head = createHead();
    const env = createServerEnvironment(schema, persistedQueries);
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
