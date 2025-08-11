import { useState, useEffect, useMemo, useCallback, useRef, startTransition } from 'react';
import { usePaginationFragment } from 'react-relay/hooks';
import { 
  usePreferences, 
  setRefetchCallback, 
  clearRefetchCallback,
  type PreferencesMap,
  DEFAULT_PREFERENCES 
} from '../lib/client/cookies';
import { sessionRegistry, type SessionData } from '../lib/client/relay_client_environment';

const createDebouncer = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};


export function useOptimizedInputHandlers(
  updatePreference: (key: keyof PreferencesMap['commanders'], value: number | null) => void,
) {
  return useMemo(() => {
    const debouncedMinEntries = createDebouncer((value: string) => {
      const numValue = value === '' ? null : parseInt(value, 10);
      if (numValue === null || (!isNaN(numValue) && numValue >= 1)) {
        updatePreference('minEntries' as keyof PreferencesMap['commanders'], numValue);
      }
    }, 250);

    const debouncedEventSize = createDebouncer((value: string) => {
      const numValue = value === '' ? null : parseInt(value, 10);
      if (numValue === null || (!isNaN(numValue) && numValue >= 1)) {
        updatePreference('minTournamentSize' as keyof PreferencesMap['commanders'], numValue);
      }
    }, 250);

    const handleMinEntriesChange = (value: string, setLocal: (value: string) => void) => {
      setLocal(value);
      debouncedMinEntries(value);
    };

    const handleMinEntriesSelect = (value: number | null, setLocal: (value: string) => void) => {
      const stringValue = value?.toString() || '';
      startTransition(() => setLocal(stringValue));
      updatePreference('minEntries' as keyof PreferencesMap['commanders'], value);
    };

    const handleEventSizeChange = (value: string, setLocal: (value: string) => void) => {
      setLocal(value);
      debouncedEventSize(value);
    };

    const handleEventSizeSelect = (value: number | null, setLocal: (value: string) => void) => {
      const stringValue = value?.toString() || '';
      startTransition(() => setLocal(stringValue));
      updatePreference('minTournamentSize' as keyof PreferencesMap['commanders'], value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Go') {
        (e.target as HTMLInputElement).blur();
      }
    };

    return {
      handleMinEntriesChange,
      handleMinEntriesSelect,
      handleEventSizeChange,
      handleEventSizeSelect,
      handleKeyDown,
    };
  }, [updatePreference]);
}


export function useCommandersPage(
  query: any, 
  fragmentRef: any, 
  sessionContext?: {
    isAuthenticated: boolean;
    sessionData: any;
    updatePreferences: (prefs: any) => Promise<void>;
  }
) {
  const { preferences, updatePreference, isHydrated } = usePreferences(
    'commanders',
    DEFAULT_PREFERENCES.commanders!,
  );

  
  const sessionFromHook = useSession();
  const { 
    isAuthenticated, 
    sessionData, 
    updatePreferences: updateSessionPrefs 
  } = sessionContext || {
    isAuthenticated: sessionFromHook.isAuthenticated,
    sessionData: sessionFromHook.sessionData,
    updatePreferences: sessionFromHook.updatePreferences
  };

  const serverPreferences = useMemo(() => {
    if (typeof window !== 'undefined' && (window as any).__SERVER_PREFERENCES__) {
      return (window as any).__SERVER_PREFERENCES__;
    }
    return null;
  }, []);

  const { data, loadNext, isLoadingNext, hasNext, refetch } = usePaginationFragment(
    fragmentRef,
    query,
  );

  
  const [localMinEntries, setLocalMinEntries] = useState(
    () => preferences?.minEntries?.toString() || '',
  );
  const [localEventSize, setLocalEventSize] = useState(() =>
    preferences?.minTournamentSize && preferences?.minTournamentSize > 0
      ? preferences?.minTournamentSize.toString()
      : '',
  );

  const hasRefetchedRef = useRef(false);

  
  const enhancedUpdatePreference = useCallback(async (
    key: keyof PreferencesMap['commanders'], 
    value: any
  ) => {
    if (isAuthenticated) {
      
      await updateSessionPrefs({
        commanders: { ...preferences, [key]: value }
      });
    } else {
      
      updatePreference(key, value);
    }
  }, [isAuthenticated, updateSessionPrefs, updatePreference, preferences]);

  const inputHandlers = useOptimizedInputHandlers(enhancedUpdatePreference);

  const currentPreferences = useMemo(
    () => ({
      sortBy: preferences?.sortBy || ('CONVERSION' as const),
      timePeriod: preferences?.timePeriod || ('ONE_MONTH' as const),
      colorId: preferences?.colorId || '',
      minEntries: preferences?.minEntries || null,
      minTournamentSize: preferences?.minTournamentSize || null,
      display: preferences?.display || ('card' as const),
    }),
    [preferences],
  );

  const secondaryStatistic = useMemo(
    () => currentPreferences.sortBy === 'CONVERSION' ? ('topCuts' as const) : ('count' as const),
    [currentPreferences.sortBy],
  );

  
  const handleRefetch = useCallback(() => {
    //console.log('🔄 [COMMANDERS] Refetch triggered by preferences change');
    startTransition(() => {
      refetch({}, { fetchPolicy: 'network-only' });
    });
  }, [refetch]);

  const handleLoadMore = useCallback((count: number) => {
    startTransition(() => {
      loadNext(count);
    });
  }, [loadNext]);

  const handleDisplayToggle = useCallback(() => {
    enhancedUpdatePreference(
      'display' as keyof PreferencesMap['commanders'],
      currentPreferences.display === 'table' ? 'card' : 'table',
    );
  }, [enhancedUpdatePreference, currentPreferences.display]);

  const handleSortByChange = useCallback((value: 'CONVERSION' | 'POPULARITY') => {
    enhancedUpdatePreference('sortBy' as keyof PreferencesMap['commanders'], value);
  }, [enhancedUpdatePreference]);

  const handleTimePeriodChange = useCallback((value: any) => {
    enhancedUpdatePreference('timePeriod' as keyof PreferencesMap['commanders'], value);
  }, [enhancedUpdatePreference]);

  const handleColorChange = useCallback((value: string) => {
    enhancedUpdatePreference('colorId' as keyof PreferencesMap['commanders'], value);
  }, [enhancedUpdatePreference]);

  
  useEffect(() => {
    setLocalMinEntries(preferences?.minEntries?.toString() || '');
  }, [preferences?.minEntries]);

  useEffect(() => {
    setLocalEventSize(
      preferences?.minTournamentSize && preferences?.minTournamentSize > 0
        ? preferences?.minTournamentSize.toString()
        : '',
    );
  }, [preferences?.minTournamentSize]);

  useEffect(() => {
    setRefetchCallback(handleRefetch);
    return clearRefetchCallback;
  }, [handleRefetch]);

  useEffect(() => {
    if (isHydrated && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;
      const actualServerPrefs = serverPreferences || DEFAULT_PREFERENCES.commanders;
      const prefsMatch = JSON.stringify(preferences) === JSON.stringify(actualServerPrefs);

      //console.log('🍪 [COMMANDERS] Hydration complete:', {
      //  clientPrefs: preferences,
      //  serverPrefs: actualServerPrefs,
      //  needsRefetch: !prefsMatch,
      //  isAuthenticated,
      //});
    }
  }, [isHydrated, preferences, serverPreferences, isAuthenticated]);

  return {
    data,
    currentPreferences,
    secondaryStatistic,
    localMinEntries,
    setLocalMinEntries,
    localEventSize,
    setLocalEventSize,
    inputHandlers,
    hasNext,
    isLoadingNext,
    isAuthenticated,
    
    
    handleDisplayToggle,
    handleSortByChange,
    handleTimePeriodChange,
    handleColorChange,
    handleLoadMore,
  };
}


export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData>(() => 
    sessionRegistry.get()
  );

  useEffect(() => {
    let hasHydrated = false;

    
    if (typeof window !== 'undefined' && window.__SERVER_PREFERENCES__ && !hasHydrated) {
      const serverPrefs = window.__SERVER_PREFERENCES__;
      
      setTimeout(() => {
        sessionRegistry.set({ preferences: serverPrefs });
      }, 0);
      hasHydrated = true;
    }

    
    if (typeof window !== 'undefined' && window.__SESSION_DATA__ && !hasHydrated) {
      const sessionData = window.__SESSION_DATA__;
      
      setTimeout(() => {
        if (sessionData) { 
          sessionRegistry.hydrate(sessionData);
          delete window.__SESSION_DATA__;
        }
      }, 0);
      hasHydrated = true;
    }

    
    const unsubscribe = sessionRegistry.subscribe(setSessionData);
    return () => {
      unsubscribe();
    };
  }, []);

  
  const updatePreferences = useCallback(async (newPreferences: Partial<PreferencesMap>) => {
    
    const serverSuccess = await sessionRegistry.updateServerPreferences(newPreferences);
    
    if (!serverSuccess) {
      //console.log('Server session update failed, preferences will be handled by cookie system');
    }
  }, []);

  
  const getPreference = useCallback(<T>(
    category: keyof PreferencesMap, 
    key: string, 
    defaultValue?: T
  ): T => {
    const categoryPrefs = sessionData.preferences?.[category];
    return (categoryPrefs as any)?.[key] ?? defaultValue;
  }, [sessionData.preferences]);

  
  const updateSessionData = useCallback(async (newData: Partial<Omit<SessionData, 'preferences'>>) => {
    await sessionRegistry.updateSessionData(newData);
  }, []);

  
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        sessionRegistry.set({
          userId: result.user.id,
          username: result.user.username,
          isAuthenticated: true,
          isAdmin: result.user.isAdmin,
          userProfile: result.user.profile,
          sessionId: result.sessionId,
        });
        return true; 
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      sessionRegistry.set({
        userId: undefined,
        username: undefined,
        isAuthenticated: false,
        isAdmin: false,
        sessionId: undefined,
        userProfile: undefined,
        
      });
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }, []);

  return {
    
    sessionData,
    preferences: sessionData.preferences,
    
    
    isAuthenticated: sessionData.isAuthenticated || false,
    isAdmin: sessionData.isAdmin || false,
    userId: sessionData.userId,
    
    
    updatePreferences,
    getPreference,
    updateSessionData,
    login,
    logout,
    
    
    registry: sessionRegistry,
  };
}
