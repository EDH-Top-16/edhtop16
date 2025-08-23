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
  const preferences = request ? getPreferencesFromRequest(request) : {};

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

    const contextValue = createContext(request, preferences);

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

export function updateRelayPreferences(preferences: Partial<PreferencesMap>) {
  console.debug('Server-side preference update:', preferences);
}

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
