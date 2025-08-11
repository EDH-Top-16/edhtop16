import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import type {
  CommandersPreferences,
  EntryPreferences,
  TournamentPreferences,
  TournamentsPreferences,
  PreferencesMap,
} from './cookies';

// Extended session data structure
export type SessionData = {
  preferences: PreferencesMap;
  userId?: string;
  username?: string;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  sessionId?: string;
  userProfile?: {
    displayName: string;
    email: string;
    favoriteCommander: string;
    joinDate: string;
    totalGames: number;
    winRate: number;
  };
  [key: string]: any;
};

// Global session registry that works alongside your existing cookie system
class SessionRegistry {
  private data: SessionData = { preferences: {} };
  private listeners = new Set<(data: SessionData) => void>();

  get(): SessionData {
    return this.data;
  }

  set(data: Partial<SessionData>) {
    this.data = { ...this.data, ...data };
    this.notifyListeners();
  }

  hydrate(sessionData: SessionData) {
    this.data = sessionData;
    this.notifyListeners();
  }

  subscribe(listener: (data: SessionData) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    // Defer notifications to avoid setState during render
    Promise.resolve().then(() => {
      this.listeners.forEach(listener => listener(this.data));
    });
  }

  // Server-side session preference updates (in addition to cookies)
  async updateServerPreferences(newPreferences: Partial<PreferencesMap>) {
    try {
      const response = await fetch('/api/session/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences),
      });

      if (response.ok) {
        this.set({
          preferences: { ...this.data.preferences, ...newPreferences }
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to update server preferences:', error);
    }
    return false;
  }

  // Update session data (user info, etc.)
  async updateSessionData(newData: Partial<Omit<SessionData, 'preferences'>>) {
    try {
      const response = await fetch('/api/session/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        this.set(newData);
        return true;
      }
    } catch (error) {
      console.error('Failed to update session data:', error);
    }
    return false;
  }
}

export const sessionRegistry = new SessionRegistry();

// Keep your existing preference system
let currentPreferences: PreferencesMap = {};

const requestCache = new Map<string, Promise<any>>();

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const sessionData = sessionRegistry.get();
    const cacheKey = `${params.id || params.name}-${JSON.stringify(variables)}-${JSON.stringify(currentPreferences)}-${JSON.stringify(sessionData)}`;

    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey)!;
    }

    const requestPromise = (async () => {
      const requestBody = {
        query: params.text,
        id: params.id,
        variables,
        extensions: {
          sitePreferences: currentPreferences,
          sessionData: sessionData, // Add full session data
        },
      };

      const response = await fetch('/api/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      requestCache.delete(cacheKey);
      return result;
    })();

    requestCache.set(cacheKey, requestPromise);
    return requestPromise;
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

// Your existing functions - maintained for backward compatibility
export function updateRelayPreferences(prefs: Partial<PreferencesMap>) {
  currentPreferences = {...currentPreferences, ...prefs};
  
  // Defer session registry update to avoid setState during render
  Promise.resolve().then(() => {
    sessionRegistry.set({ preferences: currentPreferences });
  });
}

export function getRelayPreferences(): PreferencesMap {
  return currentPreferences;
}

// Global window type extensions
declare global {
  interface Window {
    __SERVER_PREFERENCES__?: PreferencesMap;
    __SESSION_DATA__?: SessionData;
  }
}

export default getClientEnvironment();
