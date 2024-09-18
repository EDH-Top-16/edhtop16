import { builder } from "./builder";

export const SortDirection = builder.enumType("SortDirection", {
  values: ["ASC", "DESC"] as const,
});

export const TimePeriod = builder.enumType("TimePeriod", {
  values: ["ONE_MONTH", "THREE_MONTHS", "SIX_MONTHS"] as const,
});
