import { isAfter } from "date-fns";
import { db } from "../db";
import { builder } from "./builder";
import { Entry } from "./entry";

const ALL_KNOWN_CHEATERS: { topdeckProfile: string; expiration: Date }[] = [
  // https://docs.google.com/document/d/1m7aHiwIl11RKnpp7aYVzOA8daPijgbygbLreWi5cmeM/edit?tab=t.0
  {
    topdeckProfile: "eUiV4NK8aWXDzUpX8ieUCC8C9On1",
    expiration: new Date("2026-03-21"),
  },
  // https://docs.google.com/document/d/1HVo6lrWz252eu-8eNVzjY0MPddOt-uucFQobKDMI7Zk/edit?usp=drivesdk
  {
    topdeckProfile: "QnHqzI3FgmgQsJOLZNU9CuizkKC3",
    expiration: new Date("2025-01-01"),
  },
];

const now = Date.now();
const UNEXPIRED_CHEATERS = new Set(
  ALL_KNOWN_CHEATERS.filter((p) => isAfter(p.expiration, now)).map(
    (p) => p.topdeckProfile,
  ),
);

export const Player = builder.loadableNodeRef("Player", {
  id: { parse: (id) => Number(id), resolve: (parent) => parent.id },
  load: async (ids: number[]) => {
    const nodes = await db
      .selectFrom("Player")
      .selectAll()
      .where("id", "in", ids)
      .execute();

    const nodesById = new Map<number, (typeof nodes)[number]>();
    for (const node of nodes) nodesById.set(node.id, node);

    return ids.map((id) => nodesById.get(id)!);
  },
});

Player.implement({
  fields: (t) => ({
    name: t.exposeString("name"),
    topdeckProfile: t.exposeString("topdeckProfile", { nullable: true }),
    entries: t.field({
      type: [Entry],
      resolve: (parent) => {
        return db
          .selectFrom("Entry")
          .selectAll()
          .where("Entry.playerId", "=", parent.id)
          .execute();
      },
    }),
    wins: t.int({
      resolve: async (parent) => {
        const { wins } = await db
          .selectFrom("Entry")
          .select((eb) =>
            eb(
              eb.fn.sum<number>("winsBracket"),
              "+",
              eb.fn.sum<number>("winsSwiss"),
            ).as("wins"),
          )
          .where("playerId", "=", parent.id)
          .executeTakeFirstOrThrow();

        return wins;
      },
    }),
    losses: t.int({
      resolve: async (parent, _args) => {
        const { losses } = await db
          .selectFrom("Entry")
          .select((eb) =>
            eb(
              eb.fn.sum<number>("lossesBracket"),
              "+",
              eb.fn.sum<number>("lossesSwiss"),
            ).as("losses"),
          )
          .where("playerId", "=", parent.id)
          .executeTakeFirstOrThrow();

        return losses;
      },
    }),
    draws: t.int({
      resolve: async (parent) => {
        const { draws } = await db
          .selectFrom("Entry")
          .select((eb) => eb.fn.sum<number>("draws").as("draws"))
          .where("playerId", "=", parent.id)
          .executeTakeFirstOrThrow();

        return draws;
      },
    }),
    topCuts: t.int({
      resolve: async (parent) => {
        const { topCuts } = await db
          .selectFrom("Entry")
          .select((eb) => eb.fn.count<number>("Entry.id").as("topCuts"))
          .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
          .where("Entry.playerId", "=", parent.id)
          .where((eb) =>
            eb("Entry.standing", "<=", eb.ref("Tournament.topCut")),
          )
          .executeTakeFirstOrThrow();

        return topCuts;
      },
    }),
    winRate: t.float({
      resolve: async (parent) => {
        const { winRate } = await db
          .selectFrom("Entry")
          .select((eb) =>
            eb(
              eb(
                eb.fn.sum<number>("winsBracket"),
                "+",
                eb.fn.sum<number>("winsSwiss"),
              ),
              "/",
              eb(
                eb.fn.sum<number>("winsBracket"),
                "+",
                eb(
                  eb.fn.sum<number>("winsSwiss"),
                  "+",
                  eb(
                    eb.fn.sum<number>("lossesBracket"),
                    "+",
                    eb(
                      eb.fn.sum<number>("lossesSwiss"),
                      "+",
                      eb.fn.sum<number>("draws"),
                    ),
                  ),
                ),
              ),
            ).as("winRate"),
          )
          .where("Entry.playerId", "=", parent.id)
          .executeTakeFirstOrThrow();

        return winRate;
      },
    }),
    conversionRate: t.float({
      resolve: async (parent) => {
        const { conversionRate } = await db
          .selectFrom("Entry")
          .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
          .select((eb) =>
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
          )
          .where("Entry.playerId", "=", parent.id)
          .executeTakeFirstOrThrow();

        return conversionRate;
      },
    }),
    isKnownCheater: t.boolean({
      resolve: (parent) => {
        return (
          parent.topdeckProfile != null &&
          UNEXPIRED_CHEATERS.has(parent.topdeckProfile)
        );
      },
    }),
  }),
});

builder.queryField("player", (t) =>
  t.field({
    type: Player,
    args: { profile: t.arg.string({ required: true }) },
    resolve: async (_root, args) => {
      return db
        .selectFrom("Player")
        .selectAll()
        .where("topdeckProfile", "=", args.profile)
        .executeTakeFirstOrThrow();
    },
  }),
);
