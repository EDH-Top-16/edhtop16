/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form.
 */

import { faker } from "@faker-js/faker";
import { workerPool } from "@reverecre/promise";
import Database from "better-sqlite3";
import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import { parseArgs } from "node:util";
import pc from "picocolors";
import * as undici from "undici";
import { z } from "zod";
import { ScryfallCard } from "../src/lib/server/scryfall";

const args = parseArgs({
  options: {
    tid: {
      type: "string",
      multiple: true,
    },
    anonymize: {
      type: "boolean",
    },
    "entries-db-url": {
      type: "string",
    },
  },
});

if (!args.values["entries-db-url"]) {
  console.log(
    pc.red("Could not generate database!\nMust provide --entries-db-url flag"),
  );

  process.exit(1);
}

/** Connection to the raw entries database. */
const mongo = new MongoClient(args.values["entries-db-url"]);

/** Connection to local SQLite database seeded from data warehouse. */
const db = new Database("data/edhtop16.db");

// Turn off journalizing and start a transaction for faster inserts.
console.log(pc.green(`Connected to local SQLite database!`));
db.pragma("journal_mode = OFF");
db.pragma("synchronous = 0");
db.pragma("cache_size = 1000000");
db.pragma("locking_mode = EXCLUSIVE");
db.pragma("temp_store = MEMORY");

class ScryfallDatabase {
  private static scryfallBulkDataSchema = z.object({
    object: z.literal("list"),
    data: z.array(
      z.object({
        object: z.literal("bulk_data"),
        type: z.enum([
          "oracle_cards",
          "unique_artwork",
          "default_cards",
          "all_cards",
          "rulings",
        ]),
        download_uri: z.string().url(),
        content_type: z.string(),
        content_encoding: z.string(),
      }),
    ),
  });

  static async create(kind: "default_cards" | "oracle_cards") {
    const databaseFileName = `./${kind}.scryfall.json`;

    try {
      await fs.access(databaseFileName, fs.constants.F_OK);
      console.log(
        pc.green(
          `Found cached Scryfall bulk database: ${pc.cyan(databaseFileName)}`,
        ),
      );
    } catch (e) {
      console.log(pc.cyan("Requesting Scryfall bulk data URL..."));
      const scryfallBulkDataResponse = await undici.request(
        "https://api.scryfall.com/bulk-data",
        { headers: { Accept: "*/*", "User-Agent": "edhtop16/2.0" } },
      );

      if (scryfallBulkDataResponse.statusCode >= 400) {
        throw new Error(
          "Could not load bulk data: " +
            (await scryfallBulkDataResponse.body.text()),
        );
      }

      const scryfallBulkDataJson = await scryfallBulkDataResponse.body.json();
      const { data: scryfallBulkData } =
        ScryfallDatabase.scryfallBulkDataSchema.parse(scryfallBulkDataJson);

      const databaseUrl = scryfallBulkData.find((d) => d.type === kind)
        ?.download_uri;

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

      await undici.stream(databaseUrl, { method: "GET" }, () =>
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

const topdeckTournamentSchema = z.object({
  TID: z.string(),
  tournamentName: z.string(),
  size: z.number().int(),
  date: z.date(),
  dateCreated: z.number().int(),
  swissNum: z.number().int(),
  topCut: z.number().int(),
  bracketUrl: z.string().optional(),
});

const jsonImportedSchema = z.object({
  TID: z.string(),
  tournamentName: z.string(),
  players: z.number().int(),
  startDate: z.number().int(),
  swissRounds: z.number().int(),
  topCut: z.number().int(),
  bracketUrl: z.string().optional(),
});

async function getTournaments(
  tids?: string[],
): Promise<z.infer<typeof jsonImportedSchema>[]> {
  const tournamentSchema = z.union([
    topdeckTournamentSchema,
    jsonImportedSchema,
  ]);

  const metadataFilters: Record<string, unknown> = {};
  if (tids) {
    metadataFilters.TID = { $in: tids };
  }

  const tournaments = mongo
    .db("cedhtop16")
    .collection("metadata")
    .find(metadataFilters)
    .map((doc) => {
      const result = tournamentSchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `Could not parse document ${doc.TID} (${doc.tournamentName}): ${result.error.message}`,
        );

        return false;
      }

      return result.data;
    });

  return (await tournaments.toArray())
    .filter((t) => t !== false)
    .map((t) => {
      if ("players" in t) return t;

      return {
        TID: t.TID,
        tournamentName: t.tournamentName,
        bracketUrl: t.bracketUrl,
        players: t.size,
        startDate: t.dateCreated,
        swissRounds: t.swissNum,
        topCut: t.topCut,
      };
    });
}

type Entry = z.infer<typeof entrySchema>;
const entrySchema = z.object({
  name: z.string().trim(),
  profile: z.string().nullable().optional(),
  decklist: z.string().nullable(),
  winsSwiss: z.number().int(),
  winsBracket: z.number().int(),
  draws: z.number().int(),
  lossesSwiss: z.number().int(),
  lossesBracket: z.number().int(),
  standing: z.number().int(),
  colorID: z.string(),
  commander: z.string(),
  mainDeck: z.array(z.string()).nullish(),
});

async function getTournamentEntries(tournamentId: string) {
  const entries = mongo
    .db("cedhtop16")
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

async function createTournaments(tids?: string[]) {
  const insertTournament = db.prepare(`
    INSERT INTO "Tournament"
    ("uuid", "TID", "name", "tournamentDate", "size", "swissRounds", "topCut", "bracketUrl")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tournaments = await getTournaments(tids);
  console.log(
    pc.yellow(`Importing ${pc.cyan(tournaments.length)} tournaments!`),
  );

  const tournamentUuidByTid = new Map<string, string>();

  db.transaction(() => {
    for (const t of tournaments) {
      const tournamentUuid = randomUUID();

      console.log(
        `Creating tournament: ${pc.cyan(t.tournamentName)} ${pc.dim(
          `[${t.TID}]`,
        )}`,
      );

      insertTournament.run(
        tournamentUuid,
        t.TID,
        t.tournamentName,
        new Date(t.startDate * 1000).toISOString(),
        t.players,
        t.swissRounds,
        t.topCut,
        t.bracketUrl,
      );

      tournamentUuidByTid.set(t.TID, tournamentUuid);
    }
  })();

  return tournamentUuidByTid;
}

type EntryWithTid = Entry & { TID: string };
async function loadEntries(tids: string[]): Promise<EntryWithTid[]> {
  const entriesByTid = new Map<string, Entry[]>();
  await workerPool(tids, async (tid) => {
    entriesByTid.set(tid, await getTournamentEntries(tid));
  });

  return Array.from(entriesByTid).flatMap(([TID, entries]) => {
    return entries.flatMap((e) => ({ ...e, TID }));
  });
}

async function createCommanders(entries: EntryWithTid[]) {
  const insertCommander = db.prepare(`
    INSERT INTO "Commander"
    ("uuid", "name", "colorId")
    VALUES (?, ?, ?)
  `);

  const commanderUuidByName = new Map<string, string>();
  db.transaction(() => {
    for (const entry of entries) {
      if (commanderUuidByName.has(entry.commander)) continue;

      const commanderUuid = randomUUID();
      commanderUuidByName.set(entry.commander, commanderUuid);

      console.log(`Creating commander: ${pc.cyan(entry.commander)}`);
      insertCommander.run(commanderUuid, entry.commander, entry.colorID);
    }
  })();

  return commanderUuidByName;
}

async function createCards(entries: EntryWithTid[]) {
  const insertCard = db.prepare(`
    INSERT INTO "Card"
    ("uuid", "oracleId", "name", "data")
    VALUES (?, ?, ?, ?)
  `);

  const cardUuidByOracleId = new Map<string, string>();
  const cardUuidByScryfallId = new Map<string, string>();

  const [oracleDatabase, scryfallDatabase] = await Promise.all([
    ScryfallDatabase.create("oracle_cards"),
    ScryfallDatabase.create("default_cards"),
  ]);

  const mainDeckCards = entries.flatMap((e) => e.mainDeck ?? []);
  const commanderCards = entries
    .flatMap((e) => e.commander.split(" / "))
    .map((c) => scryfallDatabase.cardByName.get(c)?.id)
    .filter((id) => id != null);

  const defaultCommander = scryfallDatabase.cardByName.get(
    "The Prismatic Piper",
  );

  if (defaultCommander) commanderCards.push(defaultCommander.id);

  const allScryfallIds = Array.from(
    new Set([...mainDeckCards, ...commanderCards]),
  );

  const allOracleIds = Array.from(
    new Set(
      allScryfallIds
        .map((id) => scryfallDatabase.cardByScryfallId.get(id)?.oracle_id)
        .filter((id) => id != null),
    ),
  );

  console.log(
    `Creating ${pc.cyan(allOracleIds.length)} cards from oracle ID's`,
  );

  db.transaction(() => {
    for (const oracleId of allOracleIds) {
      if (cardUuidByOracleId.has(oracleId)) continue;

      const card = oracleDatabase.cardByOracleId.get(oracleId);
      if (card == null) continue;

      const cardUuid = randomUUID();
      cardUuidByOracleId.set(card.oracle_id, cardUuid);

      let colorId: string = "";
      for (const c of ["W", "U", "B", "R", "G", "C"]) {
        if (card.color_identity.includes(c)) colorId += c;
      }

      insertCard.run(cardUuid, card.oracle_id, card.name, JSON.stringify(card));
    }
  })();

  for (const scryfallId of allScryfallIds) {
    const card = scryfallDatabase.cardByScryfallId.get(scryfallId);
    if (card == null) continue;

    const cardUuid = cardUuidByOracleId.get(card.oracle_id);
    if (cardUuid == null) continue;

    cardUuidByScryfallId.set(scryfallId, cardUuid);
  }

  return cardUuidByScryfallId;
}

async function createPlayers(
  {
    entries,
    tournamentUuidByTid,
    commanderUuidByName,
    cardUuidByScryfallId,
  }: {
    entries: EntryWithTid[];
    tournamentUuidByTid: Map<string, string>;
    commanderUuidByName: Map<string, string>;
    cardUuidByScryfallId: Map<string, string>;
  },
  { anonymizeNames }: { anonymizeNames: boolean },
) {
  const insertPlayer = db.prepare(`
    INSERT INTO "Player"
    ("uuid", "name", "topdeckProfile")
    VALUES (?, ?, ?)
  `);

  const insertEntry = db.prepare(`
    INSERT INTO "Entry"
    ("uuid", "decklist", "draws", "lossesBracket", "lossesSwiss", "standing", "winsBracket", "winsSwiss", "playerUuid", "commanderUuid", "tournamentUuid")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDecklistItem = db.prepare(`
    INSERT INTO "DecklistItem"
    ("entryUuid", "cardUuid")
    VALUES (?, ?)
  `);

  console.log(pc.yellow(`Creating players from entries...`));

  const playerUuidByTopdeckUuid = new Map<string, string>();

  db.transaction(() => {
    for (const entry of entries) {
      const tournamentUuid = tournamentUuidByTid.get(entry.TID);
      if (tournamentUuid == null) {
        console.error(`Could not find UUID for tournament: ${entry.TID}`);
        continue;
      }

      const commanderUuid = commanderUuidByName.get(entry.commander);
      if (commanderUuid == null) {
        console.error(`Could not find UUID for commander: ${entry.commander}`);
        continue;
      }

      let playerUuid: string;
      if (entry.profile != null) {
        if (playerUuidByTopdeckUuid.has(entry.profile)) {
          playerUuid = playerUuidByTopdeckUuid.get(entry.profile)!;
        } else {
          playerUuid = randomUUID();
          playerUuidByTopdeckUuid.set(entry.profile, playerUuid);
          insertPlayer.run(
            playerUuid,
            anonymizeNames
              ? faker.person.fullName()
              : entry.name || "Unknown Player",
            anonymizeNames ? faker.string.nanoid() : entry.profile,
          );
        }
      } else {
        playerUuid = randomUUID();
        insertPlayer.run(
          playerUuid,
          anonymizeNames
            ? faker.person.fullName()
            : entry.name || "Unknown Player",
          null,
        );
      }

      const cardUuids = new Set(
        (entry.mainDeck ?? [])
          .map((id) => cardUuidByScryfallId.get(id))
          .filter((c) => c != null),
      );

      const entryUuid = randomUUID();
      insertEntry.run(
        entryUuid,
        entry.decklist,
        entry.draws,
        entry.lossesBracket,
        entry.lossesSwiss,
        entry.standing,
        entry.winsBracket,
        entry.winsSwiss,
        playerUuid,
        commanderUuid,
        tournamentUuid,
      );

      for (const cardUuid of Array.from(cardUuids)) {
        insertDecklistItem.run(entryUuid, cardUuid);
      }
    }
  })();

  console.log(pc.green(`Finished creating players and entries!`));
}

function createSchema() {
  db.exec(`
CREATE TABLE "Tournament" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "TID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tournamentDate" DATETIME NOT NULL,
    "size" INTEGER NOT NULL,
    "swissRounds" INTEGER NOT NULL,
    "topCut" INTEGER NOT NULL,
    "bracketUrl" TEXT
);

CREATE TABLE "Player" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "topdeckProfile" TEXT,
    "name" TEXT NOT NULL
);

CREATE TABLE "Commander" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colorId" TEXT NOT NULL
);

CREATE TABLE "Entry" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "tournamentUuid" TEXT NOT NULL,
    "playerUuid" TEXT NOT NULL,
    "commanderUuid" TEXT NOT NULL,
    "standing" INTEGER NOT NULL,
    "decklist" TEXT,
    "winsSwiss" INTEGER NOT NULL,
    "winsBracket" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "lossesSwiss" INTEGER NOT NULL,
    "lossesBracket" INTEGER NOT NULL,
    CONSTRAINT "Entry_tournamentUuid_fkey" FOREIGN KEY ("tournamentUuid") REFERENCES "Tournament" ("uuid"),
    CONSTRAINT "Entry_playerUuid_fkey" FOREIGN KEY ("playerUuid") REFERENCES "Player" ("uuid"),
    CONSTRAINT "Entry_commanderUuid_fkey" FOREIGN KEY ("commanderUuid") REFERENCES "Commander" ("uuid")
);

CREATE TABLE "Card" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "oracleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

CREATE TABLE "DecklistItem" (
    "entryUuid" TEXT NOT NULL,
    "cardUuid" TEXT NOT NULL,

    PRIMARY KEY ("entryUuid", "cardUuid"),
    CONSTRAINT "DecklistItem_entryUuid_fkey" FOREIGN KEY ("entryUuid") REFERENCES "Entry" ("uuid"),
    CONSTRAINT "DecklistItem_cardUuid_fkey" FOREIGN KEY ("cardUuid") REFERENCES "Card" ("uuid")
);
`);
}

function createIndexes() {
  db.exec(`
    CREATE UNIQUE INDEX "Tournament_TID_key" ON "Tournament"("TID");
    CREATE INDEX "Tournament_TID_idx" ON "Tournament"("TID");
    CREATE UNIQUE INDEX "Player_topdeckProfile_key" ON "Player"("topdeckProfile");
    CREATE INDEX "Player_topdeckProfile_idx" ON "Player"("topdeckProfile");
    CREATE UNIQUE INDEX "Card_oracleId_key" ON "Card"("oracleId");

    CREATE INDEX "Entry_tournamentUuid_idx" on "Entry"("tournamentUuid");
    CREATE INDEX "Entry_playerUuid_idx" on "Entry"("playerUuid");
    CREATE INDEX "Entry_commanderUuid_idx" on "Entry"("commanderUuid");

    CREATE INDEX "DecklistItem_cardUuid_idx" on "DecklistItem"("cardUuid");
    CREATE INDEX "DecklistItem_entryUuid_idx" on "DecklistItem"("entryUuid");
  `);
}

async function main({
  tid: importedTids,
  anonymize: anonymizeNames = false,
}: {
  anonymize?: boolean;
  tid?: string[];
}) {
  createSchema();

  const tournamentUuidByTid = await createTournaments(importedTids);
  const entries = await loadEntries(Array.from(tournamentUuidByTid.keys()));
  const commanderUuidByName = await createCommanders(entries);
  const cardUuidByScryfallId = await createCards(entries);
  await createPlayers(
    {
      entries,
      tournamentUuidByTid,
      commanderUuidByName,
      cardUuidByScryfallId,
    },
    { anonymizeNames },
  );

  createIndexes();
}

main(args.values)
  .catch((e) => {
    console.error("Error during script generation:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongo.close();

    console.log(pc.yellow("Closing database connection..."));
    db.close();

    console.log(pc.green("Database creation succeeded!"));
  });
