import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import { execute, parse } from 'graphql';
import type { GraphQLSchema } from 'graphql';
import type {
  CommandersPreferences,
  EntryPreferences,
  TournamentPreferences,
  TournamentsPreferences,
  PreferencesMap,
} from '../client/cookies';

// Import SessionData type from client (since it's shared)
export type { SessionData } from '../client/relay_client_environment';

/**
 * Creates a server-side Relay environment for SSR.
 * This executes GraphQL directly against the schema instead of making HTTP requests.
 */
export function createServerEnvironment(
  schema: GraphQLSchema,
  persistedQueries: Record<string, string>,
  preferences: PreferencesMap,
  sessionData?: any
) {
  const network = Network.create(async (params, variables) => {
    // On the server, execute GraphQL directly against the schema
    let query: string | undefined;

    if (params.id && persistedQueries[params.id]) {
      // Use persisted query if available
      query = persistedQueries[params.id];
    } else if (params.text && typeof params.text === 'string') {
      // Use the query text directly (with explicit type check)
      query = params.text;
    } else {
      throw new Error('No query found for execution');
    }

    try {
      const result = await execute({
        schema,
        document: parse(query || ''),
        variableValues: variables,
        contextValue: {
          // Your existing context creation logic
          preferences,
          sessionData,
          sitePreferences: preferences, // For backward compatibility
        },
      });

      // Convert ExecutionResult to the format Relay expects
      return {
        data: result.data,
        errors: result.errors,
        extensions: result.extensions,
      } as any; // Type assertion to satisfy Relay's expected return type
    } catch (error) {
      console.error('Server GraphQL execution error:', error);
      throw error;
    }
  });

  return new Environment({
    network,
    store: new Store(new RecordSource()),
    isServer: true,
  });
}