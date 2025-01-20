import { db } from "../db";
import { scryfallCardSchema } from "../scryfall";
import { builder } from "./builder";

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
  }),
});
