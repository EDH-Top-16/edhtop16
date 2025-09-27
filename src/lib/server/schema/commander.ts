import {DB} from '#genfiles/db/types.js';
import DataLoader from 'dataloader';
import {formatISO, startOfWeek, subMonths, subYears} from 'date-fns';
import {fromGlobalId, toGlobalId} from 'graphql-relay';
import {Float, Int} from 'grats';
import {sql} from 'kysely';
import {Context} from '../context';
import {db} from '../db';
import {Card} from './card';
import {Connection, GraphQLNode} from './connection';
import {Entry} from './entry';
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

interface CommanderCardFilters extends EntriesFilter {
  timePeriod: TimePeriod;
  minEventSize: Int;
  maxStanding?: Int | null;
}

/** @gqlType */
export class CommanderCardWinRatePoint {
  constructor(
    /** @gqlField */ readonly periodStart: string,
    /** @gqlField */ readonly winRateWithCard: Float | null,
    /** @gqlField */ readonly winRateWithoutCard: Float | null,
    /** @gqlField */ readonly withCount: Int,
    /** @gqlField */ readonly withoutCount: Int,
  ) {}
}

/** @gqlType */
export class CommanderCardDetails {
  constructor(
    private readonly commanderId: number,
    private readonly cardRow: DB['Card'],
    private readonly filters: CommanderCardFilters,
    private readonly sortBy: EntriesSortBy,
  ) {}

  /** @gqlField */
  card(): Card {
    return new Card(this.cardRow);
  }

  private createCursor(entry: Entry, tournamentDate: string, size: number) {
    return CommanderEntriesCursor.fromEntry(
      entry,
      tournamentDate,
      size,
    ).toString();
  }

  /** @gqlField */
  async winRateSeries(): Promise<CommanderCardWinRatePoint[]> {
    const cutoff = subMonths(new Date(), 3).toISOString();

    const [entries, entriesWithCard] = await Promise.all([
      db
        .selectFrom('Entry')
        .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
        .select([
          'Entry.id as entryId',
          'Entry.winsSwiss',
          'Entry.winsBracket',
          'Entry.lossesSwiss',
          'Entry.lossesBracket',
          'Entry.draws',
          'Tournament.tournamentDate',
        ])
        .where('Entry.commanderId', '=', this.commanderId)
        .where('Tournament.tournamentDate', '>=', cutoff)
        .execute(),
      db
        .selectFrom('DecklistItem')
        .innerJoin('Entry', 'Entry.id', 'DecklistItem.entryId')
        .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
        .select(['DecklistItem.entryId'])
        .where('DecklistItem.cardId', '=', this.cardRow.id)
        .where('Entry.commanderId', '=', this.commanderId)
        .where('Tournament.tournamentDate', '>=', cutoff)
        .execute(),
    ]);

    const entryIdsWithCard = new Set(entriesWithCard.map((row) => row.entryId));

    const buckets = new Map<
      string,
      {
        withWins: number;
        withGames: number;
        withCount: number;
        withoutWins: number;
        withoutGames: number;
        withoutCount: number;
      }
    >();

    for (const row of entries) {
      const tournamentDate = new Date(row.tournamentDate);
      const bucketKey = formatISO(
        startOfWeek(tournamentDate, {weekStartsOn: 1}),
        {
          representation: 'date',
        },
      );

      const bucket = buckets.get(bucketKey) ?? {
        withWins: 0,
        withGames: 0,
        withCount: 0,
        withoutWins: 0,
        withoutGames: 0,
        withoutCount: 0,
      };

      const wins = row.winsSwiss + row.winsBracket;
      const losses = row.lossesSwiss + row.lossesBracket;
      const games = wins + losses + row.draws;
      const target = entryIdsWithCard.has(row.entryId) ? 'with' : 'without';

      if (games > 0) {
        if (target === 'with') {
          bucket.withWins += wins;
          bucket.withGames += games;
        } else {
          bucket.withoutWins += wins;
          bucket.withoutGames += games;
        }
      }

      if (target === 'with') {
        bucket.withCount += 1;
      } else {
        bucket.withoutCount += 1;
      }

      buckets.set(bucketKey, bucket);
    }

    const sortedKeys = Array.from(buckets.keys()).sort();
    return sortedKeys.map((key) => {
      const bucket = buckets.get(key)!;
      const withRate =
        bucket.withGames > 0 ? bucket.withWins / bucket.withGames : null;
      const withoutRate =
        bucket.withoutGames > 0
          ? bucket.withoutWins / bucket.withoutGames
          : null;

      return new CommanderCardWinRatePoint(
        key,
        withRate,
        withoutRate,
        bucket.withCount,
        bucket.withoutCount,
      );
    });
  }

  /** @gqlField */
  async entries(
    first: Int = 20,
    after?: string | null,
  ): Promise<Connection<Entry>> {
    const minDate = minDateFromTimePeriod(this.filters.timePeriod);

    let query = db
      .selectFrom('Entry')
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .innerJoin('DecklistItem', 'DecklistItem.entryId', 'Entry.id')
      .where('Entry.commanderId', '=', this.commanderId)
      .where('DecklistItem.cardId', '=', this.cardRow.id)
      .where('Tournament.size', '>=', this.filters.minEventSize)
      .where('Tournament.tournamentDate', '>=', minDate.toISOString())
      .selectAll('Entry')
      .select(['Tournament.tournamentDate', 'Tournament.size']);

    if (this.filters.maxStanding != null) {
      query = query.where('Entry.standing', '<=', this.filters.maxStanding);
    }

    if (after) {
      const cursor = CommanderEntriesCursor.fromString(after);
      if (this.sortBy === EntriesSortBy.NEW) {
        query = query.where(({eb, tuple, refTuple}) =>
          eb(
            refTuple('Tournament.tournamentDate', 'Entry.id'),
            '<',
            tuple(cursor.date, cursor.id),
          ),
        );
      } else {
        query = query.where(({eb, tuple, refTuple, and, or}) =>
          or([
            eb('standing', '>', cursor.standing),
            and([
              eb('standing', '=', cursor.standing),
              eb(
                refTuple('Tournament.size', 'Entry.id'),
                '<',
                tuple(cursor.size, cursor.id),
              ),
            ]),
          ]),
        );
      }
    }

    query = query.orderBy(
      this.sortBy === EntriesSortBy.NEW
        ? ['Tournament.tournamentDate desc', 'Entry.id desc']
        : ['Entry.standing asc', 'Tournament.size desc', 'Entry.id desc'],
    );

    const rows = await query.limit(first + 1).execute();

    const edges = rows.slice(0, first).map((r) => {
      const node = new Entry(r);
      const cursor = this.createCursor(node, r.tournamentDate, r.size);

      return {cursor, node};
    });

    return {
      edges,
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: rows.length > edges.length,
        startCursor: edges.at(0)?.cursor ?? null,
        endCursor: edges.at(-1)?.cursor ?? null,
      },
    };
  }
}

/** @gqlInput */
export interface CommanderStatsFilters {
  colorId?: string;
  minSize?: Int;
  minDate?: string;
  maxSize?: Int;
  maxDate?: string;
  timePeriod?: TimePeriod;
}

/** @gqlInput */
export interface EntriesFilter {
  timePeriod: TimePeriod;
  minEventSize: Int;
  maxStanding?: Int;
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

  /** @gqlField */
  async entries(
    first: Int = 20,
    after?: string | null,
    filters?: EntriesFilter | null,
    sortBy: EntriesSortBy = EntriesSortBy.TOP,
  ): Promise<Connection<Entry>> {
    const minEventSize = filters?.minEventSize ?? 60;
    const maxStanding = filters?.maxStanding ?? Number.MAX_SAFE_INTEGER;
    const minDate = minDateFromTimePeriod(
      filters?.timePeriod ?? TimePeriod.ALL_TIME,
    );

    let query = db
      .selectFrom('Entry')
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.commanderId', '=', this.id)
      .where('standing', '<=', maxStanding)
      .where('Tournament.tournamentDate', '>=', minDate.toISOString())
      .where('Tournament.size', '>=', minEventSize)
      .selectAll('Entry')
      .select(['Tournament.tournamentDate', 'Tournament.size']);

    if (after) {
      const cursor = CommanderEntriesCursor.fromString(after);
      if (sortBy === EntriesSortBy.NEW) {
        query = query.where(({eb, tuple, refTuple}) =>
          eb(
            refTuple('Tournament.tournamentDate', 'Entry.id'),
            '<',
            tuple(cursor.date, cursor.id),
          ),
        );
      } else {
        query = query.where(({eb, tuple, refTuple, and, or}) =>
          or([
            eb('standing', '>', cursor.standing),
            and([
              eb('standing', '=', cursor.standing),
              eb(
                refTuple('Tournament.size', 'Entry.id'),
                '<',
                tuple(cursor.size, cursor.id),
              ),
            ]),
          ]),
        );
      }
    }

    query = query.orderBy(
      sortBy === EntriesSortBy.NEW
        ? ['Tournament.tournamentDate desc', 'id desc']
        : ['Entry.standing asc', 'Tournament.size desc', 'id desc'],
    );

    const rows = await query.limit(first + 1).execute();

    const edges = rows.slice(0, first).map((r) => {
      const node = new Entry(r);
      const cursor = CommanderEntriesCursor.fromEntry(
        node,
        r.tournamentDate,
        r.size,
      ).toString();

      return {cursor, node};
    });

    return {
      edges,
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: rows.length > edges.length,
        startCursor: edges.at(0)?.cursor ?? null,
        endCursor: edges.at(-1)?.cursor ?? null,
      },
    };
  }

  /** @gqlField */
  async cards(commanderLoader: CommanderCardsLoader): Promise<Card[]> {
    return await commanderLoader.load(this.name);
  }

  /** @gqlField */
  async cardDetails(
    cardName?: string | null,
    filters?: EntriesFilter | null,
    sortBy: EntriesSortBy = EntriesSortBy.TOP,
  ): Promise<CommanderCardDetails | null> {
    if (!cardName) {
      return null;
    }

    const cardRow = await db
      .selectFrom('Card')
      .selectAll()
      .where('name', '=', cardName)
      .executeTakeFirst();

    if (!cardRow) {
      return null;
    }

    const normalizedFilters: CommanderCardFilters = {
      minEventSize: filters?.minEventSize ?? 60,
      timePeriod: filters?.timePeriod ?? TimePeriod.ONE_YEAR,
      maxStanding:
        filters?.maxStanding == null ? null : Number(filters.maxStanding),
    };

    return new CommanderCardDetails(
      this.id,
      cardRow,
      normalizedFilters,
      sortBy,
    );
  }

  /** @gqlField */
  async staples(): Promise<Card[]> {
    const oneYearAgo = subYears(new Date(), 1).toISOString();
    const {totalEntries} = await db
      .selectFrom('Entry')
      .select([(eb) => eb.fn.countAll<number>().as('totalEntries')])
      .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.commanderId', '=', this.id)
      .where('Tournament.tournamentDate', '>=', oneYearAgo)
      .executeTakeFirstOrThrow();

    const query = db
      .with('entries', (eb) => {
        return eb
          .selectFrom('DecklistItem')
          .leftJoin('Card', 'Card.id', 'DecklistItem.cardId')
          .leftJoin('Entry', 'Entry.id', 'DecklistItem.entryId')
          .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
          .where('Entry.commanderId', '=', this.id)
          .where('Tournament.tournamentDate', '>=', oneYearAgo)
          .groupBy('Card.id')
          .select((eb) => [
            eb.ref('Card.id').as('cardId'),
            eb(
              eb.cast(eb.fn.count<number>('Card.id'), 'real'),
              '/',
              totalEntries,
            ).as('playRateLastYear'),
          ]);
      })
      .selectFrom('Card')
      .leftJoin('entries', 'entries.cardId', 'Card.id')
      .where((eb) =>
        eb(
          eb.fn('json_extract', ['Card.data', sql`'$.type_line'`]),
          'not like',
          '%Land%',
        ),
      )
      .orderBy(
        (eb) =>
          eb('entries.playRateLastYear', '-', eb.ref('Card.playRateLastYear')),
        'desc',
      )
      .selectAll('Card');

    const rows = await query.limit(100).execute();
    return rows.map((r) => new Card(r));
  }

  /** @gqlField */
  promo(): FirstPartyPromo | undefined {
    return getActivePromotions({commander: this.name})[0];
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

  /** @gqlQueryField */
  static async commanders(
    first: Int = 20,
    after?: string | null,
    minEntries?: Int | null,
    minTournamentSize?: Int | null,
    timePeriod: TimePeriod = TimePeriod.ONE_MONTH,
    sortBy: CommandersSortBy = CommandersSortBy.CONVERSION,
    colorId?: string | null,
  ): Promise<Connection<Commander>> {
    const minDate = minDateFromTimePeriod(timePeriod);
    const minTournamentSizeValue = minTournamentSize || 0;
    const minEntriesValue = minEntries || 0;
    const sortByColumn =
      sortBy === CommandersSortBy.POPULARITY
        ? 'stats.count'
        : sortBy === CommandersSortBy.TOP_CUTS
          ? 'stats.topCuts'
          : 'stats.conversionRate';

    let query = db
      .with('stats', (eb) =>
        eb
          .selectFrom('Commander')
          .leftJoin('Entry', 'Entry.commanderId', 'Commander.id')
          .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
          .where('Tournament.tournamentDate', '>=', minDate.toISOString())
          .where('Tournament.size', '>=', minTournamentSizeValue)
          .groupBy('Commander.id')
          .select((eb) => [
            eb.ref('Commander.id').as('commanderId'),
            eb.fn.count('Entry.id').as('count'),
            eb.fn
              .sum(
                eb
                  .case()
                  .when('Entry.standing', '<=', eb.ref('Tournament.topCut'))
                  .then(1)
                  .else(0)
                  .end(),
              )
              .as('topCuts'),
            eb(
              eb.cast(
                eb.fn.sum(
                  eb
                    .case()
                    .when('Entry.standing', '<=', eb.ref('Tournament.topCut'))
                    .then(1)
                    .else(0)
                    .end(),
                ),
                'real',
              ),
              '/',
              eb.fn.count('Entry.id'),
            ).as('conversionRate'),
          ]),
      )
      .selectFrom('Commander')
      .selectAll('Commander')
      .leftJoin('stats', 'stats.commanderId', 'Commander.id')
      .where('Commander.name', '!=', 'Unknown Commander')
      .where('Commander.name', '!=', 'Nadu, Winged Wisdom')
      .where('stats.count', '>=', minEntriesValue);

    if (colorId) {
      query = query.where('Commander.colorId', '=', colorId);
    }

    if (after) {
      const {id} = fromGlobalId(after);
      query = query.where((eb) =>
        eb(
          eb.tuple(eb.ref(sortByColumn), eb.ref('Commander.id')),
          '<',
          eb.tuple(
            eb
              .selectFrom('stats')
              .select(sortByColumn)
              .where('commanderId', '=', Number(id)),
            Number(id),
          ),
        ),
      );
    }

    query = query
      .orderBy(sortByColumn, 'desc')
      .orderBy('Commander.id', 'desc')
      .limit(first + 1);

    const rows = await query.execute();

    const edges = rows.slice(0, first).map((r) => ({
      cursor: toGlobalId('Commander', r.id),
      node: new Commander(r),
    }));

    return {
      edges,
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: rows.length > edges.length,
        startCursor: edges.at(0)?.cursor ?? null,
        endCursor: edges.at(-1)?.cursor ?? null,
      },
    };
  }
}

class CommanderEntriesCursor {
  static fromString(cursor: string) {
    const [id, standing, date, size] = cursor.split(';');
    return new CommanderEntriesCursor(
      Number(id),
      Number(standing),
      date!,
      Number(size),
    );
  }

  static fromEntry(e: Entry, tournamentDate: string, tournamentSize: number) {
    return new CommanderEntriesCursor(
      e.id,
      e.standing,
      tournamentDate,
      tournamentSize,
    );
  }

  private constructor(
    readonly id: number,
    readonly standing: number,
    readonly date: string,
    readonly size: number,
  ) {}

  toString() {
    return [this.id, this.standing, this.date, this.size].join(';');
  }
}
