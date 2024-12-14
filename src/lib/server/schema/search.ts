import { prisma } from "../prisma";
import { builder } from "./builder";

const SearchResult = builder
  .objectRef<{ name: string; url: string }>("SearchResult")
  .implement({
    fields: (t) => ({
      name: t.exposeString("name"),
      url: t.exposeString("url"),
    }),
  });

const SearchResultType = builder.enumType("SearchResultType", {
  values: ["COMMANDER", "TOURNAMENT"] as const,
});

builder.queryField("searchResults", (t) =>
  t.field({
    type: t.listRef(SearchResult),
    args: { types: t.arg({ type: [SearchResultType] }) },
    resolve: async (_root, { types }) => {
      const results: (typeof SearchResult)["$inferType"][] = [];

      if (types == null || types.includes("COMMANDER")) {
        const commanders = await prisma.commander.findMany({
          select: { name: true },
        });

        for (const commander of commanders) {
          results.push({
            name: commander.name,
            url: `/commander/${encodeURIComponent(commander.name)}`,
          });
        }
      }

      if (types == null || types.includes("TOURNAMENT")) {
        const tournaments = await prisma.tournament.findMany({
          select: { name: true, TID: true },
        });

        for (const tournament of tournaments) {
          results.push({
            name: tournament.name,
            url: `/tournament/${encodeURIComponent(tournament.TID)}`,
          });
        }
      }

      return results;
    },
  }),
);
