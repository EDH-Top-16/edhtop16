import { TopdeckTournamentRound, TopdeckTournamentTable } from "../topdeck";
import { builder } from "./builder";

export const SortDirection = builder.enumType("SortDirection", {
  values: ["ASC", "DESC"] as const,
});

export const TimePeriod = builder.enumType("TimePeriod", {
  values: ["ONE_MONTH", "THREE_MONTHS", "SIX_MONTHS"] as const,
});

export const TopdeckTournamentRoundType = builder.objectRef<
  TopdeckTournamentRound & { TID: string }
>("TopdeckTournamentRound");

export const TopdeckTournamentTableType = builder.objectRef<
  TopdeckTournamentTable & { TID: string; roundName: string }
>("TopdeckTournamentTable");

export const TournamentBreakdownGroupType = builder.objectRef<{
  commanderUuid: string;
  topCuts: number;
  entries: number;
  conversionRate: number;
}>("TournamentBreakdownGroup");
