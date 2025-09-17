import {DB} from '#genfiles/db/types.js';
import {Float, Int} from 'grats';
import {db} from '../db';
import {Card} from './card';
import {Commander, CommanderLoader} from './commander';
import {GraphQLNode} from './connection';
import {Player, PlayerLoader} from './player';
import {Tournament, TournamentLoader} from './tournament';

/** @gqlInput */
export interface EntryFilters {
  minSize?: Int;
  maxSize?: Int;
  minDate?: string;
  maxDate?: string;
  minStanding?: Int;
  maxStanding?: Int;
  minWins?: Int;
  maxWins?: Int;
  minLosses?: Int;
  maxLosses?: Int;
  minDraws?: Int;
  maxDraws?: Int;
}

/** @gqlEnum */
export enum EntrySortBy {
  STANDING = 'STANDING',
  WINS = 'WINS',
  LOSSES = 'LOSSES',
  DRAWS = 'DRAWS',
  WINRATE = 'WINRATE',
  DATE = 'DATE',
}

/** @gqlType */
export class Entry implements GraphQLNode {
  id;
  __typename = 'Entry' as const;

  /** @gqlField */
  readonly standing: Int;
  /** @gqlField */
  readonly decklist: string | null;
  /** @gqlField */
  readonly winsSwiss: Int;
  /** @gqlField */
  readonly winsBracket: Int;
  /** @gqlField */
  readonly draws: Int;
  /** @gqlField */
  readonly lossesSwiss: Int;
  /** @gqlField */
  readonly lossesBracket: Int;

  constructor(private readonly row: DB['Entry']) {
    this.id = row.id;
    this.standing = row.standing;
    this.decklist = row.decklist;
    this.winsSwiss = row.winsSwiss;
    this.winsBracket = row.winsBracket;
    this.draws = row.draws;
    this.lossesSwiss = row.lossesSwiss;
    this.lossesBracket = row.lossesBracket;
  }

  /** @gqlField */
  async commander(commanderLoader: CommanderLoader): Promise<Commander> {
    return await commanderLoader.load(this.row.commanderId);
  }

  /** @gqlField */
  async player(playerLoader: PlayerLoader): Promise<Player> {
    return await playerLoader.load(this.row.playerId);
  }

  /** @gqlField */
  async tournament(tournamentLoader: TournamentLoader): Promise<Tournament> {
    return tournamentLoader.load(this.row.tournamentId);
  }

  /** @gqlField */
  wins(): Int {
    return this.winsBracket + this.winsSwiss;
  }

  /** @gqlField */
  losses(): Int {
    return this.lossesBracket + this.lossesSwiss;
  }

  /** @gqlField */
  winRate(): Float | null {
    const wins = this.winsBracket + this.winsSwiss;
    const games = wins + this.lossesBracket + this.lossesSwiss + this.draws;

    if (games === 0) return null;
    return wins / games;
  }

  /** @gqlField */
  async maindeck(): Promise<Card[]> {
    const rows = await db
      .selectFrom('DecklistItem')
      .innerJoin('Card', 'Card.id', 'DecklistItem.cardId')
      .selectAll('Card')
      .where('DecklistItem.entryId', '=', this.id)
      .execute();

    return rows.map((r) => new Card(r));
  }
}
