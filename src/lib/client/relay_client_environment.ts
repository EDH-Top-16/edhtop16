import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import type {RecordSourceSelectorProxy} from 'relay-runtime';
import type {PreferencesMap} from '../shared/preferences-types';
import {getCurrentPreferences, setCookieValue} from '../shared/cookie-utils';

// Enhanced environment with context support
interface RelayEnvironmentWithContext extends Environment {
  setContext: (newContext: Partial<PreferencesMap>) => void;
  getContext: () => PreferencesMap;
  updateContextAndInvalidate: (newContext: Partial<PreferencesMap>) => void;
}

// Global context state
let environmentContext: PreferencesMap = {} as PreferencesMap;
let contextChangeListeners: Set<() => void> = new Set();

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const currentContext = getEnvironmentContext();
    
    const response = await fetch('/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Send context as header for server-side processing
        'X-Relay-Context': JSON.stringify(currentContext),
        // Keep legacy header for backward compatibility during migration
        'X-Preferences': JSON.stringify(currentContext),
      },
      body: JSON.stringify({
        query: params.text,
        id: params.id,
        variables: {
          ...variables,
          // Remove this once fully migrated to context
          preferences: currentContext,
        },
        // Pass context in GraphQL extensions (Relay standard way)
        extensions: {
          relayContext: currentContext,
        },
      }),
    });

    const json = await response.text();
    return JSON.parse(json);
  });
}

let clientEnv: RelayEnvironmentWithContext | undefined;

export function getClientEnvironment(): RelayEnvironmentWithContext | null {
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    // Initialize context from cookies on first load
    environmentContext = getCurrentPreferences();

    const baseEnvironment = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    }) as RelayEnvironmentWithContext;

    // Add context methods
    baseEnvironment.getContext = () => {
      return environmentContext;
    };

    baseEnvironment.setContext = (newContext: Partial<PreferencesMap>) => {
      const previousContext = { ...environmentContext };
      environmentContext = {
        ...environmentContext,
        ...newContext,
      };

      // Update cookies
      const jsonToSave = JSON.stringify(environmentContext);
      setCookieValue('sitePreferences', jsonToSave);

      // Notify listeners (for debugging/dev tools)
      contextChangeListeners.forEach(listener => listener());

      console.debug('Context updated:', {
        previous: previousContext,
        current: environmentContext,
        changed: newContext,
      });
    };

    baseEnvironment.updateContextAndInvalidate = (newContext: Partial<PreferencesMap>) => {
      baseEnvironment.setContext(newContext);
      
      baseEnvironment.commitUpdate((store) => {
        (store as any).invalidateStore();  // hack for weird type issue with invalidateStore
      });
      
      console.debug('Store invalidated due to context change');
    };

    clientEnv = baseEnvironment;
  }

  return clientEnv;
}

// Utility functions for managing context
export function getEnvironmentContext(): PreferencesMap {
  return environmentContext;
}

export function updateRelayContext(newContext: Partial<PreferencesMap>) {
  const env = getClientEnvironment();
  if (env) {
    env.updateContextAndInvalidate(newContext);
  } else {
    // Fallback for server-side or before environment is ready
    environmentContext = {
      ...environmentContext,
      ...newContext,
    };
  }
}

// Legacy function - keep for backward compatibility during migration
export function updateRelayPreferences(preferences: Partial<PreferencesMap>) {
  console.warn('updateRelayPreferences is deprecated, use updateRelayContext instead');
  updateRelayContext(preferences);
}

// Legacy function - keep for backward compatibility
export function getRelayPreferences(): Partial<PreferencesMap> {
  console.warn('getRelayPreferences is deprecated, use getEnvironmentContext instead');
  return getEnvironmentContext();
}

export function clearRelayContext() {
  const env = getClientEnvironment();
  if (env) {
    env.setContext({});
    // Use the proper typing - commitUpdate expects RecordSourceProxy, not RecordSourceSelectorProxy
    env.commitUpdate((store) => {
      // According to Relay docs, RecordSourceProxy also has invalidateStore()
      (store as any).invalidateStore();
    });
  } else {
    environmentContext = {} as PreferencesMap;
  }
}

// Legacy function
export function clearRelayPreferences() {
  console.warn('clearRelayPreferences is deprecated, use clearRelayContext instead');
  clearRelayContext();
}

// Development utilities
export function addContextChangeListener(listener: () => void) {
  contextChangeListeners.add(listener);
  return () => contextChangeListeners.delete(listener);
}

// Hook for React DevTools or debugging
export function useRelayContextDevTools() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).__RELAY_CONTEXT__ = {
      getContext: getEnvironmentContext,
      updateContext: updateRelayContext,
      clearContext: clearRelayContext,
      addListener: addContextChangeListener,
    };
  }
}
