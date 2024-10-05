/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form specified in schema.prisma.
 */

import { Commander, Player, PrismaClient } from "@prisma/client";
import { workerPool } from "@reverecre/promise";
import { randomUUID } from "crypto";
import DataLoader from "dataloader";
import { MongoClient } from "mongodb";
import { z } from "zod";

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

async function getTournamentEntries(tournamentId: string) {
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
  });

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

function createPlayerDataLoader() {
  return new DataLoader<
    Omit<Player, "uuid">,
    [string | null, string | null],
    string | null
  >(
    async (players) => {
      const newUuidsByTopdeckProfile = new Map<string, string>();
      for (const player of players) {
        if (player.topdeckProfile) {
          newUuidsByTopdeckProfile.set(player.topdeckProfile, randomUUID());
        }
      }

      await prisma.player.createMany({
        data: players
          .filter((p) => p.topdeckProfile != null)
          .map(
            (p): Player => ({
              uuid: newUuidsByTopdeckProfile.get(p.topdeckProfile!)!,
              name: p.name,
              topdeckProfile: p.topdeckProfile,
            }),
          ),
      });

      return players.map((p) => [
        p.topdeckProfile,
        newUuidsByTopdeckProfile.get(p.topdeckProfile!) ?? null,
      ]);
    },
    {
      cacheKeyFn: (player) => player.topdeckProfile,
    },
  );
}

function createCommanderDataLoader() {
  return new DataLoader<Omit<Commander, "uuid">, [string, string], string>(
    async (commanders) => {
      const newUuidsByName = new Map<string, string>();
      for (const commander of commanders) {
        newUuidsByName.set(commander.name, randomUUID());
      }

      await prisma.commander.createMany({
        data: commanders.map(
          (c): Commander => ({
            uuid: newUuidsByName.get(c.name)!,
            name: c.name,
            colorId: c.colorId,
          }),
        ),
      });

      return commanders.map((c) => [c.name, newUuidsByName.get(c.name)!]);
    },
    {
      cacheKeyFn: (commander) => commander.name,
    },
  );
}

const players = createPlayerDataLoader();
const commanders = createCommanderDataLoader();

async function main() {
  const tournaments = await getTournaments();
  console.log("Found", tournaments.length, "tournaments!");

  const uuidByTid = new Map(tournaments.map((t) => [t.TID, randomUUID()]));

  await workerPool(tournaments, async (t) => {
    console.log("Creating", t.tournamentName);
    await prisma.tournament.create({
      data: {
        uuid: uuidByTid.get(t.TID)!,
        TID: t.TID,
        name: t.tournamentName,
        size: t.players,
        swissRounds: t.swissRounds,
        topCut: t.topCut,
        tournamentDate: new Date(t.startDate),
        bracketUrl: t.bracketUrl,
      },
    });

    const entries = await getTournamentEntries(t.TID);

    const commanderUuidByName = new Map(
      (
        await commanders.loadMany(
          entries.map((e) => ({
            name: e.commander,
            colorId: e.colorID,
          })),
        )
      ).filter(isNotError),
    );

    const playerUuidByProfile = new Map(
      (
        await players.loadMany(
          entries.map((e) => ({
            name: e.name,
            topdeckProfile: e.profile ?? null,
          })),
        )
      ).filter(isNotError),
    );

    console.log("Creating", entries.length, "entries");
    await prisma.entry.createMany({
      data: entries.map((e) => {
        const entryUuid = randomUUID();
        const playerUuid = playerUuidByProfile.get(e.profile!);
        const commanderUuid = commanderUuidByName.get(e.commander)!;
        const tournamentUuid = uuidByTid.get(t.TID)!;

        return {
          uuid: entryUuid,
          decklist: e.decklist,
          draws: e.draws,
          lossesBracket: e.lossesBracket,
          lossesSwiss: e.lossesSwiss,
          standing: e.standing,
          winsBracket: e.winsBracket,
          winsSwiss: e.winsSwiss,
          playerUuid,
          commanderUuid,
          tournamentUuid,
        };
      }),
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
