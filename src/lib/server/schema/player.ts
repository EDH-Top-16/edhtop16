import { prisma } from "../prisma";
import { builder } from "./builder";

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

builder.queryField("player", (t) =>
  t.prismaField({
    type: "Player",
    args: { profile: t.arg.string({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) =>
      prisma.player.findFirstOrThrow({
        ...query,
        where: { topdeckProfile: args.profile },
      }),
  }),
);
