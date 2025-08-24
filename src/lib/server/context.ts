import {Context} from './schema/builder';
import {TopdeckClient} from './topdeck';
import type {PreferencesMap} from '../shared/preferences-types';
import {getPreferencesFromRequest} from './cookies';
import {DEFAULT_PREFERENCES} from '../shared/preferences-types';

export interface RelayContextData {
  preferences: PreferencesMap;
  user?: {
    id: string;
    roles: string[];
  };
  // Add other context fields as needed
}

export function createContext(
  request?: Request,
  preferences?: Partial<PreferencesMap>,
): Context {
  let relayContext: PreferencesMap = {};

  // Multi-source context extraction with priority order:
  // 1. Explicit preferences parameter (highest priority)
  // 2. X-Relay-Context header (new approach)
  // 3. X-Preferences header (legacy)
  // 4. Request cookies/body (fallback)
  // 5. Default preferences (last resort)

  if (preferences && Object.keys(preferences).length > 0) {
    relayContext = {
      ...DEFAULT_PREFERENCES,
      ...preferences,
    };
    console.debug('📊 Relay Context from explicit preferences:', relayContext);
  } else if (request) {
    try {
      const relayContextHeader = request.headers.get('X-Relay-Context');
      if (relayContextHeader) {
        const parsedContext = JSON.parse(relayContextHeader);
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...(parsedContext.preferences || parsedContext),
        };
        console.debug(
          '📊 Relay Context from X-Relay-Context header:',
          relayContext,
        );
      } else {
        const prefsHeader = request.headers.get('X-Preferences');
        if (prefsHeader) {
          relayContext = {
            ...DEFAULT_PREFERENCES,
            ...JSON.parse(prefsHeader),
          };
          console.debug(
            '📊 Relay Context from X-Preferences header (legacy):',
            relayContext,
          );
        } else {
          relayContext = {
            ...DEFAULT_PREFERENCES,
            ...getPreferencesFromRequest(request),
          };
          console.debug(
            '📊 Relay Context from request (cookies):',
            relayContext,
          );
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse relay context from request:', error);
      relayContext = DEFAULT_PREFERENCES;
    }
  } else {
    relayContext = DEFAULT_PREFERENCES;
    console.debug('📊 Relay Context using defaults (no request)');
  }

  return {
    topdeckClient: new TopdeckClient(),
    preferences: relayContext,
    relayContext,
    request,
  };
}

export function createRelayContext(
  request: Request,
  graphqlParams?: {
    extensions?: {
      relayContext?: {
        preferences?: Partial<PreferencesMap>;
        user?: {id: string; roles: string[]};
      };
    };
  },
): Context {
  let relayContext: PreferencesMap = {};

  try {
    // Priority 1: GraphQL extensions (from client environment)
    if (graphqlParams?.extensions?.relayContext?.preferences) {
      relayContext = {
        ...DEFAULT_PREFERENCES,
        ...graphqlParams.extensions.relayContext.preferences,
      };
      console.debug('📊 Relay Context from GraphQL extensions:', relayContext);
    } else {
      // Priority 2: Headers
      const relayContextHeader = request.headers.get('X-Relay-Context');
      const prefsHeader = request.headers.get('X-Preferences');

      if (relayContextHeader) {
        const parsedContext = JSON.parse(relayContextHeader);
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...(parsedContext.preferences || parsedContext), // Handle both formats
        };
        console.debug(
          '📊 Relay Context from X-Relay-Context header:',
          relayContext,
        );
      } else if (prefsHeader) {
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...JSON.parse(prefsHeader),
        };
        console.debug(
          '📊 Relay Context from X-Preferences header (legacy):',
          relayContext,
        );
      } else {
        // Priority 3: Request cookies
        relayContext = {
          ...DEFAULT_PREFERENCES,
          ...getPreferencesFromRequest(request),
        };
        console.debug('📊 Relay Context from request cookies:', relayContext);
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to extract relay context:', error);
    relayContext = DEFAULT_PREFERENCES;
  }

  return {
    topdeckClient: new TopdeckClient(),
    preferences: relayContext, // Maintain backward compatibility
    relayContext, // New explicit property
    request,
    // TODO: Add user extraction when ready
    // user: extractUserFromRequest(request, graphqlParams),
  };
}

export function getContextPreferences(
  context: Context,
  key?: keyof PreferencesMap,
) {
  if (key) {
    return context.relayContext?.[key] || context.preferences?.[key];
  }
  return context.relayContext || context.preferences;
}
