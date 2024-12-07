import { resolveOffsetConnection } from "@pothos/plugin-relay";
import { Commander, Prisma } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../prisma";
import { scryfallCardSchema } from "../scryfall";
import { builder } from "./builder";
import { minDateFromTimePeriod, TimePeriod } from "./types";

interface CommanderStatsQuery {
  uuid: string;
  topCut: number;
  minSize: number;
  minEntries: number;
  minDate: Date;
  maxSize: number;
  maxEntries: number;
  maxDate: Date;
}

interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
}

export type CommanderStatsDataLoader = DataLoader<
  CommanderStatsQuery,
  CommanderCalculatedStats,
  string
>;

export function createCommanderStatsLoader(): CommanderStatsDataLoader {
  return new DataLoader<CommanderStatsQuery, CommanderCalculatedStats, string>(
    async (commanders) => {
      const stats = await Promise.all(
        commanders.map(
          async ({
            uuid,
            topCut,
            minSize,
            minEntries,
            minDate,
            maxDate,
            maxEntries,
            maxSize,
          }) => {
            return prisma.$queryRaw<(Commander & CommanderCalculatedStats)[]>`
              select
                c.*,
                count(c.uuid)::int as "count",
                sum(case when e.standing <= t."topCut" then 1 else 0 end)::int as "topCuts",
                sum(case when e.standing <= t."topCut" then 1.0 else 0.0 end) / count(e) as "conversionRate"
              from "Commander" as c
              left join "Entry" e on c.uuid = e."commanderUuid"
              left join "Tournament" t on t.uuid = e."tournamentUuid"
              where t.size >= ${minSize}
              and t.size <= ${maxSize}
              and t."topCut" >= ${topCut}
              and t."tournamentDate" >= ${minDate}
              and t."tournamentDate" <= ${maxDate}
              and c.uuid = ${uuid}::uuid
              group by c.uuid
              having count(c.uuid) >= ${minEntries}
              and count(c.uuid) <= ${maxEntries}
            `;
          },
        ),
      );

      const statsByCommanderUuid = new Map<string, CommanderCalculatedStats>();

      for (const { uuid, conversionRate, count, topCuts } of stats.flat()) {
        statsByCommanderUuid.set(uuid, {
          conversionRate,
          count,
          topCuts,
        });
      }

      return commanders.map(
        ({ uuid }) =>
          statsByCommanderUuid.get(uuid) ?? {
            topCuts: 0,
            conversionRate: 0,
            count: 0,
          },
      );
    },
    {
      cacheKeyFn: ({ uuid, topCut, minSize, minEntries, minDate }) =>
        [uuid, topCut, minSize, minEntries, minDate.getTime()].join(":"),
    },
  );
}

const CommandersSortBy = builder.enumType("CommandersSortBy", {
  values: ["POPULARITY", "CONVERSION"] as const,
});

const CommanderSortBy = builder.enumType("CommanderSortBy", {
  values: ["ENTRIES", "TOP_CUTS", "NAME", "CONVERSION"] as const,
});

const EntriesSortBy = builder.enumType("EntriesSortBy", {
  values: ["NEW", "TOP"] as const,
});

const FiltersInput = builder.inputType("CommanderStatsFilters", {
  fields: (t) => ({
    topCut: t.int(),
    colorId: t.string(),
    minSize: t.int(),
    minEntries: t.int(),
    minDate: t.string(),
    maxSize: t.int(),
    maxEntries: t.int(),
    maxDate: t.string(),
    timePeriod: t.field({ type: TimePeriod }),
  }),
});

function commanderStatsQueryFromFilters(
  filters: (typeof FiltersInput)["$inferInput"] | null | undefined,
): Omit<CommanderStatsQuery, "uuid"> {
  const minDate =
    filters?.minDate != null
      ? new Date(filters?.minDate ?? 0)
      : minDateFromTimePeriod(filters?.timePeriod);

  return {
    topCut: filters?.topCut ?? 0,
    minSize: filters?.minSize ?? 0,
    minEntries: filters?.minEntries ?? 0,
    minDate,
    maxSize: filters?.maxSize ?? Number.MAX_SAFE_INTEGER,
    maxEntries: filters?.maxEntries ?? Number.MAX_SAFE_INTEGER,
    maxDate: filters?.maxDate ? new Date(filters.maxDate) : new Date(),
  };
}

const EntriesFilter = builder.inputType("EntriesFilter", {
  fields: (t) => ({
    timePeriod: t.field({ type: TimePeriod, defaultValue: "ONE_MONTH" }),
    minEventSize: t.int({ defaultValue: 60 }),
    maxStanding: t.int(),
  }),
});

const CommanderType = builder.prismaNode("Commander", {
  id: { field: "uuid" },
  fields: (t) => ({
    name: t.exposeString("name"),
    colorId: t.exposeString("colorId"),
    breakdownUrl: t.string({
      resolve: (parent) => `/commander/${encodeURIComponent(parent.name)}`,
    }),
    count: t.int({
      args: { filters: t.arg({ type: FiltersInput }) },
      resolve: async (parent, { filters }, ctx) => {
        const { count } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          ...commanderStatsQueryFromFilters(filters),
        });

        return count;
      },
    }),
    topCuts: t.int({
      args: { filters: t.arg({ type: FiltersInput }) },
      resolve: async (parent, { filters }, ctx) => {
        const { topCuts } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          ...commanderStatsQueryFromFilters(filters),
        });

        return topCuts;
      },
    }),
    conversionRate: t.float({
      args: { filters: t.arg({ type: FiltersInput }) },
      resolve: async (parent, { filters }, ctx) => {
        const { conversionRate } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          ...commanderStatsQueryFromFilters(filters),
        });

        return conversionRate;
      },
    }),
    entries: t.relatedConnection("entries", {
      cursor: "uuid",
      args: {
        filters: t.arg({ type: EntriesFilter }),
        sortBy: t.arg({
          type: EntriesSortBy,
          defaultValue: "TOP",
        }),
      },
      query: ({ filters, sortBy }) => {
        const timePeriod = filters?.timePeriod ?? "ONE_MONTH";
        const minEventSize = filters?.minEventSize ?? 60;
        const maxStanding = filters?.maxStanding;

        const minDate = minDateFromTimePeriod(timePeriod);
        const orderBy: Prisma.EntryOrderByWithRelationInput[] =
          sortBy === "NEW"
            ? [{ tournament: { tournamentDate: "desc" } }]
            : [{ standing: "asc" }, { tournament: { size: "desc" } }];

        return {
          where: {
            standing: { lte: maxStanding ?? undefined },
            tournament: {
              tournamentDate: { gte: minDate },
              size: { gte: minEventSize },
            },
          },
          orderBy,
        };
      },
    }),
    imageUrls: t.stringList({
      resolve: async (parent, _args) => {
        const cardNames =
          parent.name === "Unknown Commander"
            ? ["The Prismatic Piper"]
            : parent.name.split(" / ");

        const cards = await prisma.card.findMany({
          where: { name: { in: cardNames } },
        });

        return cards
          .map((c) => scryfallCardSchema.parse(c.data))
          .flatMap((c) => (c.card_faces ? c.card_faces : [c]))
          .map((c) => c.image_uris?.art_crop)
          .filter((c): c is string => c != null);
      },
    }),
  }),
});

builder.queryField("commander", (t) =>
  t.prismaField({
    type: "Commander",
    args: { name: t.arg.string({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) =>
      prisma.commander.findFirstOrThrow({
        ...query,
        where: { name: args.name },
      }),
  }),
);

builder.queryField("commanderNames", (t) =>
  t.stringList({
    resolve: async () => {
      const commanders = await prisma.commander.findMany({
        select: { name: true },
        where: { name: { not: "Unknown Commander" } },
        orderBy: { entries: { _count: "desc" } },
      });

      return commanders.map((c) => c.name);
    },
  }),
);

builder.queryField("commanders", (t) =>
  t.connection({
    type: CommanderType,
    args: {
      minEntries: t.arg.int(),
      timePeriod: t.arg({ type: TimePeriod, defaultValue: "ONE_MONTH" }),
      sortBy: t.arg({ type: CommandersSortBy, defaultValue: "CONVERSION" }),
    },
    resolve: async (_root, args) => {
      return resolveOffsetConnection({ args }, ({ limit, offset }) => {
        const minDate = minDateFromTimePeriod(args.timePeriod ?? "ONE_MONTH");
        const minEntries =
          args.minEntries ??
          (args.timePeriod === "ALL_TIME"
            ? 120
            : args.timePeriod === "ONE_YEAR"
            ? 120
            : args.timePeriod === "SIX_MONTHS"
            ? 120
            : args.timePeriod === "THREE_MONTHS"
            ? 60
            : 20);

        const orderBy =
          args.sortBy === "POPULARITY"
            ? Prisma.sql([`count(e)`])
            : Prisma.sql([
                `sum(case when e.standing <= t."topCut" then 1.0 else 0.0 end) / count(e)`,
              ]);

        return prisma.$queryRaw<Commander[]>`
          SELECT c.*
          FROM "Commander" as c
          LEFT JOIN "Entry" e on e."commanderUuid" = c.uuid
          LEFT JOIN "Tournament" t on t.uuid = e."tournamentUuid"
          WHERE c.name != 'Unknown Commander'
          AND t."tournamentDate" >= ${minDate}
          GROUP BY c.uuid
          HAVING count(e) >= ${minEntries}
          ORDER BY ${orderBy} DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      });
    },
  }),
);
