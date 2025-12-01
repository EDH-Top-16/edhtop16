import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Player').addColumn('elo', 'real').execute();
}
