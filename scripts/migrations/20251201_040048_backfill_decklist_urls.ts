import {type Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Backfill decklist URLs for entries that have DecklistItems but missing decklist column
  // The decklist URL format is: https://topdeck.gg/deck/${TID}/${topdeckProfile}
  await sql`
    UPDATE Entry
    SET decklist = 'https://topdeck.gg/deck/' || t.TID || '/' || p.topdeckProfile
    FROM Tournament t, Player p
    WHERE Entry.tournamentId = t.id
      AND Entry.playerId = p.id
      AND Entry.decklist IS NULL
      AND EXISTS (
        SELECT 1 FROM DecklistItem di WHERE di.entryId = Entry.id
      )
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Rollback is not implemented as we cannot reliably determine which decklist URLs
  // were set by this migration vs. other sources. This is a data backfill operation
  // that should not need to be rolled back.
  throw new Error(
    'Rollback not supported for backfill_decklist_urls migration',
  );
}
