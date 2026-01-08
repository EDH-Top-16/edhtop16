import {sql} from 'kysely';
import {db} from './db';

interface SearchResult {
  name: string;
  url: string;
}

export enum SearchResultType {
  COMMANDER = 'COMMANDER',
  TOURNAMENT = 'TOURNAMENT',
}

export async function searchResults(
  types: SearchResultType[],
): Promise<SearchResult[]> {
  const commandersQuery = db
    .selectFrom('Commander')
    .select((eb) => [
      eb.ref('Commander.name').as('name'),
      sql.lit('/commander/').as('prefix'),
      eb.ref('Commander.name').as('suffix'),
    ]);

  const tournamentsQuery = db
    .selectFrom('Tournament')
    .select((eb) => [
      eb.ref('Tournament.name').as('name'),
      sql.lit('/tournament/').as('prefix'),
      eb.ref('Tournament.TID').as('suffix'),
    ])
    .orderBy('Tournament.size desc');

  const queryParts: (typeof commandersQuery | typeof tournamentsQuery)[] = [];

  if (types == null || types.includes(SearchResultType.COMMANDER)) {
    queryParts.push(commandersQuery);
  }

  if (types == null || types.includes(SearchResultType.TOURNAMENT)) {
    queryParts.push(tournamentsQuery);
  }

  const results = await queryParts
    .reduce((acc, q) => acc.unionAll(q))
    .execute();

  return results.map((r) => ({
    name: r.name,
    url: r.prefix + encodeURIComponent(r.suffix),
  }));
}
