/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form specified in schema.prisma.
 */

import { faker } from "@faker-js/faker";
import { workerPool } from "@reverecre/promise";
import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import { parseArgs } from "node:util";
import { escapeIdentifier, escapeLiteral } from "pg";
import * as undici from "undici";
import { z } from "zod";
import { ScryfallCard } from "../src/lib/server/scryfall";

const env = z.object({ ENTRIES_DB_URL: z.string() }).parse(process.env);

// Connection to the raw entries database.
const mongo = new MongoClient(env.ENTRIES_DB_URL);

type SafeSqlString = string & { __escaped: true };
class SqlFileBuffer {
  static sql(
    strings: readonly string[],
    ...values: (string | number | undefined | null)[]
  ): SafeSqlString {
    let buf = "";
    for (let i = 0; i < strings.length - 1; ++i) {
      buf += strings[i];

      const value = values[i];
      if (value == null) {
        buf += "NULL";
      } else {
        buf += escapeLiteral(`${values[i]}`);
      }
    }

    buf += strings[strings.length - 1];
    return (buf
      .trim()
      .split("\n")
      .reduce(
        ({ sql, parens }, line) => {
          line = line.trim();
          if (line.startsWith(")")) parens -= 1;

          return {
            sql: sql + SqlFileBuffer.repeat("  ", parens) + line + "\n",
            parens: line.endsWith("(") ? parens + 1 : parens,
          };
        },
        { sql: "", parens: 0 },
      ).sql + "\n") as SafeSqlString;
  }

  private static repeat(s: string, n: number) {
    let buf = "";
    for (let i = 0; i < n; ++i) {
      buf += s;
    }

    return buf;
  }

  private readonly writeStream;

  constructor(path: string) {
    this.writeStream = createWriteStream(path);
  }

  write(chunk: SafeSqlString) {
    this.writeStream.write(chunk);
  }

  insert(
    table: string,
    record: Record<string, string | number | undefined | null>,
  ) {
    this.writeStream.write(`INSERT INTO ${escapeIdentifier(table)}
(${Object.keys(record).map(escapeIdentifier).join(", ")})
VALUES (
${Object.values(record)
  .map((value) => "  " + (value == null ? "NULL" : escapeLiteral(`${value}`)))
  .join(",\n")}
);

`);
  }
}

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
      console.log("Found cached Scryfall bulk database, skipping download");
    } catch (e) {
      console.log("Requesting Scryfall bulk data URL...");
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
      console.log(scryfallBulkDataJson);
      const { data: scryfallBulkData } =
        ScryfallDatabase.scryfallBulkDataSchema.parse(scryfallBulkDataJson);

      const databaseUrl = scryfallBulkData.find((d) => d.type === kind)
        ?.download_uri;

      if (!databaseUrl) {
        throw new Error(
          `Could not find URL for Scryfall bulk data export: ${kind}`,
        );
      }

      console.log(`Downloading Scryfall database: ${kind}`);
      await undici.stream(databaseUrl, { method: "GET" }, () =>
        createWriteStream(databaseFileName),
      );
    }

    console.log(`Loading Scryfall database JSON: ${kind}`);
    const scryfallDatabaseJson = (
      await fs.readFile(databaseFileName)
    ).toString();

    console.log(`Parsing Scryfall database JSON: ${kind}`);
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

async function createTournaments(seedScript: SqlFileBuffer, tids?: string[]) {
  const tournaments = await getTournaments(tids);
  console.log("Found", tournaments.length, "tournaments!");

  const tournamentUuidByTid = new Map<string, string>();
  await workerPool(tournaments, async (t) => {
    const tournamentUuid = randomUUID();

    console.log("Creating tournament:", t.tournamentName);
    seedScript.insert("Tournament", {
      uuid: tournamentUuid,
      TID: t.TID,
      name: t.tournamentName,
      tournamentDate: new Date(t.startDate * 1000).toISOString(),
      size: t.players,
      swissRounds: t.swissRounds,
      topCut: t.topCut,
      bracketUrl: t.bracketUrl,
    });

    tournamentUuidByTid.set(t.TID, tournamentUuid);
  });

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

function createCommanders(seedScript: SqlFileBuffer, entries: EntryWithTid[]) {
  const commanderUuidByName = new Map<string, string>();
  for (const entry of entries) {
    if (commanderUuidByName.has(entry.commander)) continue;

    const commanderUuid = randomUUID();
    commanderUuidByName.set(entry.commander, commanderUuid);

    console.log("Creating commander:", entry.commander);
    seedScript.insert("Commander", {
      uuid: commanderUuid,
      name: entry.commander,
      colorId: entry.colorID,
    });
  }

  return commanderUuidByName;
}

async function createCards(seedScript: SqlFileBuffer, entries: EntryWithTid[]) {
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

    console.log("Creating card:", card.name);
    seedScript.insert("Card", {
      uuid: cardUuid,
      oracleId: card.oracle_id,
      name: card.name,
      data: JSON.stringify(card),
    });
  }

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
  seedScript: SqlFileBuffer,
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
  const playerUuidByTopdeckUuid = new Map<string, string>();

  // Create all entries and players.
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
        seedScript.insert("Player", {
          uuid: playerUuid,
          name: anonymizeNames ? faker.person.fullName() : entry.name,
          topdeckProfile: anonymizeNames
            ? faker.string.nanoid()
            : entry.profile,
        });
      }
    } else {
      playerUuid = randomUUID();
      seedScript.insert("Player", {
        uuid: playerUuid,
        name: anonymizeNames ? faker.person.fullName() : entry.name,
      });
    }

    const cardUuids = new Set(
      (entry.mainDeck ?? [])
        .map((id) => cardUuidByScryfallId.get(id))
        .filter((c) => c != null),
    );

    const entryUuid = randomUUID();
    seedScript.insert("Entry", {
      uuid: entryUuid,
      decklist: entry.decklist,
      draws: entry.draws,
      lossesBracket: entry.lossesBracket,
      lossesSwiss: entry.lossesSwiss,
      standing: entry.standing,
      winsBracket: entry.winsBracket,
      winsSwiss: entry.winsSwiss,
      playerUuid: playerUuid,
      commanderUuid: commanderUuid,
      tournamentUuid: tournamentUuid,
    });

    for (const cardUuid of Array.from(cardUuids)) {
      seedScript.insert("DecklistItem", {
        entryUuid,
        cardUuid,
      });
    }
  }
}

async function main({
  tid: importedTids,
  out: outputFile = "prisma/seed.sql",
  anonymize: anonymizeNames = false,
}: {
  out?: string;
  anonymize?: boolean;
  tid?: string[];
}) {
  const seedScript = new SqlFileBuffer(outputFile);
  const tournamentUuidByTid = await createTournaments(seedScript, importedTids);
  const entries = await loadEntries(Array.from(tournamentUuidByTid.keys()));
  const commanderUuidByName = createCommanders(seedScript, entries);
  const cardUuidByScryfallId = await createCards(seedScript, entries);
  await createPlayers(
    seedScript,
    {
      entries,
      tournamentUuidByTid,
      commanderUuidByName,
      cardUuidByScryfallId,
    },
    { anonymizeNames },
  );
}

const args = parseArgs({
  options: {
    out: {
      type: "string",
    },
    tid: {
      type: "string",
      multiple: true,
    },
    anonymize: {
      type: "boolean",
    },
  },
});

main(args.values)
  .catch((e) => {
    console.error("Error during script generation:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongo.close();
  });
