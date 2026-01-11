import {DB} from '@/genfiles/db/types.js';
import {isAfter} from 'date-fns';
import {Selectable} from 'kysely';
import {db} from './db';
import {Entry} from './entry';
import {ViewerContext} from './ViewerContext';

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

export type ClientPlayer = ReturnType<Player['toClient']>;

export class Player implements Selectable<DB['Player']> {
  readonly id;
  readonly name;
  readonly topdeckProfile;
  readonly coachingBio;
  readonly coachingBookingUrl;
  readonly coachingRatePerHour;
  readonly elo;
  readonly offersCoaching;

  constructor(
    private readonly vc: ViewerContext,
    row: Selectable<DB['Player']>,
  ) {
    this.id = row.id;
    this.name = row.name;
    this.topdeckProfile = row.topdeckProfile;
    this.coachingBio = row.coachingBio;
    this.coachingBookingUrl = row.coachingBookingUrl;
    this.coachingRatePerHour = row.coachingRatePerHour;
    this.elo = row.elo;
    this.offersCoaching = row.offersCoaching;
  }

  async entries(): Promise<Entry[]> {
    const entries = await db
      .selectFrom('Entry')
      .selectAll()
      .where('Entry.playerId', '=', this.id)
      .execute();

    return entries.map((e) => new Entry(this.vc, e));
  }

  async wins(): Promise<number> {
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

  async losses(): Promise<number> {
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

  async draws(): Promise<number> {
    const {draws} = await db
      .selectFrom('Entry')
      .select((eb) => eb.fn.sum<number>('draws').as('draws'))
      .where('playerId', '=', this.id)
      .executeTakeFirstOrThrow();

    return draws;
  }

  async topCuts(): Promise<number> {
    const {topCuts} = await db
      .selectFrom('Entry')
      .select((eb) => eb.fn.count<number>('Entry.id').as('topCuts'))
      .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .where('Entry.playerId', '=', this.id)
      .where((eb) => eb('Entry.standing', '<=', eb.ref('Tournament.topCut')))
      .executeTakeFirstOrThrow();

    return topCuts;
  }

  async winRate(): Promise<number> {
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

  async conversionRate(): Promise<number> {
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

  isKnownCheater(): boolean {
    return (
      this.topdeckProfile != null && UNEXPIRED_CHEATERS.has(this.topdeckProfile)
    );
  }

  toClient() {
    return {
      ['&brand']: 'client',
      id: this.id,
      name: this.name,
      topdeckProfile: this.topdeckProfile,
      isKnownCheater: this.isKnownCheater,
    };
  }

  static async player(vc: ViewerContext, profile: string): Promise<Player> {
    const row = await db
      .selectFrom('Player')
      .selectAll()
      .where('topdeckProfile', '=', profile)
      .executeTakeFirstOrThrow();

    return new Player(vc, row);
  }

  static async cheaters(vc: ViewerContext): Promise<Player[]> {
    const allCheaters = ALL_KNOWN_CHEATERS.map((p) => p.topdeckProfile);
    if (allCheaters.length === 0) return [];

    const players = await db
      .selectFrom('Player')
      .selectAll()
      .where('topdeckProfile', 'in', allCheaters)
      .execute();

    return players.map((p) => new Player(vc, p));
  }
}
