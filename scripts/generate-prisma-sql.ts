/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form specified in schema.prisma.
 */

import { faker } from "@faker-js/faker";
import { workerPool } from "@reverecre/promise";
import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import { MongoClient } from "mongodb";
import { parseArgs } from "node:util";
import { escapeLiteral } from "pg";
import { z } from "zod";
import { createScyfallIdLoader } from "../src/lib/server/scryfall";

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
}

function isNotFalse<T>(v: T | false): v is T {
  return !!v;
}

function isNotError<T>(v: T | Error): v is T {
  return !(v instanceof Error);
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

  return (await tournaments.toArray()).filter(isNotFalse).map((t) => {
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

  return (await entries.toArray()).filter(isNotFalse);
}

async function main() {
  const {
    values: {
      tid: importedTids,
      out: outputFile = "prisma/seed.sql",
      anonymize: anonymizeNames = false,
    },
  } = parseArgs({
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

  const seedScript = new SqlFileBuffer(outputFile);

  const tournaments = await getTournaments(importedTids);
  console.log("Found", tournaments.length, "tournaments!");

  const tournamentUuidByTid = new Map<string, string>();
  const entriesByTid = new Map<string, Entry[]>();
  const playerUuidByTopdeckUuid = new Map<string, string>();
  const commanderUuidByName = new Map<string, string>();
  const cardUuidByOracleId = new Map<string, string>();
  const cardUuidByScryfallId = new Map<string, string>();

  // Create all tournament objects in database and collect entries.
  await workerPool(tournaments, async (t) => {
    const tournamentUuid = randomUUID();

    console.log("Creating tournament:", t.tournamentName);
    seedScript.write(
      SqlFileBuffer.sql`
        INSERT INTO "Tournament"
        ("uuid", "TID", "name", "tournamentDate", "size", "swissRounds", "topCut", "bracketUrl")
        VALUES (
          ${tournamentUuid},
          ${t.TID},
          ${t.tournamentName},
          ${new Date(t.startDate * 1000).toISOString()},
          ${t.players},
          ${t.swissRounds},
          ${t.topCut},
          ${t.bracketUrl}
        );
      `,
    );

    tournamentUuidByTid.set(t.TID, tournamentUuid);
    entriesByTid.set(t.TID, await getTournamentEntries(t.TID));
  });

  const entries = Array.from(entriesByTid).flatMap(([TID, entries]) => {
    return entries.flatMap((e) => ({ ...e, TID }));
  });

  console.log("Found", entries.length, "entries!");

  // Create all commanders.
  for (const entry of entries) {
    if (commanderUuidByName.has(entry.commander)) continue;

    const commanderUuid = randomUUID();
    commanderUuidByName.set(entry.commander, commanderUuid);

    console.log("Creating commander:", entry.commander);
    seedScript.write(
      SqlFileBuffer.sql`
        INSERT INTO "Commander"
        ("uuid", "name", "colorId")
        VALUES (
          ${commanderUuid},
          ${entry.commander},
          ${entry.colorID}
        );
    `,
    );
  }

  const cardScryfallIds = new Set<string>();
  for (const entry of entries) {
    for (const card of entry.mainDeck ?? []) {
      cardScryfallIds.add(card);
    }
  }

  const cardLoader = createScyfallIdLoader();
  const cards = (await cardLoader.loadMany(Array.from(cardScryfallIds))).filter(
    isNotError,
  );

  // Create all cards.
  for (const card of cards) {
    if (cardUuidByOracleId.has(card.oracle_id)) {
      if (!cardUuidByScryfallId.has(card.id)) {
        cardUuidByScryfallId.set(
          card.id,
          cardUuidByOracleId.get(card.oracle_id)!,
        );
      }

      continue;
    }

    const cardUuid = randomUUID();
    cardUuidByOracleId.set(card.oracle_id, cardUuid);
    cardUuidByScryfallId.set(card.id, cardUuid);

    let colorId: string = "";
    for (const c of ["W", "U", "B", "R", "G", "C"]) {
      if (card.color_identity.includes(c)) colorId += c;
    }

    console.log("Creating card:", card.name);
    seedScript.write(
      SqlFileBuffer.sql`
        INSERT INTO "Card"
        ("uuid", "oracleId", "name", "cmc", "colorId", "type")
        VALUES (
          ${cardUuid},
          ${card.oracle_id},
          ${card.name},
          ${card.cmc},
          ${colorId},
          ${card.type_line}
        );
    `,
    );
  }

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

        seedScript.write(
          SqlFileBuffer.sql`
            INSERT INTO "Player"
            ("uuid", "name", "topdeckProfile")
            VALUES (
              ${playerUuid},
              ${anonymizeNames ? faker.person.fullName() : entry.name},
              ${anonymizeNames ? faker.string.nanoid() : entry.profile}
            );
          `,
        );
      }
    } else {
      playerUuid = randomUUID();
      seedScript.write(
        SqlFileBuffer.sql`
          INSERT INTO "Player"
          ("uuid", "name")
          VALUES (
            ${playerUuid},
            ${anonymizeNames ? faker.person.fullName() : entry.name}
          );
        `,
      );
    }

    const cardUuids = new Set(
      (entry.mainDeck ?? [])
        .map((scryfallId) => cardUuidByScryfallId.get(scryfallId))
        .filter((c) => c != null),
    );

    const entryUuid = randomUUID();
    seedScript.write(
      SqlFileBuffer.sql`
        INSERT INTO "Entry"
        ("uuid", "decklist", "draws", "lossesBracket", "lossesSwiss", "standing", "winsBracket", "winsSwiss", "playerUuid", "commanderUuid", "tournamentUuid")
        VALUES (
          ${entryUuid},
          ${entry.decklist},
          ${entry.draws},
          ${entry.lossesBracket},
          ${entry.lossesSwiss},
          ${entry.standing},
          ${entry.winsBracket},
          ${entry.winsSwiss},
          ${playerUuid},
          ${commanderUuid},
          ${tournamentUuid}
        );
      `,
    );

    for (const cardUuid of Array.from(cardUuids)) {
      seedScript.write(
        SqlFileBuffer.sql`
          INSERT INTO "DecklistItem"
          ("entryUuid", "cardUuid")
          VALUES (${entryUuid}, ${cardUuid});
        `,
      );
    }
  }
}

main()
  .catch((e) => {
    console.error("Error during script generation:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongo.close();
  });
