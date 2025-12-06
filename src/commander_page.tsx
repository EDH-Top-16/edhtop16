import {commanderPage_CardEntries$key} from '#genfiles/queries/commanderPage_CardEntries.graphql';
import {commanderPage_CommanderBanner$key} from '#genfiles/queries/commanderPage_CommanderBanner.graphql';
import {commanderPage_CommanderMeta$key} from '#genfiles/queries/commanderPage_CommanderMeta.graphql';
import {
  commanderPage_CommanderQuery,
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/commanderPage_CommanderQuery.graphql';
import {commanderPage_CommanderShellQuery} from '#genfiles/queries/commanderPage_CommanderShellQuery.graphql.js';
import {commanderPage_CommanderStaples$key} from '#genfiles/queries/commanderPage_CommanderStaples.graphql.js';
import {commanderPage_CommanderStatsQuery} from '#genfiles/queries/commanderPage_CommanderStatsQuery.graphql.js';
import {commanderPage_entries$key} from '#genfiles/queries/commanderPage_entries.graphql';
import {commanderPage_EntryCard$key} from '#genfiles/queries/commanderPage_EntryCard.graphql';
import {commanderPage_LazyCardEntriesQuery} from '#genfiles/queries/commanderPage_LazyCardEntriesQuery.graphql';
import {CommanderEntriesQuery} from '#genfiles/queries/CommanderEntriesQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {Link, useNavigation} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback.jsx';
import cn from 'classnames';
import {format} from 'date-fns';
import {PropsWithChildren, Suspense, useMemo, useState} from 'react';
import {
  EntryPoint,
  EntryPointComponent,
  EntryPointContainer,
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {graphql} from 'relay-runtime';
import {ColorIdentity, ManaCost} from './assets/icons/colors';
import {Card} from './components/card';
import {Footer} from './components/footer';
import {LoadMoreButton} from './components/load_more';
import {Navigation} from './components/navigation';
import {FirstPartyPromo} from './components/promo';
import {Select} from './components/select';
import {Tab, TabList} from './components/tabs';
import {formatOrdinals, formatPercent} from './lib/client/format';
import {ServerSafeSuspense} from './lib/client/suspense';
import { ArrowRight, Calendar, Trophy, Users, UsersRound } from 'lucide-react';

function EntryCard(props: {entry: commanderPage_EntryCard$key}) {
  const entry = useFragment(
    graphql`
      fragment commanderPage_EntryCard on Entry @throwOnFieldError {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
          isKnownCheater
          offersCoaching
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
    <span className="relative flex flex-col gap-1 items-baseline">
      {entryName} 
      <>
        {entry.player?.isKnownCheater && (
          <span className="mt-0.5 rounded-full bg-red-600 px-2 py-1 text-xs uppercase mb-1">
            Cheater
          </span>
        )}
        {!entry.player?.isKnownCheater && entry.player?.offersCoaching && (
          // TODO(@rdelaney): Hook this up to the coach profile page, conver to <Link>
          <a className="mt-0.5 flex gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs uppercase cursor-pointer group mb-1">
            Offers coaching
            <ArrowRight className="w-4 h-4 hidden group-hover:block "/>
          </a>
        )}
      </>
    </span>
  );

  return (
    <Card hoverEffect={false} className="h-fit">
      <div className="flex flex-col"> 
        <div className="flex gap-0.5 justify-between items-flex-startr">
          <span className="text-xl font-semibold">{entryNameNode}</span>
          {entry.decklist && (
            <a
              href={entry.decklist}
              target="_blank"
              className="font-semibold h-fit text-sm transition-colors flex flex-shrink-0 gap-1 items-center px-2 py-1 border border-white/40 rounded"
            >
              <img
                src={'https://topdeck.gg/img/logo/TopDeckNoBorder.png'}
                alt="View decklist on TopDeck.gg"
                className="h-4 w-4"
              />
              Decklist
            </a>
          )}
        </div>

        <div className="space-y-0.5">
          <Link
            href={`/tournament/${entry.tournament.TID}`}
            className="flex gap-2 items-center line-clamp-2 text-sm pt-2 underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            <Trophy className="w-3 h-3 text-purple-300/50" />
            {entry.tournament.name}
          </Link>
          <div className="flex gap-2 items-center line-clamp-1 text-sm">
            <UsersRound className="w-3 h-3 text-purple-300/50" />
            #{entry.standing} of&nbsp;
            {entry.tournament.size} players
          </div>
          <div className="flex gap-2 items-center line-clamp-1 text-sm">
            <Calendar className="w-3 h-3 text-purple-300/50" />
            <span className="text-white/60">
              {format(entry.tournament.tournamentDate, 'MMMM do yyyy')}
            </span>
          </div>
        </div>

        <div className="bg-[#131224] py-3 px-8 rounded-2xl mt-3 flex gap-2 justify-between">
          <div className="flex flex-col items-center">
            <span className="font-medium text-lg">{entry.wins}</span>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">Wins</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium text-lg">{entry.losses}</span>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">Losses</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium text-lg">{entry.draws}</span>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">Draws</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Card type constants for staples grouping
const STAPLE_TYPE_ORDER = [
  'Creature',
  'Instant',
  'Sorcery',
  'Artifact',
  'Enchantment',
  'Planeswalker',
  'Battle',
  'Land',
] as const;

type StapleCardType = (typeof STAPLE_TYPE_ORDER)[number];

function getStapleCardType(typeLine: string): StapleCardType {
  const normalized = typeLine.toLowerCase();
  if (normalized.includes('creature')) return 'Creature';
  if (normalized.includes('instant')) return 'Instant';
  if (normalized.includes('sorcery')) return 'Sorcery';
  if (normalized.includes('artifact')) return 'Artifact';
  if (normalized.includes('enchantment')) return 'Enchantment';
  if (normalized.includes('planeswalker')) return 'Planeswalker';
  if (normalized.includes('battle')) return 'Battle';
  if (normalized.includes('land')) return 'Land';
  return 'Artifact';
}

// Play rate thresholds by card type. Since this is the commander page,
// it's probably fine by showing everything and not truncating any cards.
// Can change this in the future if data gets noisy
const STAPLE_PLAY_RATE_THRESHOLDS: Record<StapleCardType, number> = {
  Creature: 0,
  Instant: 0,
  Sorcery: 0,
  Artifact: 0,
  Enchantment: 0,
  Planeswalker: 0,
  Battle: 0,
  Land: 0,
};

type StapleCardData = {
  id: string;
  name: string;
  type: string;
  manaCost: string;
  scryfallUrl: string;
  playRateLastYear: number;
};

function StapleCardRow({
  card,
  commanderName,
}: {
  card: StapleCardData;
  commanderName: string;
}) {
  const playRatePercentage = (card.playRateLastYear * 100).toFixed(1);
  const {replaceRoute} = useNavigation();

  return (
    <button
      onClick={() => {
        replaceRoute('/commander/:commander', {
          commander: commanderName,
          tab: 'card',
          card: card.name,
        });
      }}
      className="group flex w-full cursor-pointer items-center justify-between border-b border-white/10 p-2 text-left"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-white hover:underline">{card.name}</span>
      </div>
      <div className="flex gap-2">
        <ManaCost cost={card.manaCost} size={14} className="space-x-0.5" />
        <span className="text-sm text-white/60">{playRatePercentage}%</span>
      </div>
    </button>
  );
}

function StapleTypeSection({
  type,
  cards,
  commanderName,
}: {
  type: StapleCardType;
  cards: readonly StapleCardData[];
  commanderName: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const threshold = STAPLE_PLAY_RATE_THRESHOLDS[type];

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => b.playRateLastYear - a.playRateLastYear),
    [cards],
  );

  const {aboveThreshold, belowThreshold} = useMemo(() => {
    const above: StapleCardData[] = [];
    const below: StapleCardData[] = [];
    for (const card of sortedCards) {
      if (card.playRateLastYear >= threshold) {
        above.push(card);
      } else {
        below.push(card);
      }
    }
    return {aboveThreshold: above, belowThreshold: below};
  }, [sortedCards, threshold]);

  const visibleCards = showAll ? sortedCards : aboveThreshold;

  if (sortedCards.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between border-b border-white/30 bg-black/30 px-2 py-1">
        <span className="font-medium">{type}</span>
        <span className="text-sm font-medium">Play rate</span>
      </div>
      <div className="flex flex-col">
        {visibleCards.map((card) => (
          <StapleCardRow
            key={card.id}
            card={card}
            commanderName={commanderName}
          />
        ))}
      </div>
      {belowThreshold.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="p-2 text-sm text-white/50 hover:text-white"
        >
          {showAll ? 'Show less' : `Show ${belowThreshold.length} more`}
        </button>
      )}
    </div>
  );
}

function CommanderStaples(props: {
  commander: commanderPage_CommanderStaples$key;
}) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CommanderStaples on Commander @throwOnFieldError {
        name
        staples {
          id
          name
          type
          manaCost
          scryfallUrl
          playRateLastYear
        }
      }
    `,
    props.commander,
  );

  const groupedCards = useMemo(() => {
    const groups: Record<StapleCardType, StapleCardData[]> = {
      Creature: [],
      Instant: [],
      Sorcery: [],
      Artifact: [],
      Enchantment: [],
      Planeswalker: [],
      Battle: [],
      Land: [],
    };

    for (const card of commander.staples) {
      const cardType = getStapleCardType(card.type);
      groups[cardType].push(card);
    }

    return groups;
  }, [commander.staples]);

  // Column layout for md+:
  // Column 1: Planeswalker, Creature, Sorcery
  // Column 2: Instant
  // Column 3: Artifact, Enchantment, Battle, Land
  const column1Types: StapleCardType[] = [
    'Planeswalker',
    'Creature',
    'Sorcery',
  ];
  const column2Types: StapleCardType[] = ['Instant'];
  const column3Types: StapleCardType[] = [
    'Artifact',
    'Enchantment',
    'Battle',
    'Land',
  ];

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-4">
      {/* Mobile: single column with all types */}
      <div className="md:hidden">
        {STAPLE_TYPE_ORDER.map((type) => (
          <StapleTypeSection
            key={type}
            type={type}
            cards={groupedCards[type]}
            commanderName={commander.name}
          />
        ))}
      </div>

      {/* md+: 3 column layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        <div>
          {column1Types.map((type) => (
            <StapleTypeSection
              key={type}
              type={type}
              cards={groupedCards[type]}
              commanderName={commander.name}
            />
          ))}
        </div>
        <div>
          {column2Types.map((type) => (
            <StapleTypeSection
              key={type}
              type={type}
              cards={groupedCards[type]}
              commanderName={commander.name}
            />
          ))}
        </div>
        <div>
          {column3Types.map((type) => (
            <StapleTypeSection
              key={type}
              type={type}
              cards={groupedCards[type]}
              commanderName={commander.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommanderCardDetail(props: {
  commander: any;
  cardName: string;
  sortBy: EntriesSortBy;
}) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CardDetail on Commander @throwOnFieldError {
        name
        cardDetail(cardName: $cardName) {
          name
          type
          cmc
          colorId
          imageUrls
          scryfallUrl
          cardPreviewImageUrl
        }
        cardWinrateStats(cardName: $cardName, timePeriod: THREE_MONTHS) {
          withCard {
            totalEntries
            topCuts
            conversionRate
          }
          withoutCard {
            totalEntries
            topCuts
            conversionRate
          }
        }
        ...commanderPage_CardEntries
      }
    `,
    props.commander,
  );

  const card = commander.cardDetail;
  const stats = commander.cardWinrateStats;

  if (!card) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <h2 className="text-2xl text-white">Card not found</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card Info */}
        <div className="flex flex-col items-center space-y-4">
          {card.cardPreviewImageUrl && (
            <img
              src={card.cardPreviewImageUrl}
              alt={card.name}
              className="max-w-xs rounded-lg shadow-lg"
            />
          )}
          <div className="text-center">
            <a
              href={card.scryfallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl font-bold text-white underline decoration-transparent transition-colors hover:text-blue-300 hover:decoration-inherit"
            >
              {card.name}
            </a>
            <p className="text-lg text-gray-300">{card.type}</p>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <ColorIdentity identity={card.colorId} />
              {card.cmc > 0 && (
                <span className="rounded bg-gray-700 px-2 py-1 font-mono text-sm text-white">
                  {card.cmc}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Winrate Stats */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">
            Performance Stats (Last 3 Months)
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-green-900/30 p-4">
              <h4 className="text-lg font-semibold text-green-300">
                With {card.name}
              </h4>
              <div className="mt-2 space-y-1">
                <div className="text-white">
                  <span className="font-bold">
                    {stats.withCard.totalEntries}
                  </span>{' '}
                  entries
                </div>
                <div className="text-white">
                  <span className="font-bold">{stats.withCard.topCuts}</span>{' '}
                  top cuts
                </div>
                <div className="text-green-300">
                  <span className="font-bold">
                    {formatPercent(stats.withCard.conversionRate)}
                  </span>{' '}
                  conversion rate
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-red-900/30 p-4">
              <h4 className="text-lg font-semibold text-red-300">
                Without {card.name}
              </h4>
              <div className="mt-2 space-y-1">
                <div className="text-white">
                  <span className="font-bold">
                    {stats.withoutCard.totalEntries}
                  </span>{' '}
                  entries
                </div>
                <div className="text-white">
                  <span className="font-bold">{stats.withoutCard.topCuts}</span>{' '}
                  top cuts
                </div>
                <div className="text-red-300">
                  <span className="font-bold">
                    {formatPercent(stats.withoutCard.conversionRate)}
                  </span>{' '}
                  conversion rate
                </div>
              </div>
            </div>
          </div>

          {stats.withCard.totalEntries > 0 &&
            stats.withoutCard.totalEntries > 0 && (
              <div className="rounded-lg bg-blue-900/30 p-4">
                <h4 className="text-lg font-semibold text-blue-300">Impact</h4>
                <div className="mt-2">
                  <div className="text-white">
                    {stats.withCard.conversionRate >
                    stats.withoutCard.conversionRate ? (
                      <span className="text-green-400">
                        +
                        {formatPercent(
                          stats.withCard.conversionRate -
                            stats.withoutCard.conversionRate,
                        )}{' '}
                        higher conversion rate
                      </span>
                    ) : stats.withCard.conversionRate <
                      stats.withoutCard.conversionRate ? (
                      <span className="text-red-400">
                        {formatPercent(
                          stats.withCard.conversionRate -
                            stats.withoutCard.conversionRate,
                        )}{' '}
                        lower conversion rate
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        No significant impact on conversion rate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Card Entries */}
      <div className="mt-8">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="text-2xl font-bold text-white">
            Tournament Entries Using {card.name}
          </h3>
          <div className="flex gap-4">
            <CardEntriesSort
              commanderName={commander.name}
              cardName={card.name}
              currentSort={props.sortBy}
            />
          </div>
        </div>
        <ServerSafeSuspense fallback={<LoadingIcon />}>
          <LazyCommanderCardEntries
            commanderName={commander.name}
            cardName={card.name}
            sortBy={props.sortBy}
          />
        </ServerSafeSuspense>
      </div>
    </div>
  );
}

function CardEntriesSort({
  commanderName,
  cardName,
  currentSort,
}: {
  commanderName: string;
  cardName: string;
  currentSort: EntriesSortBy;
}) {
  const {replaceRoute} = useNavigation();

  return (
    <Select
      id="card-entries-sort"
      label="Sort By"
      value={currentSort}
      onChange={(sortBy) => {
        replaceRoute('/commander/:commander', {
          commander: commanderName,
          tab: 'card',
          card: cardName,
          sortBy,
        });
      }}
    >
      <option value="TOP">Top Performing</option>
      <option value="NEW">Recent</option>
    </Select>
  );
}

function CommanderCardEntries(props: {
  commander: commanderPage_CardEntries$key;
  sortBy: EntriesSortBy;
}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment(
    graphql`
      fragment commanderPage_CardEntries on Commander
      @throwOnFieldError
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "CommanderCardEntriesQuery") {
        cardEntries(
          cardName: $cardName
          first: $count
          after: $cursor
          sortBy: $sortBy
        ) @connection(key: "commanderPage_cardEntries") {
          edges {
            node {
              id
              ...commanderPage_EntryCard
            }
          }
        }
      }
    `,
    props.commander,
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.cardEntries.edges.map(({node}) => (
          <EntryCard key={node.id} entry={node} />
        ))}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={loadNext}
      />
    </>
  );
}

function LazyCommanderCardEntries(props: {
  commanderName: string;
  cardName: string;
  sortBy: EntriesSortBy;
}) {
  const {commander} = useLazyLoadQuery<commanderPage_LazyCardEntriesQuery>(
    graphql`
      query commanderPage_LazyCardEntriesQuery(
        $cardName: String
        $count: Int = 48
        $cursor: String
        $sortBy: EntriesSortBy!
        $commanderName: String!
      ) @throwOnFieldError {
        commander(name: $commanderName) {
          ...commanderPage_CardEntries
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
    {
      commanderName: props.commanderName,
      cardName: props.cardName,
      sortBy: props.sortBy,
    },
  );

  return <CommanderCardEntries commander={commander} sortBy={props.sortBy} />;
}

function CommanderEntries(props: {commander: commanderPage_entries$key}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    CommanderEntriesQuery,
    commanderPage_entries$key
  >(
    graphql`
      fragment commanderPage_entries on Commander
      @throwOnFieldError
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
        ) @connection(key: "commanderPage_entries") {
          edges {
            node {
              id
              ...commanderPage_EntryCard
            }
          }
        }
      }
    `,
    props.commander,
  );

  return (
    <>
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
    </>
  );
}

/** @resource m#commander_stats */
export const CommanderStats: EntryPointComponent<
  {statsRef: commanderPage_CommanderStatsQuery},
  {}
> = ({queries}) => {
  const {commander} = usePreloadedQuery(
    graphql`
      query commanderPage_CommanderStatsQuery(
        $commander: String!
        $timePeriod: TimePeriod!
        $minEventSize: Int!
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
    queries.statsRef,
  );

  return (
    <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
      {commander.stats.count} Entries
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(commander.stats.metaShare)} Meta%
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(commander.stats.conversionRate)} Conversion
    </div>
  );
};

function CommanderBanner({
  children,
  ...props
}: PropsWithChildren<{commander: commanderPage_CommanderBanner$key}>) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CommanderBanner on Commander @throwOnFieldError {
        name
        colorId
        cards {
          imageUrls
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

        {children}
      </div>
    </div>
  );
}

function useCommanderMeta(commanderFromProps: commanderPage_CommanderMeta$key) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CommanderMeta on Commander @throwOnFieldError {
        name
      }
    `,
    commanderFromProps,
  );

  return commander;
}

/** @resource m#commander_page */
export const CommanderPage: EntryPointComponent<
  {commanderQueryRef: commanderPage_CommanderQuery},
  {}
> = ({queries}) => {
  const {commander} = usePreloadedQuery(
    graphql`
      query commanderPage_CommanderQuery(
        $commander: String!
        $showStaples: Boolean!
        $showEntries: Boolean!
        $showCardDetail: Boolean!
        $cardName: String
        $sortBy: EntriesSortBy!
        $minEventSize: Int!
        $maxStanding: Int
        $timePeriod: TimePeriod!
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          ...commanderPage_CommanderStaples
            @include(if: $showStaples)
            @alias(as: "staples")
          ...commanderPage_entries
            @include(if: $showEntries)
            @alias(as: "entries")
          ...commanderPage_CardDetail
            @include(if: $showCardDetail)
            @alias(as: "cardDetail")
        }
      }
    `,
    queries.commanderQueryRef,
  );

  return (
    <>
      {queries.commanderQueryRef.variables.showStaples &&
        commander.staples != null && (
          <CommanderStaples commander={commander.staples} />
        )}

      {queries.commanderQueryRef.variables.showEntries &&
        commander.entries != null && (
          <CommanderEntries commander={commander.entries} />
        )}

      {queries.commanderQueryRef.variables.showCardDetail &&
        commander.cardDetail != null &&
        queries.commanderQueryRef.variables.cardName && (
          <CommanderCardDetail
            commander={commander.cardDetail}
            cardName={queries.commanderQueryRef.variables.cardName ?? undefined}
            sortBy={queries.commanderQueryRef.variables.sortBy}
          />
        )}
      <Footer />
    </>
  );
};

/** @resource m#commander_page_shell */
export const CommanderPageShell: EntryPointComponent<
  {commanderRef: commanderPage_CommanderShellQuery},
  {
    commanderStats: EntryPoint<ModuleType<'m#commander_stats'>>;
    commanderContent: EntryPoint<ModuleType<'m#commander_page'>>;
  },
  {},
  {
    maxStanding?: number | null;
    minEventSize: number;
    sortBy: EntriesSortBy;
    timePeriod: TimePeriod;
    tab: 'entries' | 'staples' | 'card';
    cardName?: string;
  }
> = ({
  entryPoints,
  queries,
  extraProps: {maxStanding, minEventSize, sortBy, timePeriod, tab, cardName},
}) => {
  const {commander} = usePreloadedQuery(
    graphql`
      query commanderPage_CommanderShellQuery($commander: String!)
      @preloadable
      @throwOnFieldError {
        commander(name: $commander) {
          name
          breakdownUrl
          ...commanderPage_CommanderBanner
          ...commanderPage_CommanderMeta

          promo {
            ...promo_EmbededPromo
          }
        }
      }
    `,
    queries.commanderRef,
  );

  const commanderMeta = useCommanderMeta(commander);
  const {replaceRoute} = useNavigation();

  return (
    <>
      <title>{commanderMeta.name}</title>
      <meta
        name="description"
        content={`Top Performing and Recent Decklists for ${commanderMeta.name} in cEDH`}
      />
      <Navigation />
      <CommanderBanner commander={commander}>
        <Suspense fallback={null}>
          <EntryPointContainer
            entryPointReference={entryPoints.commanderStats}
            props={{}}
          />
        </Suspense>
      </CommanderBanner>
      {commander.promo && <FirstPartyPromo promo={commander.promo} />}

      <TabList
        className="mx-auto max-w-(--breakpoint-md)"
        border={tab === 'staples' || tab === 'card'}
      >
        <Tab
          selected={tab === 'entries' || !tab}
          onClick={() => {
            replaceRoute('/commander/:commander', {
              commander: commander.name,
              tab: 'entries',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              // Explicitly clear card parameter
              card: undefined,
            });
          }}
        >
          Tournament Entries
        </Tab>

        <Tab
          selected={tab === 'staples'}
          onClick={() => {
            replaceRoute('/commander/:commander', {
              commander: commander.name,
              tab: 'staples',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              // Explicitly clear card parameter
              card: undefined,
            });
          }}
        >
          Staples
        </Tab>

        {cardName && tab === 'card' && (
          <Tab
            selected={tab === 'card'}
            onClick={() => {
              replaceRoute('/commander/:commander', {
                commander: commander.name,
                tab: 'card',
                card: cardName,
                sortBy,
                timePeriod,
                maxStanding,
                minEventSize,
              });
            }}
          >
            {cardName}
          </Tab>
        )}
      </TabList>

      {tab === 'entries' && (
        <div className="mx-auto grid max-w-(--breakpoint-md) grid-cols-2 gap-4 border-b border-white/40 p-6 text-center text-black sm:flex sm:flex-wrap sm:justify-center">
          <Select
            id="commander-sort-by"
            label="Sort By"
            value={sortBy}
            onChange={(e) => {
              replaceRoute('/commander/:commander', {
                commander: commander.name,
                sortBy: e,
              });
            }}
          >
            <option value="TOP">Top Performing</option>
            <option value="NEW">Recent</option>
          </Select>

          <Select
            id="commanders-time-period"
            label="Time Period"
            value={timePeriod}
            onChange={(e) => {
              replaceRoute('/commander/:commander', {
                commander: commander.name,
                timePeriod: e,
              });
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
            id="commander-event-size"
            label="Event Size"
            value={`${minEventSize}`}
            onChange={(e) => {
              replaceRoute('/commander/:commander', {
                commander: commander.name,
                minEventSize: Number(e),
              });
            }}
          >
            <option value="0">All Events</option>
            <option value="16">16+ Players</option>
            <option value="30">30+ Players</option>
            <option value="50">50+ Players</option>
            <option value="100">100+ Players</option>
            <option value="250">250+ Players</option>
          </Select>

          <Select
            id="commander-event-size"
            label="Standing"
            value={`${maxStanding}`}
            onChange={(e) => {
              replaceRoute('/commander/:commander', {
                commander: commander.name,
                maxStanding: Number(e),
              });
            }}
          >
            <option value="">All Players</option>
            <option value="16">Top 16</option>
            <option value="4">Top 4</option>
            <option value="1">Winner</option>
          </Select>
        </div>
      )}

      <Suspense fallback={<LoadingIcon />}>
        <EntryPointContainer
          entryPointReference={entryPoints.commanderContent}
          props={{}}
        />
      </Suspense>
    </>
  );
};
