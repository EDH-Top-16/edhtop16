import {Commander_CommanderBanner$key} from '#genfiles/queries/Commander_CommanderBanner.graphql';
import {Commander_CommanderMeta$key} from '#genfiles/queries/Commander_CommanderMeta.graphql';
import {Commander_CommanderPageShell$key} from '#genfiles/queries/Commander_CommanderPageShell.graphql';
import {
  Commander_CommanderQuery,
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/Commander_CommanderQuery.graphql';
import {Commander_entries$key} from '#genfiles/queries/Commander_entries.graphql';
import {Commander_EntryCard$key} from '#genfiles/queries/Commander_EntryCard.graphql';
import {CommanderEntriesQuery} from '#genfiles/queries/CommanderEntriesQuery.graphql';
import {Link, useNavigation} from '#genfiles/river/router';
import {useSeoMeta} from '@unhead/react';
import cn from 'classnames';
import {format} from 'date-fns';
import {PropsWithChildren, useState, useEffect, useCallback, startTransition} from 'react';
import {
  EntryPointComponent,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {graphql} from 'relay-runtime';
import {ColorIdentity} from '../../../assets/icons/colors';
import {Card} from '../../../components/card';
import {Dropdown} from '../../../components/dropdown';
import {Footer} from '../../../components/footer';
import {LoadMoreButton} from '../../../components/load_more';
import {Navigation} from '../../../components/navigation';
import {NumberInputDropdown} from '../../../components/number_input_dropdown';
import {FirstPartyPromo} from '../../../components/promo';
import {Select} from '../../../components/select';
import {formatOrdinals, formatPercent} from '../../../lib/client/format';

function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

function EntryCard(props: {entry: Commander_EntryCard$key}) {
  const entry = useFragment(
    graphql`
      fragment Commander_EntryCard on Entry {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
          isKnownCheater
        }

        tournament {
          name
          size
          tournamentDate
          TID
        }
      }
    `,
    props.entry,
  );

  let entryName = `${entry.player?.name ?? 'Unknown Player'}`;
  if (entry.standing === 1) {
    entryName = `🥇 ${entryName}`;
  } else if (entry.standing <= 4) {
    entryName = `🥈 ${entryName}`;
  } else if (entry.standing <= 16) {
    entryName = `🥉 ${entryName}`;
  }

  const entryNameNode = (
    <span className="relative flex items-baseline">
      {entryName}
      {entry.player?.isKnownCheater && (
        <span className="absolute right-0 rounded-full bg-red-600 px-2 py-1 text-xs uppercase">
          Cheater
        </span>
      )}
    </span>
  );

  const bottomText = (
    <div className="flex">
      <span className="flex-1">
        {formatOrdinals(entry.standing)}&nbsp;/&nbsp;
        {entry.tournament.size} players
      </span>

      <span>
        Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
      </span>
    </div>
  );

  return (
    <Card bottomText={bottomText}>
      <div className="flex h-32 flex-col">
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            className="line-clamp-1 text-xl font-bold underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            {entryNameNode}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryNameNode}</span>
        )}

        <Link
          href={`/tournament/${entry.tournament.TID}`}
          className="line-clamp-2 pt-2 underline decoration-transparent transition-colors hover:decoration-inherit"
        >
          {entry.tournament.name}
        </Link>
        <span className="line-clamp-1 text-sm opacity-70">
          {format(entry.tournament.tournamentDate, 'MMMM do yyyy')}
        </span>
      </div>
    </Card>
  );
}

function CommanderBanner(props: {commander: Commander_CommanderBanner$key}) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderBanner on Commander {
        name
        colorId
        cards {
          imageUrls
        }

        stats(filters: {timePeriod: $timePeriod, minSize: $minEventSize}) {
          conversionRate
          metaShare
          count
          topCuts
          topCutBias
        }
      }
    `,
    props.commander,
  );

  

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center">
        <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
          {commander.cards
            .flatMap((c) => c.imageUrls)
            .map((src, _i, {length}) => {
              return (
                <img
                  className={cn(
                    'flex-1 object-cover object-top',
                    length === 2 ? 'w-1/2' : 'w-full',
                  )}
                  key={src}
                  src={src}
                  alt={`${commander.name} art`}
                />
              );
            })}
        </div>

        <h1 className="font-title relative m-0 mb-4 text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
        </h1>

        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>

        <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
          {commander.stats.count} Entries
          <div className="mr-1 ml-2 border-l border-white/60 py-2">
            &nbsp;
          </div>{' '}
          {formatPercent(commander.stats.metaShare)} Meta%
          <div className="mr-1 ml-2 border-l border-white/60 py-2">
            &nbsp;
          </div>{' '}
          {formatPercent(commander.stats.conversionRate)} Conversion
          <div className="mr-1 ml-2 border-l border-white/60 py-2">
            &nbsp;
          </div>{' '}
          {commander.stats.topCutBias > 0 ? (commander.stats.topCuts/commander.stats.topCutBias).toFixed(1) : '0.0'} Top Cut Bias
        </div>
      </div>
    </div>
  );
}

function useCommanderMeta(commanderFromProps: Commander_CommanderMeta$key) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderMeta on Commander {
        name
      }
    `,
    commanderFromProps,
  );

  useSeoMeta({
    title: commander.name,
    description: `Top Performing and Recent Decklists for ${commander.name} in cEDH`,
  });
}

export function CommanderPageShell({
  disableNavigation,
  maxStanding,
  minEventSize,
  sortBy,
  timePeriod,
  children,
  ...props
}: PropsWithChildren<{
  disableNavigation?: boolean;
  maxStanding?: number | null;
  minEventSize?: number | null;
  sortBy: EntriesSortBy;
  timePeriod: TimePeriod;
  commander: Commander_CommanderPageShell$key;
}>) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderPageShell on Commander {
        name
        breakdownUrl
        ...Commander_CommanderBanner
        ...Commander_CommanderMeta

        promo {
          ...promo_EmbededPromo
        }
      }
    `,
    props.commander,
  );

  useCommanderMeta(commander);
  const {replaceRoute} = useNavigation();

  const [localEventSize, setLocalEventSize] = useState(minEventSize?.toString() || '');
  const [localMaxStanding, setLocalMaxStanding] = useState(maxStanding?.toString() || '');

  useEffect(() => {
    setLocalEventSize(minEventSize?.toString() || '');
  }, [minEventSize]);

  useEffect(() => {
    setLocalMaxStanding(maxStanding?.toString() || '');
  }, [maxStanding]);

  const debouncedEventSizeUpdate = useCallback(
    debounce((value: string) => {
      if (value === '') {
        replaceRoute('/commander/:commander', {
          commander: commander.name,
          minEventSize: null,
        });
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
          replaceRoute('/commander/:commander', {
            commander: commander.name,
            minEventSize: numValue,
          });
        }
      }
    }, 300),
    [commander.name, replaceRoute]
  );

  const debouncedMaxStandingUpdate = useCallback(
    debounce((value: string) => {
      if (value === '') {
        replaceRoute('/commander/:commander', {
          commander: commander.name,
          maxStanding: null,
        });
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1) {
          replaceRoute('/commander/:commander', {
            commander: commander.name,
            maxStanding: numValue,
          });
        }
      }
    }, 300),
    [commander.name, replaceRoute]
  );

  const handleEventSizeChange = useCallback((value: string) => {
    setLocalEventSize(value);
    debouncedEventSizeUpdate(value);
  }, [debouncedEventSizeUpdate]);

  const handleEventSizeSelect = useCallback((value: number | null) => {
    const stringValue = value?.toString() || '';
    setLocalEventSize(stringValue);
    replaceRoute('/commander/:commander', {
      commander: commander.name,
      minEventSize: value,
    });
  }, [commander.name, replaceRoute]);

  const handleMaxStandingChange = useCallback((value: string) => {
    setLocalMaxStanding(value);
    debouncedMaxStandingUpdate(value);
  }, [debouncedMaxStandingUpdate]);

  const handleMaxStandingSelect = useCallback((value: number | null) => {
    const stringValue = value?.toString() || '';
    setLocalMaxStanding(stringValue);
    replaceRoute('/commander/:commander', {
      commander: commander.name,
      maxStanding: value,
    });
  }, [commander.name, replaceRoute]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Go') {
      (e.target as HTMLInputElement).blur();
    }
  }, []);

  return (
    <>
      <Navigation />
      <CommanderBanner commander={commander} />
      {commander.promo && <FirstPartyPromo promo={commander.promo} />}

      <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4 lg:flex-nowrap">
        <div className="relative flex flex-col">
              <Dropdown
                id="commander-sort-by"
                label="Sort By"
                value={sortBy === 'TOP' ? 'Top Performing' : 'Recent'}
                options={[
                  { value: 'TOP' as EntriesSortBy, label: 'Top Performing' },
                  { value: 'NEW' as EntriesSortBy, label: 'Recent' }
                ]}
                onSelect={(value) => {
                  replaceRoute('/commander/:commander', {
                    commander: commander.name,
                    sortBy: value,
                  });
                }}
              />
            </div>

            <div className="relative flex flex-col">
              <Dropdown
                id="commander-time-period"
                label="Time Period"
                value={
                  timePeriod === 'ONE_MONTH' ? '1 Month' : 
                  timePeriod === 'THREE_MONTHS' ? '3 Months' : 
                  timePeriod === 'SIX_MONTHS' ? '6 Months' : 
                  timePeriod === 'ONE_YEAR' ? '1 Year' : 
                  timePeriod === 'ALL_TIME' ? 'All Time' : 
                  'Post Ban'
                }
                options={[
                  { value: 'ONE_MONTH', label: '1 Month' },
                  { value: 'THREE_MONTHS', label: '3 Months' },
                  { value: 'SIX_MONTHS', label: '6 Months' },
                  { value: 'ONE_YEAR', label: '1 Year' },
                  { value: 'ALL_TIME', label: 'All Time' },
                  { value: 'POST_BAN', label: 'Post Ban' }
                ]}
                onSelect={(value) => {
                  replaceRoute('/commander/:commander', {
                    commander: commander.name,
                    timePeriod: value,
                  });
                }}
              />
            </div>

            <div className="relative flex flex-col">
              <NumberInputDropdown
                id="commander-event-size"
                label="Event Size"
                value={localEventSize}
                placeholder="Event Size"
                min="0"
                dropdownClassName="event-size-dropdown"
                options={[
                  { value: null, label: 'All Events' },
                  { value: 32, label: '32+ - Medium Events' },
                  { value: 60, label: '60+ - Large Events' },
                  { value: 100, label: '100+ - Major Events' }
                ]}
                onChange={handleEventSizeChange}
                onSelect={handleEventSizeSelect}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="relative flex flex-col">
              <NumberInputDropdown
                id="commander-max-standing"
                label="Standing Cutoff"
                value={localMaxStanding}
                placeholder="Standing Cutoff"
                min="1"
                dropdownClassName="max-standing-dropdown"
                options={[
                  { value: null, label: 'All Players' },
                  { value: 1, label: 'Tournament Winners' },
                  { value: 4, label: 'Top 4' },
                  { value: 16, label: 'Top 16' }
                ]}
                onChange={handleMaxStandingChange}
                onSelect={handleMaxStandingSelect}
                onKeyDown={handleKeyDown}
              />
            </div>
      </div>
      {children}
    </>
  );
}

/** @resource m#commander_page */
export const CommanderPage: EntryPointComponent<
  {commanderQueryRef: Commander_CommanderQuery},
  {}
> = ({queries}) => {
  const {commander} = usePreloadedQuery(
    graphql`
      query Commander_CommanderQuery(
        $commander: String!
        $sortBy: EntriesSortBy!
        $minEventSize: Int
        $maxStanding: Int
        $timePeriod: TimePeriod!
      ) @preloadable {
        commander(name: $commander) {
          ...Commander_CommanderPageShell
          ...Commander_entries
        }
      }
    `,
    queries.commanderQueryRef,
  );

  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    CommanderEntriesQuery,
    Commander_entries$key
  >(
    graphql`
      fragment Commander_entries on Commander
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "CommanderEntriesQuery") {
        entries(
          first: $count
          after: $cursor
          sortBy: $sortBy
          filters: {
            minEventSize: $minEventSize
            maxStanding: $maxStanding
            timePeriod: $timePeriod
          }
        ) @connection(key: "Commander_entries") {
          edges {
            node {
              id
              ...Commander_EntryCard
            }
          }
        }
      }
    `,
    commander,
  );

  return (
    <CommanderPageShell
      commander={commander}
      maxStanding={queries.commanderQueryRef.variables.maxStanding}
      minEventSize={queries.commanderQueryRef.variables.minEventSize}
      sortBy={queries.commanderQueryRef.variables.sortBy}
      timePeriod={queries.commanderQueryRef.variables.timePeriod}
    >
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {data.entries.edges.map(({node}) => (
          <EntryCard key={node.id} entry={node} />
        ))}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={loadNext}
      />

      <Footer />
    </CommanderPageShell>
  );
};

