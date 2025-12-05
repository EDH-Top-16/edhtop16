import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('Player')
    .addColumn('offersCoaching', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .execute();

  await db.schema
    .alterTable('Player')
    .addColumn('coachingBio', 'text')
    .execute();

  await db.schema
    .alterTable('Player')
    .addColumn('coachingBookingUrl', 'text')
    .execute();

  await db.schema
    .alterTable('Player')
    .addColumn('coachingRatePerHour', 'real')
    .execute();
}
