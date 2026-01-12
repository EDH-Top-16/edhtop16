import {z} from 'zod';

export const playerDeckSchema = z.object({
  commanderId: z.number(),
  commanderName: z.string(),
  colorId: z.string(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  winRate: z.number(),
  conversionRate: z.number(),
  topCuts: z.number(),
  entries: z.number(),
});

export const playerFinishSchema = z.object({
  entryId: z.number(),
  tournamentId: z.number(),
  tournamentName: z.string(),
  tournamentSize: z.number(),
  tournamentDate: z.string(),
  topCut: z.number(),
  TID: z.string(),
  commanderName: z.string(),
  standing: z.number(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  winRate: z.number(),
  placementQuality: z.number(),
  decklist: z.string().nullable(),
});

export type PlayerDeckData = z.infer<typeof playerDeckSchema>;
export type PlayerFinishData = z.infer<typeof playerFinishSchema>;
