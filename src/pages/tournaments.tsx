import {AllTournamentsQuery} from '#genfiles/queries/AllTournamentsQuery.graphql';
import {tournaments_TournamentCard$key} from '#genfiles/queries/tournaments_TournamentCard.graphql';
import {tournaments_Tournaments$key} from '#genfiles/queries/tournaments_Tournaments.graphql';
import {
  TimePeriod,
  tournaments_TournamentsQuery,
  tournaments_TournamentsQuery$variables,
  TournamentSortBy,
} from '#genfiles/queries/tournaments_TournamentsQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {
  EntryPointParams,
  RouteLink,
  useNavigation,
} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback';
import {format} from 'date-fns';
import {PropsWithChildren, useMemo} from 'react';
import {
  EntryPoint,
  EntryPointComponent,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {Card} from '../components/card';
import {Footer} from '../components/footer';
import {LoadMoreButton} from '../components/load_more';
import {Navigation} from '../components/navigation';
import {Select} from '../components/select';

function TournamentCard(props: {commander: tournaments_TournamentCard$key}) {
  const tournament = useFragment(
    graphql`
      fragment tournaments_TournamentCard on Tournament @throwOnFieldError {
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
  const {replaceRoute} = useNavigation();

  return (
    <>
      <title>cEDH Tournaments</title>
      <meta
        name="description"
        content="Discover top and recent cEDH tournaments!"
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="font-title flex-1 text-4xl font-extrabold text-white md:text-5xl">
            cEDH Tournaments
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Select
              id="tournaments-sort-by"
              label="Sort By"
              value={sortBy}
              onChange={(value) => {
                replaceRoute('/tournaments', {sortBy: value});
              }}
            >
              <option value="PLAYERS">Tournament Size</option>
              <option value="DATE">Date</option>
            </Select>

            <Select
              id="tournaments-players"
              label="Players"
              value={minSize}
              onChange={(value) => {
                replaceRoute('/tournaments', {minSize: Number(value)});
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="32">32+ Players</option>
              <option value="60">60+ Players</option>
              <option value="100">100+ Players</option>
            </Select>

            <Select
              id="tournaments-time-period"
              label="Time Period"
              value={timePeriod}
              onChange={(value) => {
                replaceRoute('/tournaments', {timePeriod: value});
              }}
            >
              <option value="ONE_MONTH">1 Month</option>
              <option value="THREE_MONTHS">3 Months</option>
              <option value="SIX_MONTHS">6 Months</option>
              <option value="POST_BAN">Post Ban</option>
              <option value="ONE_YEAR">1 Year</option>
              <option value="ALL_TIME">All Time</option>
            </Select>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

/** @resource m#tournaments_fallback */
export const TournamentsPageFallback: EntryPointComponent<
  {},
  {},
  {},
  tournaments_TournamentsQuery$variables
> = ({extraProps}) => {
  return (
    <TournamentsPageShell
      sortBy={extraProps.sortBy}
      timePeriod={extraProps.timePeriod}
      minSize={`${extraProps.minSize}`}
    >
      <LoadingIcon />
    </TournamentsPageShell>
  );
};

/** @resource m#tournaments */
export const TournamentsPage: EntryPointComponent<
  {tournamentQueryRef: tournaments_TournamentsQuery},
  {fallback: EntryPoint<ModuleType<'m#tournaments_fallback'>>}
> = ({queries}) => {
  const query = usePreloadedQuery(
    graphql`
      query tournaments_TournamentsQuery(
        $timePeriod: TimePeriod!
        $sortBy: TournamentSortBy!
        $minSize: Int!
      ) @preloadable @throwOnFieldError {
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
      @throwOnFieldError
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
