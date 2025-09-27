import {DB} from '#genfiles/db/types.js';
import DataLoader from 'dataloader';
import {fromGlobalId, toGlobalId} from 'graphql-relay';
import {Int, Float} from 'grats';
import {Context} from '../context';
import {db} from '../db';
import {ScryfallCard, scryfallCardSchema} from '../scryfall';
import {Connection, GraphQLNode} from './connection';
import {Entry} from './entry';

export type CardLoader = DataLoader<number, Card>;

/** @gqlContext */
export function createCardLoader(ctx: Context): CardLoader {
  return ctx.loader('CardLoader', async (cardIds: readonly number[]) => {
    const cards = await db
      .selectFrom('Card')
      .where('id', 'in', cardIds)
      .selectAll()
      .execute();

    const cardById = new Map<number, Card>();
    for (const c of cards) {
      cardById.set(c.id, new Card(c));
    }

    return cardIds.map(
      (id) => cardById.get(id) ?? new Error(`Could not load card: ${id}`),
    );
  });
}

/** @gqlInput */
export interface CardEntriesFilters {
  colorId?: string;
  commanderName?: string;
  tournamentTID?: string;
}

/** @gqlType */
export class Card implements GraphQLNode {
  id;
  __typename = 'Card' as const;

  /** @gqlField */
  readonly name: string;
  /** @gqlField */
  readonly oracleId: string;

  constructor(private readonly row: DB['Card']) {
    this.id = row.id;
    this.name = row.name;
    this.oracleId = row.oracleId;
    this.scryfallData = scryfallCardSchema.parse(JSON.parse(row.data));
  }

  private readonly scryfallData: ScryfallCard;

  /** @gqlField */
  cmc(): Int {
    return this.scryfallData.cmc;
  }

  /** @gqlField */
  colorId(): string {
    const colorIdentity = new Set(this.scryfallData.color_identity);

    let colorId: string = '';
    for (const c of ['W', 'U', 'B', 'R', 'G', 'C']) {
      if (colorIdentity.has(c)) colorId += c;
    }

    return colorId || 'C';
  }

  /** @gqlField */
  type(): string {
    return this.scryfallData.type_line;
  }

  /**
   * URL's of art crops for each card face.
   * @gqlField
   */
  imageUrls(): string[] {
    const card = this.scryfallData;
    const cardFaces = card.card_faces ? card.card_faces : [card];
    return cardFaces
      .map((c) => c.image_uris?.art_crop)
      .filter((c): c is string => c != null);
  }

  /**
   * Image of the full front card face.
   * @gqlField
   */
  cardPreviewImageUrl(): string | undefined {
    const card = this.scryfallData;
    const cardFaces = card.card_faces ? card.card_faces : [card];
    return cardFaces
      .map((c) => c.image_uris?.normal)
      .filter((c): c is string => c != null)
      ?.at(0);
  }

  /**
   * Link to the card on Scryfall.
   * @gqlField
   */
  scryfallUrl(): string {
    return this.scryfallData.scryfall_uri;
  }

  /** @gqlField */
  playRateLastYear(): Float {
    return this.row.playRateLastYear ?? 0;
  }

  /** @gqlField */
  async entries(
    first: Int = 20,
    after?: string | null,
    filters?: CardEntriesFilters | null,
  ): Promise<Connection<Entry>> {
    let query = db
      .selectFrom('DecklistItem')
      .innerJoin('Entry', 'Entry.id', 'DecklistItem.entryId')
      .leftJoin('Commander', 'Commander.id', 'Entry.commanderId')
      .where('DecklistItem.cardId', '=', this.id)
      .selectAll('Entry');

    if (filters?.colorId) {
      query = query.where('Commander.colorId', '=', filters.colorId);
    }

    if (filters?.commanderName) {
      query = query.where('Commander.name', '=', filters.commanderName);
    }

    if (filters?.tournamentTID) {
      query = query
        .leftJoin('Tournament', 'Tournament.id', 'Entry.tournamentId')
        .where('Tournament.TID', '=', filters.tournamentTID);
    }

    if (after) {
      const {id} = fromGlobalId(after);
      query = query.where('Entry.id', '<', Number(id));
    }

    const rows = await query
      .orderBy('Entry.id', 'desc')
      .limit(first + 1)
      .execute();

    const edges = rows.slice(0, first).map((r) => ({
      cursor: toGlobalId('Entry', r.id),
      node: new Entry(r),
    }));

    return {
      edges,
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: rows.length > edges.length,
        startCursor: edges.at(0)?.cursor ?? null,
        endCursor: edges.at(-1)?.cursor ?? null,
      },
    };
  }

  /** @gqlQueryField */
  static async card(name: string): Promise<Card> {
    const row = await db
      .selectFrom('Card')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();

    return new Card(row);
  }

  /** @gqlQueryField */
  static async staples(colorId?: string | null): Promise<Card[]> {
    const rows = await db
      .selectFrom('Card')
      .selectAll()
      .where('playRateLastYear', '>=', 0.01)
      .orderBy('playRateLastYear desc')
      .execute();

    const cards = rows.map((r) => new Card(r));

    if (colorId) {
      // Filter cards that match the color identity exactly
      return cards.filter((card) => {
        const cardColorId = card.colorId();
        return cardColorId === colorId;
      });
    }

    return cards;
  }
}
