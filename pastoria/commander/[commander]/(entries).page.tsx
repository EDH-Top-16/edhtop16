import EntriesQuery from '#genfiles/queries/EntriesQuery.graphql.js';
import {Entries_list$key} from '#genfiles/queries/Entries_list.graphql.js';
import {Entries_entryCard$key} from '#genfiles/queries/Entries_entryCard.graphql.js';
import {EntriesPaginationQuery} from '#genfiles/queries/EntriesPaginationQuery.graphql.js';
import {Link, useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {Card} from '#components/card.js';
import {LoadMoreButton} from '#components/load_more.js';
import {Select} from '#components/select.js';
import {formatOrdinals} from '#src/lib/client/format.js';
import {format} from 'date-fns';
import {useCallback} from 'react';
import {
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

export const queries = {
  entriesQueryRef: EntriesQuery,
};

function EntryCard(props: {entry: Entries_entryCard$key}) {
  const entry = useFragment(
    graphql`
      fragment Entries_entryCard on Entry @throwOnFieldError {
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

function EntriesList(props: {commander: Entries_list$key}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    EntriesPaginationQuery,
    Entries_list$key
  >(
    graphql`
      fragment Entries_list on Commander
      @throwOnFieldError
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "EntriesPaginationQuery") {
        entries(
          first: $count
          after: $cursor
          sortBy: $sortBy
          filters: {
            minEventSize: $minEventSize
            maxStanding: $maxStanding
            timePeriod: $timePeriod
          }
        ) @connection(key: "Entries__entries") {
          edges {
            node {
              id
              ...Entries_entryCard
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

export default function CommanderEntries({
  queries,
}: PageProps<'/commander/[commander]#entries'>) {
  const {
    commander: commanderName,
    sortBy = 'TOP',
    timePeriod = 'ONE_YEAR',
    maxStanding,
    minEventSize = 60,
  } = useRouteParams('/commander/[commander]');

  const {replaceRoute} = useNavigation();

  // Get data from preloaded query
  const {commander} = usePreloadedQuery(
    graphql`
      query EntriesQuery(
        $commander: String!
        $sortBy: EntriesSortBy = TOP
        $minEventSize: Int = 60
        $maxStanding: Int
        $timePeriod: TimePeriod = ONE_YEAR
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          name
          ...Entries_list
        }
      }
    `,
    queries.entriesQueryRef,
  );

  const updateFilters = useCallback(
    (
      newFilters: Partial<{
        sortBy: string;
        timePeriod: string;
        maxStanding: number;
        minEventSize: number;
      }>,
    ) => {
      replaceRoute('/commander/[commander]', {
        commander: commanderName,
        ...newFilters,
      });
    },
    [replaceRoute, commanderName],
  );

  if (!commander) {
    return null;
  }

  return (
    <>
      <div className="mx-auto grid max-w-(--breakpoint-md) grid-cols-2 gap-4 border-b border-white/40 p-6 text-center text-black sm:flex sm:flex-wrap sm:justify-center">
        <Select
          id="commander-sort-by"
          label="Sort By"
          value={sortBy}
          onChange={(e) => updateFilters({sortBy: e})}
        >
          <option value="TOP">Top Performing</option>
          <option value="NEW">Recent</option>
        </Select>

        <Select
          id="commanders-time-period"
          label="Time Period"
          value={timePeriod}
          onChange={(e) => updateFilters({timePeriod: e})}
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
          onChange={(e) => updateFilters({minEventSize: Number(e)})}
        >
          <option value="0">All Events</option>
          <option value="16">16+ Players</option>
          <option value="30">30+ Players</option>
          <option value="50">50+ Players</option>
          <option value="100">100+ Players</option>
          <option value="250">250+ Players</option>
        </Select>

        <Select
          id="commander-max-standing"
          label="Standing"
          value={`${maxStanding ?? ''}`}
          onChange={(e) =>
            updateFilters({maxStanding: e ? Number(e) : undefined})
          }
        >
          <option value="">All Players</option>
          <option value="16">Top 16</option>
          <option value="4">Top 4</option>
          <option value="1">Winner</option>
        </Select>
      </div>

      <EntriesList commander={commander} />
    </>
  );
}
