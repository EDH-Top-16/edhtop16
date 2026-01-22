import {Card} from '#components/card.js';
import {Footer} from '#components/footer.js';
import {LoadMoreButton} from '#components/load_more.js';
import {FirstPartyPromo} from '#components/promo.js';
import {AllTournamentsQuery} from '#genfiles/queries/AllTournamentsQuery.graphql.js';
import {tournaments_TournamentCard$key} from '#genfiles/queries/tournaments_TournamentCard.graphql.js';
import {tournaments_Tournaments$key} from '#genfiles/queries/tournaments_Tournaments.graphql.js';
import tournaments_TournamentsQuery from '#genfiles/queries/tournaments_TournamentsQuery.graphql.js';
import {RouteLink} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {format} from 'date-fns';
import {useMemo} from 'react';
import {graphql, useFragment, usePaginationFragment, usePreloadedQuery} from 'react-relay/hooks';

export const queries = {
  tournamentQueryRef: tournaments_TournamentsQuery,
};

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
          route="/tournament/[tid]"
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

export default function TournamentsPage({
  queries,
}: PageProps<'/tournaments#tournaments'>) {
  const query = usePreloadedQuery(
    graphql`
      query tournaments_TournamentsQuery(
        $timePeriod: TimePeriod = ALL_TIME
        $sortBy: TournamentSortBy = DATE
        $minSize: Int = 0
      ) @preloadable @throwOnFieldError {
        ...tournaments_Tournaments

        tournamentPagePromo {
          ...promo_EmbededPromo
        }
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
