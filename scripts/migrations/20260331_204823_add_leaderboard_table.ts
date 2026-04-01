import {type Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('Leaderboard')
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull(),
    )
    .addColumn('playerId', 'integer', (col) =>
      col.notNull().references('Player.id'),
    )
    .addColumn('rank', 'integer', (col) => col.notNull())
    .addColumn('totalGames', 'integer', (col) => col.notNull())
    .addColumn('draws', 'integer', (col) => col.notNull())
    .addColumn('drawRate', 'real', (col) => col.notNull())
    .addColumn('topCommanderIds', 'text', (col) => col.notNull())
    .execute();

  await sql`CREATE UNIQUE INDEX "Leaderboard_playerId_key" ON "Leaderboard"("playerId")`.execute(
    db,
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('Leaderboard').execute();
}
