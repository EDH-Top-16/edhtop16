import {DB} from '@/genfiles/db/types';
import {Selectable, sql} from 'kysely';
import {Commander} from './commander';
import {Connection} from './connection';
import {db} from './db';
import {Entry} from './entry';
import {FirstPartyPromo, getActivePromotions} from './promo';
import {minDateFromTimePeriod, TimePeriod} from './types';
import {ViewerContext} from './ViewerContext';

export enum TournamentSortBy {
  PLAYERS = 'PLAYERS',
  DATE = 'DATE',
}

export interface TournamentFilters {
  timePeriod?: TimePeriod;
  minDate?: string;
  maxDate?: string;
  minSize?: number;
  maxSize?: number;
}

export class TournamentBreakdownGroup {
  constructor(
    private readonly vc: ViewerContext,
    readonly commanderId: number,
    readonly topCuts: number,
    readonly entries: number,
    readonly conversionRate: number,
  ) {}

  async commander(): Promise<Commander> {
    const commander = await this.vc.commanderLoader.load(
      this.commanderId as number,
    );

    return new Commander(this.vc, commander);
  }
}

export class Tournament implements Selectable<DB['Tournament']> {
  readonly id;
  readonly TID: string;
  readonly name: string;
  readonly size: number;
  readonly swissRounds: number;
  readonly topCut: number;
  readonly tournamentDate: string;

  constructor(
    private readonly vc: ViewerContext,
    private readonly row: Selectable<DB['Tournament']>,
  ) {
    this.id = row.id;
    this.TID = row.TID;
    this.name = row.name;
    this.size = row.size;
    this.swissRounds = row.swissRounds;
    this.topCut = row.topCut;
    this.tournamentDate = row.tournamentDate;
  }

  async entries(
    commander?: string | null,
    maxStanding?: number | null,
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
    return rows.map((r) => new Entry(this.vc, r));
  }

  get bracketUrl(): string {
    return this.row.bracketUrl ?? `https://topdeck.gg/bracket/${this.TID}`;
  }

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
      group by e."commanderId"
      order by "topCuts" desc, entries desc
    `.execute(db);

    return groups.rows.map(
      (r) =>
        new TournamentBreakdownGroup(
          this.vc,
          r.commanderId,
          r.topCuts,
          r.entries,
          r.conversionRate,
        ),
    );
  }

  /** @gqlField */
  promo(): FirstPartyPromo | undefined {
    return getActivePromotions({tid: this.TID})[0];
  }

  static async tournament(vc: ViewerContext, TID: string): Promise<Tournament> {
    const row = await db
      .selectFrom('Tournament')
      .selectAll()
      .where('TID', '=', TID)
      .executeTakeFirstOrThrow();

    return new Tournament(vc, row);
  }

  static async tournaments(
    vc: ViewerContext,
    first: number = 20,
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
        query = query.where(({eb, tuple, refTuple}) =>
          eb(
            refTuple('size', 'tournamentDate', 'id'),
            '<',
            tuple(cursor.size, cursor.date, cursor.id),
          ),
        );
      } else {
        query = query.where(({eb, tuple, refTuple}) =>
          eb(
            refTuple('tournamentDate', 'size', 'id'),
            '<',
            tuple(cursor.date, cursor.size, cursor.id),
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
      const node = new Tournament(vc, r);
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
