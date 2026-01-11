import {CommanderEntriesFilterMenu} from '@/components/CommanderEntriesFilterMenu';
import {EntryCard} from '@/components/EntryCard';
import {LoadingIcon} from '@/components/fallback';
import {ListContainer, ListContainerState} from '@/components/ListContainer';
import {Commander, EntriesSortBy} from '@/lib/schema/commander';
import {TimePeriod} from '@/lib/schema/types';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import {Suspense} from 'react';
import {z} from 'zod/v4';

const PAGE_SIZE = 48;

export default async function CommanderPage(
  props: PageProps<'/commander/[commander]'>,
) {
  const commanderName = decodeURIComponent((await props.params).commander);

  const {sortBy, timePeriod, maxStanding, minEventSize} = z
    .object({
      sortBy: z.enum(EntriesSortBy).optional().default(EntriesSortBy.TOP),
      timePeriod: z.enum(TimePeriod).optional().default(TimePeriod.ONE_YEAR),
      maxStanding: z.coerce.number().int().optional(),
      minEventSize: z.coerce.number().int().optional().default(60),
    })
    .parse(await props.searchParams);

  const filters = {minEventSize, timePeriod, maxStanding};

  async function loadEntries(cursor?: string): Promise<ListContainerState> {
    'use server';

    const vc = await ViewerContext.forRequest();
    const commander = await Commander.commander(vc, commanderName);
    const entries = await commander.entries(PAGE_SIZE, cursor, filters, sortBy);

    return {
      items: (
        <>
          {entries.edges.map(({node}) => (
            <EntryCard key={node.id} entry={node} />
          ))}
        </>
      ),
      hasNextPage: entries.pageInfo.hasNextPage,
      endCursor: entries.pageInfo.endCursor,
    };
  }

  return (
    <>
      <CommanderEntriesFilterMenu
        filters={{minEventSize, sortBy, timePeriod, maxStanding}}
      />

      <Suspense
        key={JSON.stringify(filters) + sortBy}
        fallback={<LoadingIcon />}
      >
        <ListContainer
          initialState={loadEntries()}
          loadMoreAction={loadEntries}
          gridClassName="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3"
        />
      </Suspense>
    </>
  );
}
