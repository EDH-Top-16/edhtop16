/**
 * @fileoverview Backfill location data for existing tournaments by fetching
 * eventData from the TopDeck API and deriving country from coordinates.
 */

import {feature} from '@rapideditor/country-coder';
import Database from 'better-sqlite3';
import {Kysely, SqliteDialect} from 'kysely';
import type {DB} from '../__generated__/db/types';
import {TopDeckClient} from './lib/topdeck-client.ts';

try {
  process.loadEnvFile();
} catch {
  console.log('No .env file found, continuing...');
}

if (!process.env.TOPDECK_GG_API_KEY) {
  console.error('Must provide TOPDECK_GG_API_KEY!');
  process.exit(1);
}

const topdeckClient = new TopDeckClient(process.env.TOPDECK_GG_API_KEY);

const sqliteDb = new Database('edhtop16.db');
const db = new Kysely<DB>({
  dialect: new SqliteDialect({database: sqliteDb}),
});

function countryFromCoords(
  lat: number | undefined,
  lng: number | undefined,
): string | null {
  if (lat == null || lng == null) return null;
  const f = feature([lng, lat]);
  return f?.properties?.nameEn ?? null;
}

async function main() {
  const tournaments = await db
    .selectFrom('Tournament')
    .select(['id', 'TID', 'latitude', 'longitude'])
    .where((eb) =>
      eb.and([
        eb('locationName', 'is', null),
        eb('city', 'is', null),
        eb('latitude', 'is', null),
      ]),
    )
    .execute();

  console.log(`Found ${tournaments.length} tournaments missing location data.`);

  if (tournaments.length === 0) {
    // Still backfill country for tournaments that have coordinates but no country
    await backfillCountryOnly();
    return;
  }

  const BATCH_SIZE = 50;
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < tournaments.length; i += BATCH_SIZE) {
    const batch = tournaments.slice(i, i + BATCH_SIZE);
    const tids = batch.map((t) => t.TID);

    console.log(
      `Fetching batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(tournaments.length / BATCH_SIZE)} (${tids.length} tournaments)...`,
    );

    let results;
    try {
      results = await topdeckClient.listTournaments({TID: tids});
    } catch (e) {
      console.error(`  Error fetching batch: ${e}`);
      continue;
    }

    const eventDataByTid = new Map(
      results.map((t) => [t.TID, t.eventData] as const),
    );

    for (const tournament of batch) {
      const eventData = eventDataByTid.get(tournament.TID);
      const hasLocation =
        eventData?.location || eventData?.city || eventData?.lat != null;

      if (!hasLocation) {
        skipped++;
        continue;
      }

      const country = countryFromCoords(eventData?.lat, eventData?.lng);

      await db
        .updateTable('Tournament')
        .set({
          locationName: eventData?.location ?? null,
          city: eventData?.city ?? null,
          state: eventData?.state ?? null,
          latitude: eventData?.lat ?? null,
          longitude: eventData?.lng ?? null,
          country,
        })
        .where('id', '=', tournament.id)
        .execute();

      updated++;
    }

    console.log(
      `  Progress: ${updated} updated, ${skipped} skipped (no location data)`,
    );

    // Rate limit between batches
    if (i + BATCH_SIZE < tournaments.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(
    `Done! Updated ${updated} tournaments, skipped ${skipped} with no location data.`,
  );

  await backfillCountryOnly();
}

/** Backfill country for tournaments that have coordinates but no country yet. */
async function backfillCountryOnly() {
  const rows = await db
    .selectFrom('Tournament')
    .select(['id', 'latitude', 'longitude'])
    .where('country', 'is', null)
    .where('latitude', 'is not', null)
    .where('longitude', 'is not', null)
    .execute();

  if (rows.length === 0) {
    console.log('All tournaments with coordinates already have country set.');
    return;
  }

  console.log(
    `Backfilling country for ${rows.length} tournaments with coordinates...`,
  );

  let updated = 0;
  for (const row of rows) {
    const country = countryFromCoords(row.latitude!, row.longitude!);
    if (!country) continue;

    await db
      .updateTable('Tournament')
      .set({country})
      .where('id', '=', row.id)
      .execute();
    updated++;
  }

  console.log(`Done! Set country for ${updated} tournaments.`);
}

main()
  .catch((e) => {
    console.error('Backfill failed:', e);
    process.exit(1);
  })
  .finally(() => {
    sqliteDb.close();
  });
