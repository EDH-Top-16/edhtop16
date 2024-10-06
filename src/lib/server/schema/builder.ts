import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "../prisma";
import { ScryfallCardLoader } from "../scryfall";
import {
  TopdeckClient,
  TopdeckTournamentRound,
  TopdeckTournamentTable,
} from "../topdeck";
import { type CommanderStatsDataLoader } from "./commander";
import { EntryDataLoader } from "./entry";

export interface Context {
  commanderStats: CommanderStatsDataLoader;
  entries: EntryDataLoader;
  topdeckClient: TopdeckClient;
  scryfallCardLoader: ScryfallCardLoader;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
}>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

builder.queryType({});
