import { resolveOffsetConnection } from "@pothos/plugin-relay";
import { sql } from "kysely";
import { db } from "../db";
import { DB } from "../db/__generated__/types";
import { builder } from "./builder";
import { Commander } from "./commander";
import { Entry } from "./entry";
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
      type: [Entry],
      resolve: (parent) => {
        return parent.players.map((p) => ({
          TID: parent.TID,
          profile: p.id,
        }));
      },
      load: async (keys: { TID: string; profile: string }[]) => {
        const entries = await sql<DB["Entry"] & { key: string }>`
          select e.*, t."TID" || ':' || p."topdeckProfile" as key
          from "Entry" as e
          left join "Tournament" t on t.uuid = e."tournamentUuid"
          left join "Player" p on p.uuid = e."playerUuid"
          where t."TID" || ':' || p."topdeckProfile" in (${sql.join(
            keys.map((e) => `${e.TID}:${e.profile}`),
          )})
        `.execute(db);

        const entriesByKey = new Map(entries.rows.map((e) => [e.key, e]));
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
      type: Entry,
      nullable: true,
      resolve: (parent) => {
        const winnerPlayer = parent.players.find(
          (p) => p.name === parent.winner,
        );

        if (winnerPlayer == null) {
          return null;
        }

        return db
          .selectFrom("Entry")
          .leftJoin("Tournament", "Tournament.uuid", "Entry.tournamentUuid")
          .leftJoin("Player", "Player.uuid", "Entry.playerUuid")
          .selectAll("Entry")
          .where("Tournament.TID", "=", parent.TID)
          .where("Player.topdeckProfile", "=", winnerPlayer.id)
          .executeTakeFirst();
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
    commander: t.field({
      type: Commander,
      resolve: (parent, _args, ctx) => {
        return Commander.getDataloader(ctx).load(parent.commanderUuid);
      },
    }),
  }),
});

export const Tournament = builder.loadableNodeRef("Tournament", {
  id: { resolve: (parent) => parent.uuid },
  load: async (ids: string[]) => {
    const nodes = await db
      .selectFrom("Tournament")
      .selectAll()
      .where("uuid", "in", ids)
      .execute();

    const nodesByUuid = new Map<string, (typeof nodes)[number]>();
    for (const node of nodes) nodesByUuid.set(node.uuid, node);

    return ids.map((id) => nodesByUuid.get(id)!);
  },
});

Tournament.implement({
  fields: (t) => ({
    TID: t.exposeString("TID"),
    name: t.exposeString("name"),
    size: t.exposeInt("size"),
    swissRounds: t.exposeInt("swissRounds"),
    topCut: t.exposeInt("topCut"),
    tournamentDate: t.string({
      resolve: (tournament) => tournament.tournamentDate,
    }),
    entries: t.field({
      type: [Entry],
      args: { maxStanding: t.arg.int(), commander: t.arg.string() },
      resolve: (parent, args) => {
        let query = db
          .selectFrom("Entry")
          .leftJoin("Commander", "Commander.uuid", "Entry.commanderUuid")
          .selectAll("Entry")
          .where("Entry.tournamentUuid", "=", parent.uuid);

        if (args.maxStanding) {
          query = query.where("Entry.standing", "<=", args.maxStanding);
        }
        if (args.commander) {
          query = query.where("Commander.name", "=", args.commander);
        }

        return query.orderBy("standing asc").execute();
      },
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
        const groups = await sql<Group>`
          select
            e."commanderUuid",
            count(e."commanderUuid") as entries,
            sum(case when e.standing <= t."topCut" then 1 else 0 end) as "topCuts",
            sum(case when e.standing <= t."topCut" then 1.0 else 0.0 end) / count(e.uuid) as "conversionRate"
          from "Entry" as e
          left join "Tournament" t on t.uuid = e."tournamentUuid"
          left join "Commander" c on c.uuid = e."commanderUuid"
          where t."uuid" = ${parent.uuid}
          and c.name != 'Unknown Commander'
          group by e."commanderUuid"
          order by "topCuts" desc, entries desc
        `.execute(db);

        return groups.rows;
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
    minDate: t.string(),
    maxDate: t.string(),
    minSize: t.int(),
    maxSize: t.int(),
  }),
});

builder.queryField("tournaments", (t) =>
  t.connection({
    type: Tournament,
    args: {
      search: t.arg.string(),
      filters: t.arg({ type: TournamentFiltersInput }),
      sortBy: t.arg({ type: TournamentSortBy, defaultValue: "DATE" }),
    },
    resolve: async (_, args) =>
      resolveOffsetConnection({ args }, ({ limit, offset }) => {
        let query = db.selectFrom("Tournament").selectAll();

        if (args.search) {
          query = query.where("name", "like", `%${args.search}%`);
        }
        if (args.filters?.minSize) {
          query = query.where("size", ">=", args.filters.minSize);
        }
        if (args.filters?.maxSize) {
          query = query.where("size", "<=", args.filters.maxSize);
        }
        if (args.filters?.timePeriod || args.filters?.minDate) {
          const minDate =
            args.filters?.minDate != null
              ? new Date(args.filters?.minDate ?? 0)
              : minDateFromTimePeriod(args.filters?.timePeriod);

          query = query.where("tournamentDate", ">=", minDate.toISOString());
        }
        if (args.filters?.maxDate) {
          const maxDate = new Date(args.filters.maxDate);
          query = query.where("tournamentDate", "<=", maxDate.toISOString());
        }

        if (args.sortBy === "PLAYERS") {
          query = query.orderBy(["size desc", "tournamentDate desc"]);
        } else {
          query = query.orderBy(["tournamentDate desc", "size desc"]);
        }

        return query.limit(limit).offset(offset).execute();
      }),
  }),
);

builder.queryField("tournament", (t) =>
  t.field({
    type: Tournament,
    args: { TID: t.arg.string({ required: true }) },
    resolve: async (_root, args) => {
      return db
        .selectFrom("Tournament")
        .selectAll()
        .where("TID", "=", args.TID)
        .executeTakeFirstOrThrow();
    },
  }),
);
