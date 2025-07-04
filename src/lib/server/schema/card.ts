import {
  resolveCursorConnection,
  ResolveCursorConnectionArgs,
} from "@pothos/plugin-relay";
import { db } from "../db";
import { scryfallCardSchema } from "../scryfall";
import { builder } from "./builder";
import { Entry } from "./entry";

const CardEntriesFilters = builder.inputType("CardEntriesFilters", {
  fields: (t) => ({
    colorId: t.string({ required: false }),
    commanderName: t.string({ required: false }),
    tournamentTID: t.string({ required: false }),
  }),
});

export const Card = builder.loadableNode("Card", {
  id: { parse: (id) => Number(id), resolve: (parent) => parent.id },
  load: async (ids: number[]) => {
    const nodes = await db
      .selectFrom("Card")
      .selectAll()
      .where("id", "in", ids)
      .execute();

    const nodesById = new Map<number, (typeof nodes)[number]>();
    for (const node of nodes) nodesById.set(node.id, node);

    return ids.map((id) => nodesById.get(id)!);
  },
  fields: (t) => ({
    name: t.exposeString("name"),
    oracleId: t.exposeString("oracleId"),
    cmc: t.int({
      resolve: (parent) => {
        return scryfallCardSchema.parse(JSON.parse(parent.data)).cmc;
      },
    }),
    colorId: t.string({
      resolve: (parent) => {
        const card = scryfallCardSchema.parse(JSON.parse(parent.data));
        const colorIdentity = new Set(card.color_identity);

        let colorId: string = "";
        for (const c of ["W", "U", "B", "R", "G", "C"]) {
          if (colorIdentity.has(c)) colorId += c;
        }

        return colorId || "C";
      },
    }),
    type: t.string({
      resolve: (parent) => {
        return scryfallCardSchema.parse(JSON.parse(parent.data)).type_line;
      },
    }),
    imageUrls: t.stringList({
      description: `URL's of art crops for each card face.`,
      resolve: (parent) => {
        const card = scryfallCardSchema.parse(JSON.parse(parent.data));
        const cardFaces = card.card_faces ? card.card_faces : [card];
        return cardFaces
          .map((c) => c.image_uris?.art_crop)
          .filter((c): c is string => c != null);
      },
    }),
    cardPreviewImageUrl: t.string({
      description: `Image of the full front card face.`,
      nullable: true,
      resolve: (parent) => {
        const card = scryfallCardSchema.parse(JSON.parse(parent.data));
        const cardFaces = card.card_faces ? card.card_faces : [card];
        return cardFaces
          .map((c) => c.image_uris?.normal)
          .filter((c): c is string => c != null)
          ?.at(0);
      },
    }),
    scryfallUrl: t.string({
      description: `Link to the card on Scryfall.`,
      resolve: (parent) => {
        const card = scryfallCardSchema.parse(JSON.parse(parent.data));
        return card.scryfall_uri;
      },
    }),
    entries: t.connection({
      type: Entry,
      args: {
        filters: t.arg({ type: CardEntriesFilters, required: false }),
      },
      resolve: (parent, args) => {
        return resolveCursorConnection(
          {
            args,
            toCursor: (parent) => `${parent.id}`,
          },
          async ({
            before,
            after,
            limit,
            inverted,
          }: ResolveCursorConnectionArgs) => {
            let query = db
              .selectFrom("DecklistItem")
              .innerJoin("Entry", "Entry.id", "DecklistItem.entryId")
              .leftJoin("Commander", "Commander.id", "Entry.commanderId")
              .where("DecklistItem.cardId", "=", parent.id)
              .selectAll("Entry");

            if (args.filters?.colorId) {
              query = query.where(
                "Commander.colorId",
                "=",
                args.filters.colorId,
              );
            }

            if (args.filters?.commanderName) {
              query = query.where(
                "Commander.name",
                "=",
                args.filters.commanderName,
              );
            }

            if (args.filters?.tournamentTID) {
              query = query
                .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
                .where("Tournament.TID", "=", args.filters.tournamentTID);
            }

            if (before) {
              query = query.where("Entry.id", ">", Number(before));
            }

            if (after) {
              query = query.where("Entry.id", "<", Number(after));
            }

            return query
              .orderBy("Entry.id", inverted ? "asc" : "desc")
              .limit(limit)
              .execute();
          },
        );
      },
    }),
  }),
});

builder.queryField("card", (t) =>
  t.field({
    type: Card,
    args: { name: t.arg.string({ required: true }) },
    resolve: async (_root, args) => {
      return db
        .selectFrom("Card")
        .selectAll()
        .where("name", "=", args.name)
        .executeTakeFirstOrThrow();
    },
  }),
);

builder.queryField("staples", (t) =>
  t.field({
    type: t.listRef(Card),
    resolve: async () => {
      return db
        .selectFrom("Card")
        .selectAll()
        .where("playRateLastYear", ">=", 0.01)
        .orderBy("playRateLastYear desc")
        .execute();
    },
  }),
);
