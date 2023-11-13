import { z } from "zod";

export const Commander = z.object({
  colorID: z.string().nullish(),
  wins: z.number().nullish(),
  winsSwiss: z.number().nullish(),
  winsBracket: z.number().nullish(),
  draws: z.number().nullish(),
  losses: z.number().nullish(),
  lossesSwiss: z.number().nullish(),
  lossesBracket: z.number().nullish(),
  count: z.number().nullish(),
  winRate: z.number().nullish(),
  winRateSwiss: z.number().nullish(),
  winRateBracket: z.number().nullish(),
  topCuts: z.number().nullish(),
  conversionRate: z.number().nullish(),
  colors: z.unknown().nullish(),
});

export const Commanders = z.record(Commander);

export type CommanderType = z.infer<typeof Commander>;
export type CommandersType = z.infer<typeof Commanders>;
