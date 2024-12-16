import { Card as PrismaCard } from "@prisma/client";
import { ScryfallCard, scryfallCardSchema } from "../scryfall";
import { builder } from "./builder";

const CARD_DATA = Symbol("CARD_DATA");
function getCardData(card: PrismaCard) {
  if (!Object.hasOwn(card, CARD_DATA)) {
    Object.defineProperty(card, CARD_DATA, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: scryfallCardSchema.parse(JSON.parse(card.data)),
    });
  }

  return Object.getOwnPropertyDescriptor(card, CARD_DATA)!
    .value as ScryfallCard;
}

export const Card = builder.prismaNode("Card", {
  id: { field: "uuid" },
  fields: (t) => ({
    name: t.exposeString("name"),
    oracleId: t.exposeString("oracleId"),
    cmc: t.int({
      resolve: (parent) => {
        return getCardData(parent).cmc;
      },
    }),
    colorId: t.string({
      resolve: (parent) => {
        const colorIdentity = new Set(getCardData(parent).color_identity);

        let colorId: string = "";
        for (const c of ["W", "U", "B", "R", "G", "C"]) {
          if (colorIdentity.has(c)) colorId += c;
        }

        return colorId || "C";
      },
    }),
    type: t.string({
      resolve: (parent) => {
        return getCardData(parent).type_line;
      },
    }),
    imageUrls: t.stringList({
      resolve: (parent) => {
        const card = getCardData(parent);
        const cardFaces = card.card_faces ? card.card_faces : [card];
        return cardFaces
          .map((c) => c.image_uris?.art_crop)
          .filter((c): c is string => c != null);
      },
    }),
  }),
});
