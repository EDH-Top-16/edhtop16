/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form specified in schema.prisma.
 */

import { PrismaClient } from "@prisma/client";
import { workerPool } from "@reverecre/promise";
import { randomUUID } from "crypto";
import { MongoClient } from "mongodb";
import { z } from "zod";
import { createScyfallIdLoader } from "../src/lib/server/scryfall";

const env = z.object({ ENTRIES_DB_URL: z.string() }).parse(process.env);

// Connection to the raw entries database.
const mongo = new MongoClient(env.ENTRIES_DB_URL);
// Connection to the normalized database, well typed using Prisma.
const prisma = new PrismaClient();

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

async function getTournaments(): Promise<z.infer<typeof jsonImportedSchema>[]> {
  const tournamentSchema = z.union([
    topdeckTournamentSchema,
    jsonImportedSchema,
  ]);

  const tournaments = mongo
    .db("cedhtop16")
    .collection("metadata")
    .find()
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
  const tournaments = await getTournaments();
  console.log("Found", tournaments.length, "tournaments!");

  const tournamentUuidByTid = new Map<string, string>();
  const entriesByTid = new Map<string, Entry[]>();
  const playerUuidByTopdeckUuid = new Map<string, string>();
  const commanderUuidByName = new Map<string, string>();
  const cardUuidByOracleId = new Map<string, string>();
  const cardUuidByScryfallId = new Map<string, string>();

  // Create all tournament objects in database and collect entries.
  await workerPool(tournaments, async (t) => {
    console.log("Creating tournament:", t.tournamentName);

    try {
      const tournament = await prisma.tournament.create({
        data: {
          uuid: randomUUID(),
          TID: t.TID,
          name: t.tournamentName,
          size: t.players,
          swissRounds: t.swissRounds,
          topCut: t.topCut,
          tournamentDate: new Date(t.startDate * 1000).toISOString(),
          bracketUrl: t.bracketUrl,
        },
      });

      tournamentUuidByTid.set(tournament.TID, tournament.uuid);

      const entries = await getTournamentEntries(t.TID);
      entriesByTid.set(tournament.TID, entries);
    } catch (e) {
      console.error(
        `Could not create tournament ${t.tournamentName} (TID ${t.TID}):`,
        e,
      );

      return;
    }
  });

  const entries = Array.from(entriesByTid).flatMap(([TID, entries]) => {
    return entries.flatMap((e) => ({ ...e, TID }));
  });

  console.log("Found", entries.length, "entries!");

  // Create all commanders.
  await workerPool(entries, async (entry) => {
    if (commanderUuidByName.has(entry.commander)) return;

    console.log("Creating commander:", entry.commander);

    const commanderUuid = randomUUID();
    commanderUuidByName.set(entry.commander, commanderUuid);
    await prisma.commander.create({
      data: {
        uuid: commanderUuid,
        name: entry.commander,
        colorId: entry.colorID,
      },
    });
  });

  const cardLoader = createScyfallIdLoader();
  const cards = (
    await cardLoader.loadMany(entries.flatMap((e) => e.mainDeck ?? []))
  ).filter(isNotError);

  // Create all cards.
  await workerPool(cards, async (card) => {
    if (cardUuidByOracleId.has(card.oracle_id)) {
      if (!cardUuidByScryfallId.has(card.id)) {
        cardUuidByScryfallId.set(
          card.id,
          cardUuidByOracleId.get(card.oracle_id)!,
        );
      }

      return;
    }

    console.log("Creating card:", card.name);

    const cardUuid = randomUUID();
    cardUuidByOracleId.set(card.oracle_id, cardUuid);
    cardUuidByScryfallId.set(card.id, cardUuid);

    let colorId: string = "";
    for (const c of ["W", "U", "B", "R", "G", "C"]) {
      if (card.color_identity.includes(c)) colorId += c;
    }

    await prisma.card.create({
      data: {
        uuid: cardUuid,
        oracleId: card.oracle_id,
        name: card.name,
        cmc: card.cmc,
        colorId,
        type: card.type_line,
      },
    });
  });

  // Create all entries and players.
  await workerPool(entries, async (entry) => {
    const tournamentUuid = tournamentUuidByTid.get(entry.TID);
    if (tournamentUuid == null) {
      console.error(`Could not find UUID for tournament: ${entry.TID}`);
      return;
    }

    const commanderUuid = commanderUuidByName.get(entry.commander);
    if (commanderUuid == null) {
      console.error(`Could not find UUID for commander: ${entry.commander}`);
      return;
    }

    let playerUuid: string;
    if (entry.profile != null) {
      if (playerUuidByTopdeckUuid.has(entry.profile)) {
        playerUuid = playerUuidByTopdeckUuid.get(entry.profile)!;
      } else {
        playerUuid = randomUUID();
        playerUuidByTopdeckUuid.set(entry.profile, playerUuid);

        await prisma.player.create({
          data: {
            uuid: playerUuid,
            name: entry.name,
            topdeckProfile: entry.profile,
          },
        });
      }
    } else {
      const player = await prisma.player.create({
        data: { uuid: randomUUID(), name: entry.name },
      });

      playerUuid = player.uuid;
    }

    const cardUuids = new Set(
      (entry.mainDeck ?? [])
        .map((scryfallId) => cardUuidByScryfallId.get(scryfallId))
        .filter((c) => c != null),
    );

    const entryUuid = randomUUID();
    await prisma.entry.create({
      data: {
        uuid: entryUuid,
        decklist: entry.decklist,
        draws: entry.draws,
        lossesBracket: entry.lossesBracket,
        lossesSwiss: entry.lossesSwiss,
        standing: entry.standing,
        winsBracket: entry.winsBracket,
        winsSwiss: entry.winsSwiss,
        playerUuid,
        commanderUuid,
        tournamentUuid,
        DecklistItem: {
          createMany: {
            data: Array.from(cardUuids).map((cardUuid) => ({ cardUuid })),
          },
        },
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongo.close();
    await prisma.$disconnect();
  });
