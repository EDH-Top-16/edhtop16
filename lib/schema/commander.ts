import {DB} from '@/genfiles/db/types';
import {subYears} from 'date-fns';
import {fromGlobalId, toGlobalId} from 'graphql-relay';
import {Selectable, sql} from 'kysely';
import {Card} from './card';
import {Connection} from './connection';
import {db} from './db';
import {Entry} from './entry';
import {FirstPartyPromo, getActivePromotions} from './promo';
import {minDateFromTimePeriod, TimePeriod} from './types';
import {
  CommanderCalculatedStats,
  CommanderStatsFilters,
  ViewerContext,
} from './ViewerContext';

export enum CommandersSortBy {
  POPULARITY = 'POPULARITY',
  CONVERSION = 'CONVERSION',
  TOP_CUTS = 'TOP_CUTS',
}

export enum EntriesSortBy {
  NEW = 'NEW',
  TOP = 'TOP',
}

export interface EntriesFilter {
  timePeriod: TimePeriod;
  minEventSize: number;
  maxStanding?: number;
}

interface CommanderCardStats {
  totalEntries: number;
  topCuts: number;
  conversionRate: number;
}

interface CommanderCardWinrateStats {
  withCard: CommanderCardStats;
  withoutCard: CommanderCardStats;
}

export type ClientCommander = ReturnType<Commander['toClient']>;

export class Commander implements Selectable<DB['Commander']> {
  readonly id;
  readonly name;
  readonly colorId;

  constructor(
    private readonly vc: ViewerContext,
    row: Selectable<DB['Commander']>,
  ) {
    this.id = row.id;
    this.name = row.name;
    this.colorId = row.colorId;
  }

  breakdownUrl(): string {
    return `/commander/${encodeURIComponent(this.name)}`;
  }

  async entries(
    first: number = 20,
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
      const node = new Entry(this.vc, r);
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

  async cards(): Promise<Card[]> {
    const cards = await this.vc.commanderCardsLoader.load(this.name);
    return cards.map((c) => new Card(this.vc, c));
  }

  async cardDetail(cardName: string): Promise<Card> {
    const card = await db
      .selectFrom('Card')
      .where('name', '=', cardName)
      .selectAll()
      .executeTakeFirstOrThrow();

    return new Card(this.vc, card);
  }

  async cardWinrateStats(
    cardName: string,
    timePeriod: TimePeriod = TimePeriod.THREE_MONTHS,
  ): Promise<CommanderCardWinrateStats> {
    const minDate = minDateFromTimePeriod(timePeriod);

    // Get the card ID
    const card = await db
      .selectFrom('Card')
      .where('name', '=', cardName)
      .select('id')
      .executeTakeFirstOrThrow();

    // Entries with the card
    const withCardStats = await db
      .selectFrom('Entry')
      .innerJoin('DecklistItem', 'DecklistItem.entryId', 'Entry.id')
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.commanderId', '=', this.id)
      .where('DecklistItem.cardId', '=', card.id)
      .where('Tournament.tournamentDate', '>=', minDate.toISOString())
      .select((eb) => [
        eb.fn.count<number>('Entry.id').as('totalEntries'),
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
      ])
      .executeTakeFirstOrThrow();

    // Entries without the card
    const withoutCardStats = await db
      .selectFrom('Entry')
      .leftJoin('DecklistItem', (join) =>
        join
          .onRef('DecklistItem.entryId', '=', 'Entry.id')
          .on('DecklistItem.cardId', '=', card.id),
      )
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.commanderId', '=', this.id)
      .where('DecklistItem.cardId', 'is', null)
      .where('Tournament.tournamentDate', '>=', minDate.toISOString())
      .select((eb) => [
        eb.fn.count<number>('Entry.id').as('totalEntries'),
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
      ])
      .executeTakeFirstOrThrow();

    return {
      withCard: {
        totalEntries: withCardStats.totalEntries,
        topCuts: withCardStats.topCuts || 0,
        conversionRate:
          withCardStats.totalEntries > 0
            ? (withCardStats.topCuts || 0) / withCardStats.totalEntries
            : 0,
      },
      withoutCard: {
        totalEntries: withoutCardStats.totalEntries,
        topCuts: withoutCardStats.topCuts || 0,
        conversionRate:
          withoutCardStats.totalEntries > 0
            ? (withoutCardStats.topCuts || 0) / withoutCardStats.totalEntries
            : 0,
      },
    };
  }

  async cardEntries(
    cardName?: string | null,
    first: number = 20,
    after?: string | null,
    sortBy: EntriesSortBy = EntriesSortBy.TOP,
  ): Promise<Connection<Entry>> {
    if (!cardName) {
      return {
        edges: [],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }
    const card = await db
      .selectFrom('Card')
      .where('name', '=', cardName)
      .select('id')
      .executeTakeFirst();

    if (!card) {
      return {
        edges: [],
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    let query = db
      .selectFrom('Entry')
      .innerJoin('DecklistItem', 'DecklistItem.entryId', 'Entry.id')
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.commanderId', '=', this.id)
      .where('DecklistItem.cardId', '=', card.id)
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
      const node = new Entry(this.vc, r);
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
      .selectAll('Card')
      .select('entries.playRateLastYear as commanderPlayRate');

    const rows = await query.limit(100).execute();
    return rows.map(
      (r) =>
        // TODO(@ryan): probably want to check this casting to see if it's the right thing to do
        // Assuming we need null bc it's a left join? I also have the card constructor
        // accpet `null`, but convert that to `undefined`
        new Card(this.vc, r, {
          playRateOverride: r.commanderPlayRate as number | null,
        }),
    );
  }

  promo(): FirstPartyPromo | undefined {
    return getActivePromotions({commander: this.name})[0];
  }

  async stats(
    filters: CommanderStatsFilters,
  ): Promise<CommanderCalculatedStats> {
    return await this.vc.commanderStatsLoader(filters).load(this.id);
  }

  static async commander(vc: ViewerContext, name: string): Promise<Commander> {
    const c = await db
      .selectFrom('Commander')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();

    return new Commander(vc, c);
  }

  static async commanders(
    vc: ViewerContext,
    first: number = 20,
    after?: string | null,
    minEntries?: number | null,
    minTournamentSize?: number | null,
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
      node: new Commander(vc, r),
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

  toClient() {
    return {
      ['&brand']: 'client',
      id: this.id,
      name: this.name,
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
