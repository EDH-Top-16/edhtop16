import {DB} from '@/genfiles/db/types';
import DataLoader from 'dataloader';
import {Float, Int} from 'grats';
import {Selectable} from 'kysely';
import {Card} from './card';
import {Commander} from './commander';
import {db} from './db';
import {Player} from './player';
import {Tournament} from './tournament';
import {ViewerContext} from './ViewerContext';

export type EntryLoader = DataLoader<number, Entry>;

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

export class Entry implements Selectable<DB['Entry']> {
  readonly id: number;
  readonly commanderId: number;
  readonly playerId: number;
  readonly tournamentId: number;

  readonly standing: number;
  readonly decklist: string | null;
  readonly winsSwiss: number;
  readonly winsBracket: number;
  readonly draws: number;
  readonly lossesSwiss: number;
  readonly lossesBracket: number;

  constructor(
    private readonly vc: ViewerContext,
    private readonly row: Selectable<DB['Entry']>,
  ) {
    this.id = row.id;
    this.commanderId = row.commanderId;
    this.playerId = row.playerId;
    this.tournamentId = row.tournamentId;
    this.standing = row.standing;
    this.decklist = row.decklist;
    this.winsSwiss = row.winsSwiss;
    this.winsBracket = row.winsBracket;
    this.draws = row.draws;
    this.lossesSwiss = row.lossesSwiss;
    this.lossesBracket = row.lossesBracket;
  }

  async commander(): Promise<Commander> {
    const commander = await this.vc.commanderLoader.load(this.row.commanderId);
    return new Commander(this.vc, commander);
  }

  async player(): Promise<Player> {
    const player = await this.vc.playerLoader.load(this.row.playerId);
    return new Player(this.vc, player);
  }

  async tournament(): Promise<Tournament> {
    const t = await this.vc.tournamentLoader.load(this.row.tournamentId);
    return new Tournament(this.vc, t);
  }

  wins(): Int {
    return this.winsBracket + this.winsSwiss;
  }

  losses(): Int {
    return this.lossesBracket + this.lossesSwiss;
  }

  winRate(): Float | null {
    const wins = this.winsBracket + this.winsSwiss;
    const games = wins + this.lossesBracket + this.lossesSwiss + this.draws;

    if (games === 0) return null;
    return wins / games;
  }

  async maindeck(): Promise<Card[]> {
    const rows = await db
      .selectFrom('DecklistItem')
      .innerJoin('Card', 'Card.id', 'DecklistItem.cardId')
      .selectAll('Card')
      .where('DecklistItem.entryId', '=', this.id)
      .execute();

    return rows.map((r) => new Card(this.vc, r));
  }
}
