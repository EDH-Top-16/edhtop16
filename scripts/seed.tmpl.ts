import {
  Commander,
  Entry,
  Player,
  PrismaClient,
  Tournament,
} from "@prisma/client";

const players: Player[] = JSON.parse("{{players}}");
const commanders: Commander[] = JSON.parse("{{commanders}}");
const tournaments: Tournament[] = JSON.parse("{{tournaments}}");
const entries: Entry[] = JSON.parse("{{entries}}");

const prisma = new PrismaClient();

async function main() {
  console.log("Creating", players.length, "players...");
  await prisma.player.createMany({ data: players });

  console.log("Creating", commanders.length, "commanders...");
  await prisma.commander.createMany({ data: commanders });

  console.log("Creating", tournaments.length, "tournaments...");
  await prisma.tournament.createMany({ data: tournaments });

  console.log("Creating", entries.length, "entries...");
  await prisma.entry.createMany({ data: entries });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
