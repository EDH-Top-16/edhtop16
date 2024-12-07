import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import RelayPlugin from "@pothos/plugin-relay";
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
  DefaultFieldNullability: false;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relay: {},
  prisma: { client: prisma, exposeDescriptions: true },
  defaultFieldNullability: false,
});

builder.queryType({});
