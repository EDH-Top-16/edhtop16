import {sql} from 'kysely';
import {db} from '../db';
import {builder} from './builder';

const SearchResult = builder
  .objectRef<{name: string; url: string}>('SearchResult')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name'),
      url: t.exposeString('url'),
    }),
  });

const SearchResultType = builder.enumType('SearchResultType', {
  values: ['COMMANDER', 'TOURNAMENT'] as const,
});

builder.queryField('searchResults', (t) =>
  t.field({
    type: t.listRef(SearchResult),
    args: {types: t.arg({type: [SearchResultType]})},
    resolve: async (_root, {types}) => {
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

      const queryParts: (typeof commandersQuery | typeof tournamentsQuery)[] =
        [];

      if (types == null || types.includes('COMMANDER')) {
        queryParts.push(commandersQuery);
      }

      if (types == null || types.includes('TOURNAMENT')) {
        queryParts.push(tournamentsQuery);
      }

      const results = await queryParts
        .reduce((acc, q) => acc.unionAll(q))
        .execute();

      return results.map((r) => ({
        name: r.name,
        url: r.prefix + encodeURIComponent(r.suffix),
      }));
    },
  }),
);
