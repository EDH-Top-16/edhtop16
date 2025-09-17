import {DB} from '#genfiles/db/types';
import DataLoader from 'dataloader';
import {Float, Int} from 'grats';
import {sql} from 'kysely';
import {db} from '../db';
import {Commander, CommanderLoader} from './commander';
import {GraphQLNode} from './connection';
import {Entry} from './entry';
import {FirstPartyPromo, getActivePromotions} from './promo';
import {TimePeriod} from './types';
import {Context} from '../context';

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
  commander(commanderLoader: CommanderLoader): Promise<Commander> {
    return commanderLoader.load(this.commanderId as number);
  }
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

  constructor(private readonly row: DB['Tournament']) {
    this.id = row.id;
    this.TID = row.TID;
    this.name = row.name;
    this.size = row.size;
    this.swissRounds = row.swissRounds;
    this.topCut = row.topCut;
    this.tournamentDate = row.tournamentDate;
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
    const groups = await sql<TournamentBreakdownGroup>`
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

    return groups.rows;
  }

  /** @gqlField */
  promo(): FirstPartyPromo | undefined {
    return getActivePromotions({tid: this.TID})[0];
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

  // /** @gqlQueryField */
  // static async tournaments(
  //   search?: string,
  //   filters?: TournamentFilters,
  //   sortBy: TournamentSortBy = TournamentSortBy.DATE,
  // ): Connection<Tournament[]> {
  //   resolveOffsetConnection({args}, ({limit, offset}) => {
  //       let query = db.selectFrom('Tournament').selectAll();

  //       if (args.search) {
  //         query = query.where('name', 'like', `%${args.search}%`);
  //       }
  //       if (args.filters?.minSize) {
  //         query = query.where('size', '>=', args.filters.minSize);
  //       }
  //       if (args.filters?.maxSize) {
  //         query = query.where('size', '<=', args.filters.maxSize);
  //       }
  //       if (args.filters?.timePeriod || args.filters?.minDate) {
  //         const minDate =
  //           args.filters?.minDate != null
  //             ? new Date(args.filters?.minDate ?? 0)
  //             : minDateFromTimePeriod(args.filters?.timePeriod);

  //         query = query.where('tournamentDate', '>=', minDate.toISOString());
  //       }
  //       const maxDate = args.filters?.maxDate
  //         ? new Date(args.filters.maxDate)
  //         : new Date();
  //       query = query.where('tournamentDate', '<=', maxDate.toISOString());

  //       if (args.sortBy === 'PLAYERS') {
  //         query = query.orderBy(['size desc', 'tournamentDate desc']);
  //       } else {
  //         query = query.orderBy(['tournamentDate desc', 'size desc']);
  //       }

  //       return query.limit(limit).offset(offset).execute();
  //     }),
  // }
}
