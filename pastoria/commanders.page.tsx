import {Card} from '#components/card.js';
import {Footer} from '#components/footer.js';
import {LoadMoreButton} from '#components/load_more.js';
import commanders_CommandersQuery from '#genfiles/queries/commanders_CommandersQuery.graphql.js';
import {commanders_topCommanders$key} from '#genfiles/queries/commanders_topCommanders.graphql.js';
import {commanders_TopCommandersCard$key} from '#genfiles/queries/commanders_TopCommandersCard.graphql.js';
import {TopCommandersQuery} from '#genfiles/queries/TopCommandersQuery.graphql.js';
import {Link} from '#genfiles/router/router.jsx';
import {PageProps} from '#genfiles/router/types.js';
import {ColorIdentity} from '#src/assets/icons/colors.jsx';
import {useCommandersDisplay} from '#src/lib/client/commander_display_preferences.js';
import {formatPercent} from '#src/lib/client/format.js';
import cn from 'classnames';
import {useMemo} from 'react';
import {
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

export const queries = {
  commandersQueryRef: commanders_CommandersQuery,
};

export default function CommandersPage({queries}: PageProps<'/#commanders'>) {
  const query = usePreloadedQuery(
    graphql`
      query commanders_CommandersQuery(
        $timePeriod: TimePeriod = SIX_MONTHS
        $sortBy: CommandersSortBy = POPULARITY
        $minEntries: Int = 20
        $minSize: Int = 50
        $colorId: String
      ) @preloadable @throwOnFieldError {
        ...commanders_topCommanders
      }
    `,
    queries.commandersQueryRef,
  );

  const [display] = useCommandersDisplay();

  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    TopCommandersQuery,
    commanders_topCommanders$key
  >(
    graphql`
      fragment commanders_topCommanders on Query
      @throwOnFieldError
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "TopCommandersQuery") {
        commanders(
          first: $count
          after: $cursor
          timePeriod: $timePeriod
          sortBy: $sortBy
          colorId: $colorId
          minEntries: $minEntries
          minTournamentSize: $minSize
        ) @connection(key: "commanders__commanders") {
          edges {
            node {
              id
              ...commanders_TopCommandersCard
            }
          }
        }
      }
    `,
    query,
  );

  return (
    <>
      <div
        className={cn(
          'mx-auto grid w-full pb-4',
          display === 'table'
            ? 'w-full grid-cols-1 gap-2'
            : 'w-fit gap-4 md:grid-cols-2 xl:grid-cols-3',
        )}
      >
        {display === 'table' && (
          <div className="sticky top-[68px] hidden w-full grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px] items-center gap-x-2 overflow-x-hidden bg-[#514f86] p-4 text-sm text-white lg:grid">
            <div>Color</div>
            <div>Commander</div>
            <div>Entries</div>
            <div>Meta %</div>
            <div>Top Cuts</div>
            <div>Cnvr. %</div>
          </div>
        )}

        {data.commanders.edges.map(({node}) => (
          <TopCommandersCard
            key={node.id}
            display={display}
            commander={node}
            secondaryStatistic={
              queries.commandersQueryRef.variables.sortBy === 'CONVERSION' ||
              queries.commandersQueryRef.variables.sortBy === 'TOP_CUTS'
                ? 'topCuts'
                : 'count'
            }
          />
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

function TopCommandersCard({
  display = 'card',
  secondaryStatistic,
  ...props
}: {
  display?: 'table' | 'card';
  secondaryStatistic: 'topCuts' | 'count';
  commander: commanders_TopCommandersCard$key;
}) {
  const commander = useFragment(
    graphql`
      fragment commanders_TopCommandersCard on Commander @throwOnFieldError {
        name
        colorId
        breakdownUrl
        stats(filters: {timePeriod: $timePeriod, minSize: $minSize}) {
          conversionRate
          topCuts
          count
          metaShare
        }

        cards {
          imageUrls
        }
      }
    `,
    props.commander,
  );

  const commanderStats = useMemo(() => {
    const stats: string[] = [];

    if (secondaryStatistic === 'count') {
      stats.push(
        `Meta Share: ${formatPercent(commander.stats.metaShare)}`,
        `Entries: ${commander.stats.count}`,
      );
    } else if (secondaryStatistic === 'topCuts') {
      stats.push(
        `Conversion Rate: ${formatPercent(commander.stats.conversionRate)}`,
        `Top Cuts: ${commander.stats.topCuts}`,
      );
    }

    return stats.join(' / ');
  }, [commander, secondaryStatistic]);

  if (display === 'table') {
    return (
      <div className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]">
        <div>
          <ColorIdentity identity={commander.colorId} />
        </div>

        <Link
          href={commander.breakdownUrl}
          className="font-title mb-2 text-xl underline lg:mb-0 lg:font-sans lg:text-base"
        >
          {commander.name}
        </Link>

        <div className="text-sm opacity-75 lg:hidden">Entries:</div>
        <div className="text-sm">{commander.stats.count}</div>
        <div className="text-sm opacity-75 lg:hidden">Meta Share:</div>
        <div className="text-sm">
          {formatPercent(commander.stats.metaShare)}
        </div>
        <div className="text-sm opacity-75 lg:hidden">Top Cuts:</div>
        <div className="text-sm">{commander.stats.topCuts}</div>
        <div className="text-sm opacity-75 lg:hidden">Conversion Rate:</div>
        <div className="text-sm">
          {formatPercent(commander.stats.conversionRate)}
        </div>
      </div>
    );
  }

  return (
    <Card
      bottomText={commanderStats}
      images={commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${commander.name} card art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <Link
          href={commander.breakdownUrl}
          className="text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
        >
          {commander.name}
        </Link>

        <ColorIdentity identity={commander.colorId} />
      </div>
    </Card>
  );
}
