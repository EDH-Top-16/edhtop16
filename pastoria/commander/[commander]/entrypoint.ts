import type {EntriesSortBy} from '#genfiles/queries/EntriesQuery.graphql.js';
import type {TimePeriod} from '#genfiles/queries/StatsQuery.graphql.js';
import type {EntryPointParams} from '#genfiles/router/router.js';
import type {PreloadPropsForRoute} from '#genfiles/router/types.js';
import * as z from 'zod/v4-mini';

// Custom schema that includes tab (a client-only param not in the GraphQL query)
export const schema = z.object({
  commander: z.pipe(z.string(), z.transform(decodeURIComponent)),
  card: z.pipe(
    z.nullish(z.pipe(z.string(), z.transform(decodeURIComponent))),
    z.transform((s) => (s == null ? undefined : s)),
  ),
  tab: z.pipe(
    z.nullish(z.pipe(z.string(), z.transform(decodeURIComponent))),
    z.transform((s) => (s == null ? undefined : s)),
  ),
  maxStanding: z.pipe(
    z.nullish(z.coerce.number<number>()),
    z.transform((s) => (s == null ? undefined : s)),
  ),
  minEventSize: z.pipe(
    z.nullish(z.coerce.number<number>()),
    z.transform((s) => (s == null ? undefined : s)),
  ),
  sortBy: z.pipe(
    z.nullish(z.transform((s: string) => s as EntriesSortBy)),
    z.transform((s) => (s == null ? undefined : s)),
  ),
  timePeriod: z.pipe(
    z.nullish(z.transform((s: string) => s as TimePeriod)),
    z.transform((s) => (s == null ? undefined : s)),
  ),
});

export default function getPreloadProps({
  params,
  queries,
  entryPoints,
}: EntryPointParams<'/commander/[commander]'>): PreloadPropsForRoute<'/commander/[commander]'> {
  const tab = params.tab ?? 'entries';
  const showStaples = tab === 'staples';
  const showEntries = tab === 'entries' && !params.card;
  const showCardDetail = tab === 'card' && !!params.card;

  return {
    queries: {
      // Main query only needs commander - like a layout
      shellQueryRef: queries.shellQueryRef({
        commander: params.commander,
      }),
    },
    entryPoints: {
      // Stats depend on filter params, so they're a separate entrypoint
      stats: entryPoints.stats({
        commander: params.commander,
        timePeriod: params.timePeriod,
        minEventSize: params.minEventSize,
      }),
      // Tab content is conditionally loaded based on current tab
      entries: showEntries
        ? entryPoints.entries({
            commander: params.commander,
            sortBy: params.sortBy,
            minEventSize: params.minEventSize,
            maxStanding: params.maxStanding,
            timePeriod: params.timePeriod,
          })
        : undefined,
      staples: showStaples
        ? entryPoints.staples({
            commander: params.commander,
          })
        : undefined,
      cardDetail: showCardDetail
        ? entryPoints.cardDetail({
            commander: params.commander,
            card: params.card,
          })
        : undefined,
    },
  };
}
