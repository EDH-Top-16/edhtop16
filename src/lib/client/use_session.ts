import {useState, useEffect, useCallback} from 'react';
import {sessionRegistry, type SessionData} from './relay_client_environment';
import type {PreferencesMap} from './cookies';

export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData>(() =>
    sessionRegistry.get(),
  );

  useEffect(() => {
    let hasHydrated = false;

    if (
      typeof window !== 'undefined' &&
      window.__SERVER_PREFERENCES__ &&
      !hasHydrated
    ) {
      const serverPrefs = window.__SERVER_PREFERENCES__;
      sessionRegistry.set({preferences: serverPrefs});
      hasHydrated = true;
    }

    if (
      typeof window !== 'undefined' &&
      window.__SESSION_DATA__ &&
      !hasHydrated
    ) {
      sessionRegistry.hydrate(window.__SESSION_DATA__);
      delete window.__SESSION_DATA__;
      hasHydrated = true;
    }

    const unsubscribe = sessionRegistry.subscribe(setSessionData);
    return () => {
      unsubscribe();
    };
  }, []);

  const updatePreferences = useCallback(
    async (newPreferences: Partial<PreferencesMap>) => {
      const serverSuccess =
        await sessionRegistry.updateServerPreferences(newPreferences);

      if (!serverSuccess) {
        //console.log('Server session update failed, preferences will be handled by cookie system');
      }
    },
    [],
  );

  const getPreference = useCallback(
    <T>(category: keyof PreferencesMap, key: string, defaultValue?: T): T => {
      const categoryPrefs = sessionData.preferences?.[category];
      return (categoryPrefs as any)?.[key] ?? defaultValue;
    },
    [sessionData.preferences],
  );

  const updateSessionData = useCallback(
    async (newData: Partial<Omit<SessionData, 'preferences'>>) => {
      await sessionRegistry.updateSessionData(newData);
    },
    [],
  );

  const login = useCallback(
    async (credentials: {username: string; password: string}) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(credentials),
        });

        if (response.ok) {
          const result = await response.json();
          sessionRegistry.set({
            userId: result.userId,
            isAuthenticated: true,
            isAdmin: result.isAdmin || false,
            sessionId: result.sessionId,
          });
          return true;
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
      return false;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      sessionRegistry.set({
        userId: undefined,
        isAuthenticated: false,
        isAdmin: false,
        sessionId: undefined,
      });
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
    }
    return false;
  }, []);

  return {
    sessionData,
    preferences: sessionData.preferences,

    isAuthenticated: sessionData.isAuthenticated || false,
    isAdmin: sessionData.isAdmin || false,
    userId: sessionData.userId,
    sessionId: sessionData.sessionId,

    updatePreferences,
    getPreference,
    updateSessionData,
    login,
    logout,

    registry: sessionRegistry,
  };
}
