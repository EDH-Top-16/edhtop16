import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "./prisma";
import { Commander } from "@prisma/client";
import DataLoader from "dataloader";

const MIN_ENTRIES = 10;

interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
}

interface Context {
  commanderStats: DataLoader<
    { uuid: string; topCut: number; minSize: number },
    CommanderCalculatedStats
  >;
}

export function createContext(): Context {
  return {
    commanderStats: new DataLoader(
      async (commanders): Promise<CommanderCalculatedStats[]> => {
        const stats = await Promise.all(
          commanders.map(async ({ uuid, topCut, minSize }) => {
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
              and t."topCut" >= ${topCut}
              and c.uuid = ${uuid}::uuid
              group by c.uuid
              having count(c.uuid) > ${MIN_ENTRIES}
            `;
          }),
        );

        const statsByCommanderUuid = new Map<
          string,
          CommanderCalculatedStats
        >();

        for (const { uuid, conversionRate, count, topCuts } of stats.flat()) {
          statsByCommanderUuid.set(uuid, {
            conversionRate,
            count,
            topCuts,
          });
        }

        return commanders.map(({ uuid }) => statsByCommanderUuid.get(uuid)!);
      },
      {
        cacheKeyFn: ({ uuid, topCut, minSize }) =>
          [uuid, topCut, minSize].join(":"),
      },
    ),
  };
}

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
}>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

const PlayerType = builder.prismaObject("Player", {
  fields: (t) => ({
    id: t.exposeID("uuid"),
    name: t.exposeString("name"),
    topdeckProfile: t.exposeString("topdeckProfile", { nullable: true }),
    entries: t.relation("entries"),
    wins: t.int({
      resolve: async (parent) => {
        const aggregateWins = await prisma.entry.aggregate({
          _sum: { winsBracket: true, winsSwiss: true },
          where: { playerUuid: parent.uuid },
        });

        return (
          (aggregateWins._sum.winsBracket ?? 0) +
          (aggregateWins._sum.winsSwiss ?? 0)
        );
      },
    }),
    losses: t.int({
      resolve: async (parent, _args, ctx) => {
        const aggregateLosses = await prisma.entry.aggregate({
          _sum: { lossesBracket: true, lossesSwiss: true },
          where: { playerUuid: parent.uuid },
        });

        return (
          (aggregateLosses._sum.lossesBracket ?? 0) +
          (aggregateLosses._sum.lossesSwiss ?? 0)
        );
      },
    }),
    draws: t.int({
      resolve: async (parent) => {
        const aggregateDraws = await prisma.entry.aggregate({
          _sum: { draws: true },
          where: { playerUuid: parent.uuid },
        });

        return aggregateDraws._sum.draws ?? 0;
      },
    }),
    topCuts: t.int({
      resolve: async (parent) => {
        const entries = await prisma.entry.findMany({
          where: { playerUuid: parent.uuid },
          select: { standing: true, tournament: { select: { topCut: true } } },
        });

        return entries.filter((e) => e.standing <= e.tournament.topCut).length;
      },
    }),
    winRate: t.float({
      resolve: async (parent) => {
        const {
          _sum: { draws, winsBracket, lossesBracket, lossesSwiss, winsSwiss },
        } = await prisma.entry.aggregate({
          _sum: {
            draws: true,
            winsBracket: true,
            winsSwiss: true,
            lossesBracket: true,
            lossesSwiss: true,
          },
          where: { playerUuid: parent.uuid },
        });

        const totalWins = (winsBracket ?? 0) + (winsSwiss ?? 0);
        const totalGames =
          (draws ?? 0) +
          (winsBracket ?? 0) +
          (lossesBracket ?? 0) +
          (lossesSwiss ?? 0) +
          (winsSwiss ?? 0);

        if (totalGames === 0) return 0;
        return totalWins / totalGames;
      },
    }),
    conversionRate: t.float({
      resolve: async (parent) => {
        const entries = await prisma.entry.findMany({
          where: { playerUuid: parent.uuid },
          select: { standing: true, tournament: { select: { topCut: true } } },
        });

        if (entries.length === 0) return 0;
        return (
          entries.filter((e) => e.standing <= e.tournament.topCut).length /
          entries.length
        );
      },
    }),
  }),
});

builder.prismaObject("Commander", {
  fields: (t) => ({
    id: t.exposeID("uuid"),
    name: t.exposeString("name"),
    colorId: t.exposeString("colorId"),
    entries: t.relation("entries", {
      query: {
        orderBy: { standing: "asc" },
      },
    }),
    count: t.int({
      args: {
        minSize: t.arg({ type: "Int" }),
      },
      resolve: async (parent, { minSize }, ctx) => {
        const { count } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          topCut: 16,
          minSize: minSize ?? 64,
        });

        return count;
      },
    }),
    topCuts: t.int({
      args: {
        topCut: t.arg({ type: "Int" }),
        minSize: t.arg({ type: "Int" }),
      },
      resolve: async (parent, { topCut, minSize }, ctx) => {
        const { topCuts } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          topCut: topCut ?? 16,
          minSize: minSize ?? 64,
        });

        return topCuts;
      },
    }),
    conversionRate: t.float({
      args: {
        topCut: t.arg({ type: "Int" }),
        minSize: t.arg({ type: "Int" }),
      },
      resolve: async (parent, { topCut, minSize }, ctx) => {
        const { conversionRate } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          topCut: topCut ?? 16,
          minSize: minSize ?? 64,
        });

        return conversionRate;
      },
    }),
  }),
});

const EntryType = builder.prismaObject("Entry", {
  fields: (t) => ({
    id: t.exposeID("uuid"),
    standing: t.exposeInt("standing"),
    decklist: t.exposeString("decklist", { nullable: true }),
    winsSwiss: t.exposeInt("winsSwiss"),
    winsBracket: t.exposeInt("winsBracket"),
    draws: t.exposeInt("draws"),
    lossesSwiss: t.exposeInt("lossesSwiss"),
    lossesBracket: t.exposeInt("lossesBracket"),
    commander: t.relation("commander"),
    player: t.relation("player", { nullable: true }),
    tournament: t.relation("tournament"),
    wins: t.int({
      resolve: (parent) => parent.winsBracket + parent.winsSwiss,
    }),
    losses: t.int({
      resolve: (parent) => parent.lossesBracket + parent.lossesSwiss,
    }),
  }),
});

const TournamentType = builder.prismaObject("Tournament", {
  fields: (t) => ({
    id: t.exposeID("uuid"),
    TID: t.exposeString("TID"),
    name: t.exposeString("name"),
    size: t.exposeInt("size"),
    swissRounds: t.exposeInt("swissRounds"),
    topCut: t.exposeInt("topCut"),
    tournamentDate: t.string({
      resolve: (tournament) => tournament.tournamentDate.toISOString(),
    }),
    entries: t.relation("entries", {
      query: {
        orderBy: { standing: "asc" },
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    tournaments: t.prismaField({
      type: ["Tournament"],
      resolve: async (query, _root, _args, _ctx, _info) =>
        prisma.tournament.findMany({
          ...query,
          orderBy: { tournamentDate: "desc" },
        }),
    }),

    tournament: t.prismaField({
      type: "Tournament",
      args: { TID: t.arg.string({ required: true }) },
      resolve: async (query, _root, args, _ctx, _info) =>
        prisma.tournament.findUniqueOrThrow({
          ...query,
          where: { TID: args.TID },
        }),
    }),

    commanders: t.prismaField({
      type: ["Commander"],
      args: {
        topCut: t.arg({ type: "Int" }),
        minSize: t.arg({ type: "Int" }),
      },
      resolve: async (query, _root, args, ctx) => {
        const minSize = args.minSize ?? 64;
        const topCut = args.topCut ?? 16;

        const commanderStats = await prisma.$queryRaw<
          (Commander & CommanderCalculatedStats)[]
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
          and t."topCut" >= ${topCut}
          group by c.uuid
          having count(c.uuid) > ${MIN_ENTRIES}
          order by "topCuts" desc
        `;

        for (const { uuid, topCuts, conversionRate, count } of commanderStats) {
          ctx.commanderStats.prime(
            { uuid, topCut, minSize },
            { conversionRate, topCuts, count },
          );
        }

        return commanderStats;
      },
    }),

    commander: t.prismaField({
      type: "Commander",
      args: { name: t.arg.string({ required: true }) },
      resolve: async (query, _root, args, _ctx, _info) =>
        prisma.commander.findFirstOrThrow({
          ...query,
          where: { name: args.name },
        }),
    }),

    player: t.prismaField({
      type: "Player",
      args: { profile: t.arg.string({ required: true }) },
      resolve: async (query, _root, args, _ctx, _info) =>
        prisma.player.findFirstOrThrow({
          ...query,
          where: { topdeckProfile: args.profile },
        }),
    }),
  }),
});

export const schema = builder.toSchema();
