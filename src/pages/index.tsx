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
import {PropsWithChildren, useCallback, useMemo, useState, useEffect} from 'react';
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

// Add debounce function
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

function TopCommandersCard({
  display = 'card',
  secondaryStatistic,
  ...props
}: {
  display?: 'table' | 'card';
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
          topCutBias
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
  sortBy,
  timePeriod,
  colorId,
  minEntries,
  minTournamentSize,
  children,
}: PropsWithChildren<{
  colorId: string;
  minEntries?: number | null;
  minTournamentSize: number;
  sortBy: CommandersSortBy;
  timePeriod: TimePeriod;
}>) {
  useSeoMeta({
    title: 'cEDH Commanders',
    description: 'Discover top performing commanders in cEDH!',
  });

  const {replaceRoute} = useNavigation();
  const [display, toggleDisplay] = useCommandersDisplay();

  // Add local state for debounced inputs
  const [localMinEntries, setLocalMinEntries] = useState(minEntries?.toString() || '');
  const [localEventSize, setLocalEventSize] = useState(minTournamentSize?.toString() || '');

  // Update local state when props change
  useEffect(() => {
    setLocalMinEntries(minEntries?.toString() || '');
  }, [minEntries]);

  useEffect(() => {
    setLocalEventSize(minTournamentSize?.toString() || '');
  }, [minTournamentSize]);

  // Create debounced route update functions
  const debouncedMinEntriesUpdate = useCallback(
    debounce((value: string) => {
      if (value === '') {
        replaceRoute('/', {
          minEntries: null,
        });
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1) {
          replaceRoute('/', {
            minEntries: numValue,
          });
        }
      }
    }, 300),
    [replaceRoute]
  );

  const debouncedEventSizeUpdate = useCallback(
    debounce((value: string) => {
      if (value === '') {
        replaceRoute('/', {
          minSize: null,
        });
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1) {
          replaceRoute('/', {
            minSize: numValue,
          });
        }
      }
    }, 300),
    [replaceRoute]
  );

  return (
    <>
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white lg:mb-0">
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

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 lg:flex-nowrap lg:justify-end">
            <div className="relative flex flex-col">
              <label htmlFor="commanders-sort-by" className="text-sm font-medium mb-1 text-white text-center">
                Sort By
              </label>
              <div className="relative">
                <input
                  id="commanders-sort-by"
                  type="text"
                  value={sortBy === 'POPULARITY' ? 'Most Popular' : 'Top Performing'}
                  readOnly
                  onFocus={(e) => {
                    const dropdown = e.target.parentElement?.querySelector('.sort-by-dropdown');
                    if (dropdown) {
                      dropdown.classList.remove('hidden');
                    }
                  }}
                  onBlur={(e) => {
                    // Delay hiding to allow clicking on dropdown options
                    setTimeout(() => {
                      const dropdown = e.target.parentElement?.querySelector('.sort-by-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }, 150);
                  }}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 cursor-pointer"
                />
                <div className="sort-by-dropdown absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 z-10 hidden">
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        sortBy: 'CONVERSION' as CommandersSortBy,
                      });
                    }}
                  >
                    Top Performing
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        sortBy: 'POPULARITY' as CommandersSortBy,
                      });
                    }}
                  >
                    Most Popular
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col">
              <label htmlFor="commanders-time-period" className="text-sm font-medium mb-1 text-white text-center">
                Time Period
              </label>
              <div className="relative">
                <input
                  id="commanders-time-period"
                  type="text"
                  value={timePeriod === 'ONE_MONTH' ? '1 Month' : timePeriod === 'THREE_MONTHS' ? '3 Months' : timePeriod === 'SIX_MONTHS' ? '6 Months' : timePeriod === 'ONE_YEAR' ? '1 Year' : timePeriod === 'ALL_TIME' ? 'All Time' : 'Post Ban'}
                  readOnly
                  onFocus={(e) => {
                    const dropdown = e.target.parentElement?.querySelector('.time-period-dropdown');
                    if (dropdown) {
                      dropdown.classList.remove('hidden');
                    }
                  }}
                  onBlur={(e) => {
                    // Delay hiding to allow clicking on dropdown options
                    setTimeout(() => {
                      const dropdown = e.target.parentElement?.querySelector('.time-period-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }, 150);
                  }}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 cursor-pointer"
                />
                <div className="time-period-dropdown absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 z-10 hidden">
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        timePeriod: 'ONE_MONTH',
                      });
                    }}
                  >
                    1 Month
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        timePeriod: 'THREE_MONTHS',
                      });
                    }}
                  >
                    3 Months
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        timePeriod: 'SIX_MONTHS',
                      });
                    }}
                  >
                    6 Months
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        timePeriod: 'ONE_YEAR',
                      });
                    }}
                  >
                    1 Year
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        timePeriod: 'ALL_TIME',
                      });
                    }}
                  >
                    All Time
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      replaceRoute('/', {
                        timePeriod: 'POST_BAN',
                      });
                    }}
                  >
                    Post Ban
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col">
              <label htmlFor="commanders-min-entries" className="text-sm font-medium mb-1 text-white text-center">
                Commander Entries
              </label>
              <div className="relative">
                <input
                  id="commanders-min-entries"
                  type="number"
                  min="1"
                  value={localMinEntries || ''}
                  onChange={(e) => {
                    // Update local state immediately for responsive UI
                    setLocalMinEntries(e.target.value);
                    // Debounce the route update
                    debouncedMinEntriesUpdate(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Go') {
                      (e.target as HTMLInputElement).blur();
                      const dropdown = (e.target as HTMLElement).parentElement?.querySelector('.min-entries-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }
                  }}
                  onFocus={(e) => {
                    const dropdown = e.target.parentElement?.querySelector('.min-entries-dropdown');
                    if (dropdown) {
                      dropdown.classList.remove('hidden');
                    }
                  }}
                  onBlur={(e) => {
                    // Delay hiding to allow clicking on dropdown options
                    setTimeout(() => {
                      const dropdown = e.target.parentElement?.querySelector('.min-entries-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }, 150);
                  }}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 cursor-pointer"
                  placeholder="Commander Entries"
                />
                <div className="min-entries-dropdown absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 z-10 hidden">
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalMinEntries('')
                      replaceRoute('/', {
                        minEntries: null,
                      });
                    }}
                  >
                    All Entries
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalMinEntries('20');
                      replaceRoute('/', {
                        minEntries: 20,
                      });
                    }}
                  >
                    20+ Entries
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalMinEntries('40');
                      replaceRoute('/', {
                        minEntries: 40,
                      });
                    }}
                  >
                    40+ Entries
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalMinEntries('60');
                      replaceRoute('/', {
                        minEntries: 60,
                      });
                    }}
                  >
                    60+ Entries
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalMinEntries('100');
                      replaceRoute('/', {
                        minEntries: 100,
                      });
                    }}
                  >
                    100+ Entries
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col">
              <label htmlFor="commanders-event-size" className="text-sm font-medium mb-1 text-white text-center">
                Event Size
              </label>
              <div className="relative">
                <input
                  id="commanders-event-size"
                  type="number"
                  min="1"
                  value={localEventSize || ''}
                  onChange={(e) => {
                    // Update local state immediately for responsive UI
                    setLocalEventSize(e.target.value);
                    // Debounce the route update
                    debouncedEventSizeUpdate(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Go') {
                      (e.target as HTMLInputElement).blur();
                      const dropdown = (e.target as HTMLElement).parentElement?.querySelector('.event-size-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }
                  }}
                  onFocus={(e) => {
                    const dropdown = e.target.parentElement?.querySelector('.event-size-dropdown');
                    if (dropdown) {
                      dropdown.classList.remove('hidden');
                    }
                  }}
                  onBlur={(e) => {
                    // Delay hiding to allow clicking on dropdown options
                    setTimeout(() => {
                      const dropdown = e.target.parentElement?.querySelector('.event-size-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }, 150);
                  }}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 cursor-pointer"
                  placeholder="Event Size"
                />
                <div className="event-size-dropdown absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 z-10 hidden">
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalEventSize('');
                      replaceRoute('/', {
                        minSize: null,
                      });
                    }}
                  >
                    All Tournaments
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalEventSize('30');
                      replaceRoute('/', {
                        minSize: 30,
                      });
                    }}
                  >
                    30+ - Medium Events
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalEventSize('60');
                      replaceRoute('/', {
                        minSize: 60,
                      });
                    }}
                  >
                    60+ - Large Events
                  </div>
                  <div
                    className="px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer border-b border-gray-600"
                    onMouseDown={(e) => {
                      setLocalEventSize('100');
                      replaceRoute('/', {
                        minSize: 100,
                      });
                    }}
                  >
                    100+ - Major Events
                  </div>                
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

function useCommandersDisplay() {
  const {display} = useRouteParams('/');
  const {replaceRoute} = useNavigation();

  const toggleDisplay = useCallback(() => {
    replaceRoute('/', {display: display === 'table' ? 'card' : 'table'});
  }, [display, replaceRoute]);

  return useMemo(() => {
    return [display === 'table' ? 'table' : 'card', toggleDisplay] as const;
  }, [display, toggleDisplay]);
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
        $minEntries: Int
        $minTournamentSize: Int!
        $colorId: String
      ) @preloadable {
        ...pages_topCommanders
      }
    `,
    queries.commandersQueryRef,
  );

  const [display] = useCommandersDisplay();

  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
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

  return (
    <CommandersPageShell
      sortBy={queries.commandersQueryRef.variables.sortBy}
      timePeriod={queries.commandersQueryRef.variables.timePeriod}
      colorId={queries.commandersQueryRef.variables.colorId || ''}
      minEntries={queries.commandersQueryRef.variables.minEntries}
      minTournamentSize={queries.commandersQueryRef.variables.minTournamentSize}
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
    </CommandersPageShell>
  );
};
