import StatsQuery from '#genfiles/queries/StatsQuery.graphql.js';
import {PageProps} from '#genfiles/router/types.js';
import {formatPercent} from '#src/lib/client/format.js';
import {graphql, usePreloadedQuery} from 'react-relay/hooks';

export const queries = {
  statsQueryRef: StatsQuery,
};

export default function CommanderStats({
  queries,
}: PageProps<'/commander/[commander]#stats'>) {
  const {commander} = usePreloadedQuery(
    graphql`
      query StatsQuery(
        $commander: String!
        $timePeriod: TimePeriod = ONE_YEAR
        $minEventSize: Int = 60
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          stats(filters: {timePeriod: $timePeriod, minSize: $minEventSize}) {
            conversionRate
            metaShare
            count
          }
        }
      }
    `,
    queries.statsQueryRef,
  );

  if (!commander) {
    return null;
  }

  const {stats} = commander;

  return (
    <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
      {stats.count} Entries
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(stats.metaShare)} Meta%
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(stats.conversionRate)} Conversion
    </div>
  );
}
