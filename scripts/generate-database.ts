/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form.
 */

import {faker} from '@faker-js/faker';
import {workerPool} from '@reverecre/promise';
import Database from 'better-sqlite3';
import {subYears} from 'date-fns';
import {MongoClient} from 'mongodb';
import {createWriteStream} from 'node:fs';
import fs from 'node:fs/promises';
import {parseArgs} from 'node:util';
import pc from 'picocolors';
import * as undici from 'undici';
import {z} from 'zod/v4';
import {ScryfallCard, scryfallCardSchema} from '../src/lib/server/scryfall';

/** Tournament IDs to exclude from ingestion */
const EXCLUDED_TOURNAMENT_IDS = [
  'spicerack:2269579',
  'spicerack:2269574',
  'spicerack:2269571',
];

const topDeckPlayerSchema = z.object({
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

const topDeckTournamentListSchema = z.object({
  TID: z.string(),
  tournamentName: z.string(),
  swissNum: z.number(),
  startDate: z.number(),
  game: z.string(),
  format: z.string(),
  averageElo: z.number(),
  modeElo: z.number(),
  medianElo: z.number(),
  topElo: z.number(),
  eventData: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    location: z.string().optional(),
    headerImage: z.string().optional(),
  }),
  topCut: z.number(),
  standings: z.array(z.object({id: z.string()})),
});

const topDeckTournamentDetailSchema = z.object({
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
            importedFrom: z.string(),
          }),
        })
        .nullable(),
      standing: z.number(),
      points: z.number(),
      winRate: z.number(),
      opponentWinRate: z.number(),
    }),
  ),
});

class TopDeckClient {
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

  async getPlayers(playerIds: string[]) {
    const queryString = playerIds
      .map((id) => `id=${encodeURIComponent(id)}`)
      .join('&');
    return this.request(
      'GET',
      `/player?${queryString}`,
      z.array(topDeckPlayerSchema),
    );
  }

  async listTournaments(options: {
    game: string;
    format: string;
    columns: string[];
    last?: number;
    tids?: string[];
  }) {
    return this.request(
      'POST',
      '/tournaments',
      z.array(topDeckTournamentListSchema),
      options,
    );
  }

  async getTournament(tournamentId: string) {
    return this.request(
      'GET',
      `/tournaments/${tournamentId}`,
      topDeckTournamentDetailSchema,
    );
  }
}

const args = parseArgs({
  options: {
    tid: {
      type: 'string',
      multiple: true,
    },
    anonymize: {
      type: 'boolean',
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
const db = new Database('edhtop16.db');

// Turn off journalizing and start a transaction for faster inserts.
console.log(pc.green(`Connected to local SQLite database!`));
db.pragma('journal_mode = OFF');
db.pragma('synchronous = 0');
db.pragma('cache_size = 1000000');
db.pragma('locking_mode = EXCLUSIVE');
db.pragma('temp_store = MEMORY');

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

  private constructor(private readonly cards: ScryfallCard[]) {
    const cardByScryfallId = new Map<string, ScryfallCard>();
    const cardByOracleId = new Map<string, ScryfallCard>();
    const cardByName = new Map<string, ScryfallCard>();

    for (const card of this.cards) {
      cardByScryfallId.set(card.id, card);
      cardByOracleId.set(card.oracle_id, card);
      cardByName.set(card.name, card);
    }

    this.cardByScryfallId = cardByScryfallId;
    this.cardByOracleId = cardByOracleId;
    this.cardByName = cardByName;
  }
}

async function getTournaments(
  tids?: string[],
): Promise<z.infer<typeof topDeckTournamentListSchema>[]> {
  const tournaments = await topdeckClient.listTournaments({
    game: 'Magic: The Gathering',
    format: 'EDH',
    columns: ['id'],
    tids,
    last: tids == null ? 5 : undefined,
  });

  return tournaments;
}

async function getTournamentEntries(tournamentId: string) {
  const entries = mongo
    .db('cedhtop16')
    .collection(tournamentId)
    .find()
    .map((doc) => {
      const result = entrySchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `Could not parse document ${tournamentId} / ${doc.name}: ${result.error.message}`,
        );

        return false;
      }

      return result.data;
    });

  return (await entries.toArray()).filter((e) => e !== false);
}

async function createTournaments(
  tournaments: z.infer<typeof topDeckTournamentListSchema>[],
) {
  const insertTournament = db.prepare(`
    INSERT INTO "Tournament"
    ("TID", "name", "tournamentDate", "size", "swissRounds", "topCut", "bracketUrl")
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `);

  console.log(
    pc.yellow(`Importing ${pc.cyan(tournaments.length)} tournaments!`),
  );

  const tournamentIdByTid = new Map<string, number>();

  db.transaction(() => {
    for (const t of tournaments) {
      console.log(
        `Creating tournament: ${pc.cyan(t.tournamentName)} ${pc.dim(
          `[${t.TID}]`,
        )}`,
      );

      const {lastInsertRowid} = insertTournament.run(
        t.TID,
        t.tournamentName,
        new Date(t.startDate * 1000).toISOString(),
        t.standings.length,
        t.swissNum,
        t.topCut,
        `https://topdeck.gg/bracket/${t.TID}`,
      );

      tournamentIdByTid.set(t.TID, lastInsertRowid as number);
    }
  })();

  return tournamentIdByTid;
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

async function createCommanders(entries: EntryWithTid[]) {
  const insertCommander = db.prepare(`
    INSERT INTO "Commander"
    ("name", "colorId")
    VALUES (?, ?)
  `);

  const commanderIdByName = new Map<string, number>();
  db.transaction(() => {
    for (const entry of entries) {
      if (!entry.commander || !entry.colorID) continue;
      if (commanderIdByName.has(entry.commander)) continue;

      console.log(`Creating commander: ${pc.cyan(entry.commander)}`);
      const {lastInsertRowid} = insertCommander.run(
        entry.commander,
        entry.colorID,
      );

      commanderIdByName.set(entry.commander, lastInsertRowid as number);
    }
  })();

  return commanderIdByName;
}

async function createCards(
  entries: EntryWithTid[],
  defaultCards: ScryfallDatabase,
  oracleCards: ScryfallDatabase,
) {
  const insertCard = db.prepare(`
    INSERT INTO "Card"
    ("oracleId", "name", "data")
    VALUES (?, ?, ?)
  `);

  const cardIdByOracleId = new Map<string, number>();
  const cardIdByScryfallId = new Map<string, number>();

  const mainDeckCards = entries.flatMap((e) => e.mainDeck ?? []);
  const commanderCards = entries
    .flatMap((e) => e.commander?.split(' / ') ?? [])
    .map((c) => defaultCards.cardByName.get(c)?.id)
    .filter((id) => id != null);

  const defaultCommander = defaultCards.cardByName.get('The Prismatic Piper');

  if (defaultCommander) commanderCards.push(defaultCommander.id);

  const allScryfallIds = Array.from(
    new Set([...mainDeckCards, ...commanderCards]),
  );

  const allOracleIds = Array.from(
    new Set(
      allScryfallIds
        .map((id) => defaultCards.cardByScryfallId.get(id)?.oracle_id)
        .filter((id) => id != null),
    ),
  );

  console.log(
    `Creating ${pc.cyan(allOracleIds.length)} cards from oracle ID's`,
  );

  db.transaction(() => {
    for (const oracleId of allOracleIds) {
      if (cardIdByOracleId.has(oracleId)) continue;

      const card = oracleCards.cardByOracleId.get(oracleId);
      if (card == null) continue;

      let colorId: string = '';
      for (const c of ['W', 'U', 'B', 'R', 'G', 'C']) {
        if (card.color_identity.includes(c)) colorId += c;
      }

      const {lastInsertRowid} = insertCard.run(
        card.oracle_id,
        card.name,
        JSON.stringify(card),
      );

      cardIdByOracleId.set(card.oracle_id, lastInsertRowid as number);
    }
  })();

  for (const scryfallId of allScryfallIds) {
    const card = defaultCards.cardByScryfallId.get(scryfallId);
    if (card == null) continue;

    const cardId = cardIdByOracleId.get(card.oracle_id);
    if (cardId == null) continue;

    cardIdByScryfallId.set(scryfallId, cardId);
  }

  return cardIdByScryfallId;
}

async function createPlayers(
  {
    entries,
    tournamentIdByTid,
    commanderIdByName,
    cardIdByScryfallId,
  }: {
    entries: EntryWithTid[];
    tournamentIdByTid: Map<string, number>;
    commanderIdByName: Map<string, number>;
    cardIdByScryfallId: Map<string, number>;
  },
  {anonymizeNames}: {anonymizeNames: boolean},
) {
  const insertPlayer = db.prepare(`
    INSERT INTO "Player"
    ("name", "topdeckProfile")
    VALUES (?, ?)
  `);

  const insertEntry = db.prepare(`
    INSERT INTO "Entry"
    ("decklist", "draws", "lossesBracket", "lossesSwiss", "standing", "winsBracket", "winsSwiss", "playerId", "commanderId", "tournamentId")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDecklistItem = db.prepare(`
    INSERT INTO "DecklistItem"
    ("entryId", "cardId")
    VALUES (?, ?)
  `);

  console.log(pc.yellow(`Creating players from entries...`));

  const playerIdByTopdeckId = new Map<string, number>();

  db.transaction(() => {
    for (const entry of entries) {
      const tournamentId = tournamentIdByTid.get(entry.TID);
      if (tournamentId == null) {
        console.error(`Could not find ID for tournament: ${entry.TID}`);
        continue;
      }

      if (!entry.commander) {
        console.error(`Entry has no commander: ${entry.TID}/${entry.name}`);
        continue;
      }

      const commanderId = commanderIdByName.get(entry.commander);
      if (commanderId == null) {
        console.error(`Could not find ID for commander: ${entry.commander}`);
        continue;
      }

      let playerId: number;
      if (entry.profile != null) {
        if (playerIdByTopdeckId.has(entry.profile)) {
          playerId = playerIdByTopdeckId.get(entry.profile)!;
        } else {
          const {lastInsertRowid} = insertPlayer.run(
            anonymizeNames
              ? faker.person.fullName()
              : entry.name || 'Unknown Player',
            anonymizeNames ? faker.string.nanoid() : entry.profile,
          );

          playerId = lastInsertRowid as number;
          playerIdByTopdeckId.set(entry.profile, lastInsertRowid as number);
        }
      } else {
        const {lastInsertRowid} = insertPlayer.run(
          anonymizeNames
            ? faker.person.fullName()
            : entry.name || 'Unknown Player',
          null,
        );

        playerId = lastInsertRowid as number;
      }

      const cardIds = new Set(
        (entry.mainDeck ?? [])
          .map((id) => cardIdByScryfallId.get(id))
          .filter((c) => c != null),
      );

      const decklistUrlMatch = entry.decklist?.match(/https?:\/\/[\w\W]*$/g);
      let decklistUrl = decklistUrlMatch?.[0] ?? entry.decklist;
      if (entry.profile != null) {
        decklistUrl = `https://topdeck.gg/deck/${entry.TID}/${entry.profile}`;
      }

      const {lastInsertRowid} = insertEntry.run(
        decklistUrl,
        entry.draws,
        entry.lossesBracket,
        entry.lossesSwiss,
        entry.standing,
        entry.winsBracket,
        entry.winsSwiss,
        playerId,
        commanderId,
        tournamentId,
      );

      for (const cardId of Array.from(cardIds)) {
        insertDecklistItem.run(lastInsertRowid, cardId);
      }
    }
  })();

  console.log(pc.green(`Finished creating players and entries!`));
}

function createSchema() {
  db.exec(`
CREATE TABLE "Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY ASC,
    "TID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tournamentDate" DATETIME NOT NULL,
    "size" INTEGER NOT NULL,
    "swissRounds" INTEGER NOT NULL,
    "topCut" INTEGER NOT NULL,
    "bracketUrl" TEXT
);

CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY ASC,
    "topdeckProfile" TEXT,
    "name" TEXT NOT NULL
);

CREATE TABLE "Commander" (
    "id" INTEGER NOT NULL PRIMARY KEY ASC,
    "name" TEXT NOT NULL,
    "colorId" TEXT NOT NULL
);

CREATE TABLE "Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY ASC,
    "tournamentId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "commanderId" INTEGER NOT NULL,
    "standing" INTEGER NOT NULL,
    "decklist" TEXT,
    "winsSwiss" INTEGER NOT NULL,
    "winsBracket" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "lossesSwiss" INTEGER NOT NULL,
    "lossesBracket" INTEGER NOT NULL,
    CONSTRAINT "Entry_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id"),
    CONSTRAINT "Entry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id"),
    CONSTRAINT "Entry_commanderId_fkey" FOREIGN KEY ("commanderId") REFERENCES "Commander" ("id")
);

CREATE TABLE "Card" (
    "id" INTEGER NOT NULL PRIMARY KEY ASC,
    "oracleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

CREATE TABLE "DecklistItem" (
    "entryId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,

    PRIMARY KEY ("entryId", "cardId"),
    CONSTRAINT "DecklistItem_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id"),
    CONSTRAINT "DecklistItem_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id")
);
`);
}

function createIndexes() {
  db.exec(`
    CREATE INDEX "Commander_name_idx" on "Commander"("name");

    CREATE UNIQUE INDEX "Tournament_TID_key" ON "Tournament"("TID");
    CREATE INDEX "Tournament_TID_idx" ON "Tournament"("TID");
    CREATE INDEX "Tournament_name_idx" ON "Tournament"("name");

    CREATE UNIQUE INDEX "Player_topdeckProfile_key" ON "Player"("topdeckProfile");
    CREATE INDEX "Player_topdeckProfile_idx" ON "Player"("topdeckProfile");

    CREATE UNIQUE INDEX "Card_oracleId_key" ON "Card"("oracleId");
    CREATE INDEX "Card_name_idx" on "Card"("name");

    CREATE INDEX "Entry_tournamentId_idx" on "Entry"("tournamentId");
    CREATE INDEX "Entry_playerId_idx" on "Entry"("playerId");
    CREATE INDEX "Entry_commanderId_idx" on "Entry"("commanderId");

    CREATE INDEX "DecklistItem_cardId_idx" on "DecklistItem"("cardId");
    CREATE INDEX "DecklistItem_entryId_idx" on "DecklistItem"("entryId");
  `);
}

function addCardPlayRates(cardIds: number[]) {
  console.log(pc.yellow(`Adding column "playRateLastYear" on Card`));
  db.exec(`ALTER TABLE "Card" ADD COLUMN "playRateLastYear" REAL;`);

  const getCard = db.prepare<
    [number],
    {id: number; name: string; data: string}
  >(`SELECT * FROM "Card" WHERE "id" = ?`);

  const setCardPlayRate = db.prepare<[number, number]>(
    `UPDATE "Card" set "playRateLastYear" = ? where "id" = ?`,
  );

  const getEntriesForColorId = db.prepare<[string, string], {total: number}>(`
    SELECT COUNT(*) AS total
    FROM "Entry" AS e
    LEFT JOIN "Commander" c on c.id = e."commanderId"
    LEFT JOIN "Tournament" t on t.id = e."tournamentId"
    WHERE c."colorId" like ?
    AND c."colorId" != 'N/A'
    AND t."tournamentDate" >= ?
  `);

  const getEntriesForCard = db.prepare<[number, string], {total: number}>(`
    SELECT COUNT(*) AS total
    FROM "DecklistItem" di
    LEFT JOIN "Entry" e on e.id = di."entryId"
    LEFT JOIN "Tournament" t on t.id = e."tournamentId"
    WHERE "cardId" = ?
    AND t."tournamentDate" >= ?
  `);

  const memoEntriesForColorId = new Map<string, number>();
  const oneYearAgo = subYears(new Date(), 1).toISOString();

  console.log(`Calculating play rate for ${pc.cyan(cardIds.length)} cards`);
  for (const cardId of cardIds) {
    const card = getCard.get(cardId);
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

      const totalForColorId = getEntriesForColorId.get(
        colorIdMatch,
        oneYearAgo,
      )?.total;

      if (totalForColorId) memoEntriesForColorId.set(colorId, totalForColorId);
    }

    const totalEntriesForCard = getEntriesForCard.get(
      card.id,
      oneYearAgo,
    )?.total;
    const totalPossibleEntries = memoEntriesForColorId.get(colorId);
    if (totalPossibleEntries == null || totalEntriesForCard == null) return;

    setCardPlayRate.run(totalEntriesForCard / totalPossibleEntries, card.id);
  }

  console.log(`Finished calculating play rates!`);
}

async function main({
  tid: importedTids,
  anonymize: anonymizeNames = false,
}: {
  anonymize?: boolean;
  tid?: string[];
}) {
  createSchema();
  const [oracleCards, defaultCards] = await Promise.all([
    ScryfallDatabase.create('oracle_cards'),
    ScryfallDatabase.create('default_cards'),
  ]);

  const tournaments = await getTournaments(importedTids);
  // TODO: Upsert players here.
  const playerIdByProfile = new Map<string, string>();
  const tournamentIdByTid = await createTournaments(tournaments);

  const commanderIdByName = await createCommanders(entries);

  const cardIdByScryfallId = await createCards(
    entries,
    defaultCards,
    oracleCards,
  );

  await createPlayers(
    {
      entries,
      tournamentIdByTid,
      commanderIdByName,
      cardIdByScryfallId,
    },
    {anonymizeNames},
  );

  createIndexes();
  addCardPlayRates(Array.from(cardIdByScryfallId.values()));
}

main(args.values)
  .catch((e) => {
    console.error('Error during script generation:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log(pc.yellow('Closing database connection...'));
    db.close();

    console.log(pc.green('Database creation succeeded!'));
  });
