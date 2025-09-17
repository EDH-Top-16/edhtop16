import {DB} from '#genfiles/db/types.js';
import DataLoader from 'dataloader';
import {Float, Int} from 'grats';
import {Context} from '../context';
import {db} from '../db';
import {Card} from './card';
import {GraphQLNode} from './connection';
import {FirstPartyPromo, getActivePromotions} from './promo';
import {minDateFromTimePeriod, TimePeriod} from './types';

export type CommanderLoader = DataLoader<number, Commander>;

/** @gqlContext */
export function createCommanderLoader(ctx: Context): CommanderLoader {
  return ctx.loader(
    'CommanderLoader',
    async (commanderIds: readonly number[]) => {
      const commanders = await db
        .selectFrom('Commander')
        .where('id', 'in', commanderIds)
        .selectAll()
        .execute();

      const commanderById = new Map<number, Commander>();
      for (const c of commanders) {
        commanderById.set(c.id, new Commander(c));
      }

      return commanderIds.map(
        (id) =>
          commanderById.get(id) ?? new Error(`Could not load commander: ${id}`),
      );
    },
  );
}

export type CommanderCardsLoader = DataLoader<string, Card[]>;

/** @gqlContext */
export function createCommanderCardsLoader(ctx: Context): CommanderCardsLoader {
  return ctx.loader(
    'CommanderCardsLoader',
    async (commanders: readonly string[]) => {
      if (commanders.length === 0) return [];

      const names = commanders.map((c) =>
        c === 'Unknown Commander' ? [] : c.split(' / '),
      );

      const cards = await db
        .selectFrom('Card')
        .selectAll()
        .where('name', 'in', names.flat())
        .execute();

      const cardByName = new Map<string, Card>();
      for (const card of cards) {
        cardByName.set(card.name, new Card(card));
      }

      return names.map((ns) =>
        ns.map((n) => cardByName.get(n)!).filter(Boolean),
      );
    },
  );
}

/** @gqlEnum */
export enum CommandersSortBy {
  POPULARITY = 'POPULARITY',
  CONVERSION = 'CONVERSION',
  TOP_CUTS = 'TOP_CUTS',
}

/** @gqlEnum */
export enum EntriesSortBy {
  NEW = 'NEW',
  TOP = 'TOP',
}

/** @gqlInput */
export interface CommanderStatsFilters {
  colorId: string;
  minSize: Int;
  minDate: string;
  maxSize: Int;
  maxDate: string;
  timePeriod: TimePeriod;
}

/** @gqlInput */
export interface EntriesFilter {
  timePeriod: TimePeriod;
  minEventSize: Int;
  maxStanding: Int;
}

/** @gqlType */
interface CommanderCalculatedStats {
  /** @gqlField */
  count: Int;
  /** @gqlField */
  topCuts: Int;
  /** @gqlField */
  conversionRate: Float;
  /** @gqlField */
  metaShare: Float;
}

export type CommanderStatsLoader = (
  filters: CommanderStatsFilters,
) => DataLoader<number, CommanderCalculatedStats>;
const COMMANDER_STATS_CACHE = new WeakMap<Context, CommanderStatsLoader>();

/** @gqlContext */
export function commanderStatsLoader(ctx: Context): CommanderStatsLoader {
  if (COMMANDER_STATS_CACHE.has(ctx)) {
    return COMMANDER_STATS_CACHE.get(ctx)!;
  }

  const loaderForFilters = new Map<
    string,
    DataLoader<number, CommanderCalculatedStats>
  >();

  const loaderProducer: CommanderStatsLoader = (filters) => {
    const cacheKey = Object.keys(filters)
      .sort()
      .map((key) => `key=${filters[key as keyof CommanderStatsFilters]}`)
      .join(';');

    if (loaderForFilters.has(cacheKey)) {
      return loaderForFilters.get(cacheKey)!;
    }

    const loader = new DataLoader<number, CommanderCalculatedStats>(
      async (commanderIds) => {
        const minSize = filters?.minSize ?? 0;
        const maxSize = filters?.maxSize ?? 1_000_000;
        const maxDate = filters?.maxDate
          ? new Date(filters.maxDate)
          : new Date();
        const minDate =
          filters?.minDate != null
            ? new Date(filters?.minDate ?? 0)
            : minDateFromTimePeriod(filters?.timePeriod);

        const [entriesQuery, statsQuery] = await Promise.all([
          db
            .selectFrom('Entry')
            .select((eb) => eb.fn.countAll<number>().as('totalEntries'))
            .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
            .where('Tournament.size', '>=', minSize)
            .where('Tournament.size', '<=', maxSize)
            .where('Tournament.tournamentDate', '>=', minDate.toISOString())
            .where('Tournament.tournamentDate', '<=', maxDate.toISOString())
            .executeTakeFirstOrThrow(),
          db
            .selectFrom('Commander')
            .leftJoin('Entry', 'Entry.commanderId', 'Commander.id')
            .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
            .select([
              'Commander.id',
              'Commander.name',
              'Commander.colorId',
              (eb) => eb.fn.count<number>('Commander.id').as('count'),
              (eb) =>
                eb.fn
                  .sum<number>(
                    eb
                      .case()
                      .when('Entry.standing', '<=', eb.ref('Tournament.topCut'))
                      .then(1)
                      .else(0)
                      .end(),
                  )
                  .as('topCuts'),
              (eb) =>
                eb(
                  eb.cast<number>(
                    eb.fn.sum<number>(
                      eb
                        .case()
                        .when(
                          'Entry.standing',
                          '<=',
                          eb.ref('Tournament.topCut'),
                        )
                        .then(1)
                        .else(0)
                        .end(),
                    ),
                    'real',
                  ),
                  '/',
                  eb.fn.count<number>('Entry.id'),
                ).as('conversionRate'),
            ])
            .where('Tournament.size', '>=', minSize)
            .where('Tournament.size', '<=', maxSize)
            .where('Tournament.tournamentDate', '>=', minDate.toISOString())
            .where('Tournament.tournamentDate', '<=', maxDate.toISOString())
            .where('Commander.id', 'in', commanderIds)
            .groupBy('Commander.id')
            .execute(),
        ]);

        const totalEntries = entriesQuery.totalEntries ?? 1;
        const statsByCommanderId = new Map<number, CommanderCalculatedStats>();
        for (const {id, ...stats} of statsQuery) {
          statsByCommanderId.set(id, {
            ...stats,
            metaShare: stats.count / totalEntries,
          });
        }

        return commanderIds.map(
          (id) =>
            statsByCommanderId.get(id) ?? {
              topCuts: 0,
              conversionRate: 0,
              count: 0,
              metaShare: 0,
            },
        );
      },
    );

    loaderForFilters.set(cacheKey, loader);
    return loader;
  };

  COMMANDER_STATS_CACHE.set(ctx, loaderProducer);
  return loaderProducer;
}

/** @gqlType */
export class Commander implements GraphQLNode {
  id;
  __typename = 'Commander' as const;

  /** @gqlField */
  readonly name: string;
  /** @gqlField */
  readonly colorId: string;

  constructor(private readonly row: DB['Commander']) {
    this.id = row.id;
    this.name = row.name;
    this.colorId = row.colorId;
  }

  /** @gqlField */
  breakdownUrl(): string {
    return `/commander/${encodeURIComponent(this.name)}`;
  }

  // /** @gqlField */
  // async entries(
  //   filters: EntriesFilter,
  //   sortBy: EntriesSortBy = EntriesSortBy.TOP,
  // ): Connection<Entry> {
  //   return         resolveOffsetConnection({args}, ({limit, offset}) => {
  //         const minEventSize = args.filters?.minEventSize ?? 60;
  //         const maxStanding =
  //           args.filters?.maxStanding ?? Number.MAX_SAFE_INTEGER;
  //         const minDate = minDateFromTimePeriod(
  //           args.filters?.timePeriod ?? 'ALL_TIME',
  //         );

  //         return db
  //           .selectFrom('Entry')
  //           .selectAll('Entry')
  //           .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
  //           .where('Entry.commanderId', '=', parent.id)
  //           .where('standing', '<=', maxStanding)
  //           .where('Tournament.tournamentDate', '>=', minDate.toISOString())
  //           .where('Tournament.size', '>=', minEventSize)
  //           .orderBy(
  //             args.sortBy === 'NEW'
  //               ? ['Tournament.tournamentDate desc']
  //               : ['Entry.standing asc', 'Tournament.size desc'],
  //           )
  //           .limit(limit)
  //           .offset(offset)
  //           .execute();
  //       }),
  // }

  /** @gqlField */
  async cards(commanderLoader: CommanderCardsLoader): Promise<Card[]> {
    return await commanderLoader.load(this.name);
  }

  // staples: t.connection({
  //     type: Card,
  //     resolve: async (parent, args) => {
  //       return resolveOffsetConnection({args}, async ({limit, offset}) => {
  //         const oneYearAgo = subYears(new Date(), 1).toISOString();

  //         const {totalEntries} = await db
  //           .selectFrom('Entry')
  //           .select([(eb) => eb.fn.countAll<number>().as('totalEntries')])
  //           .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
  //           .where('Entry.commanderId', '=', parent.id)
  //           .where('Tournament.tournamentDate', '>=', oneYearAgo)
  //           .executeTakeFirstOrThrow();

  //         const query = db
  //           .with('entries', (eb) => {
  //             return eb
  //               .selectFrom('DecklistItem')
  //               .leftJoin('Card', 'Card.id', 'DecklistItem.cardId')
  //               .leftJoin('Entry', 'Entry.id', 'DecklistItem.entryId')
  //               .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
  //               .where('Entry.commanderId', '=', parent.id)
  //               .where('Tournament.tournamentDate', '>=', oneYearAgo)
  //               .groupBy('Card.id')
  //               .select((eb) => [
  //                 eb.ref('Card.id').as('cardId'),
  //                 eb(
  //                   eb.cast(eb.fn.count<number>('Card.id'), 'real'),
  //                   '/',
  //                   totalEntries,
  //                 ).as('playRateLastYear'),
  //               ]);
  //           })
  //           .selectFrom('Card')
  //           .leftJoin('entries', 'entries.cardId', 'Card.id')
  //           .where((eb) =>
  //             eb(
  //               eb.fn('json_extract', ['Card.data', sql`'$.type_line'`]),
  //               'not like',
  //               '%Land%',
  //             ),
  //           )
  //           .orderBy(
  //             (eb) =>
  //               eb(
  //                 'entries.playRateLastYear',
  //                 '-',
  //                 eb.ref('Card.playRateLastYear'),
  //               ),
  //             'desc',
  //           )
  //           .selectAll('Card');

  //         return query.limit(limit).offset(offset).execute();
  //       });
  //     },
  //   }),

  /** @gqlField */
  promo(): FirstPartyPromo | undefined {
    return getActivePromotions({commander: parent.name})[0];
  }

  /** @gqlField */
  async stats(
    filters: CommanderStatsFilters,
    commanderStatsLoader: CommanderStatsLoader,
  ): Promise<CommanderCalculatedStats> {
    return await commanderStatsLoader(filters).load(this.id);
  }

  /** @gqlQueryField */
  static async commander(name: string): Promise<Commander> {
    const c = await db
      .selectFrom('Commander')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();

    return new Commander(c);
  }
}

// builder.queryField('commanders', (t) =>
//   t.connection({
//     type: Commander,
//     args: {
//       minEntries: t.arg.int(),
//       minTournamentSize: t.arg.int(),
//       timePeriod: t.arg({type: TimePeriod, defaultValue: 'ONE_MONTH'}),
//       sortBy: t.arg({type: CommandersSortBy, defaultValue: 'CONVERSION'}),
//       colorId: t.arg.string(),
//     },
//     resolve: async (_root, args) => {
//       return resolveCursorConnection(
//         {args, toCursor: (parent) => `${parent.id}`},
//         async ({
//           before,
//           after,
//           limit,
//           inverted,
//         }: ResolveCursorConnectionArgs) => {
//           const minDate = minDateFromTimePeriod(args.timePeriod ?? 'ONE_MONTH');
//           const minTournamentSize = args.minTournamentSize || 0;
//           const minEntries = args.minEntries || 0;
//           const sortBy =
//             args.sortBy === 'POPULARITY'
//               ? 'stats.count'
//               : args.sortBy === 'TOP_CUTS'
//                 ? 'stats.topCuts'
//                 : 'stats.conversionRate';

//           let query = db
//             .with('stats', (eb) =>
//               eb
//                 .selectFrom('Commander')
//                 .leftJoin('Entry', 'Entry.commanderId', 'Commander.id')
//                 .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
//                 .where('Tournament.tournamentDate', '>=', minDate.toISOString())
//                 .where('Tournament.size', '>=', minTournamentSize)
//                 .groupBy('Commander.id')
//                 .select((eb) => [
//                   eb.ref('Commander.id').as('commanderId'),
//                   eb.fn.count('Entry.id').as('count'),
//                   eb.fn
//                     .sum(
//                       eb
//                         .case()
//                         .when(
//                           'Entry.standing',
//                           '<=',
//                           eb.ref('Tournament.topCut'),
//                         )
//                         .then(1)
//                         .else(0)
//                         .end(),
//                     )
//                     .as('topCuts'),
//                   eb(
//                     eb.cast(
//                       eb.fn.sum(
//                         eb
//                           .case()
//                           .when(
//                             'Entry.standing',
//                             '<=',
//                             eb.ref('Tournament.topCut'),
//                           )
//                           .then(1)
//                           .else(0)
//                           .end(),
//                       ),
//                       'real',
//                     ),
//                     '/',
//                     eb.fn.count('Entry.id'),
//                   ).as('conversionRate'),
//                 ]),
//             )
//             .selectFrom('Commander')
//             .selectAll('Commander')
//             .leftJoin('stats', 'stats.commanderId', 'Commander.id')
//             .where('Commander.name', '!=', 'Unknown Commander')
//             .where('Commander.name', '!=', 'Nadu, Winged Wisdom')
//             .where('stats.count', '>=', minEntries);

//           if (args.colorId) {
//             query = query.where('Commander.colorId', '=', args.colorId);
//           }

//           if (before) {
//             query = query.where((eb) =>
//               eb(
//                 eb.tuple(eb.ref(sortBy), eb.ref('Commander.id')),
//                 '>',
//                 eb.tuple(
//                   eb
//                     .selectFrom('stats')
//                     .select(sortBy)
//                     .where('commanderId', '=', Number(after)),
//                   Number(after),
//                 ),
//               ),
//             );
//           }

//           if (after) {
//             query = query.where((eb) =>
//               eb(
//                 eb.tuple(eb.ref(sortBy), eb.ref('Commander.id')),
//                 '<',
//                 eb.tuple(
//                   eb
//                     .selectFrom('stats')
//                     .select(sortBy)
//                     .where('commanderId', '=', Number(after)),
//                   Number(after),
//                 ),
//               ),
//             );
//           }

//           query = query
//             .orderBy(sortBy, inverted ? 'asc' : 'desc')
//             .orderBy('Commander.id', inverted ? 'asc' : 'desc')
//             .limit(limit);

//           return query.execute();
//         },
//       );
//     },
//   }),
// );
