import {Commander_CommanderBanner$key} from '#genfiles/queries/Commander_CommanderBanner.graphql';
import {Commander_CommanderMeta$key} from '#genfiles/queries/Commander_CommanderMeta.graphql';
import {Commander_CommanderPageShell$key} from '#genfiles/queries/Commander_CommanderPageShell.graphql';
import {
  Commander_CommanderQuery,
  Commander_CommanderQuery$variables,
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/Commander_CommanderQuery.graphql';
import {Commander_CardTab$key} from '#genfiles/queries/Commander_CardTab.graphql';
import {Commander_entries$key} from '#genfiles/queries/Commander_entries.graphql';
import {Commander_EntryCard$key} from '#genfiles/queries/Commander_EntryCard.graphql';
import {CommanderEntriesQuery} from '#genfiles/queries/CommanderEntriesQuery.graphql';
import {CommanderCardEntriesQuery} from '#genfiles/queries/CommanderCardEntriesQuery.graphql';
import {EntryPointParams, Link, useNavigation} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback.jsx';
import {useSeoMeta} from '@unhead/react';
import cn from 'classnames';
import {format} from 'date-fns';
import {PropsWithChildren, useEffect} from 'react';
import {
  EntryPoint,
  EntryPointComponent,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {graphql} from 'relay-runtime';
import {ColorIdentity} from '../../../assets/icons/colors';
import {Card} from '../../../components/card';
import {Footer} from '../../../components/footer';
import {LoadMoreButton} from '../../../components/load_more';
import {Navigation} from '../../../components/navigation';
import {FirstPartyPromo} from '../../../components/promo';
import {Select} from '../../../components/select';
import {Tab, TabList} from '../../../components/tabs';
import {formatOrdinals, formatPercent} from '../../../lib/client/format';
import {Commander_CommanderStats$key} from '#genfiles/queries/Commander_CommanderStats.graphql.js';
import {Commander_CommanderFallbackQuery} from '#genfiles/queries/Commander_CommanderFallbackQuery.graphql.js';
import {Commander_CommanderStaples$key} from '#genfiles/queries/Commander_CommanderStaples.graphql.js';
import {ModuleType} from '#genfiles/router/js_resource.js';

function EntryCard(props: {entry: Commander_EntryCard$key}) {
  const entry = useFragment(
    graphql`
      fragment Commander_EntryCard on Entry @throwOnFieldError {
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

function StapleCard({card}: {card: any}) {
  const playRatePercentage = (card.playRateLastYear * 100).toFixed(1);

  return (
    <Card
      images={card.imageUrls.map((img: string) => ({
        src: img,
        alt: `${card.name} card art`,
      }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <a
          href={card.scryfallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-xl font-bold text-white underline decoration-transparent transition-colors hover:text-blue-300 hover:decoration-inherit"
        >
          {card.name}
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ColorIdentity identity={card.colorId} />
            {card.cmc > 0 && (
              <span className="rounded bg-gray-700 px-2 py-1 font-mono text-xs text-white">
                {card.cmc}
              </span>
            )}
          </div>
          <div className="rounded bg-green-900/50 px-2 py-1">
            <span className="text-xs font-medium text-green-300">
              Play Rate: {playRatePercentage}%
            </span>
          </div>
        </div>
        <div className="mt-auto text-sm text-gray-300">{card.type}</div>
      </div>
    </Card>
  );
}

function CommanderStaples(props: {commander: Commander_CommanderStaples$key}) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderStaples on Commander @throwOnFieldError {
        staples {
          id
          name
          type
          cmc
          colorId
          imageUrls
          scryfallUrl
          playRateLastYear
        }
      }
    `,
    props.commander,
  );

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
      {commander.staples.map((card) => (
        <StapleCard key={card.id} card={card} />
      ))}
    </div>
  );
}

function CommanderEntries(props: {commander: Commander_entries$key}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    CommanderEntriesQuery,
    Commander_entries$key
  >(
    graphql`
      fragment Commander_entries on Commander
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

function WinRateLineChart({
  series,
}: {
  series: readonly {
    periodStart: string;
    winRateWithCard: number | null;
    winRateWithoutCard: number | null;
    withCount: number;
    withoutCount: number;
  }[];
}) {
  if (!series || series.length === 0) {
    return (
      <div className="rounded-xl bg-black/40 p-6 text-center text-white/70">
        Not enough tournament data from the last three months to chart this
        card.
      </div>
    );
  }

  const width = 720;
  const height = 320;
  const padding = {top: 24, right: 24, bottom: 48, left: 64};
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const xForIndex = (index: number) => {
    if (series.length <= 1) {
      return padding.left + chartWidth / 2;
    }

    return padding.left + (index / (series.length - 1)) * chartWidth;
  };

  const yForValue = (value: number | null) => {
    if (value == null) return null;
    const clamped = clamp(value);
    return padding.top + (1 - clamped) * chartHeight;
  };

  const pathFromPoints = (points: {x: number; y: number | null}[]) => {
    let started = false;
    let path = '';

    for (const point of points) {
      if (point.y == null) {
        started = false;
        continue;
      }

      const command = `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      if (!started) {
        path += `M ${command}`;
        started = true;
      } else {
        path += ` L ${command}`;
      }
    }

    return path;
  };

  const withPoints = series.map((point, index) => ({
    x: xForIndex(index),
    y: yForValue(point.winRateWithCard),
  }));
  const withoutPoints = series.map((point, index) => ({
    x: xForIndex(index),
    y: yForValue(point.winRateWithoutCard),
  }));

  const gridValues = [0, 0.25, 0.5, 0.75, 1];
  const labelStep = Math.max(1, Math.ceil(series.length / 6));
  const latestPoint = series.at(-1);
  const formatRate = (value: number | null) =>
    value == null ? '—' : `${Math.round(value * 1000) / 10}%`;

  return (
    <div className="rounded-xl bg-black/40 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Win Rate (last 3 months)</h3>
          <p className="text-sm text-white/70">
            Weekly win rate of this commander with and without the selected card
            in the deck.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-6 rounded-full bg-emerald-400" />
            <span>With card ({formatRate(latestPoint?.winRateWithCard)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-6 rounded-full bg-sky-400" />
            <span>
              Without card ({formatRate(latestPoint?.winRateWithoutCard)})
            </span>
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-64 w-full"
        role="img"
        aria-label="Line chart showing win rate with and without the selected card"
      >
        <g stroke="#ffffff30" strokeWidth={1}>
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
          />
        </g>

        {gridValues.map((value) => {
          const y = yForValue(value)!;
          return (
            <g key={value}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#ffffff10"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                fontSize={12}
                fill="#ffffffa0"
                textAnchor="end"
              >
                {Math.round(value * 100)}%
              </text>
            </g>
          );
        })}

        {series.map((point, index) => {
          if (index % labelStep !== 0 && index !== series.length - 1) {
            return null;
          }

          const x = xForIndex(index);
          const dateLabel = format(new Date(point.periodStart), 'MMM d');
          return (
            <text
              key={point.periodStart}
              x={x}
              y={height - padding.bottom + 24}
              fontSize={12}
              fill="#ffffffa0"
              textAnchor="middle"
            >
              {dateLabel}
            </text>
          );
        })}

        <path
          d={pathFromPoints(withoutPoints)}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2}
        />
        <path
          d={pathFromPoints(withPoints)}
          fill="none"
          stroke="#34d399"
          strokeWidth={2}
        />

        {withPoints.map((point, index) => {
          if (point.y == null) return null;
          return (
            <circle
              key={`with-${index}`}
              cx={point.x}
              cy={point.y}
              r={3}
              fill="#34d399"
            />
          );
        })}

        {withoutPoints.map((point, index) => {
          if (point.y == null) return null;
          return (
            <circle
              key={`without-${index}`}
              cx={point.x}
              cy={point.y}
              r={3}
              fill="#38bdf8"
            />
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap gap-6 text-sm text-white/70">
        <span>
          Entries with card: <strong>{latestPoint?.withCount ?? 0}</strong>
        </span>
        <span>
          Entries without card:{' '}
          <strong>{latestPoint?.withoutCount ?? 0}</strong>
        </span>
      </div>
    </div>
  );
}

function CommanderCardDetailView({
  commanderName,
  cardName,
  cardOptions,
  commanderRef,
}: {
  commanderName: string;
  cardName?: string | null;
  cardOptions: readonly {id: string; name: string}[];
  commanderRef: Commander_CardTab$key;
}) {
  const {data, loadNext, hasNext, isLoadingNext} = usePaginationFragment<
    CommanderCardEntriesQuery,
    Commander_CardTab$key
  >(
    graphql`
      fragment Commander_CardTab on Commander
      @argumentDefinitions(
        cardName: {type: "String"}
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
        sortBy: {type: "EntriesSortBy!"}
        minEventSize: {type: "Int!"}
        maxStanding: {type: "Int"}
        timePeriod: {type: "TimePeriod!"}
      )
      @refetchable(queryName: "CommanderCardEntriesQuery") {
        cardDetails(
          cardName: $cardName
          filters: {
            minEventSize: $minEventSize
            maxStanding: $maxStanding
            timePeriod: $timePeriod
          }
          sortBy: $sortBy
        ) {
          card {
            name
            scryfallUrl
            cardPreviewImageUrl
          }
          winRateSeries {
            periodStart
            winRateWithCard
            winRateWithoutCard
            withCount
            withoutCount
          }
          entries(first: $count, after: $cursor)
            @connection(key: "Commander_cardEntries__entries") {
            edges {
              node {
                id
                ...Commander_EntryCard
              }
            }
          }
        }
      }
    `,
    commanderRef,
  );

  const cardDetails = data.cardDetails;
  const card = cardDetails?.card;

  const entries =
    cardDetails?.entries.edges
      .map((edge) => edge?.node)
      .filter((edge): edge is NonNullable<typeof edge> => edge != null) ?? [];

  if (!cardDetails) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) p-6 text-center text-white/70">
        We don't have any recorded data for {cardName ?? 'this card'} with{' '}
        {commanderName} yet.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-6 p-6">
      <div className="flex flex-col items-center gap-6 rounded-xl bg-black/40 p-6 text-center text-white sm:flex-row sm:items-start sm:text-left">
        {card?.cardPreviewImageUrl && (
          <img
            src={card.cardPreviewImageUrl}
            alt={`${card.name} card art`}
            className="h-auto w-36 rounded-lg shadow-lg"
            loading="lazy"
          />
        )}

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">
            {card?.name ?? cardName ?? 'Select a card'}
          </h2>
          <p className="text-sm text-white/70">
            Performance of {commanderName} with and without this card in the
            deck.
          </p>

          {card?.scryfallUrl && (
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                className="text-blue-300 underline decoration-transparent transition hover:decoration-inherit"
                href={card.scryfallUrl}
                target="_blank"
                rel="noreferrer"
              >
                View on Scryfall
              </a>
            </div>
          )}

          <p className="text-xs tracking-wide text-white/60 uppercase">
            {cardOptions.length} card option
            {cardOptions.length === 1 ? '' : 's'}
            available
          </p>
        </div>
      </div>

      <WinRateLineChart series={cardDetails.winRateSeries ?? []} />

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-semibold text-white">
            Tournament entries using {card?.name ?? cardName ?? 'this card'}
          </h3>
        </div>

        {entries.length === 0 ? (
          <p className="rounded-xl bg-black/40 p-6 text-center text-white/70">
            No recorded entries using this card with {commanderName} for the
            selected filters yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        <LoadMoreButton
          hasNext={hasNext}
          isLoadingNext={isLoadingNext}
          loadNext={loadNext}
        />
      </div>
    </div>
  );
}

function CommanderStats(props: {commander: Commander_CommanderStats$key}) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderStats on Commander @throwOnFieldError {
        stats(filters: {timePeriod: $timePeriod, minSize: $minEventSize}) {
          conversionRate
          metaShare
          count
        }
      }
    `,
    props.commander,
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
}

function CommanderBanner({
  children,
  ...props
}: PropsWithChildren<{commander: Commander_CommanderBanner$key}>) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderBanner on Commander @throwOnFieldError {
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

function useCommanderMeta(commanderFromProps: Commander_CommanderMeta$key) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderMeta on Commander @throwOnFieldError {
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
  tab,
  cardName,
  cardOptions = [],
  stats,
  children,
  ...props
}: PropsWithChildren<{
  disableNavigation?: boolean;
  maxStanding?: number | null;
  minEventSize: number;
  sortBy: EntriesSortBy;
  timePeriod: TimePeriod;
  tab: 'entries' | 'staples' | 'card';
  cardName?: string | null;
  cardOptions?: readonly {id: string; name: string}[];
  commander: Commander_CommanderPageShell$key;
  stats?: React.ReactNode;
}>) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderPageShell on Commander @throwOnFieldError {
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
  const cardSelectValue = cardName ?? '';
  const maxStandingValue = maxStanding == null ? '' : String(maxStanding ?? '');

  return (
    <>
      <Navigation />
      <CommanderBanner commander={commander}>{stats}</CommanderBanner>
      {commander.promo && <FirstPartyPromo promo={commander.promo} />}

      <TabList
        className="mx-auto max-w-(--breakpoint-md)"
        border={tab === 'staples'}
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
            });
          }}
        >
          Staples
        </Tab>

        <Tab
          selected={tab === 'card'}
          onClick={() => {
            replaceRoute('/commander/:commander', {
              commander: commander.name,
              tab: 'card',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              card: cardName ?? undefined,
            });
          }}
        >
          Card Details
        </Tab>
      </TabList>

      {tab !== 'staples' && (
        <div className="mx-auto grid max-w-(--breakpoint-md) grid-cols-2 gap-4 border-b border-white/40 p-6 text-center text-black sm:flex sm:flex-wrap sm:justify-center">
          {tab === 'card' && (
            <Select
              id="commander-card"
              label="Card"
              value={cardSelectValue}
              disabled={cardOptions.length === 0}
              onChange={(value) => {
                replaceRoute('/commander/:commander', {
                  commander: commander.name,
                  tab: 'card',
                  card: value || undefined,
                });
              }}
            >
              <option value="">Select a card</option>
              {cardOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          )}

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
            <option value="32">32+ Players</option>
            <option value="60">60+ Players</option>
            <option value="100">100+ Players</option>
          </Select>

          <Select
            id="commander-event-size"
            label="Standing"
            value={maxStandingValue}
            onChange={(e) => {
              replaceRoute('/commander/:commander', {
                commander: commander.name,
                maxStanding: e === '' ? undefined : Number(e),
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

      {children}
    </>
  );
}

/** @resource m#commander_page_fallback */
export const CommanderPageFallback: EntryPointComponent<
  {commanderFallbackQueryRef: Commander_CommanderFallbackQuery},
  {},
  {},
  Commander_CommanderQuery$variables & {
    tab: 'entries' | 'staples' | 'card';
    cardName?: string | null;
  }
> = ({queries, extraProps}) => {
  const {commander} = usePreloadedQuery(
    graphql`
      query Commander_CommanderFallbackQuery($commander: String!)
      @preloadable
      @throwOnFieldError {
        commander(name: $commander) {
          ...Commander_CommanderPageShell
        }
      }
    `,
    queries.commanderFallbackQueryRef,
  );

  return (
    <CommanderPageShell
      commander={commander}
      maxStanding={extraProps.maxStanding}
      minEventSize={extraProps.minEventSize}
      sortBy={extraProps.sortBy}
      timePeriod={extraProps.timePeriod}
      tab={extraProps.tab}
      cardName={extraProps.cardName}
      cardOptions={[]}
    >
      <LoadingIcon />
    </CommanderPageShell>
  );
};

/** @resource m#commander_page */
export const CommanderPage: EntryPointComponent<
  {commanderQueryRef: Commander_CommanderQuery},
  {fallback: EntryPoint<ModuleType<'m#commander_page_fallback'>>}
> = ({queries}) => {
  const {replaceRoute} = useNavigation();
  const {commander} = usePreloadedQuery(
    graphql`
      query Commander_CommanderQuery(
        $commander: String!
        $showStaples: Boolean!
        $showEntries: Boolean!
        $showCardOptions: Boolean!
        $sortBy: EntriesSortBy!
        $minEventSize: Int!
        $maxStanding: Int
        $timePeriod: TimePeriod!
        $cardName: String
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          ...Commander_CommanderPageShell
          ...Commander_CommanderStats
          ...Commander_CommanderStaples
            @include(if: $showStaples)
            @alias(as: "staples")
          ...Commander_entries @include(if: $showEntries) @alias(as: "entries")
          ...Commander_CardTab
            @include(if: $showCardOptions)
            @arguments(
              cardName: $cardName
              sortBy: $sortBy
              minEventSize: $minEventSize
              maxStanding: $maxStanding
              timePeriod: $timePeriod
            )
          cardDetailOptions: staples @include(if: $showCardOptions) {
            id
            name
          }
        }
      }
    `,
    queries.commanderQueryRef,
  );

  const variables = queries.commanderQueryRef.variables;
  const cardOptions = commander.cardDetailOptions ?? [];
  const firstCardOption = cardOptions.at(0)?.name ?? null;
  const currentTab = variables.showCardOptions
    ? 'card'
    : variables.showStaples
      ? 'staples'
      : 'entries';
  const cardName = variables.cardName ?? null;
  useEffect(() => {
    if (variables.showCardOptions && !cardName && firstCardOption) {
      replaceRoute('/commander/:commander', {
        commander: commander.name,
        tab: 'card',
        card: firstCardOption,
      });
    }
  }, [
    replaceRoute,
    variables.showCardOptions,
    cardName,
    firstCardOption,
    commander.name,
  ]);

  return (
    <CommanderPageShell
      commander={commander}
      maxStanding={variables.maxStanding}
      minEventSize={variables.minEventSize}
      sortBy={variables.sortBy}
      timePeriod={variables.timePeriod}
      tab={currentTab}
      cardName={cardName}
      cardOptions={cardOptions}
      stats={<CommanderStats commander={commander} />}
    >
      {variables.showStaples && commander.staples != null && (
        <CommanderStaples commander={commander.staples} />
      )}

      {variables.showEntries && commander.entries != null && (
        <CommanderEntries commander={commander.entries} />
      )}

      {currentTab === 'card' &&
        (cardName ? (
          <CommanderCardDetailView
            commanderName={commander.name}
            cardName={cardName}
            cardOptions={cardOptions}
            commanderRef={commander}
          />
        ) : (
          <div className="mx-auto max-w-(--breakpoint-md) p-6 text-center text-white/70">
            Select a card to view detailed performance data.
          </div>
        ))}
      <Footer />
    </CommanderPageShell>
  );
};
