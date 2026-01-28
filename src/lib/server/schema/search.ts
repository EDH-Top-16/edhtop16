import {Float, Int} from 'grats';
import {db} from '../db';

/** @gqlType */
interface SearchResult {
  /** @gqlField */
  name: string;
  /** @gqlField */
  url: string;
  // Tournament-specific fields
  /** @gqlField */
  tournamentDate: string | null;
  /** @gqlField */
  size: Int | null;
  /** @gqlField */
  topdeckUrl: string | null;
  /** @gqlField */
  winnerName: string | null;
  // Commander-specific fields
  /** @gqlField */
  entries: Int | null;
  /** @gqlField */
  topCuts: Int | null;
  /** @gqlField */
  metaShare: Float | null;
}

/** @gqlEnum */
enum SearchResultType {
  COMMANDER = 'COMMANDER',
  TOURNAMENT = 'TOURNAMENT',
}

/** @gqlQueryField */
export async function searchResults(
  types: SearchResultType[],
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  if (types == null || types.includes(SearchResultType.COMMANDER)) {
    // Get total entries for meta share calculation
    const {totalEntries} = await db
      .selectFrom('Entry')
      .select((eb) => eb.fn.countAll<number>().as('totalEntries'))
      .executeTakeFirstOrThrow();

    const commanders = await db
      .selectFrom('Commander')
      .leftJoin('Entry', 'Entry.commanderId', 'Commander.id')
      .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .select([
        'Commander.name',
        (eb) => eb.fn.count<number>('Entry.id').as('entries'),
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
      ])
      .where('Commander.name', '!=', 'Unknown Commander')
      .where('Commander.name', '!=', '')
      .groupBy('Commander.id')
      .orderBy('entries', 'desc')
      .execute();

    for (const c of commanders) {
      results.push({
        name: c.name,
        url: '/commander/' + encodeURIComponent(c.name),
        tournamentDate: null,
        size: null,
        topdeckUrl: null,
        winnerName: null,
        entries: c.entries,
        topCuts: c.topCuts ?? 0,
        metaShare: totalEntries > 0 ? c.entries / totalEntries : 0,
      });
    }
  }

  if (types == null || types.includes(SearchResultType.TOURNAMENT)) {
    const tournaments = await db
      .selectFrom('Tournament')
      .leftJoin('Entry', (join) =>
        join
          .onRef('Entry.tournamentId', '=', 'Tournament.id')
          .on('Entry.standing', '=', 1),
      )
      .leftJoin('Player', 'Player.id', 'Entry.playerId')
      .select([
        'Tournament.name',
        'Tournament.TID',
        'Tournament.tournamentDate',
        'Tournament.size',
        'Player.name as winnerName',
      ])
      .orderBy('Tournament.tournamentDate desc')
      .orderBy('Tournament.size desc')
      .execute();

    for (const t of tournaments) {
      results.push({
        name: t.name,
        url: '/tournament/' + encodeURIComponent(t.TID),
        tournamentDate: t.tournamentDate,
        size: t.size,
        topdeckUrl: `https://topdeck.gg/event/${t.TID}`,
        winnerName: t.winnerName,
        entries: null,
        topCuts: null,
        metaShare: null,
      });
    }
  }

  return results;
}
