import {DB} from '@/genfiles/db/types.js';
import {fromGlobalId, toGlobalId} from 'graphql-relay';
import {Selectable, sql} from 'kysely';
import {Connection} from './connection';
import {db} from './db';
import {Entry} from './entry';
import {ScryfallCard, scryfallCardSchema} from './scryfall';
import {ViewerContext} from './ViewerContext';

export type ClientCard = ReturnType<Card['toClient']>;

export interface CardEntriesFilters {
  colorId?: string;
  commanderName?: string;
  tournamentTID?: string;
}

export class Card implements Selectable<DB['Card']> {
  readonly id: number;
  readonly name: string;
  readonly oracleId: string;
  readonly data: string;

  private readonly playRateOverride?: number;

  constructor(
    private readonly vc: ViewerContext,
    private readonly row: Selectable<DB['Card']>,
    opts?: {playRateOverride?: number | null},
  ) {
    this.id = row.id;
    this.name = row.name;
    this.oracleId = row.oracleId;
    this.data = row.data;

    this.scryfallData = scryfallCardSchema.parse(JSON.parse(row.data));
    this.playRateOverride = opts?.playRateOverride ?? undefined;
  }

  private readonly scryfallData: ScryfallCard;

  cmc(): number {
    return this.scryfallData.cmc;
  }

  /** Mana cost string in Scryfall format, e.g. "{2}{W}{U}" */
  manaCost(): string {
    // For double-faced cards, get mana cost from the first face
    if (this.scryfallData.card_faces) {
      return this.scryfallData.card_faces[0]?.mana_cost ?? '';
    }
    return this.scryfallData.mana_cost ?? '';
  }

  colorId(): string {
    const colorIdentity = new Set(this.scryfallData.color_identity);

    let colorId: string = '';
    for (const c of ['W', 'U', 'B', 'R', 'G', 'C']) {
      if (colorIdentity.has(c)) colorId += c;
    }

    return colorId || 'C';
  }

  type(): string {
    return this.scryfallData.type_line;
  }

  /** URL's of art crops for each card face. */
  imageUrls(): string[] {
    const card = this.scryfallData;
    const cardFaces = card.card_faces ? card.card_faces : [card];
    return cardFaces
      .map((c) => c.image_uris?.art_crop)
      .filter((c): c is string => c != null);
  }

  /** Image of the full front card face. */
  cardPreviewImageUrl(): string | undefined {
    const card = this.scryfallData;
    const cardFaces = card.card_faces ? card.card_faces : [card];
    return cardFaces
      .map((c) => c.image_uris?.normal)
      .filter((c): c is string => c != null)
      ?.at(0);
  }

  /** Link to the card on Scryfall. */
  scryfallUrl(): string {
    return this.scryfallData.scryfall_uri;
  }

  get playRateLastYear(): number {
    return this.playRateOverride ?? this.row.playRateLastYear ?? 0;
  }

  async entries(
    first: number = 20,
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
      node: new Entry(this.vc, r),
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

  static async card(vc: ViewerContext, name: string): Promise<Card> {
    const row = await db
      .selectFrom('Card')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();

    return new Card(vc, row);
  }

  static async staples(
    vc: ViewerContext,
    colorId?: string | null,
    type?: string | null,
  ): Promise<Card[]> {
    let query = db
      .selectFrom('Card')
      .selectAll()
      .where('playRateLastYear', '>=', 0.01);

    if (colorId) {
      // Build color identity filter using JSON functions
      const colors = ['W', 'U', 'B', 'R', 'G', 'C'];
      const expectedColors = colorId === 'C' ? [] : colorId.split('');

      // For each color position, check if it should be present or absent
      for (const color of colors) {
        if (color === 'C') continue; // Skip colorless in the array check

        const shouldHaveColor = expectedColors.includes(color);
        if (shouldHaveColor) {
          // Color should be present in the color_identity array
          query = query.where(
            db.fn('json_extract', ['data', sql`'$.color_identity'`]),
            'like',
            `%"${color}"%`,
          );
        } else {
          // Color should NOT be present in the color_identity array
          query = query.where(
            db.fn('json_extract', ['data', sql`'$.color_identity'`]),
            'not like',
            `%"${color}"%`,
          );
        }
      }

      // Handle colorless case - should have empty color_identity array
      if (colorId === 'C') {
        query = query.where(
          db.fn('json_extract', ['data', sql`'$.color_identity'`]),
          '=',
          '[]',
        );
      }
    }

    if (type) {
      // Filter cards by type (case-insensitive partial match)
      query = query.where(
        db.fn('lower', [db.fn('json_extract', ['data', sql`'$.type_line'`])]),
        'like',
        `%${type.toLowerCase()}%`,
      );
    }

    const rows = await query.orderBy('playRateLastYear desc').execute();

    const cards = rows.map((r) => new Card(vc, r));

    return cards;
  }

  primaryType(): PrimaryCardType {
    const normalized = this.type().toLowerCase();
    if (normalized.includes('creature')) return 'Creature';
    if (normalized.includes('instant')) return 'Instant';
    if (normalized.includes('sorcery')) return 'Sorcery';
    if (normalized.includes('artifact')) return 'Artifact';
    if (normalized.includes('enchantment')) return 'Enchantment';
    if (normalized.includes('planeswalker')) return 'Planeswalker';
    if (normalized.includes('battle')) return 'Battle';
    if (normalized.includes('land')) return 'Land';
    return 'Artifact';
  }

  toClient() {
    return {
      ['&brand']: 'client',
      id: this.id,
      name: this.name,
      playRateLastYear: this.playRateLastYear,
      scryfallUrl: this.scryfallUrl(),
      manaCost: this.manaCost(),
    };
  }
}

export const PRIMARY_CARD_TYPE_ORDER = [
  'Creature',
  'Instant',
  'Sorcery',
  'Artifact',
  'Enchantment',
  'Planeswalker',
  'Battle',
  'Land',
] as const;

export type PrimaryCardType = (typeof PRIMARY_CARD_TYPE_ORDER)[number];
