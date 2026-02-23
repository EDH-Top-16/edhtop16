import {breakdown_BreakdownGroupCard$key} from '#genfiles/queries/breakdown_BreakdownGroupCard.graphql';
import {breakdown_TournamentBreakdownQuery} from '#genfiles/queries/breakdown_TournamentBreakdownQuery.graphql';
import {useNavigation} from '#genfiles/router/router';
import {ColorIdentity} from '#src/assets/icons/colors';
import {Card} from '#src/components/card';
import {Footer} from '#src/components/footer';
import {formatPercent} from '#src/lib/client/format';
import {graphql, useFragment, usePreloadedQuery} from 'react-relay/hooks';

function BreakdownGroupCard({
  onClickGroup,
  ...props
}: {
  onClickGroup?: (groupName: string) => void;
  group: breakdown_BreakdownGroupCard$key;
}) {
  const {commander, conversionRate, entries, topCuts} = useFragment(
    graphql`
      fragment breakdown_BreakdownGroupCard on TournamentBreakdownGroup
      @throwOnFieldError {
        commander {
          name
          breakdownUrl
          colorId
          cards {
            imageUrls
          }
        }

        entries
        topCuts
        conversionRate
      }
    `,
    props.group,
  );

  return (
    <Card
      bottomText={
        <div className="flex flex-wrap justify-between gap-1">
          <span>Top Cuts: {topCuts}</span>
          <span>Entries: {entries}</span>
          <span>Conversion: {formatPercent(conversionRate)}</span>
        </div>
      }
      images={commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${commander.name} art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <button
          className="text-left text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
          onClick={() => {
            onClickGroup?.(commander.name);
          }}
        >
          {commander.name}
        </button>

        <ColorIdentity identity={commander.colorId} />
      </div>
    </Card>
  );
}

export type Queries = {
  breakdown: breakdown_TournamentBreakdownQuery;
};

export default function TournamentBreakdown({
  queries,
}: PastoriaPageProps<'/tournament/[tid]#breakdown'>) {
  const {tournament} = usePreloadedQuery(
    graphql`
      query breakdown_TournamentBreakdownQuery($tid: String!)
      @preloadable
      @throwOnFieldError {
        tournament(TID: $tid) @required(action: THROW) {
          breakdown {
            commander {
              id
            }

            ...breakdown_BreakdownGroupCard
          }
        }
      }
    `,
    queries.breakdown,
  );

  const {replaceRoute} = useNavigation();

  return (
    <>
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {tournament.breakdown.map((group) => (
          <BreakdownGroupCard
            key={group.commander.id}
            group={group}
            onClickGroup={(commanderName) => {
              replaceRoute('/tournament/[tid]', {
                tid: queries.breakdown.variables.tid,
                tab: 'commander',
                commander: commanderName,
              });
            }}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
