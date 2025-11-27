/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form.
 */

import Database from 'better-sqlite3';
import Dataloader from 'dataloader';
import {subYears} from 'date-fns';
import {type InsertObject, Kysely, SqliteDialect} from 'kysely';
import {createWriteStream} from 'node:fs';
import fs from 'node:fs/promises';
import {parseArgs} from 'node:util';
import pc from 'picocolors';
import * as undici from 'undici';
import {z} from 'zod/v4';
import type {DB} from '../__generated__/db/types';
import {
  type ScryfallCard,
  scryfallCardSchema,
} from '../src/lib/server/scryfall.ts';

class TopDeckClient {
  static readonly player = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string().nullable(),
    pronouns: z.string().nullable(),
    profileImage: z.string().nullable(),
    headerImage: z.string().nullable(),
    elo: z.number().nullable(),
    gamesPlayed: z.number().nullable(),
    about: z.string().nullable(),
    twitter: z.string().nullable(),
    youtube: z.string().nullable(),
  });

  static readonly tournament = z.object({
    TID: z.string(),
    tournamentName: z.string(),
    swissNum: z.number(),
    startDate: z.number(),
    game: z.string(),
    format: z.string(),
    averageElo: z.number().optional(),
    modeElo: z.number().optional(),
    medianElo: z.number().optional(),
    topElo: z.number().optional(),
    eventData: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      location: z.string().optional(),
      headerImage: z.string().optional(),
    }),
    topCut: z.number(),
    standings: z.array(
      z.object({
        id: z.string(),
        winsSwiss: z.number().int(),
        winsBracket: z.number().int(),
        draws: z.number().int(),
        lossesSwiss: z.number().int(),
        lossesBracket: z.number().int(),
        byes: z.number().int(),
      }),
    ),
  });

  static readonly tournamentDetail = z.object({
    data: z.object({
      name: z.string(),
      game: z.string(),
      format: z.string(),
      startDate: z.number(),
    }),
    standings: z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        decklist: z.string().nullable(),
        deckObj: z
          .object({
            Commanders: z.record(
              z.string(),
              z.object({id: z.string(), count: z.number()}),
            ),
            Mainboard: z.record(
              z.string(),
              z.object({id: z.string(), count: z.number()}),
            ),
            metadata: z.object({
              game: z.string(),
              format: z.string(),
              importedFrom: z.string().optional(),
            }),
          })
          .nullable(),
        standing: z.number(),
        points: z.number(),
        winRate: z.number().nullish(),
        opponentWinRate: z.number().nullish(),
      }),
    ),
  });

  private readonly apiKey: string;
  private readonly baseUrl = 'https://topdeck.gg/api/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    schema: z.ZodType<T>,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: this.apiKey,
      Accept: '*/*',
      'User-Agent': 'edhtop16/2.0',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await undici.request(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.statusCode >= 400) {
      throw new Error(
        `TopDeck API request failed: ${response.statusCode} - ${await response.body.text()}`,
      );
    }

    const json = await response.body.json();
    return schema.parse(json);
  }

  readonly players = new Dataloader(
    (ids: readonly string[]) => {
      const queryString = ids
        .map((id) => `id=${encodeURIComponent(id)}`)
        .join('&');

      return this.request(
        'GET',
        `/player?${queryString}`,
        z.array(TopDeckClient.player),
      );
    },
    {maxBatchSize: 15},
  );

  readonly tournaments = new Dataloader((tids: readonly string[]) => {
    return Promise.all(
      tids.map((tournamentId) => {
        return this.request(
          'GET',
          `/tournaments/${tournamentId}`,
          TopDeckClient.tournamentDetail,
        );
      }),
    );
  });

  async listTournaments(options: {last?: number; tids?: string[]}) {
    return this.request(
      'POST',
      '/tournaments',
      z.array(TopDeckClient.tournament),
      {
        game: 'Magic: The Gathering',
        format: 'EDH',
        columns: [
          'id',
          'winsSwiss',
          'winsBracket',
          'draws',
          'lossesSwiss',
          'lossesBracket',
          'byes',
        ],
        ...options,
      },
    );
  }
}

class ScryfallDatabase {
  private static scryfallBulkDataSchema = z.object({
    object: z.literal('list'),
    data: z.array(
      z.object({
        object: z.literal('bulk_data'),
        type: z.enum([
          'oracle_cards',
          'unique_artwork',
          'default_cards',
          'all_cards',
          'rulings',
        ]),
        download_uri: z.string().url(),
        content_type: z.string(),
        content_encoding: z.string(),
      }),
    ),
  });

  static async create(kind: 'default_cards' | 'oracle_cards') {
    const databaseFileName = `./${kind}.scryfall.json`;

    try {
      await fs.access(databaseFileName, fs.constants.F_OK);
      console.log(
        pc.green(
          `Found cached Scryfall bulk database: ${pc.cyan(databaseFileName)}`,
        ),
      );
    } catch (e) {
      console.log(pc.cyan('Requesting Scryfall bulk data URL...'));
      const scryfallBulkDataResponse = await undici.request(
        'https://api.scryfall.com/bulk-data',
        {headers: {Accept: '*/*', 'User-Agent': 'edhtop16/2.0'}},
      );

      if (scryfallBulkDataResponse.statusCode >= 400) {
        throw new Error(
          'Could not load bulk data: ' +
            (await scryfallBulkDataResponse.body.text()),
        );
      }

      const scryfallBulkDataJson = await scryfallBulkDataResponse.body.json();
      const {data: scryfallBulkData} =
        ScryfallDatabase.scryfallBulkDataSchema.parse(scryfallBulkDataJson);

      const databaseUrl = scryfallBulkData.find(
        (d) => d.type === kind,
      )?.download_uri;

      if (!databaseUrl) {
        throw new Error(
          `Could not find URL for Scryfall bulk data export: ${pc.cyan(kind)}`,
        );
      }

      console.log(
        `Downloading Scryfall database: ${pc.cyan(kind)} from ${pc.cyan(
          databaseUrl,
        )}`,
      );

      await undici.stream(databaseUrl, {method: 'GET'}, () =>
        createWriteStream(databaseFileName),
      );
    }

    console.log(`Loading Scryfall database JSON: ${pc.cyan(kind)}`);
    const scryfallDatabaseJson = (
      await fs.readFile(databaseFileName)
    ).toString();

    console.log(`Parsing Scryfall database JSON: ${pc.cyan(kind)}`);
    return new ScryfallDatabase(JSON.parse(scryfallDatabaseJson));
  }

  readonly cardByScryfallId: ReadonlyMap<string, ScryfallCard>;
  readonly cardByOracleId: ReadonlyMap<string, ScryfallCard>;
  readonly cardByName: ReadonlyMap<string, ScryfallCard>;

  private constructor(cards: ScryfallCard[]) {
    const cardByScryfallId = new Map<string, ScryfallCard>();
    const cardByOracleId = new Map<string, ScryfallCard>();
    const cardByName = new Map<string, ScryfallCard>();

    for (const card of cards) {
      cardByScryfallId.set(card.id, card);
      cardByOracleId.set(card.oracle_id, card);
      cardByName.set(card.name, card);
    }

    this.cardByScryfallId = cardByScryfallId;
    this.cardByOracleId = cardByOracleId;
    this.cardByName = cardByName;
  }
}

const args = parseArgs({
  options: {
    tid: {
      type: 'string',
      multiple: true,
    },
  },
});

if (!process.env.TOPDECK_GG_API_KEY) {
  console.error(pc.red('Must provide TOPDECK_GG_API_KEY!'));
  process.exit(1);
}

/** Topdeck.gg API client. */
const topdeckClient = new TopDeckClient(process.env.TOPDECK_GG_API_KEY);

/** Connection to local SQLite database seeded from data warehouse. */
const dbConnection = new Database('edhtop16.db');

const db = new Kysely<DB>({
  dialect: new SqliteDialect({database: dbConnection}),
});

console.log(pc.green(`Connected to local SQLite database!`));

function commanderName(commanders: Record<string, unknown> = {}) {
  return Object.keys(commanders).sort().join(' / ');
}

/** @returns Map of TID to database ID. */
async function createTournaments(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
): Promise<Map<string, number>> {
  console.log(
    pc.yellow(`Importing ${pc.cyan(tournaments.length)} tournaments!`),
  );

  const insertedTournaments = await db
    .insertInto('Tournament')
    .values(
      tournaments.map((t) => ({
        TID: t.TID,
        name: t.tournamentName,
        tournamentDate: new Date(t.startDate * 1000).toISOString(),
        size: t.standings.length,
        swissRounds: t.swissNum,
        topCut: t.topCut,
        bracketUrl: `https://topdeck.gg/bracket/${t.TID}`,
      })),
    )
    .onConflict((oc) => oc.column('TID').doNothing())
    .returning(['id', 'TID'])
    .execute();

  return new Map(insertedTournaments.map((t) => [t.TID, t.id]));
}

function wubrgify(colorIdentity: string[]): string {
  let buf = '';

  if (colorIdentity.includes('W')) {
    buf += 'W';
  }
  if (colorIdentity.includes('U')) {
    buf += 'U';
  }
  if (colorIdentity.includes('B')) {
    buf += 'B';
  }
  if (colorIdentity.includes('R')) {
    buf += 'R';
  }
  if (colorIdentity.includes('G')) {
    buf += 'G';
  }

  if (buf.length === 0) {
    return 'C';
  } else {
    return buf;
  }
}

/** @returns Map of commander name to database ID. */
async function createCommanders(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
  oracleCards: ScryfallDatabase,
): Promise<Map<string, number>> {
  const tournamentDetails = await topdeckClient.tournaments.loadMany(
    tournaments.map((t) => t.TID),
  );

  const commanders = tournamentDetails
    .filter((t) => 'standings' in t)
    .flatMap((t) =>
      t.standings.map((s) => ({
        name: commanderName(s.deckObj?.Commanders),
        colorId: wubrgify(
          Object.values(s.deckObj?.Commanders ?? {}).flatMap(
            (c) => oracleCards.cardByScryfallId.get(c.id)?.color_identity ?? [],
          ),
        ),
      })),
    );

  console.log(
    pc.yellow(
      `Updating profile information for ${pc.cyan(commanders.length)} commanders...`,
    ),
  );

  const insertedCommanders = await db
    .insertInto('Commander')
    .values(commanders)
    .onConflict((oc) => oc.column('name').doNothing())
    .returning(['name', 'id'])
    .execute();

  return new Map(insertedCommanders.map((c) => [c.name, c.id]));
}

async function createCards(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
  oracleCards: ScryfallDatabase,
): Promise<Map<string, number>> {
  const tournamentDetails = await topdeckClient.tournaments.loadMany(
    tournaments.map((t) => t.TID),
  );

  const mainDeckCardIds = new Set(
    tournamentDetails
      .filter((t) => 'standings' in t)
      .flatMap((t) => t.standings)
      .flatMap((e) => [
        ...Object.values(e.deckObj?.Commanders ?? {}),
        ...Object.values(e.deckObj?.Mainboard ?? {}),
      ])
      .map((c) => c.id),
  );

  const defaultCommander = oracleCards.cardByName.get('The Prismatic Piper');
  if (defaultCommander) mainDeckCardIds.add(defaultCommander.id);

  console.log(
    `Creating ${pc.cyan(mainDeckCardIds.size)} cards from oracle ID's`,
  );

  const insertedCards = await db
    .insertInto('Card')
    .values(
      Array.from(mainDeckCardIds)
        .map((id) => oracleCards.cardByOracleId.get(id))
        .filter((c) => c != null)
        .map((c) => ({
          oracleId: c.oracle_id,
          name: c.name,
          data: JSON.stringify(c),
        })),
    )
    .onConflict((oc) =>
      oc.column('oracleId').doUpdateSet((eb) => ({
        name: eb.ref('excluded.name'),
        data: eb.ref('excluded.data'),
      })),
    )
    .returning(['id', 'oracleId'])
    .execute();

  return new Map(insertedCards.map((c) => [c.oracleId, c.id]));
}

async function createEntries(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
  tournamentIdByTid: Map<string, number>,
  playerIdByProfile: Map<string, number>,
  commanderIdByName: Map<string, number>,
) {
  const entries = await Promise.all(
    tournaments.map(async (t) => {
      const tournamentDetails = await topdeckClient.tournaments.load(t.TID);
      const standingDetailById = new Map(
        tournamentDetails.standings.map((s) => [s.id, s] as const),
      );

      return t.standings.map((s): InsertObject<DB, 'Entry'> => {
        const details = standingDetailById.get(s.id);
        const standing = details?.standing!;
        const playerId = playerIdByProfile.get(s.id)!;
        const tournamentId = tournamentIdByTid.get(t.TID)!;
        const commanderId = commanderIdByName.get(
          commanderName(details?.deckObj?.Commanders),
        )!;

        return {
          tournamentId,
          commanderId,
          playerId,
          standing,
          draws: s.draws,
          winsBracket: s.winsBracket,
          winsSwiss: s.winsSwiss,
          lossesBracket: s.lossesBracket,
          lossesSwiss: s.lossesSwiss,
        };
      });
    }),
  );

  const insertedEntries = await db
    .insertInto('Entry')
    .values(entries.flat())
    .onConflict((oc) => oc.doNothing())
    .returning(['Entry.id', 'Entry.playerId', 'Entry.tournamentId'])
    .execute();

  const tidByTournamentId = new Map(
    Array.from(tournamentIdByTid).map(([id, tid]) => [tid, id] as const),
  );

  const profileByPlayerId = new Map(
    Array.from(playerIdByProfile).map(([id, tid]) => [tid, id] as const),
  );

  const entryIdByTidAndProfile = new Map<string, number>();
  for (const {id, playerId, tournamentId} of insertedEntries) {
    const tid = tidByTournamentId.get(tournamentId)!;
    const profile = profileByPlayerId.get(playerId)!;
    entryIdByTidAndProfile.set(`${tid}:${profile}`, id);
  }

  return (tid: string, profile: string) => {
    return entryIdByTidAndProfile.get(`${tid}:${profile}`);
  };
}

async function createDecklists(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
  cardIdByOracleId: Map<string, number>,
  entryIdByTidAndProfile: (tid: string, profile: string) => number | undefined,
) {
  const decklistItems = await Promise.all(
    tournaments.map(async (t) => {
      const tournamentDetails = await topdeckClient.tournaments.load(t.TID);
      const standingDetailById = new Map(
        tournamentDetails.standings.map((s) => [s.id, s] as const),
      );

      return t.standings.flatMap((s): InsertObject<DB, 'DecklistItem'>[] => {
        const details = standingDetailById.get(s.id);
        const entryId = entryIdByTidAndProfile(t.TID, s.id)!;

        return Object.values(details?.deckObj?.Mainboard ?? {}).map(
          ({id: oracleId}) => {
            const cardId = cardIdByOracleId.get(oracleId)!;
            return {cardId, entryId};
          },
        );
      });
    }),
  );

  await db
    .insertInto('DecklistItem')
    .values(decklistItems.flat())
    .onConflict((oc) => oc.doNothing())
    .execute();
}

/** @returns Map of player profile ID to database ID. */
async function createPlayers(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
): Promise<Map<string, number>> {
  const playerIds = new Set(
    tournaments.flatMap((t) => t.standings.map((s) => s.id)),
  );

  console.log(
    pc.yellow(
      `Updating profile information for ${pc.cyan(playerIds.size)} players...`,
    ),
  );

  const players = await topdeckClient.players.loadMany(Array.from(playerIds));

  const insertedPlayers = await db
    .insertInto('Player')
    .values(
      players
        .filter((p) => 'id' in p)
        .map((p) => ({name: p.name, topdeckProfile: p.id})),
    )
    .onConflict((oc) =>
      oc.column('topdeckProfile').doUpdateSet((eb) => ({
        name: eb.ref('excluded.name'),
      })),
    )
    .returning(['id', 'topdeckProfile'])
    .execute();

  const playerIdByTopdeckProfile = new Map<string, number>();
  for (const {id, topdeckProfile} of insertedPlayers) {
    if (topdeckProfile) {
      playerIdByTopdeckProfile.set(topdeckProfile, id);
    }
  }

  return playerIdByTopdeckProfile;
}

async function addCardPlayRates(cardIds: number[]) {
  console.log(pc.yellow(`Calculating column "playRateLastYear" on Card`));

  function getCard(id: number) {
    return db
      .selectFrom('Card')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  function setCardPlayRate(id: number, playRateLastYear: number) {
    return db
      .updateTable('Card')
      .set({playRateLastYear})
      .where('id', '=', id)
      .execute();
  }

  function getEntriesForColorId(colorId: string, tournamentDate: string) {
    return db
      .selectFrom('Entry as e')
      .leftJoin('Commander as c', 'c.id', 'e.commanderId')
      .leftJoin('Tournament as t', 't.id', 'e.tournamentId')
      .where('c.colorId', 'like', colorId)
      .where('c.colorId', '!=', 'N/A')
      .where('t.tournamentDate', '>=', tournamentDate)
      .select((eb) => eb.fn.countAll<number>().as('total'))
      .executeTakeFirst();
  }

  function getEntriesForCard(cardId: number, tournamentDate: string) {
    return db
      .selectFrom('DecklistItem as di')
      .leftJoin('Entry as e', 'e.id', 'di.entryId')
      .leftJoin('Tournament as t', 't.id', 'e.tournamentId')
      .where('cardId', '=', cardId)
      .where('t.tournamentDate', '>=', tournamentDate)
      .select((eb) => eb.fn.countAll<number>().as('total'))
      .executeTakeFirst();
  }

  const memoEntriesForColorId = new Map<string, number>();
  const oneYearAgo = subYears(new Date(), 1).toISOString();

  console.log(`Calculating play rate for ${pc.cyan(cardIds.length)} cards`);
  for (const cardId of cardIds) {
    const card = await getCard(cardId);
    if (card == null) continue;

    const colorId = scryfallCardSchema
      .parse(JSON.parse(card.data))
      .color_identity.join('');

    if (!memoEntriesForColorId.has(colorId)) {
      let colorIdMatch = '';
      if (colorId && colorId !== 'C') {
        for (const color of ['W', 'U', 'B', 'R', 'G']) {
          if (colorId.includes(color)) {
            colorIdMatch += color;
          } else {
            colorIdMatch += '%';
          }
        }
      } else {
        colorIdMatch = '%';
      }

      const totalForColorId = (
        await getEntriesForColorId(colorIdMatch, oneYearAgo)
      )?.total;

      if (totalForColorId) memoEntriesForColorId.set(colorId, totalForColorId);
    }

    const totalEntriesForCard = (await getEntriesForCard(card.id, oneYearAgo))
      ?.total;
    const totalPossibleEntries = memoEntriesForColorId.get(colorId);
    if (totalPossibleEntries == null || totalEntriesForCard == null) return;

    setCardPlayRate(totalEntriesForCard / totalPossibleEntries, card.id);
  }

  console.log(`Finished calculating play rates!`);
}

async function main({tid: importedTids}: {tid?: string[]}) {
  console.log(pc.green(`Loading Scryfall oracle cards database...`));
  const oracleCards = await ScryfallDatabase.create('oracle_cards');

  // Last five days of tournaments, otherwise only the specified TIDs
  console.log(pc.green(`Pulling recent TopDeck tournaments...`));
  const tournaments = await topdeckClient.listTournaments({
    tids: importedTids,
    last: importedTids == null ? 5 : undefined,
  });

  console.log(pc.green(`Found ${tournaments.length} tournaments!`));

  const tournamentIdByTid = await createTournaments(tournaments);
  const playerIdByProfile = await createPlayers(tournaments);
  const commanderIdByName = await createCommanders(tournaments, oracleCards);
  const cardIdByOracleId = await createCards(tournaments, oracleCards);
  const entryIdByTidAndProfile = await createEntries(
    tournaments,
    tournamentIdByTid,
    playerIdByProfile,
    commanderIdByName,
  );

  await createDecklists(tournaments, cardIdByOracleId, entryIdByTidAndProfile);

  addCardPlayRates(Array.from(cardIdByOracleId.values()));
}

main(args.values)
  .catch((e) => {
    console.error('Error during script generation:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log(pc.yellow('Closing database connection...'));
    dbConnection.close();

    console.log(pc.green('Database creation succeeded!'));
  });
