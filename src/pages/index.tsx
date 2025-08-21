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
import {PropsWithChildren, useCallback, useMemo, startTransition} from 'react';
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

// Optimize with scheduler to prevent blocking
function scheduleWork(callback: () => void) {
  if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
    (window as any).scheduler.postTask(callback, {priority: 'user-blocking'});
  } else {
    callback();
  }
}

// Intersection Observer for lazy rendering
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {threshold, rootMargin: '200px'}, // Increased root margin to load earlier
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible] as const;
};

const TopCommandersCard = React.memo(
  ({
    display = 'card',
    secondaryStatistic,
    lazy = false,
    ...props
  }: {
    display?: 'card' | 'table';
    secondaryStatistic: 'topCuts' | 'count';
    lazy?: boolean;
    commander: pages_TopCommandersCard$key;
  }) => {
    const [ref, isVisible] = useIntersectionObserver();
    const shouldRender = !lazy || isVisible;

    const commander = useFragment(
      graphql`
        fragment pages_TopCommandersCard on Commander {
          name
          colorId
          breakdownUrl
          stats(
            filters: {timePeriod: $timePeriod, minSize: $minTournamentSize}
          ) {
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
      if (!shouldRender) return '';

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
    }, [commander.stats, secondaryStatistic, shouldRender]);

    const imageProps = useMemo(() => {
      if (!shouldRender) return [];

      return commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${commander.name} card art`,
          loading: 'lazy' as const,
          // Add dimensions to prevent CLS without breaking layout
          style: {
            maxWidth: '100%',
            height: 'auto',
          },
        }));
    }, [commander.cards, commander.name, shouldRender]);

    // Simple skeleton that matches the actual content size
    if (lazy && !shouldRender) {
      return (
        <div
          ref={ref}
          className={cn(
            display === 'table'
              ? 'grid w-full animate-pulse grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/25 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]'
              : 'animate-pulse rounded-lg bg-[#312d5a]/25',
            // Let the skeleton take natural dimensions
            display !== 'table' && 'aspect-[3/4]',
          )}
          style={{
            // Only set minimum dimensions to prevent collapse
            minHeight: display === 'table' ? '76px' : '300px',
          }}
        />
      );
    }

    if (display === 'table') {
      return (
        <div
          ref={ref}
          className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]"
        >
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
      <div ref={ref}>
        <Card bottomText={commanderStats} images={imageProps}>
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
      </div>
    );
  },
);

TopCommandersCard.displayName = 'TopCommandersCard';

const CommandersPageShell = React.memo(
  ({
    preferences,
    updatePreference,
    children,
  }: PropsWithChildren<{
    preferences: CommandersPreferences | null | undefined;
    updatePreference: <P extends keyof CommandersPreferences>(
      prefKey: P,
      value: CommandersPreferences[P],
    ) => void;
  }>) => {
    useSeoMeta({
      title: 'cEDH Commanders',
      description: 'Discover top performing commanders in cEDH!',
    });

    // Wrap all updates in transitions to prevent blocking
    const updateWithTransition = useCallback(
      <P extends keyof CommandersPreferences>(
        key: P,
        value: CommandersPreferences[P],
      ) => {
        startTransition(() => {
          updatePreference(key, value);
        });
      },
      [updatePreference],
    );

    const toggleDisplay = useCallback(() => {
      const currentDisplay = preferences?.display || 'card';
      const newDisplay = currentDisplay === 'table' ? 'card' : 'table';

      scheduleWork(() => {
        startTransition(() => {
          updatePreference('display', newDisplay);
        });
      });
    }, [preferences?.display, updatePreference]);

    const toggleStats = useCallback(() => {
      const currentStats = preferences?.statsDisplay || 'topCuts';
      const newStats = currentStats === 'topCuts' ? 'count' : 'topCuts';
      updateWithTransition('statsDisplay', newStats);
    }, [preferences?.statsDisplay, updateWithTransition]);

    const handleColorChange = useCallback(
      (value: string) => {
        updateWithTransition('colorId', value || '');
      },
      [updateWithTransition],
    );

    const handleSortChange = useCallback(
      (value: string) => {
        updateWithTransition('sortBy', value as CommandersSortBy);
      },
      [updateWithTransition],
    );

    const handleTimePeriodChange = useCallback(
      (value: string) => {
        updateWithTransition('timePeriod', value as TimePeriod);
      },
      [updateWithTransition],
    );

    const handleMinEntriesChange = useCallback(
      (value: string) => {
        updateWithTransition('minEntries', Number(value));
      },
      [updateWithTransition],
    );

    const handleMinSizeChange = useCallback(
      (value: string) => {
        updateWithTransition('minTournamentSize', Number(value));
      },
      [updateWithTransition],
    );

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
                className="cursor-pointer rounded bg-white/10 px-3 py-1 text-sm text-white transition-colors hover:bg-white/20"
                onClick={toggleStats}
              >
                {(preferences?.statsDisplay || 'topCuts') === 'topCuts'
                  ? 'Show Entries'
                  : 'Show Performance'}
              </button>

              <button
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={toggleDisplay}
              >
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
                onChange={handleColorChange}
              />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap">
              <Select
                id="commanders-sort-by"
                label="Sort By"
                value={preferences?.sortBy || 'CONVERSION'}
                onChange={handleSortChange}
              >
                <option value="CONVERSION">Conversion Rate</option>
                <option value="POPULARITY">Popularity</option>
                <option value="TOP_CUTS">Top Cuts</option>
              </Select>

              <Select
                id="commanders-time-period"
                label="Time Period"
                value={preferences?.timePeriod || 'ONE_MONTH'}
                onChange={handleTimePeriodChange}
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
                onChange={handleMinEntriesChange}
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
                onChange={handleMinSizeChange}
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
  },
);

CommandersPageShell.displayName = 'CommandersPageShell';

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

  const {
    preferences: commanderPrefs,
    updatePreference,
    isHydrated,
  } = usePreferences('commanders', DEFAULT_PREFERENCES.commanders!);

  const {data, loadNext, isLoadingNext, hasNext, refetch} =
    usePaginationFragment<TopCommandersQuery, pages_topCommanders$key>(
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

  // More aggressive debouncing for better INP
  const debouncedRefetch = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (variables: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        startTransition(() => {
          refetch(variables);
        });
      }, 300);
    };
  }, [refetch]);

  // Set up refetch callback to trigger when preferences change
  React.useEffect(() => {
    import('../lib/client/cookies').then(({setRefetchCallback}) => {
      setRefetchCallback((newPrefs) => {
        //console.log('Debounced refetch with new preferences:', newPrefs);
        debouncedRefetch({
          timePeriod: newPrefs.timePeriod || 'ONE_MONTH',
          sortBy: newPrefs.sortBy || 'CONVERSION',
          minEntries: newPrefs.minEntries || 0,
          minTournamentSize: newPrefs.minTournamentSize || 0,
          colorId: newPrefs.colorId || '',
        });
      });
    });

    return () => {
      import('../lib/client/cookies').then(({clearRefetchCallback}) => {
        clearRefetchCallback();
      });
    };
  }, [debouncedRefetch]);

  // Smart hydration refetch - only refetch if preferences differ from URL params
  const hasTriggeredHydrationRefetch = React.useRef(false);

  React.useEffect(() => {
    if (isHydrated && !hasTriggeredHydrationRefetch.current && commanderPrefs) {
      hasTriggeredHydrationRefetch.current = true;

      const urlParams = new URLSearchParams(window.location.search);
      const urlPrefs = {
        timePeriod: urlParams.get('timePeriod') || 'ONE_MONTH',
        sortBy: urlParams.get('sortBy') || 'CONVERSION',
        minEntries: Number(urlParams.get('minEntries') || '0'),
        minTournamentSize: Number(urlParams.get('minSize') || '0'),
        colorId: urlParams.get('colorId') || '',
      };

      const currentPrefs = {
        timePeriod: commanderPrefs.timePeriod || 'ONE_MONTH',
        sortBy: commanderPrefs.sortBy || 'CONVERSION',
        minEntries: commanderPrefs.minEntries || 0,
        minTournamentSize: commanderPrefs.minTournamentSize || 0,
        colorId: commanderPrefs.colorId || '',
      };

      const needsRefetch =
        currentPrefs.timePeriod !== urlPrefs.timePeriod ||
        currentPrefs.sortBy !== urlPrefs.sortBy ||
        currentPrefs.minEntries !== urlPrefs.minEntries ||
        currentPrefs.minTournamentSize !== urlPrefs.minTournamentSize ||
        currentPrefs.colorId !== urlPrefs.colorId;

      if (needsRefetch) {
        //console.log('Preferences differ from URL params, triggering refetch:', currentPrefs);
        startTransition(() => {
          refetch(currentPrefs);
        });
      } else {
        //console.log('Preferences match URL params, skipping refetch');
      }
    }
  }, [isHydrated, commanderPrefs, refetch]);

  // Memoize expensive calculations
  const commanderNodes = React.useMemo(
    () => data.commanders.edges.map(({node}) => node),
    [data.commanders.edges],
  );

  const displayConfig = React.useMemo(() => {
    const display = commanderPrefs?.display || 'card';
    return {
      className: cn(
        'mx-auto grid w-full pb-4',
        display === 'table'
          ? 'w-full grid-cols-1 gap-2'
          : 'w-fit gap-4 md:grid-cols-2 xl:grid-cols-3',
      ),
      secondaryStatistic: (commanderPrefs?.statsDisplay || 'topCuts') as
        | 'count'
        | 'topCuts',
      display,
    };
  }, [commanderPrefs?.display, commanderPrefs?.statsDisplay]);

  // Render first 6 immediately, rest lazily for better perceived performance
  const [visibleItems, hiddenItems] = React.useMemo(() => {
    const immediate = commanderNodes.slice(0, 6);
    const lazy = commanderNodes.slice(6);
    return [immediate, lazy];
  }, [commanderNodes]);

  // Critical CSS inlining for skeleton and loading states
  React.useEffect(() => {
    // Preload critical styles to prevent FOUC
    const style = document.createElement('style');
    style.textContent = `
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <CommandersPageShell
      preferences={commanderPrefs}
      updatePreference={updatePreference}
    >
      <div className={displayConfig.className}>
        {displayConfig.display === 'table' && (
          <div className="sticky top-[68px] hidden w-full grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px] items-center gap-x-2 overflow-x-hidden bg-[#514f86] p-4 text-sm text-white lg:grid">
            <div>Color</div>
            <div>Commander</div>
            <div>Entries</div>
            <div>Meta %</div>
            <div>Top Cuts</div>
            <div>Cnvr. %</div>
          </div>
        )}

        {/* Render first 6 items immediately */}
        {visibleItems.map((node) => (
          <TopCommandersCard
            key={node.id}
            display={displayConfig.display}
            commander={node}
            secondaryStatistic={displayConfig.secondaryStatistic}
            lazy={false}
          />
        ))}

        {/* Render remaining items with lazy loading */}
        {hiddenItems.map((node) => (
          <TopCommandersCard
            key={node.id}
            display={displayConfig.display}
            commander={node}
            secondaryStatistic={displayConfig.secondaryStatistic}
            lazy={true}
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
