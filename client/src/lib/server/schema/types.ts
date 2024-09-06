import { builder } from "./builder";

export const SortDirection = builder.enumType("SortDirection", {
  values: ["ASC", "DESC"] as const,
});
