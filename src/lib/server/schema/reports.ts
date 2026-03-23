import {Float, Int, ID} from 'grats';
import {sql} from 'kysely';
import {db} from '../db';

/** @gqlType */
interface CountrySeatWinRate {
  /** @gqlField */
  country: string;
  /** @gqlField */
  tournaments: Int;
  /** @gqlField */
  seatWinRate1: Float;
  /** @gqlField */
  seatWinRate2: Float;
  /** @gqlField */
  seatWinRate3: Float;
  /** @gqlField */
  seatWinRate4: Float;
  /** @gqlField */
  drawRate: Float;
}

/** @gqlType */
class MonthlySeatWinRate {
  /** @gqlField */
  id: ID;
  /** @gqlField */
  month: string;
  /** @gqlField */
  games: Int;
  /** @gqlField */
  seatWinRate1: Float;
  /** @gqlField */
  seatWinRate2: Float;
  /** @gqlField */
  seatWinRate3: Float;
  /** @gqlField */
  seatWinRate4: Float;
  /** @gqlField */
  drawRate: Float;

  constructor(
    data: {
      month: string;
      games: Int;
      seatWinRate1: Float;
      seatWinRate2: Float;
      seatWinRate3: Float;
      seatWinRate4: Float;
      drawRate: Float;
    },
    commanderName?: string | null,
    phase?: string | null,
  ) {
    const parts = [data.month];
    if (commanderName) parts.push(commanderName);
    if (phase && phase !== 'ALL_ROUNDS') parts.push(phase);
    this.id = parts.join(':');
    this.month = data.month;
    this.games = data.games;
    this.seatWinRate1 = data.seatWinRate1;
    this.seatWinRate2 = data.seatWinRate2;
    this.seatWinRate3 = data.seatWinRate3;
    this.seatWinRate4 = data.seatWinRate4;
    this.drawRate = data.drawRate;
  }
}

/** @gqlEnum */
type TournamentPhase = 'ALL_ROUNDS' | 'SWISS' | 'TOP_CUT' | 'FINALS';

/** @gqlQueryField */
export async function monthlySeatWinRates(
  args: {
    commanderName?: string | null;
    phase?: TournamentPhase | null;
  } = {},
): Promise<MonthlySeatWinRate[]> {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  let query = db
    .selectFrom('MatchSeat')
    .innerJoin('Entry', 'Entry.id', 'MatchSeat.entryId')
    .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
    .where('MatchSeat.isBye', '=', 0)
    .where('Tournament.tournamentDate', '>=', '2024-03-01')
    .where(
      sql`strftime('%Y-%m', Tournament.tournamentDate)`,
      '<',
      currentMonth,
    );

  if (args.commanderName) {
    query = query
      .innerJoin('Commander', 'Commander.id', 'Entry.commanderId')
      .where('Commander.name', '=', args.commanderName);
  }

  const phase = args.phase ?? 'ALL_ROUNDS';
  if (phase === 'SWISS') {
    query = query.where('MatchSeat.round', 'not like', 'Top%');
  } else if (phase === 'TOP_CUT') {
    query = query.where('MatchSeat.round', 'like', 'Top%');
  } else if (phase === 'FINALS') {
    query = query.where('MatchSeat.round', '=', 'Top 4');
  }

  const rows = await query
    .select([
      sql<string>`strftime('%Y-%m', Tournament.tournamentDate)`.as('month'),
      sql<number>`count(*)`.as('games'),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 0 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate1',
      ),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 1 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate2',
      ),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 2 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate3',
      ),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 3 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate4',
      ),
      sql<number>`coalesce(avg(cast(MatchSeat.isDraw as real)), 0)`.as(
        'drawRate',
      ),
    ])
    .groupBy(sql`strftime('%Y-%m', Tournament.tournamentDate)`)
    .orderBy(sql`strftime('%Y-%m', Tournament.tournamentDate)`, 'asc')
    .execute();

  return rows.map(
    (row) => new MonthlySeatWinRate(row, args.commanderName, args.phase),
  );
}

/** @gqlQueryField */
export async function countrySeatWinRates(args: {
  minTournaments?: Int | null;
}): Promise<CountrySeatWinRate[]> {
  const minTournaments = args.minTournaments ?? 5;

  const rows = await db
    .selectFrom('MatchSeat')
    .innerJoin('Entry', 'Entry.id', 'MatchSeat.entryId')
    .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
    .where('Tournament.country', 'is not', null)
    .where('MatchSeat.isBye', '=', 0)
    .select([
      'Tournament.country',
      sql<number>`count(distinct Tournament.id)`.as('tournaments'),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 0 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate1',
      ),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 1 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate2',
      ),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 2 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate3',
      ),
      sql<number>`coalesce(avg(case when MatchSeat.seatNumber = 3 then cast(MatchSeat.isWinner as real) end), 0)`.as(
        'seatWinRate4',
      ),
      sql<number>`coalesce(avg(cast(MatchSeat.isDraw as real)), 0)`.as(
        'drawRate',
      ),
    ])
    .groupBy('Tournament.country')
    .having(sql`count(distinct Tournament.id)`, '>=', minTournaments)
    .execute();

  return rows.flatMap((row) =>
    row.country != null
      ? [
          {
            country: row.country,
            tournaments: row.tournaments,
            seatWinRate1: row.seatWinRate1,
            seatWinRate2: row.seatWinRate2,
            seatWinRate3: row.seatWinRate3,
            seatWinRate4: row.seatWinRate4,
            drawRate: row.drawRate,
          },
        ]
      : [],
  );
}
