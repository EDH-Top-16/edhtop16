import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const builder = new SchemaBuilder<{ PrismaTypes: PrismaTypes }>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

builder.prismaObject("Player", {
  fields: (t) => ({
    id: t.exposeID("uuid"),
    name: t.exposeString("name"),
    topdeckProfile: t.exposeString("topdeckProfile", { nullable: true }),
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
      resolve: async (query, _root, _args, _ctx, _info) =>
        prisma.commander.findMany({
          ...query,
        }),
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

const server = new ApolloServer({ schema: builder.toSchema() });

export default startServerAndCreateNextHandler(server);
