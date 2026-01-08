import {DB} from '@/genfiles/db/types';
import DataLoader from 'dataloader';
import {Selectable} from 'kysely';
import {db} from './db';
import {minDateFromTimePeriod, TimePeriod} from './types';
import {cache} from 'react';
import {cookies} from 'next/headers';

import 'server-only';

export interface CommanderStatsFilters {
  colorId?: string;
  minSize?: number;
  minDate?: string;
  maxSize?: number;
  maxDate?: string;
  timePeriod?: TimePeriod;
}

export interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
  metaShare: number;
}

const LIST_STYLE_COOKIE_NAME = 'edhtop16ListStyle';
export type ListStyle = 'table' | 'card';

export class ViewerContext {
  static readonly forRequest = cache(async () => {
    const listStyle = (await cookies()).get(LIST_STYLE_COOKIE_NAME)?.value;
    return new ViewerContext(listStyle === 'table' ? 'table' : 'card');
  });

  private constructor(readonly listStyle: ListStyle) {}

  async updateListStyle(listStyle: ListStyle) {
    (await cookies()).set(LIST_STYLE_COOKIE_NAME, listStyle);
  }

  readonly tournamentLoader: DataLoader<number, Selectable<DB['Tournament']>> =
    new DataLoader(async (tournamentIds: readonly number[]) => {
      const tournaments = await db
        .selectFrom('Tournament')
        .where('id', 'in', tournamentIds)
        .selectAll()
        .execute();

      const tournamentById = new Map<number, Selectable<DB['Tournament']>>();
      for (const t of tournaments) {
        tournamentById.set(t.id, t);
      }

      return tournamentIds.map(
        (id) =>
          tournamentById.get(id) ??
          new Error(`Could not load tournament: ${id}`),
      );
    });

  readonly playerLoader: DataLoader<number, Selectable<DB['Player']>> =
    new DataLoader(async (playerIds: readonly number[]) => {
      const rows = await db
        .selectFrom('Player')
        .where('id', 'in', playerIds)
        .selectAll()
        .execute();

      const playerById = new Map<number, Selectable<DB['Player']>>();
      for (const r of rows) {
        playerById.set(r.id, r);
      }

      return playerIds.map(
        (id) => playerById.get(id) ?? new Error(`Could not load player: ${id}`),
      );
    });

  readonly entryLoader: DataLoader<number, Selectable<DB['Entry']>> =
    new DataLoader(async (entryIds: readonly number[]) => {
      const entries = await db
        .selectFrom('Entry')
        .where('id', 'in', entryIds)
        .selectAll()
        .execute();

      const entryById = new Map<number, Selectable<DB['Entry']>>();
      for (const e of entries) {
        entryById.set(e.id, e);
      }

      return entryIds.map(
        (id) => entryById.get(id) ?? new Error(`Could not load entry: ${id}`),
      );
    });

  readonly commanderLoader: DataLoader<number, Selectable<DB['Commander']>> =
    new DataLoader(async (commanderIds: readonly number[]) => {
      const commanders = await db
        .selectFrom('Commander')
        .where('id', 'in', commanderIds)
        .selectAll()
        .execute();

      const commanderById = new Map<number, Selectable<DB['Commander']>>();
      for (const c of commanders) {
        commanderById.set(c.id, c);
      }

      return commanderIds.map(
        (id) =>
          commanderById.get(id) ?? new Error(`Could not load commander: ${id}`),
      );
    });

  readonly commanderCardsLoader: DataLoader<string, Selectable<DB['Card']>[]> =
    new DataLoader(async (commanders: readonly string[]) => {
      if (commanders.length === 0) return [];

      const names = commanders.map((c) =>
        c === 'Unknown Commander' ? [] : c.split(' / '),
      );

      const cards = await db
        .selectFrom('Card')
        .selectAll()
        .where('name', 'in', names.flat())
        .execute();

      const cardByName = new Map<string, Selectable<DB['Card']>>();
      for (const card of cards) {
        cardByName.set(card.name, card);
      }

      return names.map((ns) =>
        ns.map((n) => cardByName.get(n)!).filter(Boolean),
      );
    });

  readonly cardLoader: DataLoader<number, Selectable<DB['Card']>> =
    new DataLoader(async (cardIds: readonly number[]) => {
      const cards = await db
        .selectFrom('Card')
        .where('id', 'in', cardIds)
        .selectAll()
        .execute();

      const cardById = new Map<number, Selectable<DB['Card']>>();
      for (const c of cards) {
        cardById.set(c.id, c);
      }

      return cardIds.map(
        (id) => cardById.get(id) ?? new Error(`Could not load card: ${id}`),
      );
    });

  private readonly statsLoaderForFilters = new Map<
    string,
    DataLoader<number, CommanderCalculatedStats>
  >();

  commanderStatsLoader(
    filters: CommanderStatsFilters,
  ): DataLoader<number, CommanderCalculatedStats> {
    const filtersJson = JSON.stringify(filters);
    if (this.statsLoaderForFilters.has(filtersJson)) {
      return this.statsLoaderForFilters.get(filtersJson)!;
    }

    const loader = new DataLoader<number, CommanderCalculatedStats>(
      async (commanderIds) => {
        const minSize = filters?.minSize ?? 0;
        const maxSize = filters?.maxSize ?? 1_000_000;
        const maxDate = filters?.maxDate
          ? new Date(filters.maxDate)
          : new Date();
        const minDate =
          filters?.minDate != null
            ? new Date(filters?.minDate ?? 0)
            : minDateFromTimePeriod(filters?.timePeriod);

        const [entriesQuery, statsQuery] = await Promise.all([
          db
            .selectFrom('Entry')
            .select((eb) => eb.fn.countAll<number>().as('totalEntries'))
            .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
            .where('Tournament.size', '>=', minSize)
            .where('Tournament.size', '<=', maxSize)
            .where('Tournament.tournamentDate', '>=', minDate.toISOString())
            .where('Tournament.tournamentDate', '<=', maxDate.toISOString())
            .executeTakeFirstOrThrow(),
          db
            .selectFrom('Commander')
            .leftJoin('Entry', 'Entry.commanderId', 'Commander.id')
            .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
            .select([
              'Commander.id',
              'Commander.name',
              'Commander.colorId',
              (eb) => eb.fn.count<number>('Commander.id').as('count'),
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
              (eb) =>
                eb(
                  eb.cast<number>(
                    eb.fn.sum<number>(
                      eb
                        .case()
                        .when(
                          'Entry.standing',
                          '<=',
                          eb.ref('Tournament.topCut'),
                        )
                        .then(1)
                        .else(0)
                        .end(),
                    ),
                    'real',
                  ),
                  '/',
                  eb.fn.count<number>('Entry.id'),
                ).as('conversionRate'),
            ])
            .where('Tournament.size', '>=', minSize)
            .where('Tournament.size', '<=', maxSize)
            .where('Tournament.tournamentDate', '>=', minDate.toISOString())
            .where('Tournament.tournamentDate', '<=', maxDate.toISOString())
            .where('Commander.id', 'in', commanderIds)
            .groupBy('Commander.id')
            .execute(),
        ]);

        const totalEntries = entriesQuery.totalEntries ?? 1;
        const statsByCommanderId = new Map<number, CommanderCalculatedStats>();
        for (const {id, ...stats} of statsQuery) {
          statsByCommanderId.set(id, {
            ...stats,
            metaShare: stats.count / totalEntries,
          });
        }

        return commanderIds.map(
          (id) =>
            statsByCommanderId.get(id) ?? {
              topCuts: 0,
              conversionRate: 0,
              count: 0,
              metaShare: 0,
            },
        );
      },
    );

    this.statsLoaderForFilters.set(filtersJson, loader);
    return loader;
  }
}
