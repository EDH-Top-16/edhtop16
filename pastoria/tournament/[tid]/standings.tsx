import {standings_TournamentStandingsQuery} from '#genfiles/queries/standings_TournamentStandingsQuery.graphql';
import {Footer} from '#src/components/footer';
import {TournamentEntryCard} from '#src/components/tournament_entry_card';
import {graphql, usePreloadedQuery} from 'react-relay/hooks';

export type Queries = {
  standings: standings_TournamentStandingsQuery;
};

export default function TournamentStanding({
  queries,
}: PastoriaPageProps<'/tournament/[tid]#standings'>) {
  const {tournament} = usePreloadedQuery(
    graphql`
      query standings_TournamentStandingsQuery($tid: String!)
      @preloadable
      @throwOnFieldError {
        tournament(TID: $tid) @required(action: THROW) {
          entries {
            id
            ...tournamentEntryCard_Entry
          }
        }
      }
    `,
    queries.standings,
  );

  return (
    <>
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {tournament.entries.map((entry) => (
          <TournamentEntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      <Footer />
    </>
  );
}
