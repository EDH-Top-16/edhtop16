import Dataloader from 'dataloader';
import * as undici from 'undici';
import {z} from 'zod/v4';

export class TopDeckClient {
  static readonly player = z.object({
    id: z.string(),
    name: z.string().nullish(),
    username: z.string().nullish(),
    pronouns: z.string().nullish(),
    profileImage: z.string().nullish(),
    headerImage: z.string().nullish(),
    elo: z.number().nullish(),
    gamesPlayed: z.number().nullish(),
    about: z.string().nullish(),
    twitter: z.string().nullish(),
    youtube: z.string().nullish(),
  });

  static readonly tournament = z.object({
    TID: z.string(),
    tournamentName: z.string(),
    swissNum: z.number(),
    startDate: z.number(),
    game: z.string(),
    format: z.string(),
    averageElo: z.number().optional(),
    modeElo: z.number().optional(),
    medianElo: z.number().optional(),
    topElo: z.number().optional(),
    eventData: z
      .object({
        lat: z.number().optional(),
        lng: z.number().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        location: z.string().optional(),
        headerImage: z.string().optional(),
      })
      .optional(),
    topCut: z.number(),
    standings: z.array(
      z.object({
        id: z.string(),
        winsSwiss: z.number().int(),
        winsBracket: z.number().int(),
        draws: z.number().int(),
        lossesSwiss: z.number().int(),
        lossesBracket: z.number().int(),
        byes: z.number().int(),
      }),
    ),
  });

  static readonly tournamentDetail = z.object({
    data: z.object({
      name: z.string(),
      game: z.string(),
      format: z.string(),
      startDate: z.number(),
    }),
    standings: z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        decklist: z.string().nullable(),
        deckObj: z
          .object({
            Commanders: z.record(
              z.string(),
              z.object({id: z.string(), count: z.number()}),
            ),
            Mainboard: z.record(
              z.string(),
              z.object({id: z.string(), count: z.number()}),
            ),
            metadata: z.object({
              game: z.string(),
              format: z.string(),
              importedFrom: z.string().optional(),
            }),
          })
          .nullable(),
        standing: z.number(),
        points: z.number().nullable(),
        winRate: z.number().nullish(),
        opponentWinRate: z.number().nullish(),
      }),
    ),
  });

  static readonly rounds = z.array(
    z.object({
      round: z.union([z.number(), z.string()]),
      tables: z.array(
        z.object({
          table: z.union([z.number(), z.string()]),
          players: z.array(
            z.object({name: z.string(), id: z.string().nullable()}),
          ),
          winner: z.string().nullish(),
          winner_id: z.string().nullish(),
          status: z.string(),
        }),
      ),
    }),
  );

  private readonly apiKey: string;
  private readonly baseUrl = 'https://topdeck.gg/api/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    schema: z.ZodType<T>,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: this.apiKey,
      Accept: '*/*',
      'User-Agent': 'edhtop16/2.0',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await undici.request(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.statusCode >= 400) {
      throw new Error(
        `TopDeck API request failed: ${response.statusCode} - ${await response.body.text()}`,
      );
    }

    const json = await response.body.json();
    return schema.parse(json);
  }

  readonly players = new Dataloader(
    (ids: readonly string[]) => {
      const queryString = ids
        .map((id) => `id=${encodeURIComponent(id)}`)
        .join('&');

      return this.request(
        'GET',
        `/player?${queryString}`,
        z.array(TopDeckClient.player),
      );
    },
    {maxBatchSize: 15},
  );

  readonly tournaments = new Dataloader((tids: readonly string[]) => {
    return Promise.all(
      tids.map((tournamentId) => {
        return this.request(
          'GET',
          `/tournaments/${tournamentId}`,
          TopDeckClient.tournamentDetail,
        );
      }),
    );
  });

  async listTournaments(options: {last?: number; TID?: string[]}) {
    return this.request(
      'POST',
      '/tournaments',
      z.array(TopDeckClient.tournament),
      {
        game: 'Magic: The Gathering',
        format: 'EDH',
        columns: [
          'id',
          'winsSwiss',
          'winsBracket',
          'draws',
          'lossesSwiss',
          'lossesBracket',
          'byes',
        ],
        ...options,
      },
    );
  }

  async getRounds(tid: string) {
    return this.request(
      'GET',
      `/tournaments/${tid}/rounds`,
      TopDeckClient.rounds,
    );
  }
}
