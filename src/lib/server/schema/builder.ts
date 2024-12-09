import SchemaBuilder from "@pothos/core";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import RelayPlugin from "@pothos/plugin-relay";
import { prisma } from "../prisma";
import { TopdeckClient } from "../topdeck";

export interface Context {
  topdeckClient: TopdeckClient;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  DefaultFieldNullability: false;
}>({
  plugins: [PrismaPlugin, RelayPlugin, DataloaderPlugin],
  relay: {},
  prisma: { client: prisma, exposeDescriptions: true },
  defaultFieldNullability: false,
});

builder.queryType({});
