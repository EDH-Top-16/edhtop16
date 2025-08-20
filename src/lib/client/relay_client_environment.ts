import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import type { PreferencesMap } from '../shared/preferences-types';

// Store preferences in the environment's context
let environmentPreferences: Partial<PreferencesMap> = {};

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Preferences': JSON.stringify(environmentPreferences), // Optional: send as header too
      },
      body: JSON.stringify({
        query: params.text,
        id: params.id,
        variables: {
          ...variables,
          preferences: environmentPreferences, // Include preferences in variables
        },
        extensions: {},
      }),
    });

    const json = await response.text();
    return JSON.parse(json);
  });
}

let clientEnv: Environment | undefined;

export function getClientEnvironment() {
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    });
  }

  return clientEnv;
}

// Function to update preferences in the Relay environment
export function updateRelayPreferences(preferences: Partial<PreferencesMap>) {
  environmentPreferences = {
    ...environmentPreferences,
    ...preferences,
  };
  
  // If we have an environment, we could potentially trigger a refetch here
  // or update any cached data that depends on preferences
  if (clientEnv) {
    // Optional: You could emit a custom event or trigger specific refetches
    // This depends on your specific needs
    console.debug('Updated Relay preferences:', environmentPreferences);
  }
}

// Function to get current preferences from the environment
export function getRelayPreferences(): Partial<PreferencesMap> {
  return environmentPreferences;
}

// Function to clear preferences (useful for logout, etc.)
export function clearRelayPreferences() {
  environmentPreferences = {};
}
