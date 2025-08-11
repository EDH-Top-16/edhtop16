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
    
    //console.log('🔄 [TOURNAMENT] Refetch would happen here if needed');
  }, []);

  
  const queryVariables = queryRef.variables;
  const currentTabFromQuery = useMemo(() => {
    if (queryVariables.showBreakdown) return 'breakdown';
    if (queryVariables.showBreakdownCommander) return 'commander';
    return 'entries';
  }, [queryVariables]);

  const commanderFromQuery = queryVariables.commander;

  
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

  
  useEffect(() => {
    setRefetchCallback(handleRefetch);
    return clearRefetchCallback;
  }, [handleRefetch]);

  useEffect(() => {
    if (isHydrated && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;
      //console.log('🍪 [TOURNAMENT] Hydration complete:', {
      //  isAuthenticated,
      //  preferences,
      //});
    }
  }, [isHydrated, isAuthenticated, preferences]);

  return {
    
    tournament,
    
    
    standingsEntries,
    breakdownCards,
    commanderEntries,
    currentContent,
    
    
    shellProps,
    isAuthenticated,
    
    
    handleCommanderSelect,
    
    
    updatePreference: enhancedUpdatePreference,
    preferences,
  };
}
