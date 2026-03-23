import Dataloader from 'dataloader';
import undici from 'undici';
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
    discordId: z.string().nullish(),
  });

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
}
