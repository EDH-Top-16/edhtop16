import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('MatchSeat')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('entryId', 'integer', (col) =>
      col.notNull().references('Entry.id'),
    )
    .addColumn('round', 'text', (col) => col.notNull())
    .addColumn('tableNumber', 'integer')
    .addColumn('seatNumber', 'integer', (col) => col.notNull())
    .addColumn('isWinner', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('isDraw', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('isBye', 'integer', (col) => col.notNull().defaultTo(0))
    .execute();

  await db.schema
    .createIndex('MatchSeat_entryId_round_key')
    .on('MatchSeat')
    .columns(['entryId', 'round'])
    .unique()
    .execute();

  await db.schema
    .createIndex('MatchSeat_entryId_idx')
    .on('MatchSeat')
    .column('entryId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('MatchSeat').execute();
}
