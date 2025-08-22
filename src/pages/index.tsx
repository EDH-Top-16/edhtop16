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
  useRelayEnvironment,
} from 'react-relay/hooks';
import {ColorIdentity} from '../assets/icons/colors';
import {Card} from '../components/card';
import {ColorSelection} from '../components/color_selection';
import {Footer} from '../components/footer';
import {LoadMoreButton} from '../components/load_more';
import {Navigation} from '../components/navigation';
import {Select} from '../components/select';
import {formatPercent} from '../lib/client/format';
import {usePreferences, DEFAULT_PREFERENCES, setRefetchCallback, clearRefetchCallback, setRelayEnvironment} from '../lib/client/cookies';
import {CommandersPreferences} from '../lib/shared/preferences-types';

// Optimize with scheduler to prevent blocking
const scheduleWork = (callback: () => void) => {
  if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
    (window as any).scheduler.postTask(callback, {priority: 'user-blocking'});
  } else {
    callback();
  }
};

// Intersection Observer for lazy rendering
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => entry && setIsVisible(entry.isIntersecting),
      {threshold, rootMargin: '200px'}
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible] as const;
};

const TopCommandersCard = React.memo(
  ({display = 'card', secondaryStatistic, lazy = false, ...props}: {
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
      if (!shouldRender) return '';
      
      const stats = secondaryStatistic === 'count' 
        ? [`Meta Share: ${formatPercent(commander.stats.metaShare)}`, `Entries: ${commander.stats.count}`]
        : [`Conversion Rate: ${formatPercent(commander.stats.conversionRate)}`, `Top Cuts: ${commander.stats.topCuts}`];
      
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
          style: { maxWidth: '100%', height: 'auto' },
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
              : 'animate-pulse rounded-lg bg-[#312d5a]/25 aspect-[3/4]',
          )}
          style={{minHeight: display === 'table' ? '76px' : '300px'}}
        />
      );
    }

    if (display === 'table') {
      return (
        <div
          ref={ref}
          className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]"
        >
          <div><ColorIdentity identity={commander.colorId} /></div>
          <Link href={commander.breakdownUrl} className="font-title mb-2 text-xl underline lg:mb-0 lg:font-sans lg:text-base">
            {commander.name}
          </Link>
          <div className="text-sm opacity-75 lg:hidden">Entries:</div>
          <div className="text-sm">{commander.stats.count}</div>
          <div className="text-sm opacity-75 lg:hidden">Meta Share:</div>
          <div className="text-sm">{formatPercent(commander.stats.metaShare)}</div>
          <div className="text-sm opacity-75 lg:hidden">Top Cuts:</div>
          <div className="text-sm">{commander.stats.topCuts}</div>
          <div className="text-sm opacity-75 lg:hidden">Conversion Rate:</div>
          <div className="text-sm">{formatPercent(commander.stats.conversionRate)}</div>
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
  ({preferences, updatePreference, children}: PropsWithChildren<{
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

    const updateWithTransition = useCallback(
      <P extends keyof CommandersPreferences>(key: P, value: CommandersPreferences[P]) => {
        startTransition(() => updatePreference(key, value));
      },
      [updatePreference],
    );

    const toggleDisplay = useCallback(() => {
      const newDisplay = (preferences?.display || 'card') === 'table' ? 'card' : 'table';
      // Use direct updatePreference instead of updateWithTransition for display changes
      // This bypasses the transition and refetch logic
      updatePreference('display', newDisplay);
    }, [preferences?.display, updatePreference]);

    const handleSortChange = useCallback((value: string) => {
      const sortBy = value as CommandersSortBy;
      const statsDisplay = sortBy === 'POPULARITY' ? 'count' : 'topCuts';
      // Update statsDisplay directly without triggering refetch logic
      updatePreference('statsDisplay', statsDisplay);
      updateWithTransition('sortBy', sortBy);
    }, [updateWithTransition, updatePreference]);

    const handleColorChange = useCallback(
      (value: string) => updateWithTransition('colorId', value || ''),
      [updateWithTransition]
    );

    const handleTimePeriodChange = useCallback(
      (value: string) => updateWithTransition('timePeriod', value as TimePeriod),
      [updateWithTransition]
    );

    const handleMinEntriesChange = useCallback(
      (value: string) => updateWithTransition('minEntries', Number(value)),
      [updateWithTransition]
    );

    const handleMinSizeChange = useCallback(
      (value: string) => updateWithTransition('minTournamentSize', Number(value)),
      [updateWithTransition]
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
              <button className="cursor-pointer transition-transform hover:scale-105" onClick={toggleDisplay}>
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
              <Select id="commanders-sort-by" label="Sort By" value={preferences?.sortBy || 'CONVERSION'} onChange={handleSortChange}>
                <option value="CONVERSION">Conversion Rate</option>
                <option value="POPULARITY">Popularity</option>
                <option value="TOP_CUTS">Top Cuts</option>
              </Select>

              <Select id="commanders-time-period" label="Time Period" value={preferences?.timePeriod || 'ONE_MONTH'} 
                onChange={handleTimePeriodChange}>
                <option value="ONE_MONTH">1 Month</option>
                <option value="THREE_MONTHS">3 Months</option>
                <option value="SIX_MONTHS">6 Months</option>
                <option value="ONE_YEAR">1 Year</option>
                <option value="ALL_TIME">All Time</option>
                <option value="POST_BAN">Post Ban</option>
              </Select>

              <Select id="commanders-min-entries" label="Min. Entries" value={`${preferences?.minEntries || 0}`}
                onChange={handleMinEntriesChange}>
                <option value="0">All Commanders</option>
                <option value="20">20+ Entries</option>
                <option value="60">60+ Entries</option>
                <option value="120">120+ Entries</option>
              </Select>

              <Select id="commanders-min-size" label="Tournament Size" value={`${preferences?.minTournamentSize || 0}`}
                onChange={handleMinSizeChange}>
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
export const CommandersPage: EntryPointComponent<{commandersQueryRef: pages_CommandersQuery}, {}> = ({queries}) => {
  const environment = useRelayEnvironment();
  
  // Set the Relay environment for the cookies module to use for cache invalidation
  React.useEffect(() => {
    setRelayEnvironment(environment);
  }, [environment]);

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

  const {preferences: commanderPrefs, updatePreference, isHydrated} = usePreferences('commanders', DEFAULT_PREFERENCES.commanders!);

  const {data, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment<TopCommandersQuery, pages_topCommanders$key>(
    graphql`
      fragment pages_topCommanders on Query
      @argumentDefinitions(cursor: {type: "String"} count: {type: "Int", defaultValue: 48})
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

  // Track if user has made any DATA preference changes to prevent blink
  const [userHasChangedDataPrefs, setUserHasChangedDataPrefs] = React.useState(false);
  const [isRefetching, setIsRefetching] = React.useState(false);
  const initialPrefsRef = React.useRef<any>(null);

  // Store initial preferences on first render
  React.useEffect(() => {
    if (isHydrated && commanderPrefs && !initialPrefsRef.current) {
      initialPrefsRef.current = commanderPrefs;
    }
  }, [isHydrated, commanderPrefs]);

  // Check if DATA preferences have changed from initial (exclude UI-only changes)
  React.useEffect(() => {
    if (isHydrated && commanderPrefs && initialPrefsRef.current) {
      // Only consider data-affecting preferences for the "changed" check
      const currentDataPrefs = {
        timePeriod: commanderPrefs.timePeriod,
        sortBy: commanderPrefs.sortBy,
        minEntries: commanderPrefs.minEntries,
        minTournamentSize: commanderPrefs.minTournamentSize,
        colorId: commanderPrefs.colorId,
      };
      
      const initialDataPrefs = {
        timePeriod: initialPrefsRef.current.timePeriod,
        sortBy: initialPrefsRef.current.sortBy,
        minEntries: initialPrefsRef.current.minEntries,
        minTournamentSize: initialPrefsRef.current.minTournamentSize,
        colorId: initialPrefsRef.current.colorId,
      };
      
      const hasChanged = JSON.stringify(currentDataPrefs) !== JSON.stringify(initialDataPrefs);
      setUserHasChangedDataPrefs(hasChanged);
    }
  }, [isHydrated, commanderPrefs]);

  const debouncedRefetch = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    let currentDisposable: any;
    
    return (variables: any) => {
      clearTimeout(timeoutId);
      
      if (currentDisposable && typeof currentDisposable.dispose === 'function') {
        currentDisposable.dispose();
      }
      
      setIsRefetching(true);
      
      timeoutId = setTimeout(() => {
        startTransition(() => {
          currentDisposable = refetch(variables, {
            fetchPolicy: 'store-and-network'
          });
          // Reset refetching state after a delay
          setTimeout(() => setIsRefetching(false), 500);
        });
      }, 150);
      
      return {
        dispose: () => {
          clearTimeout(timeoutId);
          setIsRefetching(false);
          if (currentDisposable && typeof currentDisposable.dispose === 'function') {
            currentDisposable.dispose();
            currentDisposable = undefined;
          }
        }
      };
    };
  }, [refetch]);

  // Set up refetch callback - this will be called when preferences change
  React.useEffect(() => {
    setRefetchCallback((newPrefs) => {
      // Only refetch for data-affecting preferences, not display changes
      debouncedRefetch({
        timePeriod: newPrefs.timePeriod || 'ONE_MONTH',
        sortBy: newPrefs.sortBy || 'CONVERSION',
        minEntries: newPrefs.minEntries || 0,
        minTournamentSize: newPrefs.minTournamentSize || 0,
        colorId: newPrefs.colorId || '',
        // Note: deliberately excluding 'display' and 'statsDisplay' as these don't affect data
      });
    });
      
    return () => {
      clearRefetchCallback();
    };
  }, [debouncedRefetch]);

  // Memoize expensive calculations
  const commanderNodes = React.useMemo(() => data.commanders.edges.map(({node}) => node), [data.commanders.edges]);

  const displayConfig = React.useMemo(() => {
    const display = commanderPrefs?.display || 'card';
    const secondaryStatistic = (commanderPrefs?.statsDisplay || 'topCuts') as 'count' | 'topCuts';
    
    return {
      className: cn(
        'mx-auto grid w-full pb-4',
        display === 'table'
          ? 'w-full grid-cols-1 gap-2'
          : 'w-fit gap-4 md:grid-cols-2 xl:grid-cols-3',
      ),
      secondaryStatistic,
      display,
    };
  }, [commanderPrefs?.display, commanderPrefs?.statsDisplay]);

  // Render all items with lazy loading (first few will render immediately due to viewport)
  const allItems = React.useMemo(() => commanderNodes, [commanderNodes]);

  // Critical CSS inlining for skeleton and loading states
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  return (
    <CommandersPageShell preferences={commanderPrefs} updatePreference={updatePreference}>
      {/* Show loading state ONLY if user has changed DATA prefs and we're refetching */}
      {userHasChangedDataPrefs && isRefetching ? (
        <div className="flex items-center justify-center h-96 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div>Loading commanders...</div>
          </div>
        </div>
      ) : (
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

          {/* Render all items with lazy loading */}
          {allItems.map((node) => (
            <TopCommandersCard
              key={node.id}
              display={displayConfig.display}
              commander={node}
              secondaryStatistic={displayConfig.secondaryStatistic}
              lazy={true}
            />
          ))}
        </div>
      )}

      <LoadMoreButton hasNext={hasNext} isLoadingNext={isLoadingNext} loadNext={loadNext} />
      <Footer />
    </CommandersPageShell>
  );
};
