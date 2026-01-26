import * as z from 'zod/v4-mini';
import type {EntryPointParams} from '#genfiles/router/router.jsx';
import type {PreloadPropsForRoute} from '#genfiles/router/types.js';

// Custom schema that includes tab (a client-only param not in the GraphQL query)
export const schema = z.object({
  tid: z.pipe(z.string(), z.transform(decodeURIComponent)),
  commander: z.pipe(
    z.nullish(z.pipe(z.string(), z.transform(decodeURIComponent))),
    z.transform((s) => (s == null ? undefined : s)),
  ),
  tab: z.pipe(
    z.nullish(z.pipe(z.string(), z.transform(decodeURIComponent))),
    z.transform((s) => (s == null ? undefined : s)),
  ),
});

export default function getPreloadProps({
  params,
  queries,
}: EntryPointParams<'/tournament/[tid]'>): PreloadPropsForRoute<'/tournament/[tid]'> {
  return {
    queries: {
      tournamentQueryRef: queries.tournamentQueryRef({
        tid: params.tid,
        commander: params.commander,
      }),
    },
    entryPoints: undefined,
  };
}
