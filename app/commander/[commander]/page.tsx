import {Card} from '@/components/card';
import {CommanderEntriesFilterMenu} from '@/components/CommanderEntriesFilterMenu';
import {EntryCard} from '@/components/EntryCard';
import {formatOrdinals} from '@/lib/client/format';
import {Commander, EntriesSortBy} from '@/lib/schema/commander';
import {Entry} from '@/lib/schema/entry';
import {TimePeriod} from '@/lib/schema/types';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import {format} from 'date-fns';
import Link from 'next/link';
import {z} from 'zod/v4';

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

  const vc = await ViewerContext.forRequest();
  const commander = await Commander.commander(vc, commanderName);
  const entries = await commander.entries(
    48,
    undefined,
    {minEventSize, timePeriod, maxStanding},
    sortBy,
  );

  return (
    <>
      <CommanderEntriesFilterMenu
        filters={{minEventSize, sortBy, timePeriod, maxStanding}}
      />

      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.edges.map(({node}) => (
          <EntryCard key={node.id} entry={node} />
        ))}
      </div>
    </>
  );
}
