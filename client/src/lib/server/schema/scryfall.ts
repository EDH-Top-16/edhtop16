import DataLoader from "dataloader";
import { z } from "zod";

const scryfallCardFaceSchema = z.object({
  image_uris: z
    .object({
      small: z.string(),
      normal: z.string(),
      large: z.string(),
      png: z.string(),
      art_crop: z.string(),
      border_crop: z.string(),
    })
    .optional(),
});

type ScryfallCard = z.infer<typeof scryfallCardSchema>;
const scryfallCardSchema = scryfallCardFaceSchema.extend({
  object: z.literal("card"),
  name: z.string(),
  card_faces: z.array(scryfallCardFaceSchema).optional(),
});

const scryfallCardListSchema = z.object({
  object: z.literal("list"),
  total_cards: z.number(),
  has_more: z.boolean(),
  data: z.array(scryfallCardSchema),
});

export type ScryfallCardLoader = DataLoader<string, ScryfallCard>;
export function createScryfallCardLoader() {
  return new DataLoader<string, ScryfallCard>(async (cardNames) => {
    console.log("Loading", cardNames);
    const url = new URL("https://api.scryfall.com/cards/search");
    url.searchParams.set("q", cardNames.map((c) => `!"${c}"`).join(" OR "));

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "*/*", "User-Agent": "edhtop16/2.0" },
    });

    if (!res.ok) {
      throw new Error("Could not fetch: " + (await res.text()));
    }

    const json = await res.json();
    const cardList = scryfallCardListSchema.parse(json);

    const cardsByName = new Map<string, ScryfallCard>();
    for (const card of cardList.data) {
      cardsByName.set(card.name, card);
    }

    return cardNames.map(
      (c) => cardsByName.get(c) ?? new Error(`Could not lookup card: ${c}`),
    );
  });
}
