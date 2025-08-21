import {
  CommandersSortBy,
  pages_CommandersQuery,
  TimePeriod,
} from '#genfiles/queries/pages_CommandersQuery.graphql';
import {pages_topCommanders$key} from '#genfiles/queries/pages_topCommanders.graphql';
import {pages_TopCommandersCard$key} from '#genfiles/queries/pages_TopCommandersCard.graphql';
import {TopCommandersQuery} from '#genfiles/queries/TopCommandersQuery.graphql';
import {Link, useNavigation, useRouteParams} from '#genfiles/river/router';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import {useSeoMeta} from '@unhead/react';
import cn from 'classnames';
import {PropsWithChildren, useCallback, useMemo} from 'react';
import * as React from 'react';
import {
  EntryPointComponent,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {ColorIdentity} from '../assets/icons/colors';
import {Card} from '../components/card';
import {ColorSelection} from '../components/color_selection';
import {Footer} from '../components/footer';
import {LoadMoreButton} from '../components/load_more';
import {Navigation} from '../components/navigation';
import {Select} from '../components/select';
import {formatPercent} from '../lib/client/format';
import {usePreferences, DEFAULT_PREFERENCES} from '../lib/client/cookies';
import {CommandersPreferences} from '../lib/shared/preferences-types';

function TopCommandersCard({
  display = 'card',
  secondaryStatistic,
  ...props
}: {
  display?: 'card' | 'table';
  secondaryStatistic: 'topCuts' | 'count';
  commander: pages_TopCommandersCard$key;
}) {
  const commander = useFragment(
    graphql`
      fragment pages_TopCommandersCard on Commander {
        name
        colorId
        breakdownUrl
        stats(filters: {timePeriod: $timePeriod, minSize: $minTournamentSize}) {
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

function CommandersPageShell({
  preferences,
  updatePreference,
  children,
}: PropsWithChildren<{
  preferences: CommandersPreferences | null | undefined;
  updatePreference: <P extends keyof CommandersPreferences>(prefKey: P, value: CommandersPreferences[P]) => void;
}>) {
  useSeoMeta({
    title: 'cEDH Commanders',
    description: 'Discover top performing commanders in cEDH!',
  });

  const toggleDisplay = useCallback(() => {
    const currentDisplay = preferences?.display || 'card';
    const newDisplay = currentDisplay === 'table' ? 'card' : 'table';
    console.log('Toggling display mode from:', currentDisplay, 'to:', newDisplay);
    updatePreference('display', newDisplay);
  }, [preferences?.display, updatePreference]);

  const display = preferences?.display || 'card';

  return (
    <>
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white lg:mb-0">
            cEDH Metagame Breakdown
          </h1>

          <div className="flex items-center gap-2">
            <button 
              className="cursor-pointer rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
              onClick={() => {
                const currentStats = preferences?.statsDisplay || 'topCuts';
                const newStats = currentStats === 'topCuts' ? 'count' : 'topCuts';
                updatePreference('statsDisplay', newStats);
              }}
            >
              {(preferences?.statsDisplay || 'topCuts') === 'topCuts' ? 'Show Entries' : 'Show Performance'}
            </button>

            <button className="cursor-pointer" onClick={toggleDisplay}>
              {display === 'card' ? (
                <TableCellsIcon className="h-6 w-6 text-white" />
              ) : (
                <RectangleStackIcon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
          <div className="flex-1">
            <ColorSelection
              selected={preferences?.colorId || ''}
              onChange={(value) => {
                updatePreference('colorId', value || '');
              }}
            />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap">
            <Select
              id="commanders-sort-by"
              label="Sort By"
              value={preferences?.sortBy || 'CONVERSION'}
              onChange={(value) => {
                updatePreference('sortBy', value as CommandersSortBy);
              }}
            >
              <option value="CONVERSION">Conversion Rate</option>
              <option value="POPULARITY">Popularity</option>
              <option value="TOP_CUTS">Top Cuts</option>
            </Select>

            <Select
              id="commanders-time-period"
              label="Time Period"
              value={preferences?.timePeriod || 'ONE_MONTH'}
              onChange={(value) => {
                updatePreference('timePeriod', value as TimePeriod);
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
              value={`${preferences?.minEntries || 0}`}
              onChange={(value) => {
                updatePreference('minEntries', Number(value));
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
              value={`${preferences?.minTournamentSize || 0}`}
              onChange={(value) => {
                updatePreference('minTournamentSize', Number(value));
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="32">32+ Players</option>
              <option value="60">60+ Players</option>
              <option value="100">100+ Players</option>
            </Select>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

/** @resource m#index */
export const CommandersPage: EntryPointComponent<
  {commandersQueryRef: pages_CommandersQuery},
  {}
> = ({queries}) => {
  const query = usePreloadedQuery(
    graphql`
      query pages_CommandersQuery(
        $timePeriod: TimePeriod!
        $sortBy: CommandersSortBy!
        $minEntries: Int!
        $minTournamentSize: Int!
        $colorId: String
      ) @preloadable {
        ...pages_topCommanders
      }
    `,
    queries.commandersQueryRef,
  );

  // SINGLE INSTANCE of usePreferences - this is the key fix!
  const {preferences: commanderPrefs, updatePreference} = usePreferences(
    'commanders',
    DEFAULT_PREFERENCES.commanders!
  );
  
  const display = commanderPrefs?.display || 'card';

  const {data, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment<
    TopCommandersQuery,
    pages_topCommanders$key
  >(
    graphql`
      fragment pages_topCommanders on Query
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
          minTournamentSize: $minTournamentSize
        ) @connection(key: "pages__commanders") {
          edges {
            node {
              id
              ...pages_TopCommandersCard
            }
          }
        }
      }
    `,
    query,
  );

  // Set up refetch callback to trigger when preferences change
  React.useEffect(() => {
    import('../lib/client/cookies').then(({ setRefetchCallback }) => {
      setRefetchCallback((newPrefs) => {
        console.log('Refetching with new preferences:', newPrefs);
        refetch({
          timePeriod: newPrefs.timePeriod || 'ONE_MONTH',
          sortBy: newPrefs.sortBy || 'CONVERSION',
          minEntries: newPrefs.minEntries || 0,
          minTournamentSize: newPrefs.minTournamentSize || 0,
          colorId: newPrefs.colorId || '',
        });
      });
    });

    // Cleanup on unmount
    return () => {
      import('../lib/client/cookies').then(({ clearRefetchCallback }) => {
        clearRefetchCallback();
      });
    };
  }, [refetch]);

  return (
    <CommandersPageShell 
      preferences={commanderPrefs}
      updatePreference={updatePreference}
    >
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
              (commanderPrefs?.statsDisplay || 'topCuts') as 'count' | 'topCuts'
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
    </CommandersPageShell>
  );
};
