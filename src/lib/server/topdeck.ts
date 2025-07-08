import DataLoader from 'dataloader';
import {z} from 'zod/v4';

export type TopdeckTournamentTable = z.infer<
  typeof topdeckTournamentTableSchema
>;
const topdeckTournamentTableSchema = z.object({
  table: z.number().int(),
  players: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  winner: z.string().optional(),
  status: z.string(),
});

export type TopdeckTournamentRound = z.infer<
  typeof topdeckTournamentRoundSchema
>;
const topdeckTournamentRoundSchema = z.object({
  round: z.union([z.string(), z.number()]),
  tables: z.array(topdeckTournamentTableSchema),
});

export type TopdeckTournament = z.infer<typeof topdeckTournamentSchema>;
const topdeckTournamentSchema = z.object({
  TID: z.string(),
  rounds: z
    .union([z.array(topdeckTournamentRoundSchema), z.string()])
    .transform((data) => (typeof data === 'string' ? [] : data)),
  tournamentName: z.string(),
  swissNum: z.number().int(),
  startDate: z.number().int().optional(),
  topCut: z.number().int(),
});

export class TopdeckClient {
  private readonly roundsLoader = new DataLoader(
    async (tournmentIds: readonly string[]) => {
      const res = await fetch('https://topdeck.gg/api/v2/tournaments', {
        method: 'POST',
        headers: {
          Authorization: this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          TID: tournmentIds,
          rounds: true,
          players: ['id', 'name'],
          columns: [],
        }),
      });

      if (!res.ok) {
        throw new Error(`Error loading tournaments: ${await res.text()}`);
      }

      const tournaments = z
        .array(topdeckTournamentSchema)
        .parse(await res.json());

      const tournamentsById = new Map(tournaments.map((t) => [t.TID, t]));

      return tournmentIds.map((tid) => tournamentsById.get(tid));
    },
  );

  constructor(private readonly apiKey = process.env.TOPDECK_GG_API_KEY!) {
    if (!this.apiKey) {
      throw new Error('Must provide `apiKey` or set TOPDECK_GG_API_KEY');
    }
  }

  loadRoundsData(tid: string) {
    return this.roundsLoader.load(tid);
  }
}
