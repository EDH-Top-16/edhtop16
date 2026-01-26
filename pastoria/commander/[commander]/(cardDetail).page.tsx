import CardDetailQuery from '#genfiles/queries/CardDetailQuery.graphql.js';
import {CardDetail_entries$key} from '#genfiles/queries/CardDetail_entries.graphql.js';
import {CardDetail_entryCard$key} from '#genfiles/queries/CardDetail_entryCard.graphql.js';
import {CardDetailLazyEntriesQuery} from '#genfiles/queries/CardDetailLazyEntriesQuery.graphql.js';
import {CardDetailEntriesPaginationQuery} from '#genfiles/queries/CardDetailEntriesPaginationQuery.graphql.js';
import {EntriesSortBy} from '#genfiles/queries/CardDetailLazyEntriesQuery.graphql.js';
import {Link, useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {ColorIdentity} from '#src/assets/icons/colors.js';
import {Card} from '#components/card.js';
import {CedhPromo} from '#components/cedh_promo.js';
import {LoadingIcon} from '#components/fallback.js';
import {LoadMoreButton} from '#components/load_more.js';
import {Select} from '#components/select.js';
import {formatOrdinals, formatPercent} from '#src/lib/client/format.js';
import {ServerSafeSuspense} from '#src/lib/client/suspense.js';
import {format} from 'date-fns';
import {
  graphql,
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

export const queries = {
  cardDetailQueryRef: CardDetailQuery,
};

function EntryCard(props: {entry: CardDetail_entryCard$key}) {
  const entry = useFragment(
    graphql`
      fragment CardDetail_entryCard on Entry @throwOnFieldError {
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
        replaceRoute('/commander/[commander]', {
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

function CardEntriesList(props: {
  commander: CardDetail_entries$key;
  sortBy: EntriesSortBy;
}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    CardDetailEntriesPaginationQuery,
    CardDetail_entries$key
  >(
    graphql`
      fragment CardDetail_entries on Commander
      @throwOnFieldError
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "CardDetailEntriesPaginationQuery") {
        cardEntries(
          cardName: $card
          first: $count
          after: $cursor
          sortBy: $sortBy
        ) @connection(key: "CardDetail__cardEntries") {
          edges {
            node {
              id
              ...CardDetail_entryCard
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

function LazyCardEntries(props: {
  commanderName: string;
  cardName: string;
  sortBy: EntriesSortBy;
}) {
  const {commander} = useLazyLoadQuery<CardDetailLazyEntriesQuery>(
    graphql`
      query CardDetailLazyEntriesQuery(
        $card: String
        $count: Int = 48
        $cursor: String
        $sortBy: EntriesSortBy!
        $commanderName: String!
      ) @throwOnFieldError {
        commander(name: $commanderName) {
          ...CardDetail_entries @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
    {
      commanderName: props.commanderName,
      card: props.cardName,
      sortBy: props.sortBy,
    },
  );

  if (!commander) {
    return null;
  }

  return <CardEntriesList commander={commander} sortBy={props.sortBy} />;
}

export default function CommanderCardDetail({
  queries,
}: PageProps<'/commander/[commander]#cardDetail'>) {
  const {card, sortBy = 'TOP'} = useRouteParams('/commander/[commander]');

  const {commander} = usePreloadedQuery(
    graphql`
      query CardDetailQuery($commander: String!, $card: String)
      @preloadable
      @throwOnFieldError {
        commander(name: $commander) {
          name
          cardDetail(cardName: $card) {
            name
            type
            cmc
            colorId
            imageUrls
            scryfallUrl
            cardPreviewImageUrl
          }
          cardWinrateStats(cardName: $card, timePeriod: THREE_MONTHS) {
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
        }
      }
    `,
    queries.cardDetailQueryRef,
  );

  if (!commander || !card) {
    return null;
  }

  const cardInfo = commander.cardDetail;
  const stats = commander.cardWinrateStats;

  if (!cardInfo) {
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
          {cardInfo.cardPreviewImageUrl && (
            <img
              src={cardInfo.cardPreviewImageUrl}
              alt={cardInfo.name}
              className="max-w-xs rounded-lg shadow-lg"
            />
          )}
          <div className="text-center">
            <a
              href={cardInfo.scryfallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl font-bold text-white underline decoration-transparent transition-colors hover:text-blue-300 hover:decoration-inherit"
            >
              {cardInfo.name}
            </a>
            <p className="text-lg text-gray-300">{cardInfo.type}</p>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <ColorIdentity identity={cardInfo.colorId} />
              {cardInfo.cmc > 0 && (
                <span className="rounded bg-gray-700 px-2 py-1 font-mono text-sm text-white">
                  {cardInfo.cmc}
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

          {stats ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-green-900/30 p-4">
                  <h4 className="text-lg font-semibold text-green-300">
                    With {cardInfo.name}
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
                    Without {cardInfo.name}
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
            </>
          ) : (
            <p className="text-gray-400">No performance data available</p>
          )}

          <CedhPromo />
        </div>
      </div>

      {/* Card Entries */}
      <div className="mt-8">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="text-2xl font-bold text-white">
            Tournament Entries Using {cardInfo.name}
          </h3>
          <div className="flex gap-4">
            <CardEntriesSort
              commanderName={commander.name}
              cardName={cardInfo.name}
              currentSort={sortBy as EntriesSortBy}
            />
          </div>
        </div>
        <ServerSafeSuspense fallback={<LoadingIcon />}>
          <LazyCardEntries
            commanderName={commander.name}
            cardName={cardInfo.name}
            sortBy={sortBy as EntriesSortBy}
          />
        </ServerSafeSuspense>
      </div>
    </div>
  );
}
