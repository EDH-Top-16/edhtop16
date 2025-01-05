import { db } from "../db";
import { builder } from "./builder";
import { Entry } from "./entry";

export const Player = builder.loadableNodeRef("Player", {
  id: { resolve: (parent) => parent.uuid },
  load: async (ids: string[]) => {
    const nodes = await db
      .selectFrom("Player")
      .selectAll()
      .where("uuid", "in", ids)
      .execute();

    const nodesByUuid = new Map<string, (typeof nodes)[number]>();
    for (const node of nodes) nodesByUuid.set(node.uuid, node);

    return ids.map((id) => nodesByUuid.get(id)!);
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
          .where("Entry.playerUuid", "=", parent.uuid)
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
          .where("playerUuid", "=", parent.uuid)
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
          .where("playerUuid", "=", parent.uuid)
          .executeTakeFirstOrThrow();

        return losses;
      },
    }),
    draws: t.int({
      resolve: async (parent) => {
        const { draws } = await db
          .selectFrom("Entry")
          .select((eb) => eb.fn.sum<number>("draws").as("draws"))
          .where("playerUuid", "=", parent.uuid)
          .executeTakeFirstOrThrow();

        return draws;
      },
    }),
    topCuts: t.int({
      resolve: async (parent) => {
        const { topCuts } = await db
          .selectFrom("Entry")
          .select((eb) => eb.fn.count<number>("Entry.uuid").as("topCuts"))
          .leftJoin("Tournament", "Tournament.uuid", "Entry.tournamentUuid")
          .where("Entry.playerUuid", "=", parent.uuid)
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
          .where("Entry.playerUuid", "=", parent.uuid)
          .executeTakeFirstOrThrow();

        return winRate;
      },
    }),
    conversionRate: t.float({
      resolve: async (parent) => {
        const { conversionRate } = await db
          .selectFrom("Entry")
          .leftJoin("Tournament", "Tournament.uuid", "Entry.tournamentUuid")
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
              eb.fn.count<number>("Entry.uuid"),
            ).as("conversionRate"),
          )
          .where("Entry.playerUuid", "=", parent.uuid)
          .executeTakeFirstOrThrow();

        return conversionRate;
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
