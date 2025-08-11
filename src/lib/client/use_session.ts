import { useState, useEffect, useCallback } from 'react';
import { sessionRegistry, type SessionData } from './relay_client_environment';
import type { PreferencesMap } from './cookies';

export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData>(() => 
    sessionRegistry.get()
  );

  useEffect(() => {
    let hasHydrated = false;

    // Hydrate from existing server preferences (your current system)
    if (typeof window !== 'undefined' && window.__SERVER_PREFERENCES__ && !hasHydrated) {
      const serverPrefs = window.__SERVER_PREFERENCES__;
      sessionRegistry.set({ preferences: serverPrefs });
      hasHydrated = true;
    }

    // Also check for new session data format
    if (typeof window !== 'undefined' && window.__SESSION_DATA__ && !hasHydrated) {
      sessionRegistry.hydrate(window.__SESSION_DATA__);
      delete window.__SESSION_DATA__;
      hasHydrated = true;
    }

    // Subscribe to session changes
    const unsubscribe = sessionRegistry.subscribe(setSessionData);
    return () => {
      unsubscribe();
    };
  }, []);

  // Update preferences (works with both cookies and server sessions)
  const updatePreferences = useCallback(async (newPreferences: Partial<PreferencesMap>) => {
    // Try server-side session update first
    const serverSuccess = await sessionRegistry.updateServerPreferences(newPreferences);
    
    if (!serverSuccess) {
      // Fallback to your existing cookie system
      console.log('Server session update failed, preferences will be handled by cookie system');
    }
  }, []);

  // Get a specific preference with fallback to your existing system
  const getPreference = useCallback(<T>(
    category: keyof PreferencesMap, 
    key: string, 
    defaultValue?: T
  ): T => {
    const categoryPrefs = sessionData.preferences?.[category];
    return (categoryPrefs as any)?.[key] ?? defaultValue;
  }, [sessionData.preferences]);

  // Update session data (user info, authentication, etc.)
  const updateSessionData = useCallback(async (newData: Partial<Omit<SessionData, 'preferences'>>) => {
    await sessionRegistry.updateSessionData(newData);
  }, []);

  // Login function
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      sessionRegistry.set({
        userId: undefined,
        isAuthenticated: false,
        isAdmin: false,
        sessionId: undefined,
        // Keep preferences - they'll continue to work via cookies
      });
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
    }
    return false;
  }, []);

  return {
    // Session data
    sessionData,
    preferences: sessionData.preferences,
    
    // User state
    isAuthenticated: sessionData.isAuthenticated || false,
    isAdmin: sessionData.isAdmin || false,
    userId: sessionData.userId,
    sessionId: sessionData.sessionId,
    
    // Functions
    updatePreferences,
    getPreference,
    updateSessionData,
    login,
    logout,
    
    // Direct registry access for advanced use cases
    registry: sessionRegistry,
  };
}