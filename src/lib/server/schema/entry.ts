import { db } from "../db";
import { builder } from "./builder";
import { Card } from "./card";
import { Commander } from "./commander";
import { Player } from "./player";
import { Tournament } from "./tournament";
import { TopdeckTournamentTableType } from "./types";

export const EntryFilters = builder.inputType("EntryFilters", {
  fields: (t) => ({
    minSize: t.int(),
    maxSize: t.int(),
    minDate: t.string(),
    maxDate: t.string(),
    minStanding: t.int(),
    maxStanding: t.int(),
    minWins: t.int(),
    maxWins: t.int(),
    minLosses: t.int(),
    maxLosses: t.int(),
    minDraws: t.int(),
    maxDraws: t.int(),
  }),
});

export const EntrySortBy = builder.enumType("EntrySortBy", {
  values: ["STANDING", "WINS", "LOSSES", "DRAWS", "WINRATE", "DATE"] as const,
});

export const Entry = builder.loadableNodeRef("Entry", {
  id: { resolve: (parent) => parent.uuid },
  load: async (ids: string[]) => {
    const nodes = await db
      .selectFrom("Entry")
      .selectAll()
      .where("uuid", "in", ids)
      .execute();

    const nodesByUuid = new Map<string, (typeof nodes)[number]>();
    for (const node of nodes) nodesByUuid.set(node.uuid, node);

    return ids.map((id) => nodesByUuid.get(id)!);
  },
});

Entry.implement({
  fields: (t) => ({
    standing: t.exposeInt("standing"),
    decklist: t.exposeString("decklist", { nullable: true }),
    winsSwiss: t.exposeInt("winsSwiss"),
    winsBracket: t.exposeInt("winsBracket"),
    draws: t.exposeInt("draws"),
    lossesSwiss: t.exposeInt("lossesSwiss"),
    lossesBracket: t.exposeInt("lossesBracket"),
    commander: t.field({
      type: Commander,
      resolve: (parent, _args, ctx) =>
        Commander.getDataloader(ctx).load(parent.commanderUuid),
    }),
    player: t.field({
      type: Player,
      nullable: true,
      resolve: (parent) => {
        return db
          .selectFrom("Player")
          .selectAll()
          .where("Player.uuid", "=", parent.playerUuid)
          .executeTakeFirst();
      },
    }),
    tournament: t.field({
      type: Tournament,
      resolve: (parent, _args, ctx) => {
        return Tournament.getDataloader(ctx).load(parent.tournamentUuid);
      },
    }),
    wins: t.int({
      resolve: (parent) => parent.winsBracket + parent.winsSwiss,
    }),
    losses: t.int({
      resolve: (parent) => parent.lossesBracket + parent.lossesSwiss,
    }),
    winRate: t.float({
      nullable: true,
      resolve: (parent) => {
        const wins = parent.winsBracket + parent.winsSwiss;
        const games =
          wins + parent.lossesBracket + parent.lossesSwiss + parent.draws;

        if (games === 0) return null;
        return wins / games;
      },
    }),
    tables: t.field({
      type: t.listRef(TopdeckTournamentTableType),
      resolve: async (parent, _args, ctx) => {
        if (!parent.playerUuid) return [];

        const { TID } = await db
          .selectFrom("Tournament")
          .select("TID")
          .where("uuid", "=", parent.tournamentUuid)
          .executeTakeFirstOrThrow();

        const { topdeckProfile } = await db
          .selectFrom("Player")
          .select("topdeckProfile")
          .where("uuid", "=", parent.playerUuid)
          .executeTakeFirstOrThrow();

        const roundsData = await ctx.topdeckClient.loadRoundsData(TID);

        return (
          roundsData?.rounds.flatMap((round) =>
            round.tables
              .filter((t) => t.players.some((p) => p.id === topdeckProfile))
              .map((r) => ({ ...r, TID, roundName: `${round.round}` })),
          ) ?? []
        );
      },
    }),
    maindeck: t.field({
      type: t.listRef(Card),
      resolve: async (parent) => {
        return db
          .selectFrom("DecklistItem")
          .innerJoin("Card", "Card.uuid", "DecklistItem.cardUuid")
          .selectAll("Card")
          .where("DecklistItem.entryUuid", "=", parent.uuid)
          .execute();
      },
    }),
  }),
});
