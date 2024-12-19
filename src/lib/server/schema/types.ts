import { subMonths } from "date-fns";
import { TopdeckTournamentRound, TopdeckTournamentTable } from "../topdeck";
import { builder } from "./builder";

export const SortDirection = builder.enumType("SortDirection", {
  values: ["ASC", "DESC"] as const,
});

export const TimePeriod = builder.enumType("TimePeriod", {
  values: [
    "ONE_MONTH",
    "THREE_MONTHS",
    "SIX_MONTHS",
    "ONE_YEAR",
    "ALL_TIME",
    "POST_BAN",
  ] as const,
});

export function minDateFromTimePeriod(
  timePeriod: (typeof TimePeriod)["$inferType"] | null | undefined,
) {
  return timePeriod === "SIX_MONTHS"
    ? subMonths(new Date(), 6)
    : timePeriod === "THREE_MONTHS"
    ? subMonths(new Date(), 3)
    : timePeriod === "ONE_MONTH"
    ? subMonths(new Date(), 1)
    : timePeriod === "POST_BAN"
    ? new Date("2024-09-23")
    : new Date(0);
}

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
