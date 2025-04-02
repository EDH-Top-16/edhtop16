import {
  resolveCursorConnection,
  ResolveCursorConnectionArgs,
  resolveOffsetConnection,
} from "@pothos/plugin-relay";
import { subYears } from "date-fns";
import { sql } from "kysely";
import { db } from "../db";
import { DB } from "../db/__generated__/types";
import { builder } from "./builder";
import { Card } from "./card";
import { Entry } from "./entry";
import { minDateFromTimePeriod, TimePeriod } from "./types";

const CommandersSortBy = builder.enumType("CommandersSortBy", {
  values: ["POPULARITY", "CONVERSION", "TOP_CUTS"] as const,
});

const EntriesSortBy = builder.enumType("EntriesSortBy", {
  values: ["NEW", "TOP"] as const,
});

const CommanderStatsFilters = builder.inputType("CommanderStatsFilters", {
  fields: (t) => ({
    colorId: t.string(),
    minSize: t.int(),
    minDate: t.string(),
    maxSize: t.int(),
    maxDate: t.string(),
    timePeriod: t.field({ type: TimePeriod }),
  }),
});

const EntriesFilter = builder.inputType("EntriesFilter", {
  fields: (t) => ({
    timePeriod: t.field({ type: TimePeriod, defaultValue: "ALL_TIME" }),
    minEventSize: t.int({ defaultValue: 60 }),
    maxStanding: t.int(),
  }),
});

export const Commander = builder.loadableNodeRef("Commander", {
  id: { parse: (id) => Number(id), resolve: (parent) => parent.id },
  load: async (ids: number[]) => {
    const nodes = await db
      .selectFrom("Commander")
      .selectAll()
      .where("id", "in", ids)
      .execute();

    const nodesById = new Map<number, (typeof nodes)[number]>();
    for (const node of nodes) nodesById.set(node.id, node);

    return ids.map((id) => nodesById.get(id)!);
  },
});

Commander.implement({
  fields: (t) => ({
    name: t.exposeString("name"),
    colorId: t.exposeString("colorId"),
    breakdownUrl: t.string({
      resolve: (parent) => `/commander/${encodeURIComponent(parent.name)}`,
    }),
    entries: t.connection({
      type: Entry,
      args: {
        filters: t.arg({ type: EntriesFilter }),
        sortBy: t.arg({
          type: EntriesSortBy,
          defaultValue: "TOP",
        }),
      },
      resolve: (parent, args) =>
        resolveOffsetConnection({ args }, ({ limit, offset }) => {
          const minEventSize = args.filters?.minEventSize ?? 60;
          const maxStanding =
            args.filters?.maxStanding ?? Number.MAX_SAFE_INTEGER;
          const minDate = minDateFromTimePeriod(
            args.filters?.timePeriod ?? "ALL_TIME",
          );

          return db
            .selectFrom("Entry")
            .selectAll("Entry")
            .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
            .where("Entry.commanderId", "=", parent.id)
            .where("standing", "<=", maxStanding)
            .where("Tournament.tournamentDate", ">=", minDate.toISOString())
            .where("Tournament.size", ">=", minEventSize)
            .orderBy(
              args.sortBy === "NEW"
                ? ["Tournament.tournamentDate desc"]
                : ["Entry.standing asc", "Tournament.size desc"],
            )
            .limit(limit)
            .offset(offset)
            .execute();
        }),
    }),
    cards: t.loadableList({
      type: Card,
      load: async (commanders: string[]) => {
        if (commanders.length === 0) return [];

        const names = commanders.map((c) =>
          c === "Unknown Commander" ? [] : c.split(" / "),
        );

        const cards = await db
          .selectFrom("Card")
          .selectAll()
          .where("name", "in", names.flat())
          .execute();

        const cardByName = new Map<string, DB["Card"]>();
        for (const card of cards) cardByName.set(card.name, card);

        return names.map((ns) =>
          ns.map((n) => cardByName.get(n)!).filter(Boolean),
        );
      },
      resolve: (parent) => parent.name,
    }),
    staples: t.connection({
      type: Card,
      resolve: async (parent, args) => {
        return resolveOffsetConnection({ args }, async ({ limit, offset }) => {
          const oneYearAgo = subYears(new Date(), 1).toISOString();

          const { totalEntries } = await db
            .selectFrom("Entry")
            .select([(eb) => eb.fn.countAll<number>().as("totalEntries")])
            .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
            .where("Entry.commanderId", "=", parent.id)
            .where("Tournament.tournamentDate", ">=", oneYearAgo)
            .executeTakeFirstOrThrow();

          let query = db
            .with("entries", (eb) => {
              return eb
                .selectFrom("DecklistItem")
                .leftJoin("Card", "Card.id", "DecklistItem.cardId")
                .leftJoin("Entry", "Entry.id", "DecklistItem.entryId")
                .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
                .where("Entry.commanderId", "=", parent.id)
                .where("Tournament.tournamentDate", ">=", oneYearAgo)
                .groupBy("Card.id")
                .select((eb) => [
                  eb.ref("Card.id").as("cardId"),
                  eb(
                    eb.cast(eb.fn.count<number>("Card.id"), "real"),
                    "/",
                    totalEntries,
                  ).as("playRateLastYear"),
                ]);
            })
            .selectFrom("Card")
            .leftJoin("entries", "entries.cardId", "Card.id")
            .where((eb) =>
              eb(
                eb.fn("json_extract", ["Card.data", sql`'$.type_line'`]),
                "not like",
                "%Land%",
              ),
            )
            .orderBy(
              (eb) =>
                eb(
                  "entries.playRateLastYear",
                  "-",
                  eb.ref("Card.playRateLastYear"),
                ),
              "desc",
            )
            .selectAll("Card");

          return query.limit(limit).offset(offset).execute();
        });
      },
    }),
  }),
});

builder.queryField("commander", (t) =>
  t.field({
    type: Commander,
    args: { name: t.arg.string({ required: true }) },
    resolve: async (_root, args) => {
      return db
        .selectFrom("Commander")
        .selectAll()
        .where("name", "=", args.name)
        .executeTakeFirstOrThrow();
    },
  }),
);

builder.queryField("commanders", (t) =>
  t.connection({
    type: Commander,
    args: {
      minEntries: t.arg.int(),
      minTournamentSize: t.arg.int(),
      timePeriod: t.arg({ type: TimePeriod, defaultValue: "ONE_MONTH" }),
      sortBy: t.arg({ type: CommandersSortBy, defaultValue: "CONVERSION" }),
      colorId: t.arg.string(),
    },
    resolve: async (_root, args) => {
      return resolveCursorConnection(
        { args, toCursor: (parent) => `${parent.id}` },
        async ({
          before,
          after,
          limit,
          inverted,
        }: ResolveCursorConnectionArgs) => {
          const minDate = minDateFromTimePeriod(args.timePeriod ?? "ONE_MONTH");
          const minTournamentSize = args.minTournamentSize || 0;
          const minEntries = args.minEntries || 0;
          const sortBy =
            args.sortBy === "POPULARITY"
              ? "stats.count"
              : args.sortBy === "TOP_CUTS"
              ? "stats.topCuts"
              : "stats.conversionRate";

          let query = db
            .with("stats", (eb) =>
              eb
                .selectFrom("Commander")
                .leftJoin("Entry", "Entry.commanderId", "Commander.id")
                .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
                .where("Tournament.tournamentDate", ">=", minDate.toISOString())
                .where("Tournament.size", ">=", minTournamentSize)
                .groupBy("Commander.id")
                .select((eb) => [
                  eb.ref("Commander.id").as("commanderId"),
                  eb.fn.count("Entry.id").as("count"),
                  eb.fn
                    .sum(
                      eb
                        .case()
                        .when(
                          "Entry.standing",
                          "<=",
                          eb.ref("Tournament.topCut"),
                        )
                        .then(1)
                        .else(0)
                        .end(),
                    )
                    .as("topCuts"),
                  eb(
                    eb.cast(
                      eb.fn.sum(
                        eb
                          .case()
                          .when(
                            "Entry.standing",
                            "<=",
                            eb.ref("Tournament.topCut"),
                          )
                          .then(1)
                          .else(0)
                          .end(),
                      ),
                      "real",
                    ),
                    "/",
                    eb.fn.count("Entry.id"),
                  ).as("conversionRate"),
                ]),
            )
            .selectFrom("Commander")
            .selectAll("Commander")
            .leftJoin("stats", "stats.commanderId", "Commander.id")
            .where("Commander.name", "!=", "Unknown Commander")
            .where("Commander.name", "!=", "Nadu, Winged Wisdom")
            .where("stats.count", ">=", minEntries);

          if (args.colorId) {
            query = query.where("Commander.colorId", "=", args.colorId);
          }

          if (before) {
            query = query.where((eb) =>
              eb(
                eb.tuple(eb.ref(sortBy), eb.ref("Commander.id")),
                ">",
                eb.tuple(
                  eb
                    .selectFrom("stats")
                    .select(sortBy)
                    .where("commanderId", "=", Number(after)),
                  Number(after),
                ),
              ),
            );
          }

          if (after) {
            query = query.where((eb) =>
              eb(
                eb.tuple(eb.ref(sortBy), eb.ref("Commander.id")),
                "<",
                eb.tuple(
                  eb
                    .selectFrom("stats")
                    .select(sortBy)
                    .where("commanderId", "=", Number(after)),
                  Number(after),
                ),
              ),
            );
          }

          query = query
            .orderBy(sortBy, inverted ? "asc" : "desc")
            .orderBy("Commander.id", inverted ? "asc" : "desc")
            .limit(limit);

          return query.execute();
        },
      );
    },
  }),
);

interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
  metaShare: number;
}

const CommanderStats = builder
  .objectRef<CommanderCalculatedStats>("CommanderStats")
  .implement({
    fields: (t) => ({
      count: t.exposeInt("count"),
      topCuts: t.exposeInt("topCuts"),
      conversionRate: t.exposeFloat("conversionRate"),
      metaShare: t.exposeFloat("metaShare"),
    }),
  });

builder.objectField(Commander, "stats", (t) =>
  t.loadable({
    type: CommanderStats,
    byPath: true,
    args: { filters: t.arg({ type: CommanderStatsFilters }) },
    resolve: (parent) => parent.id,
    load: async (commanderIds: number[], _ctx, { filters }) => {
      const minSize = filters?.minSize ?? 0;
      const maxSize = filters?.maxSize ?? 1_000_000;
      const maxDate = filters?.maxDate ? new Date(filters.maxDate) : new Date();
      const minDate =
        filters?.minDate != null
          ? new Date(filters?.minDate ?? 0)
          : minDateFromTimePeriod(filters?.timePeriod);

      const [entriesQuery, statsQuery] = await Promise.all([
        db
          .selectFrom("Entry")
          .select((eb) => eb.fn.countAll<number>().as("totalEntries"))
          .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
          .where("Tournament.size", ">=", minSize)
          .where("Tournament.size", "<=", maxSize)
          .where("Tournament.tournamentDate", ">=", minDate.toISOString())
          .where("Tournament.tournamentDate", "<=", maxDate.toISOString())
          .executeTakeFirstOrThrow(),
        db
          .selectFrom("Commander")
          .leftJoin("Entry", "Entry.commanderId", "Commander.id")
          .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
          .select([
            "Commander.id",
            "Commander.name",
            "Commander.colorId",
            (eb) => eb.fn.count<number>("Commander.id").as("count"),
            (eb) =>
              eb.fn
                .sum<number>(
                  eb
                    .case()
                    .when("Entry.standing", "<=", eb.ref("Tournament.topCut"))
                    .then(1)
                    .else(0)
                    .end(),
                )
                .as("topCuts"),
            (eb) =>
              eb(
                eb.cast<number>(
                  eb.fn.sum<number>(
                    eb
                      .case()
                      .when("Entry.standing", "<=", eb.ref("Tournament.topCut"))
                      .then(1)
                      .else(0)
                      .end(),
                  ),
                  "real",
                ),
                "/",
                eb.fn.count<number>("Entry.id"),
              ).as("conversionRate"),
          ])
          .where("Tournament.size", ">=", minSize)
          .where("Tournament.size", "<=", maxSize)
          .where("Tournament.tournamentDate", ">=", minDate.toISOString())
          .where("Tournament.tournamentDate", "<=", maxDate.toISOString())
          .where("Commander.id", "in", commanderIds)
          .groupBy("Commander.id")
          .execute(),
      ]);

      const totalEntries = entriesQuery.totalEntries ?? 1;
      const statsByCommanderId = new Map<number, CommanderCalculatedStats>();
      for (const { id, ...stats } of statsQuery) {
        statsByCommanderId.set(id, {
          ...stats,
          metaShare: stats.count / totalEntries,
        });
      }

      return commanderIds.map(
        (id) =>
          statsByCommanderId.get(id) ?? {
            topCuts: 0,
            conversionRate: 0,
            count: 0,
            metaShare: 0,
          },
      );
    },
  }),
);
