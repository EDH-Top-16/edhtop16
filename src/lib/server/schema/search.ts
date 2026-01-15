import {Int} from 'grats';
import {db} from '../db';

/** @gqlType */
interface SearchResult {
  /** @gqlField */
  name: string;
  /** @gqlField */
  url: string;
  /** @gqlField */
  tournamentDate: string | null;
  /** @gqlField */
  size: Int | null;
  /** @gqlField */
  topdeckUrl: string | null;
  /** @gqlField */
  winnerName: string | null;
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
    const commanders = await db
      .selectFrom('Commander')
      .select(['Commander.name'])
      .execute();

    for (const c of commanders) {
      results.push({
        name: c.name,
        url: '/commander/' + encodeURIComponent(c.name),
        tournamentDate: null,
        size: null,
        topdeckUrl: null,
        winnerName: null,
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
      });
    }
  }

  return results;
}
