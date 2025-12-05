import {DB} from '#genfiles/db/types.js';
import DataLoader from 'dataloader';
import {isAfter} from 'date-fns';
import {Float, Int} from 'grats';
import {Selectable} from 'kysely';
import {Context} from '../context';
import {db} from '../db';
import {GraphQLNode} from './connection';
import {Commander} from './commander';
import {Entry} from './entry';
import {Tournament} from './tournament';

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
  /** @gqlField */
  readonly profileImage: string | null;
  /** @gqlField */
  readonly offersCoaching: boolean;
  /** @gqlField */
  readonly coachingBio: string | null;
  /** @gqlField */
  readonly coachingBookingUrl: string | null;
  /** @gqlField */
  readonly coachingRatePerHour: Int | null;
  /** @gqlField */
  readonly elo: Int | null;

  constructor(row: Selectable<DB['Player']>) {
    this.id = row.id;
    this.name = row.name;
    this.topdeckProfile = row.topdeckProfile;
    this.profileImage = row.profileImage;
    this.offersCoaching = row.offersCoaching === 1;
    this.coachingBio = row.coachingBio;
    this.coachingBookingUrl = row.coachingBookingUrl;
    this.coachingRatePerHour = row.coachingRatePerHour;
    this.elo = row.elo;
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

  /** @gqlQueryField */
  static async coach(profile: string): Promise<Player | null> {
    const row = await db
      .selectFrom('Player')
      .selectAll()
      .where('topdeckProfile', '=', profile)
      .where('offersCoaching', '=', 1)
      .executeTakeFirst();

    return row ? new Player(row) : null;
  }

  /** @gqlQueryField */
  static async coaches(): Promise<Player[]> {
    const players = await db
      .selectFrom('Player')
      .selectAll()
      .where('offersCoaching', '=', 1)
      .execute();

    return players.map((p) => new Player(p));
  }

  /** @gqlField */
  async bestDecks(): Promise<PlayerDeck[]> {
    const entries = await db
      .selectFrom('Entry')
      .innerJoin('Commander', 'Commander.id', 'Entry.commanderId')
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .select([
        'Commander.id as commanderId',
        'Commander.name as commanderName',
        'Commander.colorId as colorId',
        (eb) => eb.fn.sum<number>('winsBracket').as('totalWinsBracket'),
        (eb) => eb.fn.sum<number>('winsSwiss').as('totalWinsSwiss'),
        (eb) => eb.fn.sum<number>('lossesBracket').as('totalLossesBracket'),
        (eb) => eb.fn.sum<number>('lossesSwiss').as('totalLossesSwiss'),
        (eb) => eb.fn.sum<number>('draws').as('totalDraws'),
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
      .where('Entry.playerId', '=', this.id)
      .where('Commander.name', '!=', 'Unknown Commander')
      .groupBy('Commander.id')
      .execute();

    const decks = entries.map((e) => {
      const wins = (e.totalWinsBracket ?? 0) + (e.totalWinsSwiss ?? 0);
      const losses = (e.totalLossesBracket ?? 0) + (e.totalLossesSwiss ?? 0);
      const draws = e.totalDraws ?? 0;
      const totalGames = wins + losses + draws;
      const winRate = totalGames > 0 ? wins / totalGames : 0;
      const conversionRate = e.entries > 0 ? (e.topCuts ?? 0) / e.entries : 0;

      return new PlayerDeck({
        commanderId: e.commanderId,
        commanderName: e.commanderName,
        colorId: e.colorId,
        wins,
        losses,
        draws,
        winRate,
        conversionRate,
        topCuts: e.topCuts ?? 0,
        entries: e.entries,
      });
    });

    // Filter to only commanders with at least one top cut
    const decksWithTopCuts = decks.filter((d) => d.topCuts > 0);

    // Sort by top cuts desc, then win rate desc
    return decksWithTopCuts
      .sort((a, b) => {
        if (b.topCuts !== a.topCuts) return b.topCuts - a.topCuts;
        return b.winRate - a.winRate;
      })
      .slice(0, 3);
  }

  /** @gqlField */
  async topFinishes(): Promise<PlayerFinish[]> {
    const entries = await db
      .selectFrom('Entry')
      .innerJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
      .innerJoin('Commander', 'Commander.id', 'Entry.commanderId')
      .selectAll('Entry')
      .select([
        'Tournament.id as tournamentId',
        'Tournament.name as tournamentName',
        'Tournament.size as tournamentSize',
        'Tournament.tournamentDate as tournamentDate',
        'Tournament.topCut as topCut',
        'Tournament.TID as TID',
        'Commander.name as commanderName',
      ])
      .where('Entry.playerId', '=', this.id)
      .execute();

    const finishes = entries.map((e) => {
      const wins = (e.winsBracket ?? 0) + (e.winsSwiss ?? 0);
      const losses = (e.lossesBracket ?? 0) + (e.lossesSwiss ?? 0);
      const draws = e.draws ?? 0;
      const totalGames = wins + losses + draws;
      const winRate = totalGames > 0 ? wins / totalGames : 0;
      const placementQuality = e.standing / e.tournamentSize;

      return new PlayerFinish({
        entryId: e.id,
        tournamentId: e.tournamentId,
        tournamentName: e.tournamentName,
        tournamentSize: e.tournamentSize,
        tournamentDate: e.tournamentDate,
        topCut: e.topCut,
        TID: e.TID,
        commanderName: e.commanderName,
        standing: e.standing,
        wins,
        losses,
        draws,
        winRate,
        placementQuality,
        decklist: e.decklist,
      });
    });

    // Sort by placement quality (lower is better)
    return finishes
      .sort((a, b) => a.placementQuality - b.placementQuality)
      .slice(0, 3);
  }
}

/** @gqlType */
export class PlayerDeck {
  readonly commanderId: Int;
  /** @gqlField */
  readonly commanderName: string;
  /** @gqlField */
  readonly colorId: string;
  /** @gqlField */
  readonly wins: Int;
  /** @gqlField */
  readonly losses: Int;
  /** @gqlField */
  readonly draws: Int;
  /** @gqlField */
  readonly winRate: Float;
  /** @gqlField */
  readonly conversionRate: Float;
  /** @gqlField */
  readonly topCuts: Int;
  /** @gqlField */
  readonly entries: Int;

  constructor(data: {
    commanderId: number;
    commanderName: string;
    colorId: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    conversionRate: number;
    topCuts: number;
    entries: number;
  }) {
    this.commanderId = data.commanderId;
    this.commanderName = data.commanderName;
    this.colorId = data.colorId;
    this.wins = data.wins;
    this.losses = data.losses;
    this.draws = data.draws;
    this.winRate = data.winRate;
    this.conversionRate = data.conversionRate;
    this.topCuts = data.topCuts;
    this.entries = data.entries;
  }

  /** @gqlField */
  async commander(): Promise<Commander> {
    const row = await db
      .selectFrom('Commander')
      .selectAll()
      .where('id', '=', this.commanderId)
      .executeTakeFirstOrThrow();

    return new Commander(row);
  }
}

/** @gqlType */
export class PlayerFinish {
  /** @gqlField */
  readonly entryId: Int;
  /** @gqlField */
  readonly tournamentId: Int;
  /** @gqlField */
  readonly tournamentName: string;
  /** @gqlField */
  readonly tournamentSize: Int;
  /** @gqlField */
  readonly tournamentDate: string;
  /** @gqlField */
  readonly topCut: Int;
  /** @gqlField */
  readonly TID: string;
  /** @gqlField */
  readonly commanderName: string;
  /** @gqlField */
  readonly standing: Int;
  /** @gqlField */
  readonly wins: Int;
  /** @gqlField */
  readonly losses: Int;
  /** @gqlField */
  readonly draws: Int;
  /** @gqlField */
  readonly winRate: Float;
  /** @gqlField */
  readonly decklist: string | null;
  readonly placementQuality: Float;

  constructor(data: {
    entryId: number;
    tournamentId: number;
    tournamentName: string;
    tournamentSize: number;
    tournamentDate: string;
    topCut: number;
    TID: string;
    commanderName: string;
    standing: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    placementQuality: number;
    decklist: string | null;
  }) {
    this.entryId = data.entryId;
    this.tournamentId = data.tournamentId;
    this.tournamentName = data.tournamentName;
    this.tournamentSize = data.tournamentSize;
    this.tournamentDate = data.tournamentDate;
    this.topCut = data.topCut;
    this.TID = data.TID;
    this.commanderName = data.commanderName;
    this.standing = data.standing;
    this.wins = data.wins;
    this.losses = data.losses;
    this.draws = data.draws;
    this.winRate = data.winRate;
    this.placementQuality = data.placementQuality;
    this.decklist = data.decklist;
  }
}
