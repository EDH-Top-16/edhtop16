import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Player').addColumn('bestDecks', 'text').execute();

  await db.schema
    .alterTable('Player')
    .addColumn('topFinishes', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Player').dropColumn('bestDecks').execute();
  await db.schema.alterTable('Player').dropColumn('topFinishes').execute();
}
