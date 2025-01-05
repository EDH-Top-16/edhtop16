import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { DB } from "./__generated__/types";

type GlobalWithDb = typeof global & { db?: Kysely<DB> };

function getDb() {
  const globalWithDb = global as GlobalWithDb;
  if (!globalWithDb.db) {
    const database = new Database("data/edhtop16.db", {
      readonly: true,
      fileMustExist: true,
    });

    database.pragma("query_only = 1");
    database.pragma("synchronous = 0");
    database.pragma("journal_mode = OFF");

    globalWithDb.db = new Kysely<DB>({
      dialect: new SqliteDialect({
        database,
      }),
    });
  }

  return globalWithDb.db;
}

export const db = getDb();
