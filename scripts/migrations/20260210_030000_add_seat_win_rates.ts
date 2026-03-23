import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('Tournament')
    .addColumn('seatWinRate1', 'real')
    .execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('seatWinRate2', 'real')
    .execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('seatWinRate3', 'real')
    .execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('seatWinRate4', 'real')
    .execute();

  await db.schema
    .alterTable('Tournament')
    .addColumn('drawRate', 'real')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('Tournament').dropColumn('seatWinRate1').execute();

  await db.schema.alterTable('Tournament').dropColumn('seatWinRate2').execute();

  await db.schema.alterTable('Tournament').dropColumn('seatWinRate3').execute();

  await db.schema.alterTable('Tournament').dropColumn('seatWinRate4').execute();

  await db.schema.alterTable('Tournament').dropColumn('drawRate').execute();
}
