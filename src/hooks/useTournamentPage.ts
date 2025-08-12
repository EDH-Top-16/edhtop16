import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { usePreloadedQuery, PreloadedQuery, useRefetchableFragment } from 'react-relay/hooks';
import { graphql } from 'relay-runtime';
import {
  usePreferences,
  setRefetchCallback,
  clearRefetchCallback,
  type PreferencesMap,
} from '../lib/client/cookies';
import { useSession } from '../lib/client/use_session';
import { useTournamentPage_TournamentQuery } from '#genfiles/queries/useTournamentPage_TournamentQuery.graphql';

const DEFAULT_PREFERENCES = {
  tab: 'entries' as const,
  commander: null,
} as const;

// Debounce utility
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

export function useTournamentPage(
  queryRef: PreloadedQuery<useTournamentPage_TournamentQuery>,
  sessionContext?: {
    isAuthenticated: boolean;
    sessionData: any;
    updatePreferences: (prefs: any) => Promise<void>;
  }
) {
  // Session handling - memoized to prevent recreating objects
  const sessionFromHook = useSession();
  const { 
    isAuthenticated, 
    sessionData, 
    updatePreferences: updateSessionPrefs 
  } = useMemo(() => sessionContext || {
    isAuthenticated: sessionFromHook.isAuthenticated,
    sessionData: sessionFromHook.sessionData,
    updatePreferences: sessionFromHook.updatePreferences
  }, [sessionContext, sessionFromHook.isAuthenticated, sessionFromHook.sessionData, sessionFromHook.updatePreferences]);

  const { preferences, updatePreference, isHydrated } = usePreferences(
    'tournament',
    DEFAULT_PREFERENCES,
  );

  // Cache for base tournament data (entries + breakdown) - use separate state since it's not in PreferencesMap
  const [cachedBaseData, setCachedBaseData] = useState<{
    entries: any[];
    breakdown: any[];
    timestamp: number;
  }>({ entries: [], breakdown: [], timestamp: 0 });

  // Load cached data from cookies/session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tournamentCache');
        if (stored) {
          const parsed = JSON.parse(stored);
          const cacheAge = Date.now() - (parsed.timestamp || 0);
          if (cacheAge < 5 * 60 * 1000) { // 5 minutes
            setCachedBaseData(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load tournament cache:', error);
      }
    }
  }, []);

  // Save cached data to localStorage
  const updateCachedBaseData = useCallback((newData: typeof cachedBaseData) => {
    setCachedBaseData(newData);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tournamentCache', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save tournament cache:', error);
      }
    }
  }, []);

  // Enhanced update preference that works with both cookies and sessions - memoized
  const enhancedUpdatePreference = useCallback(async (
    key: keyof PreferencesMap['tournament'], 
    value: any
  ) => {
    if (isAuthenticated) {
      await updateSessionPrefs({
        tournament: { ...preferences, [key]: value }
      });
    } else {
      updatePreference(key, value);
    }
  }, [isAuthenticated, updateSessionPrefs, updatePreference, preferences]);

  const hasRefetchedRef = useRef(false);
  const pendingRefetchRef = useRef<{
    commander?: string;
    showStandings: boolean;
    showBreakdown: boolean;
    showBreakdownCommander: boolean;
  } | null>(null);
  
  // Track what data we've successfully loaded
  const loadedDataRef = useRef({
    hasEntries: false,
    hasBreakdown: false,
  });

  // Memoized query for base tournament data - include both fragments
  const baseTournamentQuery = useMemo(() => graphql`
    query useTournamentPage_TournamentQuery(
      $TID: String!
      $commander: String
      $showStandings: Boolean!
      $showBreakdown: Boolean!
      $showBreakdownCommander: Boolean!
    ) @preloadable {
      tournament(TID: $TID) {
        ...useTournamentPage_baseTournament
        ...useTournamentPage_commanderData
      }
    }
  `, []);

  const { tournament: baseTournamentData } = usePreloadedQuery(baseTournamentQuery, queryRef);

  // Base tournament fragment (entries + breakdown + shell data)
  const baseTournamentFragment = useMemo(() => graphql`
    fragment useTournamentPage_baseTournament on Tournament 
    @refetchable(queryName: "useTournamentPageBaseRefetchQuery") {
      ...tournamentPage_TournamentPageShell
      entries @include(if: $showStandings) {
        id
        ...tournamentPage_EntryCard
      }
      breakdown @include(if: $showBreakdown) {
        commander {
          id
        }
        ...tournamentPage_BreakdownGroupCard
      }
    }
  `, []);

  // Commander-specific fragment (just breakdownEntries)
  const commanderFragment = useMemo(() => graphql`
    fragment useTournamentPage_commanderData on Tournament 
    @refetchable(queryName: "useTournamentPageCommanderRefetchQuery") {
      breakdownEntries: entries(commander: $commander)
        @include(if: $showBreakdownCommander) {
        id
        ...tournamentPage_EntryCard
      }
    }
  `, []);

  const [baseTournament] = useRefetchableFragment(baseTournamentFragment, baseTournamentData);
  const [commanderData, refetchCommander] = useRefetchableFragment(commanderFragment, baseTournamentData);

  // Type cast and combine data
  const baseTournamentTyped = useMemo(() => baseTournament as any, [baseTournament]);
  const commanderDataTyped = useMemo(() => commanderData as any, [commanderData]);

  // Cache base data when available
  useEffect(() => {
    const currentTime = Date.now();
    const cacheAge = currentTime - (cachedBaseData?.timestamp || 0);
    const cacheExpired = cacheAge > 5 * 60 * 1000; // 5 minutes

    if (baseTournamentTyped && (cacheExpired || !cachedBaseData?.entries?.length)) {
      const newCacheData = {
        entries: baseTournamentTyped.entries || [],
        breakdown: baseTournamentTyped.breakdown || [],
        timestamp: currentTime,
      };
      
      updateCachedBaseData(newCacheData);
    }
  }, [baseTournamentTyped, cachedBaseData, updateCachedBaseData]);

  // Debounced refetch - only for commander data now
  const debouncedRefetchCommander = useDebounce((variables: any) => {
    refetchCommander(variables);
    pendingRefetchRef.current = null;
  }, 300); // Reduced to 300ms since it's lighter

  // Event handlers - simplified with separate fragments
  const handleCommanderSelect = useCallback(
    async (commanderName: string) => {
      // Update preferences instantly
      await enhancedUpdatePreference('commander' as keyof PreferencesMap['tournament'], commanderName);
      await enhancedUpdatePreference('tab' as keyof PreferencesMap['tournament'], 'commander');

      // Only refetch commander-specific data
      debouncedRefetchCommander({
        commander: commanderName,
        showBreakdownCommander: true,
      });
    },
    [enhancedUpdatePreference, debouncedRefetchCommander],
  );

  // Fast tab switching - no refetch needed since we cache base data
  const handleTabChange = useCallback(
    async (tab: 'entries' | 'breakdown' | 'commander') => {
      await enhancedUpdatePreference('tab' as keyof PreferencesMap['tournament'], tab);
      
      if (tab !== 'commander') {
        await enhancedUpdatePreference('commander' as keyof PreferencesMap['tournament'], null);
      }
      // No refetch needed - base data is cached!
    },
    [enhancedUpdatePreference],
  );

  const handleRefetch = useCallback(() => {
    const currentTab = preferences?.tab || 'entries';
    const currentCommander = preferences?.commander;
    
    // Only refetch commander data if needed
    if (currentTab === 'commander' && currentCommander) {
      debouncedRefetchCommander({
        commander: currentCommander,
        showBreakdownCommander: true,
      });
    }
  }, [preferences?.tab, preferences?.commander, debouncedRefetchCommander]);

  // Computed values from original query variables (from page load) - safely access properties
  const originalQueryVariables = useMemo(() => queryRef.variables as any, [queryRef.variables]);
  
  const currentTabFromQuery = useMemo(() => {
    if (originalQueryVariables.showBreakdown) return 'breakdown';
    if (originalQueryVariables.showBreakdownCommander) return 'commander';
    return 'entries';
  }, [originalQueryVariables.showBreakdown, originalQueryVariables.showBreakdownCommander]);

  const commanderFromQuery = useMemo(() => originalQueryVariables.commander, [originalQueryVariables.commander]);

  // Data processing - use cached data when available
  const standingsEntries = useMemo(() => {
    return baseTournamentTyped?.entries || cachedBaseData?.entries || [];
  }, [baseTournamentTyped?.entries, cachedBaseData?.entries]);

  const breakdownCards = useMemo(() => {
    return baseTournamentTyped?.breakdown || cachedBaseData?.breakdown || [];
  }, [baseTournamentTyped?.breakdown, cachedBaseData?.breakdown]);

  const commanderEntries = useMemo(() => {
    return commanderDataTyped?.breakdownEntries || [];
  }, [commanderDataTyped?.breakdownEntries]);

  // Shell props - use base tournament data
  const shellProps = useMemo(() => ({
    tournament: baseTournamentTyped,
    commanderName: (isHydrated ? preferences?.commander : commanderFromQuery) || null,
    tab: isHydrated ? preferences?.tab || 'entries' : currentTabFromQuery,
    updatePreference: enhancedUpdatePreference,
    isAuthenticated,
  }), [
    baseTournamentTyped,
    isHydrated,
    preferences?.commander,
    preferences?.tab,
    commanderFromQuery,
    currentTabFromQuery,
    enhancedUpdatePreference,
    isAuthenticated,
  ]);

  // Current content based on active tab - optimized memoization
  const currentContent = useMemo(() => {
    const currentTab = isHydrated ? preferences?.tab || 'entries' : currentTabFromQuery;

    switch (currentTab) {
      case 'breakdown':
        return { type: 'breakdown' as const, data: breakdownCards };
      case 'commander':
        return { type: 'commander' as const, data: commanderEntries };
      default:
        return { type: 'entries' as const, data: standingsEntries };
    }
  }, [
    isHydrated,
    preferences?.tab,
    currentTabFromQuery,
    standingsEntries,
    breakdownCards,
    commanderEntries,
  ]);

  // Effects - optimized with specific dependencies
  useEffect(() => {
    setRefetchCallback(handleRefetch);
    return clearRefetchCallback;
  }, [handleRefetch]);

  useEffect(() => {
    if (isHydrated && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;
    }
  }, [isHydrated]);

  // Memoized return object for stable reference
  return useMemo(() => ({
    // Data
    tournament: baseTournamentTyped,
    
    // Processed data
    standingsEntries,
    breakdownCards,
    commanderEntries,
    currentContent,
    
    // State
    shellProps,
    isAuthenticated,
    
    // Event handlers
    handleCommanderSelect,
    handleTabChange,
    
    // Functions
    updatePreference: enhancedUpdatePreference,
    preferences,
  }), [
    baseTournamentTyped,
    standingsEntries,
    breakdownCards,
    commanderEntries,
    currentContent,
    shellProps,
    isAuthenticated,
    handleCommanderSelect,
    handleTabChange,
    enhancedUpdatePreference,
    preferences,
  ]);
}