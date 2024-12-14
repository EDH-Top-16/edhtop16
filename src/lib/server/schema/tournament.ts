import { Entry, Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { builder } from "./builder";
import { EntryType } from "./entry";
import {
  minDateFromTimePeriod,
  TimePeriod,
  TopdeckTournamentRoundType,
  TopdeckTournamentTableType,
  TournamentBreakdownGroupType,
} from "./types";

TopdeckTournamentTableType.implement({
  fields: (t) => ({
    table: t.exposeInt("table"),
    roundName: t.exposeString("roundName"),
    entries: t.loadable({
      type: [EntryType],
      resolve: (parent) => {
        return parent.players.map((p) => ({
          TID: parent.TID,
          profile: p.id,
        }));
      },
      load: async (keys: { TID: string; profile: string }[]) => {
        const entries = await prisma.$queryRaw<(Entry & { key: string })[]>`
        select e.*, t."TID" || ':' || p."topdeckProfile" as key
        from "Entry" as e
        left join "Tournament" t on t.uuid = e."tournamentUuid"
        left join "Player" p on p.uuid = e."playerUuid"
        where t."TID" || ':' || p."topdeckProfile" in (${Prisma.join(
          keys.map((e) => `${e.TID}:${e.profile}`),
        )})
      `;

        const entriesByKey = new Map(entries.map((e) => [e.key, e]));
        return keys.map((e) => entriesByKey.get(`${e.TID}:${e.profile}`)!);
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
      resolve: (parent) => {
        const winnerPlayer = parent.players.find(
          (p) => p.name === parent.winner,
        );

        if (winnerPlayer == null) {
          return null;
        }

        return prisma.entry.findFirst({
          where: {
            tournament: { TID: parent.TID },
            player: { topdeckProfile: winnerPlayer.id },
          },
        });
      },
    }),
  }),
});

TopdeckTournamentRoundType.implement({
  fields: (t) => ({
    round: t.string({
      resolve: (parent) => `${parent.round}`,
    }),
    tables: t.field({
      type: t.listRef(TopdeckTournamentTableType),
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

TournamentBreakdownGroupType.implement({
  fields: (t) => ({
    topCuts: t.exposeInt("topCuts"),
    entries: t.exposeInt("entries"),
    conversionRate: t.exposeFloat("conversionRate"),
    commander: t.prismaField({
      type: "Commander",
      resolve: (query, parent) => {
        return prisma.commander.findUniqueOrThrow({
          ...query,
          where: { uuid: parent.commanderUuid },
        });
      },
    }),
  }),
});

export const TournamentType = builder.prismaNode("Tournament", {
  id: { field: "uuid" },
  fields: (t) => ({
    TID: t.exposeString("TID"),
    name: t.exposeString("name"),
    size: t.exposeInt("size"),
    swissRounds: t.exposeInt("swissRounds"),
    topCut: t.exposeInt("topCut"),
    tournamentDate: t.string({
      resolve: (tournament) => tournament.tournamentDate.toISOString(),
    }),
    entries: t.relation("entries", {
      args: { maxStanding: t.arg.int(), commander: t.arg.string() },
      query: (args) => ({
        where: {
          standing: { lte: args.maxStanding ?? undefined },
          commander: { name: args.commander ?? undefined },
        },
        orderBy: { standing: "asc" },
      }),
    }),
    rounds: t.field({
      type: t.listRef(TopdeckTournamentRoundType),
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
    bracketUrl: t.field({
      type: "String",
      resolve: (parent) => {
        return parent.bracketUrl ?? `https://topdeck.gg/bracket/${parent.TID}`;
      },
    }),
    breakdown: t.field({
      type: t.listRef(TournamentBreakdownGroupType),
      resolve: async (parent) => {
        type Group = (typeof TournamentBreakdownGroupType)["$inferType"];
        const groups = await prisma.$queryRaw<Group[]>`
          select
            e."commanderUuid",
            count(e."commanderUuid")::int as entries,
            sum(case when e.standing <= t."topCut" then 1 else 0 end)::int as "topCuts",
            sum(case when e.standing <= t."topCut" then 1.0 else 0.0 end) / count(e) as "conversionRate"
          from "Entry" as e
          left join "Tournament" t on t.uuid = e."tournamentUuid"
          left join "Commander" c on c.uuid = e."commanderUuid"
          where t."uuid"::text = ${parent.uuid}
          and c.name != 'Unknown Commander'
          group by e."commanderUuid"
          order by "topCuts" desc, entries desc
        `;

        return groups;
      },
    }),
  }),
});

const TournamentSortBy = builder.enumType("TournamentSortBy", {
  values: ["PLAYERS", "DATE"] as const,
});

const TournamentFiltersInput = builder.inputType("TournamentFilters", {
  fields: (t) => ({
    timePeriod: t.field({ type: TimePeriod }),
    minSize: t.int(),
    maxSize: t.int(),
  }),
});

builder.queryField("tournaments", (t) =>
  t.prismaConnection({
    type: TournamentType,
    cursor: "TID",
    args: {
      search: t.arg.string(),
      filters: t.arg({ type: TournamentFiltersInput }),
      sortBy: t.arg({ type: TournamentSortBy, defaultValue: "DATE" }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const where: Prisma.TournamentWhereInput[] = [];

      if (args.search) {
        where.push({
          name: { contains: args.search, mode: "insensitive" },
        });
      }

      if (args.filters?.minSize) {
        where.push({ size: { gte: args.filters.minSize } });
      }

      if (args.filters?.maxSize) {
        where.push({ size: { lte: args.filters.maxSize } });
      }

      if (args.filters?.timePeriod) {
        const minDate = minDateFromTimePeriod(args.filters.timePeriod);
        where.push({ tournamentDate: { gte: minDate } });
      }

      const orderBy: Prisma.TournamentOrderByWithRelationInput[] =
        args.sortBy === "PLAYERS"
          ? [{ size: "desc" }, { tournamentDate: "desc" }]
          : [{ tournamentDate: "desc" }, { size: "desc" }];

      return prisma.tournament.findMany({
        ...query,
        orderBy,
        where: { AND: where },
      });
    },
  }),
);

builder.queryField("tournament", (t) =>
  t.prismaField({
    type: "Tournament",
    args: { TID: t.arg.string({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) =>
      prisma.tournament.findUniqueOrThrow({
        ...query,
        where: { TID: args.TID },
      }),
  }),
);
