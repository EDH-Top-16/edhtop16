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
import {TopdeckClient} from './lib/server/topdeck';
import {App} from './pages/_app';
import {createContext} from './lib/server/context';
import type {PreferencesMap} from './lib/client/cookies';

function createDefaultPreferences(): PreferencesMap {
  return {
    commanders: {
      sortBy: 'CONVERSION',
      timePeriod: 'ONE_MONTH',
      display: 'card',
      minEntries: 0,
      minTournamentSize: 0,
      colorId: '',
    },
  };
}

function parseCookies(cookieHeader: string): {
  cookies: Record<string, string>;
  preferences: PreferencesMap;
} {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return {
      cookies,
      preferences: createDefaultPreferences(),
    };
  }

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });

  let preferences = createDefaultPreferences();

  if (cookies.sitePreferences) {
    try {
      const decoded = decodeURIComponent(cookies.sitePreferences);
      const parsed = JSON.parse(decoded);
      preferences = {...preferences, ...parsed};
    } catch (error) {
      console.warn('❌ Failed to parse site preferences:', error);
    }
  }

  return {cookies, preferences};
}

const cookieCache = new WeakMap<Request, ReturnType<typeof parseCookies>>();
const requestPreferencesCache = new WeakMap<Request, PreferencesMap>();

export function useCreateHandler(
  template: string,
  persistedQueries: Record<string, string>,
  manifest?: Manifest,
) {
  const graphqlHandler = createYoga({
    schema,
    plugins: [
      usePersistedOperations({
        allowArbitraryOperations: true,
        extractPersistedOperationId: (
          params: GraphQLParams & {id?: unknown},
        ) => (typeof params.id === 'string' ? params.id : null),
        getPersistedOperation: (key) => persistedQueries[key] ?? null,
      }),
    ],
    context: async ({request}) => {
      if (requestPreferencesCache.has(request)) {
        const cachedPrefs = requestPreferencesCache.get(request)!;
        return createContext(new TopdeckClient(), cachedPrefs, () => {});
      }

      if (cookieCache.has(request)) {
        const cached = cookieCache.get(request)!;
        const prefs = cached.preferences;
        requestPreferencesCache.set(request, prefs);
        return createContext(new TopdeckClient(), prefs, () => {});
      }

      let preferences = createDefaultPreferences();

      try {
        const body = await request.clone().text();
        const parsed = JSON.parse(body);

        if (parsed.extensions?.sitePreferences) {
          preferences = {...preferences, ...parsed.extensions.sitePreferences};
        } else {
          const cookieHeader = request.headers.get('cookie') || '';
          const result = parseCookies(cookieHeader);
          preferences = result.preferences;
          cookieCache.set(request, result);
        }
      } catch (error) {
        console.warn('❌ GraphQL Context: Failed to parse preferences:', error);
      }

      requestPreferencesCache.set(request, preferences);
      return createContext(new TopdeckClient(), preferences, () => {});
    },
  });

  const entryPointHandler: express.Handler = async (req, res) => {
    const head = createHead();

    let preferences: PreferencesMap;

    if (requestPreferencesCache.has(req as any)) {
      preferences = requestPreferencesCache.get(req as any)!;
    } else {
      const result = parseCookies(req.headers.cookie || '');
      preferences = result.preferences;
      requestPreferencesCache.set(req as any, preferences);
    }

    const env = createServerEnvironment(schema, persistedQueries, preferences);

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

    const preferencesScript = `
<script>
  window.__SERVER_PREFERENCES__ = ${JSON.stringify(preferences)};
</script>`;

    const htmlWithPreferences = renderedHtml.replace(
      '</head>',
      `${preferencesScript}\n</head>`,
    );

    res.status(200).set({'Content-Type': 'text/html'}).end(htmlWithPreferences);
  };

  const r = express.Router();
  r.use('/api/graphql', graphqlHandler);
  for (const route of listRoutes()) {
    r.get(route, entryPointHandler);
  }

  return r;
}
