import { useState, useEffect, useCallback, useMemo, useRef, startTransition } from 'react';
import { usePaginationFragment, usePreloadedQuery, PreloadedQuery } from 'react-relay/hooks';
import { graphql } from 'relay-runtime';
import {
  usePreferences,
  setRefetchCallback,
  clearRefetchCallback,
  type PreferencesMap,
} from '../lib/client/cookies';
import { useSession } from '../lib/client/use_session';
import {
  useCommanderPage_CommanderQuery,
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/useCommanderPage_CommanderQuery.graphql';
import { useCommanderPage_entries$key } from '#genfiles/queries/useCommanderPage_entries.graphql';
import { CommanderEntriesQuery } from '#genfiles/queries/CommanderEntriesQuery.graphql';

const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

const DEFAULT_PREFERENCES = {
  sortBy: 'TOP' as const,
  timePeriod: 'ONE_YEAR' as const,
  minEventSize: null,
  maxStanding: null,
} as const;

export function useCommanderPage(
  queryRef: PreloadedQuery<useCommanderPage_CommanderQuery>,
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
    'entry',
    DEFAULT_PREFERENCES,
  );

  
  const enhancedUpdatePreference = useCallback(async (
    key: keyof PreferencesMap['entry'], 
    value: any
  ) => {
    if (isAuthenticated) {
      
      await updateSessionPrefs({
        entry: { ...preferences, [key]: value }
      });
    } else {
      
      updatePreference(key, value);
    }
  }, [isAuthenticated, updateSessionPrefs, updatePreference, preferences]);

  const hasRefetchedRef = useRef(false);

  const serverPreferences = useMemo(() => {
    if (
      typeof window !== 'undefined' &&
      (window as any).__SERVER_PREFERENCES__
    ) {
      return (window as any).__SERVER_PREFERENCES__;
    }
    return null;
  }, []);

  const { commander } = usePreloadedQuery(
    graphql`
      query useCommanderPage_CommanderQuery(
        $commander: String!
        $sortBy: EntriesSortBy!
        $minEventSize: Int
        $maxStanding: Int
        $timePeriod: TimePeriod!
      ) @preloadable {
        commander(name: $commander) {
          name
          ...commanderPage_CommanderPageShell
            @arguments(
              minEventSize: $minEventSize
              maxStanding: $maxStanding
              timePeriod: $timePeriod
            )
          ...useCommanderPage_entries
            @arguments(
              minEventSize: $minEventSize
              maxStanding: $maxStanding
              timePeriod: $timePeriod
            )
        }
      }
    `,
    queryRef,
  );

  const { data, loadNext, isLoadingNext, hasNext, refetch } =
    usePaginationFragment<CommanderEntriesQuery, useCommanderPage_entries$key>(
      graphql`
        fragment useCommanderPage_entries on Commander
        @argumentDefinitions(
          cursor: {type: "String"}
          count: {type: "Int", defaultValue: 48}
          minEventSize: {type: "Int"}
          maxStanding: {type: "Int"}
          timePeriod: {type: "TimePeriod!"}
        )
        @refetchable(queryName: "CommanderEntriesQuery") {
          # Add filteredStats to this fragment so it gets refetched
          filteredStats(
            minEventSize: $minEventSize
            maxStanding: $maxStanding
            timePeriod: $timePeriod
          ) {
            conversionRate
            topCuts
            count
            metaShare
            topCutBias
          }

          entries(
            first: $count
            after: $cursor
            sortBy: $sortBy
            filters: {
              minEventSize: $minEventSize
              maxStanding: $maxStanding
              timePeriod: $timePeriod
            }
          ) @connection(key: "Commander_entries") {
            edges {
              node {
                id
                ...commanderPage_EntryCard
              }
            }
          }
        }
      `,
      commander,
    );

  const refetchParams = useMemo(
    () => ({
      sortBy: preferences?.sortBy || DEFAULT_PREFERENCES.sortBy,
      timePeriod: preferences?.timePeriod || DEFAULT_PREFERENCES.timePeriod,
      minEventSize: preferences?.minEventSize || undefined,
      maxStanding: preferences?.maxStanding || undefined,
    }),
    [preferences],
  );

  const handleRefetch = useCallback(() => {
    
    if (!commander) {
      //console.log('⚠️ [COMMANDER_PAGE] Cannot refetch: commander is null');
      return;
    }

    //console.log('🔄 [COMMANDER_PAGE] Refetch triggered by preferences change');
    startTransition(() => {
      refetch(refetchParams, {fetchPolicy: 'network-only'});
    });
  }, [refetch, refetchParams, commander]);

  const handleLoadMore = useCallback(
    (count: number) => {
      startTransition(() => {
        loadNext(count);
      });
    },
    [loadNext],
  );

  
  const debouncedUpdaters = useMemo(
    () => ({
      eventSize: createDebouncedFunction((value: string) => {
        const numValue = value === '' ? null : parseInt(value, 10);
        if (numValue === null || (!isNaN(numValue) && numValue >= 0)) {
          enhancedUpdatePreference(
            'minEventSize' as keyof PreferencesMap['entry'],
            numValue,
          );
        }
      }, 250),
      maxStanding: createDebouncedFunction((value: string) => {
        const numValue = value === '' ? null : parseInt(value, 10);
        if (numValue === null || (!isNaN(numValue) && numValue >= 1)) {
          enhancedUpdatePreference(
            'maxStanding' as keyof PreferencesMap['entry'],
            numValue,
          );
        }
      }, 250),
    }),
    [enhancedUpdatePreference],
  );

  
  const [localEventSize, setLocalEventSize] = useState('');
  const [localMaxStanding, setLocalMaxStanding] = useState('');

  
  useEffect(() => {
    setLocalEventSize(preferences?.minEventSize?.toString() || '');
    setLocalMaxStanding(preferences?.maxStanding?.toString() || '');
  }, [preferences?.minEventSize, preferences?.maxStanding]);

  
  const handleSortBySelect = useCallback(
    (value: EntriesSortBy) => {
      enhancedUpdatePreference('sortBy' as keyof PreferencesMap['entry'], value);
    },
    [enhancedUpdatePreference],
  );

  const handleTimePeriodSelect = useCallback(
    (value: string) => {
      enhancedUpdatePreference('timePeriod' as keyof PreferencesMap['entry'], value);
    },
    [enhancedUpdatePreference],
  );

  const handleEventSizeChange = useCallback(
    (value: string) => {
      setLocalEventSize(value);
      debouncedUpdaters.eventSize(value);
    },
    [debouncedUpdaters],
  );

  const handleEventSizeSelect = useCallback(
    (value: number | null) => {
      const stringValue = value?.toString() || '';
      startTransition(() => {
        setLocalEventSize(stringValue);
      });
      enhancedUpdatePreference('minEventSize' as keyof PreferencesMap['entry'], value);
    },
    [enhancedUpdatePreference],
  );

  const handleMaxStandingChange = useCallback(
    (value: string) => {
      setLocalMaxStanding(value);
      debouncedUpdaters.maxStanding(value);
    },
    [debouncedUpdaters],
  );

  const handleMaxStandingSelect = useCallback(
    (value: number | null) => {
      const stringValue = value?.toString() || '';
      startTransition(() => {
        setLocalMaxStanding(stringValue);
      });
      enhancedUpdatePreference('maxStanding' as keyof PreferencesMap['entry'], value);
    },
    [enhancedUpdatePreference],
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Go') {
      (e.target as HTMLInputElement).blur();
    }
  }, []);

  
  const shellPreferences = useMemo(
    () => ({
      maxStanding: preferences?.maxStanding || null,
      minEventSize: preferences?.minEventSize || null,
      sortBy: preferences?.sortBy || DEFAULT_PREFERENCES.sortBy,
      timePeriod: preferences?.timePeriod || DEFAULT_PREFERENCES.timePeriod,
    }),
    [preferences],
  );

  const entryCards = useMemo(
    () => {
      if (!data?.entries?.edges) {
        return [];
      }
      return data.entries.edges.map(({node}) => node);
    },
    [data?.entries?.edges],
  );

  
  useEffect(() => {
    setRefetchCallback(handleRefetch);
    return clearRefetchCallback;
  }, [handleRefetch]);

  useEffect(() => {
    if (isHydrated && !hasRefetchedRef.current && commander) {
      hasRefetchedRef.current = true;

      const actualServerPrefs = serverPreferences || DEFAULT_PREFERENCES;
      const prefsMatch =
        JSON.stringify(preferences) === JSON.stringify(actualServerPrefs);

      //console.log('🍪 [COMMANDER_PAGE] Hydration complete:', {
      //  clientPrefs: preferences,
      //  serverPrefs: actualServerPrefs,
      //  needsRefetch: !prefsMatch,
      //  isAuthenticated,
      //  commanderExists: !!commander,
      //}
      //);

      if (!prefsMatch) {
        
        setTimeout(() => {
          handleRefetch();
        }, 200);
      }
    }
  }, [isHydrated, preferences, serverPreferences, handleRefetch, isAuthenticated, commander]);

  return {
    
    commander,
    data,
    entryCards,
    
    
    shellPreferences,
    localEventSize,
    localMaxStanding,
    hasNext,
    isLoadingNext,
    isAuthenticated,
    
    
    handleSortBySelect,
    handleTimePeriodSelect,
    handleEventSizeChange,
    handleEventSizeSelect,
    handleMaxStandingChange,
    handleMaxStandingSelect,
    handleKeyDown,
    handleLoadMore,
    
    
    updatePreference: enhancedUpdatePreference,
    preferences,
  };
}