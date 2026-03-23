import {EntriesSortBy} from '#genfiles/queries/CommanderStaplesCardEntriesQuery.graphql';
import {stapleDetails_CardEntries$key} from '#genfiles/queries/stapleDetails_CardEntries.graphql';
import {stapleDetails_CommanderStapleDetailsQuery} from '#genfiles/queries/stapleDetails_CommanderStapleDetailsQuery.graphql';
import {stapleDetails_LazyCardEntriesQuery} from '#genfiles/queries/stapleDetails_LazyCardEntriesQuery.graphql';
import {useNavigation} from '#genfiles/router/router';
import {ColorIdentity} from '#src/assets/icons/colors';
import {CedhPromo} from '#src/components/cedh_promo';
import {LoadingIcon} from '#src/components/fallback';
import {LoadMoreButton} from '#src/components/load_more';
import {Select} from '#src/components/select';
import {TournamentEntryCard} from '#src/components/tournament_entry_card';
import {formatPercent} from '#src/lib/client/format';
import {Suspense} from 'react';
import {
  graphql,
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

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

function CommanderCardEntries(props: {
  commander: stapleDetails_CardEntries$key;
  sortBy: EntriesSortBy;
}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment(
    graphql`
      fragment stapleDetails_CardEntries on Commander
      @throwOnFieldError
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "CommanderStaplesCardEntriesQuery") {
        cardEntries(
          cardName: $cardName
          first: $count
          after: $cursor
          sortBy: $sortBy
        ) @connection(key: "stapleDetails_cardEntries") {
          edges {
            node {
              id
              ...tournamentEntryCard_Entry
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
          <TournamentEntryCard
            key={node.id}
            entry={node}
            highlightFirst={false}
          />
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
  const {commander} = useLazyLoadQuery<stapleDetails_LazyCardEntriesQuery>(
    graphql`
      query stapleDetails_LazyCardEntriesQuery(
        $cardName: String
        $count: Int = 48
        $cursor: String
        $sortBy: EntriesSortBy!
        $commanderName: String!
      ) @throwOnFieldError {
        commander(name: $commanderName) {
          ...stapleDetails_CardEntries
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

export type Queries = {
  cardDetails: stapleDetails_CommanderStapleDetailsQuery;
};

export type RuntimeProps = {
  sortBy: EntriesSortBy;
};

export default function CommanderStapleDetails({
  queries,
  props: {sortBy},
}: PastoriaPageProps<'/commander/[commander]#staple_details'>) {
  const {commander} = usePreloadedQuery(
    graphql`
      query stapleDetails_CommanderStapleDetailsQuery(
        $commander: String!
        $cardName: String!
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) @required(action: THROW) {
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
        }
      }
    `,
    queries.cardDetails,
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

          <CedhPromo />
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
              currentSort={sortBy}
            />
          </div>
        </div>

        <Suspense fallback={<LoadingIcon />}>
          <LazyCommanderCardEntries
            commanderName={commander.name}
            cardName={card.name}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  );
}
