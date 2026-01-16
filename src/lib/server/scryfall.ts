import {z} from 'zod/v4';

const scryfallCardFaceSchema = z.object({
  mana_cost: z.string().optional(),
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
  object: z.literal('card'),
  id: z.string().uuid(),
  oracle_id: z.string().uuid(),
  name: z.string(),
  scryfall_uri: z.string().url(),
  card_faces: z.array(scryfallCardFaceSchema).optional(),
  cmc: z.number(),
  color_identity: z.array(z.string()),
  type_line: z.string(),
});
