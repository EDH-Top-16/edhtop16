import {AllTournamentsQuery} from '#genfiles/queries/AllTournamentsQuery.graphql';
import {tournaments_TournamentCard$key} from '#genfiles/queries/tournaments_TournamentCard.graphql';
import {tournaments_Tournaments$key} from '#genfiles/queries/tournaments_Tournaments.graphql';
import {tournaments_TournamentsQuery} from '#genfiles/queries/tournaments_TournamentsQuery.graphql';
import {RouteLink} from '#genfiles/river/router';
import {useSeoMeta} from '@unhead/react';
import {format} from 'date-fns';
import {
  PropsWithChildren,
  useMemo,
  useState,
  useEffect,
  useCallback,
  startTransition,
  useRef,
} from 'react';
import {
  EntryPointComponent,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {
  usePreferences,
  setRefetchCallback,
  clearRefetchCallback,
  type PreferencesMap,
  DEFAULT_PREFERENCES,
} from '../lib/client/cookies';
import {Card} from '../components/card';
import {Dropdown} from '../components/dropdown';
import {Footer} from '../components/footer';
import {LoadMoreButton} from '../components/load_more';
import {Navigation} from '../components/navigation';
import {NumberInputDropdown} from '../components/number_input_dropdown';

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

const TIME_PERIOD_LABELS = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
  ALL_TIME: 'All Time',
  POST_BAN: 'Post Ban',
} as const;

const SORT_BY_OPTIONS = [
  {value: 'PLAYERS' as const, label: 'Tournament Size'},
  {value: 'DATE' as const, label: 'Date'},
];

const TIME_PERIOD_OPTIONS = [
  {value: 'ONE_MONTH' as const, label: '1 Month'},
  {value: 'THREE_MONTHS' as const, label: '3 Months'},
  {value: 'SIX_MONTHS' as const, label: '6 Months'},
  {value: 'POST_BAN' as const, label: 'Post Ban'},
  {value: 'ONE_YEAR' as const, label: '1 Year'},
  {value: 'ALL_TIME' as const, label: 'All Time'},
];

const MIN_SIZE_OPTIONS = [
  {value: null, label: 'All Tournaments'},
  {value: 32, label: '32+ Players'},
  {value: 60, label: '60+ Players'},
  {value: 100, label: '100+ Players'},
];

function TournamentCard({
  commander: commanderRef,
}: {
  commander: tournaments_TournamentCard$key;
}) {
  const tournament = useFragment(
    graphql`
      fragment tournaments_TournamentCard on Tournament {
        TID
        name
        size
        tournamentDate
        entries(maxStanding: 1) {
          player {
            name
          }

          commander {
            cards {
              imageUrls
            }
          }
        }
      }
    `,
    commanderRef,
  );

  const tournamentStats = useMemo(() => {
    return (
      <div className="flex justify-between">
        <span>Players: {tournament.size}</span>
        {tournament.entries[0] != null && (
          <span>Winner: {tournament.entries[0].player?.name}</span>
        )}
      </div>
    );
  }, [tournament]);

  const images = useMemo(
    () =>
      tournament.entries[0]?.commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${tournament.name} winner card art`,
        })) || [],
    [tournament.entries, tournament.name],
  );

  return (
    <Card bottomText={tournamentStats} images={images}>
      <div className="flex h-32 flex-col space-y-2">
        <RouteLink
          route="/tournament/:tid"
          params={{tid: tournament.TID}}
          className="line-clamp-2 text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
        >
          {tournament.name}
        </RouteLink>

        <span>{format(tournament.tournamentDate, 'MMMM do yyyy')}</span>
      </div>
    </Card>
  );
}

function useOptimizedMinSizeHandler(
  updatePreference: (
    key: keyof PreferencesMap['tournaments'],
    value: number,
  ) => void,
) {
  return useMemo(() => {
    const debouncedMinSize = createDebouncer((value: string) => {
      const numValue = value === '' ? 0 : parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        updatePreference(
          'minSize' as keyof PreferencesMap['tournaments'],
          numValue,
        );
      }
    }, 250);

    const handleMinSizeChange = (
      value: string,
      setLocal: (value: string) => void,
    ) => {
      setLocal(value);
      debouncedMinSize(value);
    };

    const handleMinSizeSelect = (
      value: number | null,
      setLocal: (value: string) => void,
    ) => {
      const numValue = value || 0;
      const stringValue = numValue > 0 ? numValue.toString() : '';
      startTransition(() => setLocal(stringValue));
      updatePreference(
        'minSize' as keyof PreferencesMap['tournaments'],
        numValue,
      );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Go') {
        (e.target as HTMLInputElement).blur();
      }
    };

    return {
      handleMinSizeChange,
      handleMinSizeSelect,
      handleKeyDown,
    };
  }, [updatePreference]);
}

function TournamentsPageShell({
  sortBy,
  timePeriod,
  minSize,
  updatePreference,
  preferences,
  children,
}: PropsWithChildren<{
  sortBy: 'PLAYERS' | 'DATE';
  timePeriod: keyof typeof TIME_PERIOD_LABELS;
  minSize: number;
  updatePreference: (
    key: keyof PreferencesMap['tournaments'],
    value: any,
  ) => void;
  preferences: PreferencesMap['tournaments'];
}>) {
  useSeoMeta({
    title: 'cEDH Tournaments',
    description: 'Discover top and recent cEDH tournaments!',
  });

  const [localMinSize, setLocalMinSize] = useState(() =>
    minSize > 0 ? minSize.toString() : '',
  );

  const minSizeHandlers = useOptimizedMinSizeHandler(updatePreference);

  useEffect(() => {
    setLocalMinSize(minSize > 0 ? minSize.toString() : '');
  }, [minSize]);

  const handleSortByChange = useCallback(
    (value: 'PLAYERS' | 'DATE') => {
      updatePreference('sortBy' as keyof PreferencesMap['tournaments'], value);
    },
    [updatePreference],
  );

  const handleTimePeriodChange = useCallback(
    (value: keyof typeof TIME_PERIOD_LABELS) => {
      updatePreference(
        'timePeriod' as keyof PreferencesMap['tournaments'],
        value,
      );
    },
    [updatePreference],
  );

  const currentSortByLabel = useMemo(
    () => (sortBy === 'PLAYERS' ? 'Tournament Size' : 'Date'),
    [sortBy],
  );

  const currentTimePeriodLabel = useMemo(
    () =>
      TIME_PERIOD_LABELS[preferences?.timePeriod || timePeriod] || 'All Time',
    [preferences?.timePeriod, timePeriod],
  );

  return (
    <>
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
          <div className="flex-1">
            <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
              cEDH Tournaments
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 lg:flex-nowrap lg:justify-end">
            <div className="relative flex flex-col">
              <Dropdown
                id="tournaments-sort-by"
                label="Sort By"
                value={currentSortByLabel}
                options={SORT_BY_OPTIONS}
                onSelect={handleSortByChange}
              />
            </div>

            <div className="relative flex flex-col">
              <Dropdown
                id="tournaments-time-period"
                label="Time Period"
                value={currentTimePeriodLabel}
                options={TIME_PERIOD_OPTIONS}
                onSelect={handleTimePeriodChange}
              />
            </div>

            <div className="relative flex flex-col">
              <NumberInputDropdown
                id="tournaments-min-size"
                label="Tournament Size"
                value={localMinSize}
                placeholder="Tournament Size"
                min="0"
                dropdownClassName="min-size-dropdown"
                options={MIN_SIZE_OPTIONS}
                onChange={(value) =>
                  minSizeHandlers.handleMinSizeChange(value, setLocalMinSize)
                }
                onSelect={(value) =>
                  minSizeHandlers.handleMinSizeSelect(value, setLocalMinSize)
                }
                onKeyDown={minSizeHandlers.handleKeyDown}
              />
            </div>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

/** @resource m#tournaments */
export const TournamentsPage: EntryPointComponent<
  {tournamentQueryRef: tournaments_TournamentsQuery},
  {}
> = ({queries}) => {
  const {preferences, updatePreference, isHydrated} = usePreferences(
    'tournaments',
    DEFAULT_PREFERENCES.tournaments!,
  );

  const serverPreferences = useMemo(() => {
    if (
      typeof window !== 'undefined' &&
      (window as any).__SERVER_PREFERENCES__
    ) {
      return (window as any).__SERVER_PREFERENCES__;
    }
    return null;
  }, []);

  const query = usePreloadedQuery(
    graphql`
      query tournaments_TournamentsQuery @preloadable {
        ...tournaments_Tournaments
      }
    `,
    queries.tournamentQueryRef,
  );

  const {data, loadNext, isLoadingNext, hasNext, refetch} =
    usePaginationFragment<AllTournamentsQuery, tournaments_Tournaments$key>(
      graphql`
        fragment tournaments_Tournaments on Query
        @argumentDefinitions(
          cursor: {type: "String"}
          count: {type: "Int", defaultValue: 100}
        )
        @refetchable(queryName: "AllTournamentsQuery") {
          tournaments(first: $count, after: $cursor)
            @connection(key: "tournaments__tournaments") {
            edges {
              node {
                id
                ...tournaments_TournamentCard
              }
            }
          }
        }
      `,
      query,
    );

  const currentPreferences = useMemo(
    () => ({
      sortBy: preferences?.sortBy || ('DATE' as const),
      timePeriod: preferences?.timePeriod || ('ALL_TIME' as const),
      minSize: preferences?.minSize || 0,
    }),
    [preferences],
  );

  const handleRefetch = useCallback(() => {
    //console.log('🔄 [TOURNAMENTS] Refetch triggered by preferences change');
    startTransition(() => {
      refetch({}, {fetchPolicy: 'network-only'});
    });
  }, [refetch]);

  const handleLoadMore = useCallback(
    (count: number) => {
      startTransition(() => {
        loadNext(count);
      });
    },
    [loadNext],
  );

  const hasRefetchedRef = useRef(false);

  useEffect(() => {
    setRefetchCallback(handleRefetch);
    return clearRefetchCallback;
  }, [handleRefetch]);

  useEffect(() => {
    if (isHydrated && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;

      const actualServerPrefs =
        serverPreferences || DEFAULT_PREFERENCES.tournaments;
      const prefsMatch =
        JSON.stringify(preferences) === JSON.stringify(actualServerPrefs);

      //console.log('🍪 [TOURNAMENTS] Hydration complete:', {
      //  clientPrefs: preferences,
      //  serverPrefs: actualServerPrefs,
      //  needsRefetch: !prefsMatch,
      //});
    }
  }, [isHydrated, preferences, serverPreferences]);

  const tournamentCards = useMemo(
    () =>
      data.tournaments.edges.map((edge) => (
        <TournamentCard key={edge.node.id} commander={edge.node} />
      )),
    [data.tournaments.edges],
  );

  return (
    <TournamentsPageShell
      sortBy={currentPreferences.sortBy}
      timePeriod={currentPreferences.timePeriod}
      minSize={currentPreferences.minSize}
      updatePreference={updatePreference}
      preferences={preferences}
    >
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {tournamentCards}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={handleLoadMore}
      />

      <Footer />
    </TournamentsPageShell>
  );
};
