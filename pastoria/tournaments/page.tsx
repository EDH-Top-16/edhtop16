import {AllTournamentsQuery} from '#genfiles/queries/AllTournamentsQuery.graphql';
import {page_TournamentCard$key} from '#genfiles/queries/page_TournamentCard.graphql';
import {page_Tournaments$key} from '#genfiles/queries/page_Tournaments.graphql';
import {page_TournamentsQuery} from '#genfiles/queries/page_TournamentsQuery.graphql';
import {
  RouteLink,
  useNavigation,
  useRouteParams,
} from '#genfiles/router/router';
import {Card} from '#src/components/card';
import {LoadingIcon} from '#src/components/fallback';
import {Footer} from '#src/components/footer';
import {LoadMoreButton} from '#src/components/load_more';
import {Navigation} from '#src/components/navigation';
import {FirstPartyPromo} from '#src/components/promo';
import {Select} from '#src/components/select';
import {format} from 'date-fns';
import {Suspense, useMemo} from 'react';
import {
  graphql,
  PreloadedQuery,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

function TournamentCard(props: {commander: page_TournamentCard$key}) {
  const tournament = useFragment(
    graphql`
      fragment page_TournamentCard on Tournament @throwOnFieldError {
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

export type Queries = {
  tournamentQueryRef: page_TournamentsQuery;
};

export default function TournamentsPageShell({
  queries,
}: PastoriaPageProps<'/tournaments'>) {
  const {
    sortBy = 'DATE',
    timePeriod = 'ALL_TIME',
    minSize = 0,
  } = useRouteParams('/tournaments');
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
              label="Tournament Size"
              value={`${minSize}`}
              onChange={(value) => {
                replaceRoute('/tournaments', {minSize: Number(value)});
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="16">16+ Players</option>
              <option value="30">30+ Players</option>
              <option value="50">50+ Players</option>
              <option value="100">100+ Players</option>
              <option value="250">250+ Players</option>
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

        <Suspense fallback={<LoadingIcon />}>
          <TournamentsPage tournamentQueryRef={queries.tournamentQueryRef} />
        </Suspense>
      </div>
    </>
  );
}

function TournamentsPage({
  tournamentQueryRef,
}: {
  tournamentQueryRef: PreloadedQuery<page_TournamentsQuery>;
}) {
  const query = usePreloadedQuery(
    graphql`
      query page_TournamentsQuery(
        $timePeriod: TimePeriod = ALL_TIME
        $sortBy: TournamentSortBy = DATE
        $minSize: Int = 0
      ) @preloadable @throwOnFieldError {
        ...page_Tournaments

        tournamentPagePromo {
          ...promo_EmbededPromo
        }
      }
    `,
    tournamentQueryRef,
  );

  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    AllTournamentsQuery,
    page_Tournaments$key
  >(
    graphql`
      fragment page_Tournaments on Query
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
        ) @connection(key: "page__tournaments") {
          edges {
            node {
              id
              ...page_TournamentCard
            }
          }
        }
      }
    `,
    query,
  );

  return (
    <>
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {query.tournamentPagePromo && (
          <FirstPartyPromo
            promo={query.tournamentPagePromo}
            hasMargin={false}
            showImage={false}
            fullWidth={true}
          />
        )}

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
    </>
  );
}
