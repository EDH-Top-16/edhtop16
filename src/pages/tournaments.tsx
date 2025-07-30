import {AllTournamentsQuery} from '#genfiles/queries/AllTournamentsQuery.graphql';
import {tournaments_TournamentCard$key} from '#genfiles/queries/tournaments_TournamentCard.graphql';
import {tournaments_Tournaments$key} from '#genfiles/queries/tournaments_Tournaments.graphql';
import {
  TimePeriod,
  tournaments_TournamentsQuery,
  TournamentSortBy,
} from '#genfiles/queries/tournaments_TournamentsQuery.graphql';
import {RouteLink, useNavigation} from '#genfiles/river/router';
import {useSeoMeta} from '@unhead/react';
import {format} from 'date-fns';
import {PropsWithChildren, useMemo, useState, useEffect, useCallback} from 'react';
import {
  EntryPointComponent,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {Card} from '../components/card';
import {Dropdown} from '../components/dropdown';
import {Footer} from '../components/footer';
import {LoadMoreButton} from '../components/load_more';
import {Navigation} from '../components/navigation';
import {NumberInputDropdown} from '../components/number_input_dropdown';

function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

function TournamentCard(props: {commander: tournaments_TournamentCard$key}) {
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
    props.commander,
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

  return (
    <Card
      bottomText={tournamentStats}
      images={tournament.entries[0]?.commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${tournament.name} winner card art`,
        }))}
    >
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

function TournamentsPageShell({
  sortBy,
  timePeriod,
  minSize,
  children,
}: PropsWithChildren<{
  sortBy: TournamentSortBy;
  timePeriod: TimePeriod;
  minSize: string;
}>) {
  useSeoMeta({
    title: 'cEDH Tournaments',
    description: 'Discover top and recent cEDH tournaments!',
  });

  const {replaceRoute} = useNavigation();

  const [localMinSize, setLocalMinSize] = useState(
    minSize && parseInt(minSize, 10) > 0 ? minSize : ''
  );

  useEffect(() => {
    setLocalMinSize(
      minSize && parseInt(minSize, 10) > 0 ? minSize : ''
    );
  }, [minSize]);

  const debouncedMinSizeUpdate = useCallback(
    debounce((value: string) => {
      if (value === '') {
        replaceRoute('/tournaments', {minSize: 0});
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
          replaceRoute('/tournaments', {minSize: numValue});
        }
      }
    }, 300),
    [replaceRoute]
  );

  const handleMinSizeChange = useCallback((value: string) => {
    setLocalMinSize(value);
    debouncedMinSizeUpdate(value);
  }, [debouncedMinSizeUpdate]);

  const handleMinSizeSelect = useCallback((value: number | null) => {
    const stringValue = value?.toString() || '';
    setLocalMinSize(stringValue);
    replaceRoute('/tournaments', {minSize: value || 0});
  }, [replaceRoute]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Go') {
      (e.target as HTMLInputElement).blur();
    }
  }, []);

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
                value={sortBy === 'PLAYERS' ? 'Tournament Size' : 'Date'}
                options={[
                  { value: 'PLAYERS' as TournamentSortBy, label: 'Tournament Size' },
                  { value: 'DATE' as TournamentSortBy, label: 'Date' }
                ]}
                onSelect={(value) => {
                  replaceRoute('/tournaments', {sortBy: value});
                }}
              />
            </div>

            <div className="relative flex flex-col">
              <Dropdown
                id="tournaments-time-period"
                label="Time Period"
                value={
                  timePeriod === 'ONE_MONTH' ? '1 Month' :
                  timePeriod === 'THREE_MONTHS' ? '3 Months' :
                  timePeriod === 'SIX_MONTHS' ? '6 Months' :
                  timePeriod === 'POST_BAN' ? 'Post Ban' :
                  timePeriod === 'ONE_YEAR' ? '1 Year' :
                  'All Time'
                }
                options={[
                  { value: 'ONE_MONTH' as TimePeriod, label: '1 Month' },
                  { value: 'THREE_MONTHS' as TimePeriod, label: '3 Months' },
                  { value: 'SIX_MONTHS' as TimePeriod, label: '6 Months' },
                  { value: 'POST_BAN' as TimePeriod, label: 'Post Ban' },
                  { value: 'ONE_YEAR' as TimePeriod, label: '1 Year' },
                  { value: 'ALL_TIME' as TimePeriod, label: 'All Time' }
                ]}
                onSelect={(value) => {
                  replaceRoute('/tournaments', {timePeriod: value});
                }}
              />
            </div>

            <div className="relative flex flex-col">
              <NumberInputDropdown
                id="tournaments-min-size"
                label="Tournament Size"
                value={localMinSize || ''}
                placeholder="Tournament Size"
                min="0"
                dropdownClassName="min-size-dropdown"
                options={[
                  { value: null, label: 'All Tournaments' },
                  { value: 32, label: '32+ Players' },
                  { value: 60, label: '60+ Players' },
                  { value: 100, label: '100+ Players' }
                ]}
                onChange={handleMinSizeChange}
                onSelect={handleMinSizeSelect}
                onKeyDown={handleKeyDown}
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
  const query = usePreloadedQuery(
    graphql`
      query tournaments_TournamentsQuery(
        $timePeriod: TimePeriod!
        $sortBy: TournamentSortBy!
        $minSize: Int!
      ) @preloadable {
        ...tournaments_Tournaments
      }
    `,
    queries.tournamentQueryRef,
  );

  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    AllTournamentsQuery,
    tournaments_Tournaments$key
  >(
    graphql`
      fragment tournaments_Tournaments on Query
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 100}
      )
      @refetchable(queryName: "AllTournamentsQuery") {
        tournaments(
          first: $count
          after: $cursor
          filters: {timePeriod: $timePeriod, minSize: $minSize}
          sortBy: $sortBy
        ) @connection(key: "tournaments__tournaments") {
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

  return (
    <TournamentsPageShell
      sortBy={queries.tournamentQueryRef.variables.sortBy}
      timePeriod={queries.tournamentQueryRef.variables.timePeriod}
      minSize={`${queries.tournamentQueryRef.variables.minSize}`}
    >
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {data.tournaments.edges.map((edge) => (
          <TournamentCard key={edge.node.id} commander={edge.node} />
        ))}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={loadNext}
      />

      <Footer />
    </TournamentsPageShell>
  );
};
