import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "./prisma";
import { Commander, Entry, Prisma } from "@prisma/client";
import DataLoader from "dataloader";
import {
  TopdeckClient,
  TopdeckTournamentRound,
  TopdeckTournamentTable,
} from "./topdeck";

interface CommanderStatsQuery {
  uuid: string;
  topCut: number;
  minSize: number;
  minEntries: number;
  minDate: Date;
}

interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
}

function createCommanderStatsLoader() {
  return new DataLoader<CommanderStatsQuery, CommanderCalculatedStats, string>(
    async (commanders) => {
      const stats = await Promise.all(
        commanders.map(
          async ({ uuid, topCut, minSize, minEntries, minDate }) => {
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
              and t."tournamentDate" >= ${minDate}
              and c.uuid = ${uuid}::uuid
              group by c.uuid
              having count(c.uuid) > ${minEntries}
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

function createEntryLoader() {
  return new DataLoader<
    { TID: string; topdeckProfile: string },
    Entry | undefined,
    string
  >(
    async (entryKeys) => {
      const entries = await prisma.$queryRaw<(Entry & { key: string })[]>`
        select e.*, t."TID" || ':' || p."topdeckProfile" as key
        from "Entry" as e
        left join "Tournament" t on t.uuid = e."tournamentUuid"
        left join "Player" p on p.uuid = e."playerUuid"
        where t."TID" || ':' || p."topdeckProfile" in (${Prisma.join(
          entryKeys.map((e) => `${e.TID}:${e.topdeckProfile}`),
        )})
      `;

      const entriesByKey = new Map(entries.map((e) => [e.key, e]));
      return entryKeys.map((e) =>
        entriesByKey.get(`${e.TID}:${e.topdeckProfile}`),
      );
    },
    {
      cacheKeyFn: (e) => `${e.TID}:${e.topdeckProfile}`,
    },
  );
}

interface Context {
  commanderStats: ReturnType<typeof createCommanderStatsLoader>;
  entries: ReturnType<typeof createEntryLoader>;
  topdeckClient: TopdeckClient;
}

export function createContext(): Context {
  return {
    commanderStats: createCommanderStatsLoader(),
    entries: createEntryLoader(),
    topdeckClient: new TopdeckClient(),
  };
}

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
}>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

const FiltersInput = builder.inputType("Filters", {
  fields: (t) => ({
    topCut: t.int(),
    minSize: t.int(),
    minEntries: t.int(),
    colorId: t.string(),
    minDate: t.string(),
  }),
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
      args: { filters: t.arg({ type: FiltersInput }) },
      resolve: async (parent, { filters }, ctx) => {
        const { count } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          topCut: filters?.topCut ?? 16,
          minSize: filters?.minSize ?? 64,
          minEntries: filters?.minEntries ?? 10,
          minDate: new Date(filters?.minDate ?? 0),
        });

        return count;
      },
    }),
    topCuts: t.int({
      args: { filters: t.arg({ type: FiltersInput }) },
      resolve: async (parent, { filters }, ctx) => {
        const { topCuts } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          topCut: filters?.topCut ?? 16,
          minSize: filters?.minSize ?? 64,
          minEntries: filters?.minEntries ?? 10,
          minDate: new Date(filters?.minDate ?? 0),
        });

        return topCuts;
      },
    }),
    conversionRate: t.float({
      args: { filters: t.arg({ type: FiltersInput }) },
      resolve: async (parent, { filters }, ctx) => {
        const { conversionRate } = await ctx.commanderStats.load({
          uuid: parent.uuid,
          topCut: filters?.topCut ?? 16,
          minSize: filters?.minSize ?? 64,
          minEntries: filters?.minEntries ?? 10,
          minDate: new Date(filters?.minDate ?? 0),
        });

        return conversionRate;
      },
    }),
  }),
});

const TournamentRoundType = builder.objectRef<
  TopdeckTournamentRound & { TID: string }
>("TournamentRound");

const TournamentTableType = builder.objectRef<
  TopdeckTournamentTable & { TID: string; roundName: string }
>("TournamentTable");

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
    tables: t.field({
      type: t.listRef(TournamentTableType),
      resolve: async (parent, _args, ctx) => {
        if (!parent.playerUuid) return [];

        const { TID } = await prisma.tournament.findUniqueOrThrow({
          where: { uuid: parent.tournamentUuid },
          select: { TID: true },
        });

        const { topdeckProfile } = await prisma.player.findUniqueOrThrow({
          where: { uuid: parent.playerUuid },
          select: { topdeckProfile: true },
        });

        const roundsData = await ctx.topdeckClient.loadRoundsData(TID);

        return (
          roundsData?.rounds.flatMap((round) =>
            round.tables
              .filter((t) => t.players.some((p) => p.id === topdeckProfile))
              .map((r) => ({ ...r, TID, roundName: `${round.round}` })),
          ) ?? []
        );
      },
    }),
  }),
});

TournamentTableType.implement({
  fields: (t) => ({
    table: t.exposeInt("table"),
    roundName: t.exposeString("roundName"),
    entries: t.field({
      type: t.listRef(EntryType, { nullable: true }),
      resolve: async (parent, args, ctx) => {
        const entries = await ctx.entries.loadMany(
          parent.players.map((p) => ({
            TID: parent.TID,
            topdeckProfile: p.id,
          })),
        );

        return entries.map((e) => (e instanceof Error ? undefined : e));
      },
    }),
    winnerSeatPosition: t.int({
      nullable: true,
      resolve: (parent) => {
        const winnerIndex = parent.players.findIndex(
          (p) => p.name === parent.winner,
        );

        if (winnerIndex < 0) return null;
        return winnerIndex + 1;
      },
    }),
    winner: t.field({
      type: EntryType,
      nullable: true,
      resolve: async (parent, _args, ctx) => {
        const winnerPlayer = parent.players.find(
          (p) => p.name === parent.winner,
        );

        if (winnerPlayer == null) return null;

        return await ctx.entries.load({
          TID: parent.TID,
          topdeckProfile: winnerPlayer.id,
        });
      },
    }),
  }),
});

TournamentRoundType.implement({
  fields: (t) => ({
    round: t.string({
      resolve: (parent) => `${parent.round}`,
    }),
    tables: t.field({
      type: t.listRef(TournamentTableType),
      resolve: (parent) => {
        return parent.tables.map((t) => ({
          ...t,
          TID: parent.TID,
          roundName: `${parent.round}`,
        }));
      },
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
    rounds: t.field({
      type: t.listRef(TournamentRoundType),
      resolve: async (parent, _args, ctx) => {
        const tournament = await ctx.topdeckClient.loadRoundsData(parent.TID);
        return (
          tournament?.rounds.map((r) => ({
            ...r,
            TID: parent.TID,
          })) ?? []
        );
      },
    }),
  }),
});

const CommanderSortBy = builder.enumType("CommanderSortBy", {
  values: ["COUNT", "TOP_CUTS"] as const,
});

const SortDirection = builder.enumType("SortDirection", {
  values: ["ASC", "DESC"] as const,
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
        filters: t.arg({ type: FiltersInput }),
        sortBy: t.arg({ type: CommanderSortBy, defaultValue: "TOP_CUTS" }),
        sortDir: t.arg({ type: SortDirection, defaultValue: "DESC" }),
      },
      resolve: async (query, _root, args, ctx) => {
        const minSize = args.filters?.minSize ?? 64;
        const topCut = args.filters?.topCut ?? 16;
        const minEntries = args.filters?.minEntries ?? 10;
        const minDate = new Date(args.filters?.minDate ?? 0);
        const colorIdFilter =
          "%" +
          (args.filters?.colorId ?? "")
            ?.split("")
            .filter((c) => "WUBRG".includes(c))
            .join("%") +
          "%";

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
          and t."tournamentDate" >= ${minDate}
          and c."colorId" like ${colorIdFilter}
          group by c.uuid
          having count(c.uuid) > ${minEntries}
          order by "topCuts" desc
        `;

        for (const { uuid, topCuts, conversionRate, count } of commanderStats) {
          ctx.commanderStats.prime(
            { uuid, topCut, minSize, minEntries, minDate },
            { conversionRate, topCuts, count },
          );
        }

        const sortOperator =
          args.sortDir === "ASC"
            ? (a: number, b: number) => a - b
            : (a: number, b: number) => b - a;

        if (args.sortBy === "COUNT") {
          commanderStats.sort((a, b) => sortOperator(a.count, b.count));
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

    commanderNames: t.stringList({
      resolve: async () => {
        const commanders = await prisma.commander.findMany({
          select: { name: true },
        });

        return commanders.map((c) => c.name);
      },
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
