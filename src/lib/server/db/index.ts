import { DB } from "./__generated__/types"; // this is the Database interface we defined earlier
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

type GlobalWithDb = typeof global & { db?: Kysely<DB> };

function getDb() {
  const globalWithDb = global as GlobalWithDb;
  if (!globalWithDb.db) {
    const database = new Database("data/edhtop16.db", {
      fileMustExist: true,
    });

    database.pragma("journal_mode = WAL");

    globalWithDb.db = new Kysely<DB>({
      dialect: new SqliteDialect({
        database,
      }),
    });
  }

  return globalWithDb.db;
}

export const db = getDb();
