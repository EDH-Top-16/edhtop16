import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('Tournament')
    .addColumn('locationName', 'text')
    .execute();

  await db.schema.alterTable('Tournament').addColumn('city', 'text').execute();

  await db.schema.alterTable('Tournament').addColumn('state', 'text').execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('latitude', 'real')
    .execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('longitude', 'real')
    .execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('country', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Tournament').dropColumn('locationName').execute();

  await db.schema.alterTable('Tournament').dropColumn('city').execute();

  await db.schema.alterTable('Tournament').dropColumn('state').execute();

  await db.schema.alterTable('Tournament').dropColumn('latitude').execute();

  await db.schema.alterTable('Tournament').dropColumn('longitude').execute();

  await db.schema.alterTable('Tournament').dropColumn('country').execute();
}
