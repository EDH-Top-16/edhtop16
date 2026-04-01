import {Float, ID, Int} from 'grats';
import {sql} from 'kysely';
import {db} from '../db';
import {Commander, CommanderLoader} from './commander';
import {Player, PlayerLoader} from './player';

/** @gqlType */
class LeaderboardEntry {
  /** @gqlField */
  id: ID;
  /** @gqlField */
  rank: Int;
  /** @gqlField */
  totalGames: Int;
  /** @gqlField */
  draws: Int;
  /** @gqlField */
  drawRate: Float;

  private readonly playerId: number;
  private readonly commanderIds: number[];

  constructor(data: {
    id: number;
    playerId: number;
    rank: number;
    totalGames: number;
    draws: number;
    drawRate: number;
    topCommanderIds: string;
  }) {
    this.id = String(data.id);
    this.rank = data.rank;
    this.totalGames = data.totalGames;
    this.draws = data.draws;
    this.drawRate = data.drawRate;
    this.playerId = data.playerId;
    this.commanderIds = JSON.parse(data.topCommanderIds);
  }

  /** @gqlField */
  async player(playerLoader: PlayerLoader): Promise<Player> {
    return playerLoader.load(this.playerId);
  }

  /** @gqlField */
  async topCommanders(commanderLoader: CommanderLoader): Promise<Commander[]> {
    if (this.commanderIds.length === 0) return [];
    const results = await Promise.all(
      this.commanderIds.map((id) => commanderLoader.load(id)),
    );
    return results.filter((r): r is Commander => !(r instanceof Error));
  }
}

/** @gqlQueryField */
export async function leaderboard(): Promise<LeaderboardEntry[]> {
  const rows = await db
    .selectFrom('Leaderboard')
    .selectAll()
    .orderBy('rank', 'asc')
    .execute();

  return rows.map((row) => new LeaderboardEntry(row));
}
