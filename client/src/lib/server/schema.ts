import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "./prisma";

const builder = new SchemaBuilder<{ PrismaTypes: PrismaTypes }>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

const TopCutEnum = builder.enumType("TopCut", {
  values: ["TOP_4", "TOP_16"] as const,
});

const TournamentSizeEnum = builder.enumType("TournamentSize", {
  values: ["SIZE_0", "SIZE_64", "SIZE_128"] as const,
});

builder.prismaObject("Player", {
  fields: (t) => ({
    id: t.exposeID("uuid"),
    name: t.exposeString("name"),
    topdeckProfile: t.exposeString("topdeckProfile", { nullable: true }),
  }),
});

function topCutKey(topCut: typeof TopCutEnum.$inferType) {
  if (topCut === "TOP_4") {
    return "Top04";
  } else if (topCut === "TOP_16") {
    return "Top16";
  } else {
    throw new Error(`Unknown top cut: ${topCut}`);
  }
}

function sizeKey(size: typeof TournamentSizeEnum.$inferType) {
  if (size === "SIZE_0") {
    return "size000";
  } else if (size === "SIZE_64") {
    return "size064";
  } else if (size === "SIZE_128") {
    return "size128";
  } else {
    throw new Error(`Unknown tournament size: ${size}`);
  }
}

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
        minSize: t.arg({ type: TournamentSizeEnum }),
      },
      select: {
        size000EntryCount: true,
        size064EntryCount: true,
        size128EntryCount: true,
      },
      resolve: (parent, { minSize }) => {
        return parent[`${sizeKey(minSize ?? "SIZE_64")}EntryCount`] ?? 0;
      },
    }),
    topCuts: t.int({
      args: {
        topCut: t.arg({ type: TopCutEnum }),
        minSize: t.arg({ type: TournamentSizeEnum }),
      },
      select: {
        size000Top16Count: true,
        size064Top16Count: true,
        size128Top16Count: true,
        size000Top04Count: true,
        size064Top04Count: true,
        size128Top04Count: true,
      },
      resolve: (parent, { topCut, minSize }) => {
        return (
          parent[
            `${sizeKey(minSize ?? "SIZE_64")}${topCutKey(
              topCut ?? "TOP_16",
            )}Count`
          ] ?? 0
        );
      },
    }),
    conversionRate: t.float({
      args: {
        topCut: t.arg({ type: TopCutEnum }),
        minSize: t.arg({ type: TournamentSizeEnum }),
      },
      select: {
        size000Top16ConversionRate: true,
        size064Top16ConversionRate: true,
        size128Top16ConversionRate: true,
        size000Top04ConversionRate: true,
        size064Top04ConversionRate: true,
        size128Top04ConversionRate: true,
      },
      resolve: (parent, { topCut, minSize }) => {
        return (
          parent[
            `${sizeKey(minSize ?? "SIZE_64")}${topCutKey(
              topCut ?? "TOP_16",
            )}ConversionRate`
          ] ?? 0
        );
      },
    }),
  }),
});

builder.prismaObject("Entry", {
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
    player: t.relation("player"),
    tournament: t.relation("tournament"),
  }),
});

builder.prismaObject("Tournament", {
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
        sortTopCut: t.arg({ type: TopCutEnum }),
        sortMinSize: t.arg({ type: TournamentSizeEnum }),
      },
      resolve: async (
        query,
        _root,
        { sortMinSize = "SIZE_64", sortTopCut = "TOP_16" },
      ) => {
        return prisma.commander.findMany({
          ...query,
          orderBy: {
            [`${sizeKey(sortMinSize ?? "SIZE_64")}${topCutKey(
              sortTopCut ?? "TOP_16",
            )}ConversionRate`]: { sort: "desc", nulls: "last" },
          },
        });
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
  }),
});

export const schema = builder.toSchema();
