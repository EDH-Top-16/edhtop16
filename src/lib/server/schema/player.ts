import {DB} from '#genfiles/db/types.js';
import DataLoader from 'dataloader';
import {isAfter} from 'date-fns';
import {Float, Int} from 'grats';
import {Selectable} from 'kysely';
import {Context} from '../context';
import {db} from '../db';
import {GraphQLNode} from './connection';
import {Entry} from './entry';

const ALL_KNOWN_CHEATERS: {
  topdeckProfile: string;
  expiration: Date;
  activeDate?: Date;
}[] = [
  // https://docs.google.com/document/d/1m7aHiwIl11RKnpp7aYVzOA8daPijgbygbLreWi5cmeM/edit?tab=t.0
  {
    topdeckProfile: 'eUiV4NK8aWXDzUpX8ieUCC8C9On1',
    expiration: new Date('2026-03-21'),
  },
  // https://docs.google.com/document/d/1HVo6lrWz252eu-8eNVzjY0MPddOt-uucFQobKDMI7Zk/edit?usp=drivesdk
  {
    topdeckProfile: 'QnHqzI3FgmgQsJOLZNU9CuizkKC3',
    expiration: new Date('2025-01-01'),
  },
  // https://www.youtube.com/watch?v=qrKIr3PL2RE, top left player.
  {
    topdeckProfile: 'DtMLwxHSFUVsK6Lpe2ebySzLIP32',
    expiration: new Date('2027-02-10'),
    activeDate: new Date('2025-08-13T03:00:00.000Z'),
  },
  // https://www.youtube.com/watch?v=RKb2wqHtcdk&t=12065s, top left player.
  {
    topdeckProfile: 'NoplwPOalyPYtwTf4sgflMhSsgr1',
    expiration: new Date('2027-04-03'),
  },
  // https://www.youtube.com/watch?v=5CRCaN8f7Pc
  {
    topdeckProfile: 'eWwAraLMM5b1BDDeStW07aHTt3j2',
    expiration: new Date('2027-04-29'),
  },
  // https://www.youtube.com/watch?v=5CRCaN8f7Pc
  {
    topdeckProfile: 'tCU2ZjGXPSWWDdMtlkjJ7ddFHnS2',
    expiration: new Date('2027-04-29'),
  },
  // https://x.com/FenoDreams/status/1983361668982747281
  {
    topdeckProfile: '0Gmzn7myNwYxPFhVdZEyZISngx72',
    expiration: new Date('2027-04-29'),
  },
  // https://drive.google.com/file/d/1DHbOmAdFyzMK3UNwrtjf3oyXOt9C9yvw/view?usp=drive_link
  {
    topdeckProfile: 'O5vGNnGpjIVyV2SYOqr0pBCWqJq2',
    expiration: new Date('2027-04-29'),
  },
];

const now = Date.now();
const UNEXPIRED_CHEATERS = new Set(
  ALL_KNOWN_CHEATERS.filter(
    (p) =>
      isAfter(p.expiration, now) &&
      (p.activeDate == null || !isAfter(p.activeDate, now)),
  ).map((p) => p.topdeckProfile),
);

export type PlayerLoader = DataLoader<number, Player>;

/** @gqlContext */
export function createPlayerLoader(ctx: Context): PlayerLoader {
  return ctx.loader('PlayerLoader', async (playerIds: readonly number[]) => {
    const rows = await db
      .selectFrom('Player')
      .where('id', 'in', playerIds)
      .selectAll()
      .execute();

    const playerById = new Map<number, Player>();
    for (const r of rows) {
      playerById.set(r.id, new Player(r));
    }

    return playerIds.map(
      (id) => playerById.get(id) ?? new Error(`Could not load player: ${id}`),
    );
  });
}

/** @gqlType */
export class Player implements GraphQLNode {
  id;
  __typename = 'Player' as const;

  /** @gqlField */
  readonly name: string;
  /** @gqlField */
  readonly topdeckProfile: string | null;

  constructor(row: Selectable<DB['Player']>) {
    this.id = row.id;
    this.name = row.name;
    this.topdeckProfile = row.topdeckProfile;
  }

  /** @gqlField */
  async entries(): Promise<Entry[]> {
    const entries = await db
      .selectFrom('Entry')
      .selectAll()
      .where('Entry.playerId', '=', this.id)
      .execute();

    return entries.map((e) => new Entry(e));
  }

  /** @gqlField */
  async wins(): Promise<Int> {
    const {wins} = await db
      .selectFrom('Entry')
      .select((eb) =>
        eb(
          eb.fn.sum<number>('winsBracket'),
          '+',
          eb.fn.sum<number>('winsSwiss'),
        ).as('wins'),
      )
      .where('playerId', '=', this.id)
      .executeTakeFirstOrThrow();

    return wins;
  }

  /** @gqlField */
  async losses(): Promise<Int> {
    const {losses} = await db
      .selectFrom('Entry')
      .select((eb) =>
        eb(
          eb.fn.sum<number>('lossesBracket'),
          '+',
          eb.fn.sum<number>('lossesSwiss'),
        ).as('losses'),
      )
      .where('playerId', '=', this.id)
      .executeTakeFirstOrThrow();

    return losses;
  }

  /** @gqlField */
  async draws(): Promise<Int> {
    const {draws} = await db
      .selectFrom('Entry')
      .select((eb) => eb.fn.sum<number>('draws').as('draws'))
      .where('playerId', '=', this.id)
      .executeTakeFirstOrThrow();

    return draws;
  }

  /** @gqlField */
  async topCuts(): Promise<Int> {
    const {topCuts} = await db
      .selectFrom('Entry')
      .select((eb) => eb.fn.count<number>('Entry.id').as('topCuts'))
      .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.playerId', '=', this.id)
      .where((eb) => eb('Entry.standing', '<=', eb.ref('Tournament.topCut')))
      .executeTakeFirstOrThrow();

    return topCuts;
  }

  /** @gqlField */
  async winRate(): Promise<Float> {
    const {winRate} = await db
      .selectFrom('Entry')
      .select((eb) =>
        eb(
          eb(
            eb.fn.sum<number>('winsBracket'),
            '+',
            eb.fn.sum<number>('winsSwiss'),
          ),
          '/',
          eb(
            eb.fn.sum<number>('winsBracket'),
            '+',
            eb(
              eb.fn.sum<number>('winsSwiss'),
              '+',
              eb(
                eb.fn.sum<number>('lossesBracket'),
                '+',
                eb(
                  eb.fn.sum<number>('lossesSwiss'),
                  '+',
                  eb.fn.sum<number>('draws'),
                ),
              ),
            ),
          ),
        ).as('winRate'),
      )
      .where('Entry.playerId', '=', this.id)
      .executeTakeFirstOrThrow();

    return winRate;
  }

  /** @gqlField */
  async conversionRate(): Promise<Float> {
    const {conversionRate} = await db
      .selectFrom('Entry')
      .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .select((eb) =>
        eb(
          eb.cast<number>(
            eb.fn.sum<number>(
              eb
                .case()
                .when('Entry.standing', '<=', eb.ref('Tournament.topCut'))
                .then(1)
                .else(0)
                .end(),
            ),
            'real',
          ),
          '/',
          eb.fn.count<number>('Entry.id'),
        ).as('conversionRate'),
      )
      .where('Entry.playerId', '=', this.id)
      .executeTakeFirstOrThrow();

    return conversionRate;
  }

  /** @gqlField */
  isKnownCheater(): boolean {
    return (
      this.topdeckProfile != null && UNEXPIRED_CHEATERS.has(this.topdeckProfile)
    );
  }

  /** @gqlQueryField */
  static async player(profile: string): Promise<Player> {
    const row = await db
      .selectFrom('Player')
      .selectAll()
      .where('topdeckProfile', '=', profile)
      .executeTakeFirstOrThrow();

    return new Player(row);
  }

  /** @gqlQueryField */
  static async cheaters(): Promise<Player[]> {
    const allCheaters = ALL_KNOWN_CHEATERS.map((p) => p.topdeckProfile);
    if (allCheaters.length === 0) return [];

    const players = await db
      .selectFrom('Player')
      .selectAll()
      .where('topdeckProfile', 'in', allCheaters)
      .execute();

    return players.map((p) => new Player(p));
  }
}
