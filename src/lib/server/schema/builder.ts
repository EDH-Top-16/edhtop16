import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "../prisma";
import { TopdeckClient } from "../topdeck";
import { type CommanderStatsDataLoader } from "./commander";
import { EntryDataLoader } from "./entry";

export interface Context {
  commanderStats: CommanderStatsDataLoader;
  entries: EntryDataLoader;
  topdeckClient: TopdeckClient;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
}>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

builder.queryType({});
