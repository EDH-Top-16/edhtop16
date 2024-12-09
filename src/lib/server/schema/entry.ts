import { prisma } from "../prisma";
import { builder } from "./builder";
import { Card } from "./card";
import { TopdeckTournamentTableType } from "./types";

export const EntryFilters = builder.inputType("EntryFilters", {
  fields: (t) => ({
    minSize: t.int(),
    maxSize: t.int(),
    minDate: t.string(),
    maxDate: t.string(),
    minStanding: t.int(),
    maxStanding: t.int(),
    minWins: t.int(),
    maxWins: t.int(),
    minLosses: t.int(),
    maxLosses: t.int(),
    minDraws: t.int(),
    maxDraws: t.int(),
  }),
});

export const EntrySortBy = builder.enumType("EntrySortBy", {
  values: ["STANDING", "WINS", "LOSSES", "DRAWS", "WINRATE", "DATE"] as const,
});

export const EntryType = builder.prismaNode("Entry", {
  id: { field: "uuid" },
  fields: (t) => ({
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
    winRate: t.float({
      nullable: true,
      resolve: (parent) => {
        const wins = parent.winsBracket + parent.winsSwiss;
        const games =
          wins + parent.lossesBracket + parent.lossesSwiss + parent.draws;

        if (games === 0) return null;
        return wins / games;
      },
    }),
    tables: t.field({
      type: t.listRef(TopdeckTournamentTableType),
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
    maindeck: t.field({
      type: t.listRef(Card),
      resolve: async (parent) => {
        const decklistItems = await prisma.decklistItem.findMany({
          where: { entryUuid: parent.uuid },
          include: { card: true },
        });

        return decklistItems.map((item) => item.card);
      },
    }),
  }),
});
