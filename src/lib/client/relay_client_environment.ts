import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import type {PreferencesMap} from '../shared/preferences-types';

let environmentPreferences: Partial<PreferencesMap> = {};

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Preferences': JSON.stringify(environmentPreferences),
      },
      body: JSON.stringify({
        query: params.text,
        id: params.id,
        variables: {
          ...variables,
          preferences: environmentPreferences,
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

export function updateRelayPreferences(preferences: Partial<PreferencesMap>) {
  environmentPreferences = {
    ...environmentPreferences,
    ...preferences,
  };

  if (clientEnv) {
    console.debug('Updated Relay preferences:', environmentPreferences);
  }
}

export function getRelayPreferences(): Partial<PreferencesMap> {
  return environmentPreferences;
}

export function clearRelayPreferences() {
  environmentPreferences = {};
}
