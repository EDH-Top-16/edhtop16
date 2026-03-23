import {commanderBreakdown_BreakdownQuery} from '#genfiles/queries/commanderBreakdown_BreakdownQuery.graphql';
import {Footer} from '#src/components/footer.jsx';
import {TournamentEntryCard} from '#src/components/tournament_entry_card.jsx';
import {graphql, usePreloadedQuery} from 'react-relay/hooks';

export type Queries = {
  breakdown: commanderBreakdown_BreakdownQuery;
};

export default function TournamentBreakdown({
  queries,
}: PastoriaPageProps<'/tournament/[tid]#commander_breakdown'>) {
  const {tournament} = usePreloadedQuery(
    graphql`
      query commanderBreakdown_BreakdownQuery(
        $tid: String!
        $commander: String!
      ) @preloadable @throwOnFieldError {
        tournament(TID: $tid) @required(action: THROW) {
          breakdownEntries: entries(commander: $commander) {
            id
            ...tournamentEntryCard_Entry
          }
        }
      }
    `,
    queries.breakdown,
  );

  return (
    <>
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {tournament.breakdownEntries.map((entry) => (
          <TournamentEntryCard
            key={entry.id}
            entry={entry}
            highlightFirst={false}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
