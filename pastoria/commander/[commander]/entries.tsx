import {CommanderEntriesListQuery} from '#genfiles/queries/CommanderEntriesListQuery.graphql';
import {entries_CommanderEntries$key} from '#genfiles/queries/entries_CommanderEntries.graphql';
import {entries_CommanderEntriesQuery} from '#genfiles/queries/entries_CommanderEntriesQuery.graphql';
import {CommanderEntryCard} from '#src/components/commander_entry_card';
import {Footer} from '#src/components/footer';
import {LoadMoreButton} from '#src/components/load_more';
import {
  graphql,
  usePaginationFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

function CommanderEntriesList(props: {
  commander: entries_CommanderEntries$key;
}) {
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<
    CommanderEntriesListQuery,
    entries_CommanderEntries$key
  >(
    graphql`
      fragment entries_CommanderEntries on Commander
      @throwOnFieldError
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 48}
      )
      @refetchable(queryName: "CommanderEntriesListQuery") {
        entries(
          first: $count
          after: $cursor
          sortBy: $sortBy
          filters: {
            minEventSize: $minEventSize
            maxStanding: $maxStanding
            timePeriod: $timePeriod
          }
        ) @connection(key: "entries_entries") {
          edges {
            node {
              id
              ...commanderEntryCard_Entry
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
          <CommanderEntryCard key={node.id} entry={node} />
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

export type Queries = {
  entries: entries_CommanderEntriesQuery;
};

export default function CommanderEntries({
  queries,
}: PastoriaPageProps<'/commander/[commander]#entries'>) {
  const {commander} = usePreloadedQuery(
    graphql`
      query entries_CommanderEntriesQuery(
        $commander: String!
        $sortBy: EntriesSortBy!
        $minEventSize: Int!
        $maxStanding: Int
        $timePeriod: TimePeriod!
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          ...entries_CommanderEntries
        }
      }
    `,
    queries.entries,
  );

  return (
    <>
      <CommanderEntriesList commander={commander} />
      <Footer />
    </>
  );
}
