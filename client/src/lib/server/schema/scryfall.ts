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

const scryfallCardSchema = scryfallCardFaceSchema.extend({
  card_faces: z.array(scryfallCardFaceSchema).optional(),
});

export async function getCardByName(cardName: string) {
  const url = new URL("https://api.scryfall.com/cards/named");
  url.searchParams.set("exact", cardName);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Could not fetch: " + (await res.text()));
  }

  const json = await res.json();
  return scryfallCardFaceSchema.parse(json);
}
