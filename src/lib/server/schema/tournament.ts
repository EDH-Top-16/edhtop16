import {DB} from '#genfiles/db/types';
import DataLoader from 'dataloader';
import {Float, Int} from 'grats';
import {Selectable, sql} from 'kysely';
import {Context} from '../context';
import {db} from '../db';
import {Commander, CommanderLoader} from './commander';
import {Connection, GraphQLNode} from './connection';
import {Entry} from './entry';
import {FirstPartyPromo, getActivePromotions} from './promo';
import {minDateFromTimePeriod, TimePeriod} from './types';

export type TournamentLoader = DataLoader<number, Tournament>;

/** @gqlContext */
export function createTournamentLoader(ctx: Context): TournamentLoader {
  return ctx.loader(
    'TournamentLoader',
    async (tournamentIds: readonly number[]) => {
      const tournaments = await db
        .selectFrom('Tournament')
        .where('id', 'in', tournamentIds)
        .selectAll()
        .execute();

      const tournamentById = new Map<number, Tournament>();
      for (const t of tournaments) {
        tournamentById.set(t.id, new Tournament(t));
      }

      return tournamentIds.map(
        (id) =>
          tournamentById.get(id) ??
          new Error(`Could not load tournament: ${id}`),
      );
    },
  );
}

/** @gqlEnum */
export enum TournamentSortBy {
  PLAYERS = 'PLAYERS',
  DATE = 'DATE',
}

/** @gqlInput */
export interface TournamentFilters {
  timePeriod?: TimePeriod;
  minDate?: string;
  maxDate?: string;
  minSize?: Int;
  maxSize?: Int;
}

/** @gqlType */
export class TournamentBreakdownGroup {
  constructor(
    /** @gqlField */
    readonly commanderId: Int,
    /** @gqlField */
    readonly topCuts: Int,
    /** @gqlField */
    readonly entries: Int,
    /** @gqlField */
    readonly conversionRate: Float,
  ) {}

  /** @gqlField */
  async commander(commanderLoader: CommanderLoader): Promise<Commander> {
    const result = await commanderLoader.load(this.commanderId as number);
    if (result instanceof Error) {
      throw result;
    }
    return result;
  }
}

/** @gqlType */
export class SeatWinRates {
  constructor(
    /** @gqlField */
    readonly seat1: Float | null,
    /** @gqlField */
    readonly seat2: Float | null,
    /** @gqlField */
    readonly seat3: Float | null,
    /** @gqlField */
    readonly seat4: Float | null,
    /** @gqlField */
    readonly drawRate: Float | null,
  ) {}
}

/** @gqlType */
export class SeatWinRatesByPhase {
  constructor(
    /** @gqlField */
    readonly all: SeatWinRates,
    /** @gqlField */
    readonly swiss: SeatWinRates,
    /** @gqlField */
    readonly topCut: SeatWinRates,
    /** @gqlField */
    readonly finals: SeatWinRates,
  ) {}
}

function computeSeatWinRates(
  rows: {seatNumber: number; isWinner: number; isDraw: number}[],
): SeatWinRates {
  let c0 = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0;
  let w0 = 0,
    w1 = 0,
    w2 = 0,
    w3 = 0;
  let drawCount = 0;
  let totalForDrawRate = 0;

  for (const r of rows) {
    switch (r.seatNumber) {
      case 0:
        c0++;
        if (r.isWinner) w0++;
        totalForDrawRate++;
        if (r.isDraw) drawCount++;
        break;
      case 1:
        c1++;
        if (r.isWinner) w1++;
        break;
      case 2:
        c2++;
        if (r.isWinner) w2++;
        break;
      case 3:
        c3++;
        if (r.isWinner) w3++;
        break;
    }
  }

  return new SeatWinRates(
    c0 > 0 ? w0 / c0 : null,
    c1 > 0 ? w1 / c1 : null,
    c2 > 0 ? w2 / c2 : null,
    c3 > 0 ? w3 / c3 : null,
    totalForDrawRate > 0 ? drawCount / totalForDrawRate : null,
  );
}

/** @gqlType */
export class Tournament implements GraphQLNode {
  id;
  __typename = 'Tournament' as const;

  /** @gqlField */
  TID: string;
  /** @gqlField */
  name: string;
  /** @gqlField */
  size: Int;
  /** @gqlField */
  swissRounds: Int;
  /** @gqlField */
  topCut: Int;
  /** @gqlField */
  tournamentDate: string;

  /** @gqlField */
  seatWinRate1: Float | null;
  /** @gqlField */
  seatWinRate2: Float | null;
  /** @gqlField */
  seatWinRate3: Float | null;
  /** @gqlField */
  seatWinRate4: Float | null;
  /** @gqlField */
  drawRate: Float | null;

  constructor(private readonly row: Selectable<DB['Tournament']>) {
    this.id = row.id;
    this.TID = row.TID;
    this.name = row.name;
    this.size = row.size;
    this.swissRounds = row.swissRounds;
    this.topCut = row.topCut;
    this.tournamentDate = row.tournamentDate;
    this.seatWinRate1 = row.seatWinRate1 ?? null;
    this.seatWinRate2 = row.seatWinRate2 ?? null;
    this.seatWinRate3 = row.seatWinRate3 ?? null;
    this.seatWinRate4 = row.seatWinRate4 ?? null;
    this.drawRate = row.drawRate ?? null;
  }

  /** @gqlField */
  async entries(
    commander?: string | null,
    maxStanding?: Int | null,
  ): Promise<Entry[]> {
    let query = db
      .selectFrom('Entry')
      .leftJoin('Commander', 'Commander.id', 'Entry.commanderId')
      .selectAll('Entry')
      .where('Entry.tournamentId', '=', this.id);

    if (maxStanding != null) {
      query = query.where('Entry.standing', '<=', maxStanding);
    }
    if (commander != null) {
      query = query.where('Commander.name', '=', commander);
    }

    const rows = await query.orderBy('standing asc').execute();
    return rows.map((r) => new Entry(r));
  }

  /** @gqlField */
  bracketUrl(): string {
    return this.row.bracketUrl ?? `https://topdeck.gg/bracket/${this.TID}`;
  }

  /** @gqlField */
  async breakdown(): Promise<TournamentBreakdownGroup[]> {
    const groups = await sql<{
      commanderId: number;
      topCuts: number;
      entries: number;
      conversionRate: number;
    }>`
      select
        e."commanderId",
        count(e."commanderId") as entries,
        sum(case when e.standing <= t."topCut" then 1 else 0 end) as "topCuts",
        sum(case when e.standing <= t."topCut" then 1.0 else 0.0 end) / count(e.id) as "conversionRate"
      from "Entry" as e
      left join "Tournament" t on t.id = e."tournamentId"
      left join "Commander" c on c.id = e."commanderId"
      where t."id" = ${this.id}
      and c.name != 'Unknown Commander'
      and c.name != ''
      group by e."commanderId"
      order by "topCuts" desc, entries desc
    `.execute(db);

    return groups.rows.map(
      (r) =>
        new TournamentBreakdownGroup(
          r.commanderId,
          r.topCuts,
          r.entries,
          r.conversionRate,
        ),
    );
  }

  /** @gqlField */
  async seatWinRatesByPhase(): Promise<SeatWinRatesByPhase> {
    const rows = await db
      .selectFrom('MatchSeat')
      .innerJoin('Entry', 'Entry.id', 'MatchSeat.entryId')
      .select([
        'MatchSeat.round',
        'MatchSeat.seatNumber',
        'MatchSeat.isWinner',
        'MatchSeat.isDraw',
      ])
      .where('Entry.tournamentId', '=', this.id)
      .where('MatchSeat.isBye', '=', 0)
      .execute();

    const swissRows = rows.filter((r) => !r.round.startsWith('Top'));
    const topCutRows = rows.filter((r) => r.round.startsWith('Top'));
    const finalsRows = rows.filter((r) => r.round === 'Top 4');

    return new SeatWinRatesByPhase(
      computeSeatWinRates(rows),
      computeSeatWinRates(swissRows),
      computeSeatWinRates(topCutRows),
      computeSeatWinRates(finalsRows),
    );
  }

  /** @gqlField */
  promo(): FirstPartyPromo | undefined {
    return getActivePromotions({tid: this.TID})[0];
  }

  /** @gqlField */
  editorsNote(): string | undefined {
    return TOURNAMENT_NOTES.get(this.TID);
  }

  /** @gqlQueryField */
  static async tournament(TID: string): Promise<Tournament> {
    const row = await db
      .selectFrom('Tournament')
      .selectAll()
      .where('TID', '=', TID)
      .executeTakeFirstOrThrow();

    return new Tournament(row);
  }

  /** @gqlQueryField */
  static async tournaments(
    first: Int = 20,
    after?: string | null,
    filters?: TournamentFilters | null,
    sortBy: TournamentSortBy = TournamentSortBy.DATE,
  ): Promise<Connection<Tournament>> {
    let query = db.selectFrom('Tournament').selectAll();

    if (filters?.minSize) {
      query = query.where('size', '>=', filters.minSize);
    }
    if (filters?.maxSize) {
      query = query.where('size', '<=', filters.maxSize);
    }
    if (filters?.timePeriod || filters?.minDate) {
      const minDateValue =
        filters?.minDate != null
          ? new Date(filters.minDate)
          : minDateFromTimePeriod(filters?.timePeriod);

      query = query.where('tournamentDate', '>=', minDateValue.toISOString());
    }
    const maxDateValue = filters?.maxDate
      ? new Date(filters.maxDate)
      : new Date();
    query = query.where('tournamentDate', '<=', maxDateValue.toISOString());

    if (after) {
      const cursor = TournamentsCursor.fromString(after);
      if (sortBy === TournamentSortBy.PLAYERS) {
        query = query.where((eb) =>
          eb(
            eb.refTuple('size', 'tournamentDate', 'id'),
            '<',
            eb.tuple(cursor.size, cursor.date, cursor.id),
          ),
        );
      } else {
        query = query.where((eb) =>
          eb(
            eb.refTuple('tournamentDate', 'size', 'id'),
            '<',
            eb.tuple(cursor.date, cursor.size, cursor.id),
          ),
        );
      }
    }

    if (sortBy === TournamentSortBy.PLAYERS) {
      query = query.orderBy(['size desc', 'tournamentDate desc', 'id desc']);
    } else {
      query = query.orderBy(['tournamentDate desc', 'size desc', 'id desc']);
    }

    const rows = await query.limit(first + 1).execute();

    const edges = rows.slice(0, first).map((r) => {
      const node = new Tournament(r);
      const cursor = TournamentsCursor.fromTournament(node).toString();
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

class TournamentsCursor {
  static fromString(cursor: string) {
    const [id, size, date] = cursor.split(';');
    return new TournamentsCursor(Number(id), Number(size), date!);
  }

  static fromTournament(t: Tournament) {
    return new TournamentsCursor(t.id, t.size, t.tournamentDate);
  }

  private constructor(
    readonly id: number,
    readonly size: number,
    readonly date: string,
  ) {}

  toString() {
    return [this.id, this.size, this.date].join(';');
  }
}

/** EDHTop16's editors notes for a specific tournament. */
const TOURNAMENT_NOTES = new Map<string, string>([]);
