import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Pool, PoolClient, escapeIdentifier } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import pc from "picocolors";

async function streamCsvData(
  client: PoolClient,
  path: string,
  table: string,
  fields: string[],
) {
  console.log(pc.yellow(`Importing table ${table} from ${path}...`));

  const csv = createReadStream(path);
  const copyStream = client.query(
    copyFrom(`
COPY ${escapeIdentifier(table)} (
${fields.map(escapeIdentifier).join(", ")}
) FROM STDIN CSV HEADER;`),
  );

  await pipeline(csv, copyStream);
  console.log(pc.green(`Finished importing table ${table}!`));
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log(pc.yellow("Connecting to database"));
  const client = await pool.connect();

  try {
    await streamCsvData(
      client,
      "prisma/data/tournaments.seed.csv",
      "Tournament",
      [
        "uuid",
        "TID",
        "name",
        "tournamentDate",
        "size",
        "swissRounds",
        "topCut",
        "bracketUrl",
      ],
    );

    await streamCsvData(
      client,
      "prisma/data/commanders.seed.csv",
      "Commander",
      ["uuid", "name", "colorId"],
    );

    await streamCsvData(client, "prisma/data/cards.seed.csv", "Card", [
      "uuid",
      "oracleId",
      "name",
      "data",
    ]);

    await streamCsvData(client, "prisma/data/players.seed.csv", "Player", [
      "uuid",
      "topdeckProfile",
      "name",
    ]);

    await streamCsvData(client, "prisma/data/entries.seed.csv", "Entry", [
      "uuid",
      "decklist",
      "draws",
      "lossesBracket",
      "lossesSwiss",
      "standing",
      "winsBracket",
      "winsSwiss",
      "playerUuid",
      "commanderUuid",
      "tournamentUuid",
    ]);

    await streamCsvData(
      client,
      "prisma/data/decklist.seed.csv",
      "DecklistItem",
      ["entryUuid", "cardUuid"],
    );
  } finally {
    client.release();
  }

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
