import {Float, Int} from 'grats';
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
      sql<number>`avg(case when MatchSeat.seatNumber = 1 then cast(MatchSeat.isWinner as real) end)`.as(
        'seatWinRate1',
      ),
      sql<number>`avg(case when MatchSeat.seatNumber = 2 then cast(MatchSeat.isWinner as real) end)`.as(
        'seatWinRate2',
      ),
      sql<number>`avg(case when MatchSeat.seatNumber = 3 then cast(MatchSeat.isWinner as real) end)`.as(
        'seatWinRate3',
      ),
      sql<number>`avg(case when MatchSeat.seatNumber = 4 then cast(MatchSeat.isWinner as real) end)`.as(
        'seatWinRate4',
      ),
      sql<number>`avg(cast(MatchSeat.isDraw as real))`.as('drawRate'),
    ])
    .groupBy('Tournament.country')
    .having(sql`count(distinct Tournament.id)`, '>=', minTournaments)
    .execute();

  return rows as CountrySeatWinRate[];
}
