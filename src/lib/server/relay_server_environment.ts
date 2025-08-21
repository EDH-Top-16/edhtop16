import {graphql, GraphQLSchema} from 'graphql';
import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import {createContext} from './context';
import type {PreferencesMap} from '../shared/preferences-types';
import {getPreferencesFromRequest} from './cookies';

export function createServerEnvironment(
  schema: GraphQLSchema,
  persistedQueries?: Record<string, string>,
  request?: Request,
) {
  // Get preferences from request cookies for server-side rendering
  const preferences = request ? getPreferencesFromRequest(request) : {};
  //console.log('Server environment using preferences:', preferences);

  const networkFetchFunction: FetchFunction = async (
    requestParams,
    variables,
  ) => {
    let source = requestParams.text;
    if (source == null && requestParams.id) {
      source = persistedQueries?.[requestParams.id] ?? null;
    }

    if (source == null) {
      throw new Error(`Could not find source for query: ${requestParams.id}`);
    }

    // Create context with preferences available
    const contextValue = createContext(request, preferences);

    const results = await graphql({
      schema,
      source,
      variableValues: {
        ...variables,
        preferences, // Make preferences available to all queries
      },
      contextValue,
    });

    return results as any;
  };

  return new Environment({
    network: Network.create(networkFetchFunction),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}

// Server-side version of updateRelayPreferences (mainly for consistency)
// On the server, preferences come from cookies, so this would typically
// be used for testing or special cases
export function updateRelayPreferences(preferences: Partial<PreferencesMap>) {
  // On server, preferences are typically read from cookies on each request
  // This could be used for testing or special server-side scenarios
  console.debug('Server-side preference update:', preferences);
  // In most cases, you'd want to update the cookie/session instead
}

// Helper to create environment with specific preferences (useful for testing)
export function createServerEnvironmentWithPreferences(
  schema: GraphQLSchema,
  preferences: Partial<PreferencesMap>,
  persistedQueries?: Record<string, string>,
) {
  const networkFetchFunction: FetchFunction = async (
    requestParams,
    variables,
  ) => {
    let source = requestParams.text;
    if (source == null && requestParams.id) {
      source = persistedQueries?.[requestParams.id] ?? null;
    }

    if (source == null) {
      throw new Error(`Could not find source for query: ${requestParams.id}`);
    }

    const contextValue = createContext(undefined, preferences);

    const results = await graphql({
      schema,
      source,
      variableValues: {
        ...variables,
        preferences,
      },
      contextValue,
    });

    return results as any;
  };

  return new Environment({
    network: Network.create(networkFetchFunction),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
