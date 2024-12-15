import { scryfallCardSchema } from "../scryfall";
import { builder } from "./builder";

export const Card = builder.prismaNode("Card", {
  id: { field: "uuid" },
  fields: (t) => ({
    name: t.exposeString("name"),
    oracleId: t.exposeString("oracleId"),
    cmc: t.int({
      resolve: (parent) => {
        return scryfallCardSchema.parse(parent.data).cmc;
      },
    }),
    colorId: t.string({
      resolve: (parent) => {
        const colorIdentity = new Set(
          scryfallCardSchema.parse(parent.data).color_identity,
        );

        let colorId: string = "";
        for (const c of ["W", "U", "B", "R", "G", "C"]) {
          if (colorIdentity.has(c)) colorId += c;
        }

        return colorId || "C";
      },
    }),
    type: t.string({
      resolve: (parent) => {
        return scryfallCardSchema.parse(parent.data).type_line;
      },
    }),
    imageUrls: t.stringList({
      resolve: (parent) => {
        const card = scryfallCardSchema.parse(parent.data);
        const cardFaces = card.card_faces ? card.card_faces : [card];
        return cardFaces
          .map((c) => c.image_uris?.art_crop)
          .filter((c): c is string => c != null);
      },
    }),
  }),
});
