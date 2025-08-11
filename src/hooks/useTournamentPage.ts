import { useCallback, useMemo, useEffect, useRef } from 'react';
import { usePreloadedQuery, PreloadedQuery } from 'react-relay/hooks';
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

export function useTournamentPage(
  queryRef: PreloadedQuery<useTournamentPage_TournamentQuery>,
  sessionContext?: {
    isAuthenticated: boolean;
    sessionData: any;
    updatePreferences: (prefs: any) => Promise<void>;
  }
) {
  // Session handling
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

  const { preferences, updatePreference, isHydrated } = usePreferences(
    'tournament',
    DEFAULT_PREFERENCES,
  );

  // Enhanced update preference that works with both cookies and sessions
  const enhancedUpdatePreference = useCallback(async (
    key: keyof PreferencesMap['tournament'], 
    value: any
  ) => {
    if (isAuthenticated) {
      // Update session preferences for authenticated users
      await updateSessionPrefs({
        tournament: { ...preferences, [key]: value }
      });
    } else {
      // Use existing cookie system for guests
      updatePreference(key, value);
    }
  }, [isAuthenticated, updateSessionPrefs, updatePreference, preferences]);

  const hasRefetchedRef = useRef(false);

  const { tournament } = usePreloadedQuery(
    graphql`
      query useTournamentPage_TournamentQuery(
        $TID: String!
        $commander: String
        $showStandings: Boolean!
        $showBreakdown: Boolean!
        $showBreakdownCommander: Boolean!
      ) @preloadable {
        tournament(TID: $TID) {
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
          breakdownEntries: entries(commander: $commander)
            @include(if: $showBreakdownCommander) {
            id
            ...tournamentPage_EntryCard
          }
        }
      }
    `,
    queryRef,
  );

  // Event handlers
  const handleCommanderSelect = useCallback(
    (commanderName: string) => {
      enhancedUpdatePreference(
        'commander' as keyof PreferencesMap['tournament'],
        commanderName,
      );
      enhancedUpdatePreference(
        'tab' as keyof PreferencesMap['tournament'],
        'commander',
      );
    },
    [enhancedUpdatePreference],
  );

  const handleRefetch = useCallback(() => {
    // No longer needed since we always fetch all data
    console.log('🔄 [TOURNAMENT] Refetch would happen here if needed');
  }, []);

  // Computed values from query variables
  const queryVariables = queryRef.variables;
  const currentTabFromQuery = useMemo(() => {
    if (queryVariables.showBreakdown) return 'breakdown';
    if (queryVariables.showBreakdownCommander) return 'commander';
    return 'entries';
  }, [queryVariables]);

  const commanderFromQuery = queryVariables.commander;

  // Data processing
  const standingsEntries = useMemo(
    () => tournament?.entries || [],
    [tournament?.entries],
  );

  const breakdownCards = useMemo(
    () => tournament?.breakdown || [],
    [tournament?.breakdown],
  );

  const commanderEntries = useMemo(
    () => tournament?.breakdownEntries || [],
    [tournament?.breakdownEntries],
  );

  // Shell props
  const shellProps = useMemo(
    () => ({
      tournament,
      commanderName:
        (isHydrated ? preferences?.commander : commanderFromQuery) || null,
      tab: isHydrated ? preferences?.tab || 'entries' : currentTabFromQuery,
      updatePreference: enhancedUpdatePreference,
      isAuthenticated,
    }),
    [
      tournament,
      isHydrated,
      preferences,
      commanderFromQuery,
      currentTabFromQuery,
      enhancedUpdatePreference,
      isAuthenticated,
    ],
  );

  // Current content based on active tab
  const currentContent = useMemo(() => {
    const currentTab = isHydrated
      ? preferences?.tab || 'entries'
      : currentTabFromQuery;

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

  // Effects
  useEffect(() => {
    setRefetchCallback(handleRefetch);
    return clearRefetchCallback;
  }, [handleRefetch]);

  useEffect(() => {
    if (isHydrated && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;
      console.log('🍪 [TOURNAMENT] Hydration complete:', {
        isAuthenticated,
        preferences,
      });
    }
  }, [isHydrated, isAuthenticated, preferences]);

  return {
    // Data
    tournament,
    
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
    
    // Functions
    updatePreference: enhancedUpdatePreference,
    preferences,
  };
}
