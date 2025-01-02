import { resolveOffsetConnection } from "@pothos/plugin-relay";
import { Commander, Prisma, Card as PrismaCard } from "@prisma/client";
import { prisma } from "../prisma";
import { builder } from "./builder";
import { Card } from "./card";
import { minDateFromTimePeriod, TimePeriod } from "./types";

const CommandersSortBy = builder.enumType("CommandersSortBy", {
  values: ["POPULARITY", "CONVERSION"] as const,
});

const EntriesSortBy = builder.enumType("EntriesSortBy", {
  values: ["NEW", "TOP"] as const,
});

const CommanderStatsFilters = builder.inputType("CommanderStatsFilters", {
  fields: (t) => ({
    colorId: t.string(),
    minSize: t.int(),
    minDate: t.string(),
    maxSize: t.int(),
    maxDate: t.string(),
    timePeriod: t.field({ type: TimePeriod }),
  }),
});

const EntriesFilter = builder.inputType("EntriesFilter", {
  fields: (t) => ({
    timePeriod: t.field({ type: TimePeriod, defaultValue: "ALL_TIME" }),
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
        const minEventSize = filters?.minEventSize ?? 60;
        const maxStanding = filters?.maxStanding;
        const minDate = minDateFromTimePeriod(
          filters?.timePeriod ?? "ALL_TIME",
        );

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
    cards: t.loadableList({
      type: Card,
      load: async (commanders: string[]) => {
        const names = commanders.map((c) =>
          c === "Unknown Commander" ? [] : c.split(" / "),
        );

        const cards = await prisma.card.findMany({
          where: { name: { in: names.flat() } },
        });

        const cardByName = new Map<string, PrismaCard>();
        for (const card of cards) cardByName.set(card.name, card);

        return names.map((ns) =>
          ns.map((n) => cardByName.get(n)!).filter(Boolean),
        );
      },
      resolve: (parent) => parent.name,
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

builder.queryField("commanders", (t) =>
  t.connection({
    type: CommanderType,
    args: {
      minEntries: t.arg.int(),
      minTournamentSize: t.arg.int(),
      timePeriod: t.arg({ type: TimePeriod, defaultValue: "ONE_MONTH" }),
      sortBy: t.arg({ type: CommandersSortBy, defaultValue: "CONVERSION" }),
      colorId: t.arg.string(),
    },
    resolve: async (_root, args) => {
      return resolveOffsetConnection({ args }, async ({ limit, offset }) => {
        const minDate = minDateFromTimePeriod(args.timePeriod ?? "ONE_MONTH");
        const minTournamentSize = args.minTournamentSize || 0;
        const minEntries = args.minEntries || 0;
        const orderBy =
          args.sortBy === "POPULARITY"
            ? Prisma.sql([`count(e)`])
            : Prisma.sql([
                `sum(case when e.standing <= t."topCut" then 1.0 else 0.0 end) / count(e)`,
              ]);

        let colorId = "";
        if (args.colorId) {
          for (const color of ["W", "U", "B", "R", "G", "C"]) {
            if (args.colorId?.includes(color)) {
              colorId += color;
            } else {
              colorId += "%";
            }
          }
        } else {
          colorId = "%";
        }

        return prisma.$queryRaw<Commander[]>`
          SELECT c.*
          FROM "Commander" as c
          LEFT JOIN "Entry" e on e."commanderUuid" = c.uuid
          LEFT JOIN "Tournament" t on t.uuid = e."tournamentUuid"
          WHERE c.name != 'Unknown Commander'
          AND c.name != 'Nadu, Winged Wisdom'
          AND t."tournamentDate" >= ${minDate}
          AND t."size" >= ${minTournamentSize}
          AND c."colorId" LIKE ${colorId}
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

interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
  metaShare: number;
}

const CommanderStats = builder
  .objectRef<CommanderCalculatedStats>("CommanderStats")
  .implement({
    fields: (t) => ({
      count: t.exposeInt("count"),
      topCuts: t.exposeInt("topCuts"),
      conversionRate: t.exposeFloat("conversionRate"),
      metaShare: t.exposeFloat("metaShare"),
    }),
  });

builder.objectField(CommanderType, "stats", (t) =>
  t.loadable({
    type: CommanderStats,
    byPath: true,
    args: { filters: t.arg({ type: CommanderStatsFilters }) },
    resolve: (parent) => parent.uuid,
    load: async (commanderUuids: string[], _ctx, { filters }) => {
      const minSize = filters?.minSize ?? 0;
      const maxSize = filters?.maxSize ?? 1_000_000;
      const maxDate = filters?.maxDate ? new Date(filters.maxDate) : new Date();
      const minDate =
        filters?.minDate != null
          ? new Date(filters?.minDate ?? 0)
          : minDateFromTimePeriod(filters?.timePeriod);

      const [entriesQuery, statsQuery] = await Promise.all([
        prisma.$queryRaw<{ totalEntries: number }[]>`
          select count(*) as "totalEntries"
          from "Entry" as e
          left join "Tournament" t on t.uuid = e."tournamentUuid"
          where t.size >= ${minSize}
          and t.size <= ${maxSize}
          and t."tournamentDate" >= ${minDate}
          and t."tournamentDate" <= ${maxDate}
        `,
        prisma.$queryRaw<
          (Commander & Omit<CommanderCalculatedStats, "metaShare">)[]
        >`
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
          and t."tournamentDate" >= ${minDate}
          and t."tournamentDate" <= ${maxDate}
          and c.uuid::text in (${Prisma.join(commanderUuids)})
          group by c.uuid
        `,
      ]);

      const totalEntries = entriesQuery[0]?.totalEntries ?? 1;
      const statsByCommanderUuid = new Map<string, CommanderCalculatedStats>();
      for (const { uuid, ...stats } of statsQuery) {
        statsByCommanderUuid.set(uuid, {
          ...stats,
          metaShare: stats.count / Number(totalEntries),
        });
      }

      return commanderUuids.map(
        (uuid) =>
          statsByCommanderUuid.get(uuid) ?? {
            topCuts: 0,
            conversionRate: 0,
            count: 0,
            metaShare: 0,
          },
      );
    },
  }),
);
