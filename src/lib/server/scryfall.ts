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

export type ScryfallCard = z.infer<typeof scryfallCardSchema>;
export const scryfallCardSchema = scryfallCardFaceSchema.extend({
  object: z.literal("card"),
  id: z.string().uuid(),
  oracle_id: z.string().uuid(),
  name: z.string(),
  card_faces: z.array(scryfallCardFaceSchema).optional(),
  cmc: z.number(),
  color_identity: z.array(z.string()),
  type_line: z.string(),
});

const scryfallCardListSchema = z.object({
  object: z.literal("list"),
  total_cards: z.number(),
  has_more: z.boolean(),
  data: z.array(scryfallCardSchema),
});

async function scryfallSearch(
  searchParams: Record<string, string>,
): Promise<z.infer<typeof scryfallCardListSchema>> {
  const url = new URL("https://api.scryfall.com/cards/search");
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "*/*", "User-Agent": "edhtop16/2.0" },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    console.error(errorMessage);
    throw new Error(`Could not fetch: ${errorMessage}`);
  }

  const json = await res.json();
  return scryfallCardListSchema.parse(json);
}

async function getCardsByName(
  cardNames: readonly string[],
): Promise<(ScryfallCard | Error)[]> {
  const results = await scryfallSearch({
    q: cardNames.map((c) => `!"${c}"`).join(" OR "),
  });

  const cardsByName = new Map<string, ScryfallCard>();
  for (const card of results.data) {
    cardsByName.set(card.name, card);
  }

  return cardNames.map((c) => {
    return cardsByName.get(c) ?? new Error(`Could not lookup card: ${c}`);
  });
}

export type ScryfallCardLoader = DataLoader<string, ScryfallCard>;
export function createScryfallCardLoader() {
  return new DataLoader<string, ScryfallCard>(getCardsByName, {
    // Scryfall's max page size is 175, but has a query character limit of 1000.
    // To avoid being cut off we cap the batch size at around 30.
    maxBatchSize: 30,
  });
}

export function createScryfallOracleIdLoader() {
  return new DataLoader<string, ScryfallCard>(
    async (oracleIds) => {
      const results = await scryfallSearch({
        unique: "cards",
        q: oracleIds.map((id) => `oracleid:${id}`).join(" OR "),
      });

      console.log(results);
      return [];
    },
    {
      // Scryfall's max page size is 175, but has a query character limit of 1000.
      // To avoid being cut off we cap the batch size at around 30.
      maxBatchSize: 30,
    },
  );
}

export function createScyfallIdLoader() {
  return new DataLoader<string, ScryfallCard>(
    async (oracleIds) => {
      const results = await scryfallSearch({
        unique: "cards",
        q: oracleIds.map((id) => `scryfallid:${id}`).join(" OR "),
      });

      const cardsById = new Map<string, ScryfallCard>();
      for (const card of results.data) {
        cardsById.set(card.id, card);
      }

      return oracleIds.map((id) => {
        return cardsById.get(id) ?? new Error(`Could not lookup card: ${id}`);
      });
    },
    {
      // Scryfall's max page size is 175, but has a query character limit of 1000.
      // To avoid being cut off we cap the batch size at around 30.
      maxBatchSize: 30,
    },
  );
}
