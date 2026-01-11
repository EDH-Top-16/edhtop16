import {formatPercent} from '@/lib/client/format';
import {Commander} from '@/lib/schema/commander';
import {TimePeriod} from '@/lib/schema/types';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import z from 'zod/v4';

export default async function CommanderBannerStats(
  props: PageProps<'/commander/[commander]'>,
) {
  const vc = await ViewerContext.forRequest();
  const commanderName = decodeURIComponent((await props.params).commander);
  const {timePeriod, minEventSize} = z
    .object({
      timePeriod: z.enum(TimePeriod).optional().default(TimePeriod.ONE_YEAR),
      minEventSize: z.coerce.number().int().optional().default(60),
    })
    .parse(await props.searchParams);

  const commander = await Commander.commander(vc, commanderName);
  const stats = await commander.stats({timePeriod, minSize: minEventSize});

  return (
    <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
      {stats.count} Entries
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(stats.metaShare)} Meta%
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(stats.conversionRate)} Conversion
    </div>
  );
}
