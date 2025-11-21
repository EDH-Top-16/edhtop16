/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form.
 */

import Database from 'better-sqlite3';
import Dataloader from 'dataloader';
import {subYears} from 'date-fns';
import {Kysely, SqliteDialect} from 'kysely';
import {createWriteStream} from 'node:fs';
import fs from 'node:fs/promises';
import {parseArgs} from 'node:util';
import pc from 'picocolors';
import * as undici from 'undici';
import {z} from 'zod/v4';
import type {DB} from '../__generated__/db/types';
import {ScryfallCard, scryfallCardSchema} from '../src/lib/server/scryfall';

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
      z.array(TopDeckClient.tournament),
      options,
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
const dbConnection = new Database('edhtop16.db');

const db = new Kysely<DB>({
  dialect: new SqliteDialect({database: dbConnection}),
});

console.log(pc.green(`Connected to local SQLite database!`));

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
        name: Object.keys(s.deckObj?.Commanders ?? {})
          .sort()
          .join(' / '),
        colorId: wubrgify(
          Object.values(s.deckObj?.Commanders ?? {}).flatMap(
            (c) => oracleCards.cardByScryfallId.get(c.id)?.color_identity ?? [],
          ),
        ),
      })),
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
  cardIdByOracleId: Map<string, number>,
  {anonymizeNames}: {anonymizeNames: boolean},
) {
  // const tournamentDetails = await topdeckClient.tournaments.loadMany(
  //   tournaments.map((t) => t.TID),
  // );

  // const entries = tournamentDetails
  //   .filter((t) => 'standings' in t)
  //   .flatMap((t) => t.standings.map((s) => ({tid: t.data, ...s})));

  const entries = (
    await Promise.all(
      tournaments.map(async (t) => {
        const details = await topdeckClient.tournaments.load(t.TID);
        return details.standings.map((s) => ({tid: t.TID, ...s}));
      }),
    )
  ).flat();

  await db
    .insertInto('Entry')
    .values(entries.map((e) => ({})))
    .onConflict((oc) => oc.doNothing())
    .execute();
}

// async function createPlayers(
//   {
//     entries,
//     tournamentIdByTid,
//     commanderIdByName,
//     cardIdByScryfallId,
//   }: {
//     entries: EntryWithTid[];
//     tournamentIdByTid: Map<string, number>;
//     commanderIdByName: Map<string, number>;
//     cardIdByScryfallId: Map<string, number>;
//   },
//   {anonymizeNames}: {anonymizeNames: boolean},
// ) {
//   const insertPlayer = dbConnection.prepare(`
//     INSERT INTO "Player"
//     ("name", "topdeckProfile")
//     VALUES (?, ?)
//   `);

//   const insertEntry = dbConnection.prepare(`
//     INSERT INTO "Entry"
//     ("decklist", "draws", "lossesBracket", "lossesSwiss", "standing", "winsBracket", "winsSwiss", "playerId", "commanderId", "tournamentId")
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `);

//   const insertDecklistItem = dbConnection.prepare(`
//     INSERT INTO "DecklistItem"
//     ("entryId", "cardId")
//     VALUES (?, ?)
//   `);

//   console.log(pc.yellow(`Creating players from entries...`));

//   const playerIdByTopdeckId = new Map<string, number>();

//   dbConnection.transaction(() => {
//     for (const entry of entries) {
//       const tournamentId = tournamentIdByTid.get(entry.TID);
//       if (tournamentId == null) {
//         console.error(`Could not find ID for tournament: ${entry.TID}`);
//         continue;
//       }

//       if (!entry.commander) {
//         console.error(`Entry has no commander: ${entry.TID}/${entry.name}`);
//         continue;
//       }

//       const commanderId = commanderIdByName.get(entry.commander);
//       if (commanderId == null) {
//         console.error(`Could not find ID for commander: ${entry.commander}`);
//         continue;
//       }

//       let playerId: number;
//       if (entry.profile != null) {
//         if (playerIdByTopdeckId.has(entry.profile)) {
//           playerId = playerIdByTopdeckId.get(entry.profile)!;
//         } else {
//           const {lastInsertRowid} = insertPlayer.run(
//             anonymizeNames
//               ? faker.person.fullName()
//               : entry.name || 'Unknown Player',
//             anonymizeNames ? faker.string.nanoid() : entry.profile,
//           );

//           playerId = lastInsertRowid as number;
//           playerIdByTopdeckId.set(entry.profile, lastInsertRowid as number);
//         }
//       } else {
//         const {lastInsertRowid} = insertPlayer.run(
//           anonymizeNames
//             ? faker.person.fullName()
//             : entry.name || 'Unknown Player',
//           null,
//         );

//         playerId = lastInsertRowid as number;
//       }

//       const cardIds = new Set(
//         (entry.mainDeck ?? [])
//           .map((id) => cardIdByScryfallId.get(id))
//           .filter((c) => c != null),
//       );

//       const decklistUrlMatch = entry.decklist?.match(/https?:\/\/[\w\W]*$/g);
//       let decklistUrl = decklistUrlMatch?.[0] ?? entry.decklist;
//       if (entry.profile != null) {
//         decklistUrl = `https://topdeck.gg/deck/${entry.TID}/${entry.profile}`;
//       }

//       const {lastInsertRowid} = insertEntry.run(
//         decklistUrl,
//         entry.draws,
//         entry.lossesBracket,
//         entry.lossesSwiss,
//         entry.standing,
//         entry.winsBracket,
//         entry.winsSwiss,
//         playerId,
//         commanderId,
//         tournamentId,
//       );

//       for (const cardId of Array.from(cardIds)) {
//         insertDecklistItem.run(lastInsertRowid, cardId);
//       }
//     }
//   })();

//   console.log(pc.green(`Finished creating players and entries!`));
// }
//

/** @returns Map of player profile ID to database ID. */
async function createPlayers(
  tournaments: z.infer<typeof TopDeckClient.tournament>[],
): Promise<Map<string, number>> {
  const playerIds = tournaments.flatMap((t) => t.standings.map((s) => s.id));
  const players = await topdeckClient.players.loadMany(playerIds);

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

function addCardPlayRates(cardIds: number[]) {
  console.log(pc.yellow(`Adding column "playRateLastYear" on Card`));
  // dbConnection.exec(`ALTER TABLE "Card" ADD COLUMN "playRateLastYear" REAL;`);

  const getCard = dbConnection.prepare<
    [number],
    {id: number; name: string; data: string}
  >(`SELECT * FROM "Card" WHERE "id" = ?`);

  const setCardPlayRate = dbConnection.prepare<[number, number]>(
    `UPDATE "Card" set "playRateLastYear" = ? where "id" = ?`,
  );

  const getEntriesForColorId = dbConnection.prepare<
    [string, string],
    {total: number}
  >(`
    SELECT COUNT(*) AS total
    FROM "Entry" AS e
    LEFT JOIN "Commander" c on c.id = e."commanderId"
    LEFT JOIN "Tournament" t on t.id = e."tournamentId"
    WHERE c."colorId" like ?
    AND c."colorId" != 'N/A'
    AND t."tournamentDate" >= ?
  `);

  const getEntriesForCard = dbConnection.prepare<
    [number, string],
    {total: number}
  >(`
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
  const oracleCards = await ScryfallDatabase.create('oracle_cards');

  // Last five days of tournaments, otherwise only the specified TIDs
  const tournaments = await topdeckClient.listTournaments({
    game: 'Magic: The Gathering',
    format: 'EDH',
    columns: ['id'],
    tids: importedTids,
    last: importedTids == null ? 5 : undefined,
  });

  const tournamentIdByTid = await createTournaments(tournaments);
  const playerIdByProfile = await createPlayers(tournaments);
  const commanderIdByName = await createCommanders(tournaments, oracleCards);
  const cardIdByOracleId = await createCards(tournaments, oracleCards);
  await createEntries(
    tournaments,
    tournamentIdByTid,
    playerIdByProfile,
    commanderIdByName,
    cardIdByOracleId,
    {anonymizeNames},
  );

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
