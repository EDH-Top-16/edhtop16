import {commanders_CommandersQuery} from '#genfiles/queries/commanders_CommandersQuery.graphql';
import {commanders_DisplayPreferencesQuery} from '#genfiles/queries/commanders_DisplayPreferencesQuery.graphql.js';
import {commanders_HomePagePromoQuery} from '#genfiles/queries/commanders_HomePagePromoQuery.graphql.js';
import {commanders_topCommanders$key} from '#genfiles/queries/commanders_topCommanders.graphql';
import {commanders_TopCommandersCard$key} from '#genfiles/queries/commanders_TopCommandersCard.graphql';
import {TopCommandersQuery} from '#genfiles/queries/TopCommandersQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {Link, useNavigation, useRouteParams} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback';
import {FirstPartyPromo} from '#src/components/promo.jsx';
import {LIST_STYLE_COOKIE_NAME} from '#src/lib/client/display_preferences.js';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import cn from 'classnames';
import {Suspense, useCallback, useMemo} from 'react';
import {useClientQuery} from 'react-relay';
import {
  EntryPoint,
  EntryPointComponent,
  EntryPointContainer,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {ColorIdentity} from './assets/icons/colors';
import {Card} from './components/card';
import {ColorSelection} from './components/color_selection';
import {Footer} from './components/footer';
import {LoadMoreButton} from './components/load_more';
import {Navigation} from './components/navigation';
import {Select} from './components/select';
import {InfoIcon, Tooltip} from './components/ui/tooltip';
import {formatPercent, formatTopCutFactor} from './lib/client/format';

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
          topCutFactor
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
        `Converts: ${formatTopCutFactor(commander.stats.topCutFactor)}`,
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
        <div className="text-sm opacity-75 lg:hidden">Cnvr. Factor:</div>
        <div className="text-sm">
          {formatTopCutFactor(commander.stats.topCutFactor)}
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

/** @route / */
export const CommandersPageShell: EntryPointComponent<
  {promoQueryRef: commanders_HomePagePromoQuery},
  {commandersRef: EntryPoint<ModuleType<'m#index'>>}
> = ({queries, entryPoints}) => {
  const {homePagePromo} = usePreloadedQuery(
    graphql`
      query commanders_HomePagePromoQuery @preloadable {
        homePagePromo {
          ...promo_EmbededPromo
        }
      }
    `,
    queries.promoQueryRef,
  );

  const {
    sortBy = 'POPULARITY',
    timePeriod = 'SIX_MONTHS',
    minEntries = 20,
    minSize: minTournamentSize = 60,
    colorId = '',
  } = useRouteParams('/');
  const {replaceRoute} = useNavigation();
  const [display, toggleDisplay] = useCommandersDisplay();

  return (
    <>
      <title>cEDH Commanders</title>
      <meta
        name="description"
        content="Discover top performing commanders in cEDH!"
      />
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white">
            cEDH Metagame Breakdown
          </h1>

          <button className="cursor-pointer" onClick={toggleDisplay}>
            {display === 'card' ? (
              <TableCellsIcon className="h-6 w-6 text-white" />
            ) : (
              <RectangleStackIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
          <div className="flex-1">
            <ColorSelection
              selected={colorId}
              onChange={(value) => {
                replaceRoute('/', {colorId: value || null});
              }}
            />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap">
            <Select
              id="commanders-sort-by"
              label="Sort By"
              value={sortBy}
              onChange={(value) => {
                replaceRoute('/', {sortBy: value});
              }}
            >
              <option value="CONVERSION">Conversion Factor</option>
              <option value="POPULARITY">Popularity</option>
              <option value="TOP_CUTS">Top Cuts</option>
            </Select>

            <Select
              id="commanders-time-period"
              label="Time Period"
              value={timePeriod}
              onChange={(value) => {
                replaceRoute('/', {timePeriod: value});
              }}
            >
              <option value="ONE_MONTH">1 Month</option>
              <option value="THREE_MONTHS">3 Months</option>
              <option value="SIX_MONTHS">6 Months</option>
              <option value="ONE_YEAR">1 Year</option>
              <option value="ALL_TIME">All Time</option>
              <option value="POST_BAN">Post Ban</option>
            </Select>

            <Select
              id="commanders-min-entries"
              label="Min. Entries"
              value={`${minEntries}`}
              onChange={(value) => {
                replaceRoute('/', {minEntries: Number(value)});
              }}
            >
              <option value="0">All Commanders</option>
              <option value="20">20+ Entries</option>
              <option value="60">60+ Entries</option>
              <option value="120">120+ Entries</option>
            </Select>

            <Select
              id="commanders-min-size"
              label="Tournament Size"
              value={`${minTournamentSize}`}
              onChange={(value) => {
                replaceRoute('/', {minSize: Number(value)});
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="32">32+ Players</option>
              <option value="60">60+ Players</option>
              <option value="100">100+ Players</option>
            </Select>
          </div>
        </div>

        {homePagePromo && <FirstPartyPromo promo={homePagePromo} />}

        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.commandersRef}
            props={{}}
          />
        </Suspense>
      </div>
    </>
  );
};

function useCommandersDisplay() {
  const {displayPreferences} =
    useClientQuery<commanders_DisplayPreferencesQuery>(
      graphql`
        query commanders_DisplayPreferencesQuery {
          displayPreferences {
            listStyle
          }
        }
      `,
      {},
    );

  const listStyle = displayPreferences?.listStyle;

  const toggleDisplay = useCallback(() => {
    window.cookieStore.set(
      LIST_STYLE_COOKIE_NAME,
      listStyle === 'table' ? 'card' : 'table',
    );
  }, [listStyle]);

  return useMemo(() => {
    return [listStyle === 'table' ? 'table' : 'card', toggleDisplay] as const;
  }, [listStyle, toggleDisplay]);
}

/** @resource m#index */
export const CommandersPage: EntryPointComponent<
  {commandersQueryRef: commanders_CommandersQuery},
  {}
> = ({queries}) => {
  const query = usePreloadedQuery(
    graphql`
      query commanders_CommandersQuery(
        $timePeriod: TimePeriod = SIX_MONTHS
        $sortBy: CommandersSortBy = POPULARITY
        $minEntries: Int = 20
        $minSize: Int = 60
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
            <div className="flex items-center">
              Cnvr. Factor
              <Tooltip content="How often this commander top cuts vs expected. 1.00x = average, 2.00x = twice as often.">
                <InfoIcon className="ml-1 cursor-help text-white/50 hover:text-white/80" />
              </Tooltip>
            </div>
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
};
