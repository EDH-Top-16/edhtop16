import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Player').addColumn('teamId', 'text').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Player').dropColumn('teamId').execute();
}
