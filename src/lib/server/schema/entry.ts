import DataLoader from "dataloader";
import { prisma } from "../prisma";
import { builder } from "./builder";
import { Entry, Prisma } from "@prisma/client";
import { TopdeckTournamentTableType } from "./types";
import { scryfallCardSchema } from "../scryfall";

export type EntryDataLoader = DataLoader<
  { TID: string; topdeckProfile: string },
  Entry | undefined,
  string
>;

export function createEntryLoader(): EntryDataLoader {
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

export const Card = builder.prismaNode("Card", {
  id: { field: "uuid" },
  fields: (t) => ({
    name: t.exposeString("name"),
    oracleId: t.exposeString("oracleId"),
    cmc: t.int({
      resolve: (parent) => {
        return scryfallCardSchema.parse(parent.data).cmc;
      },
    }),
    colorId: t.string({
      resolve: (parent) => {
        const colorIdentity = new Set(
          scryfallCardSchema.parse(parent.data).color_identity,
        );

        let colorId: string = "";
        for (const c of ["W", "U", "B", "R", "G", "C"]) {
          if (colorIdentity.has(c)) colorId += c;
        }

        return colorId || "C";
      },
    }),
    type: t.string({
      resolve: (parent) => {
        return scryfallCardSchema.parse(parent.data).type_line;
      },
    }),
  }),
});
