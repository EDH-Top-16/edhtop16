/**
 * @fileoverview One-time cleanup script to remove duplicate Entry rows.
 *
 * This script will:
 * 1. Find duplicate entries for the same tournament/player
 * 2. Keep the entry with the best (lowest) standing
 * 3. Delete the other duplicates and their associated DecklistItems
 */

import Database from 'better-sqlite3';
import pc from 'picocolors';

const db = new Database('edhtop16.db');

try {
  // Find and count duplicates
  const duplicateCount = db
    .prepare(
      `SELECT COUNT(*) as count FROM Entry e1
       WHERE EXISTS (
         SELECT 1 FROM Entry e2
         WHERE e1.tournamentId = e2.tournamentId
         AND e1.playerId = e2.playerId
         AND e1.id != e2.id
       )`,
    )
    .get() as {count: number};

  if (duplicateCount.count > 0) {
    console.log(
      pc.yellow(`Found ${duplicateCount.count} duplicate Entry rows`),
    );

    // First, delete DecklistItem rows for duplicate entries
    const decklistResult = db
      .prepare(
        `DELETE FROM DecklistItem
         WHERE entryId IN (
           SELECT e.id
           FROM Entry e
           INNER JOIN (
             SELECT tournamentId, playerId, MIN(standing) as best_standing
             FROM Entry
             GROUP BY tournamentId, playerId
             HAVING COUNT(*) > 1
           ) best ON e.tournamentId = best.tournamentId
                 AND e.playerId = best.playerId
           WHERE e.standing != best.best_standing
              OR (e.standing = best.best_standing AND e.id NOT IN (
                SELECT MIN(id) FROM Entry e2
                WHERE e2.tournamentId = e.tournamentId
                  AND e2.playerId = e.playerId
                  AND e2.standing = best.best_standing
              ))
         )`,
      )
      .run();

    if (decklistResult.changes > 0) {
      console.log(
        pc.yellow(
          `  Deleted ${decklistResult.changes} DecklistItem rows for duplicate entries`,
        ),
      );
    }

    // Then delete duplicate entries, keeping the one with the best (lowest) standing
    const result = db
      .prepare(
        `DELETE FROM Entry
         WHERE id IN (
           SELECT e.id
           FROM Entry e
           INNER JOIN (
             SELECT tournamentId, playerId, MIN(standing) as best_standing
             FROM Entry
             GROUP BY tournamentId, playerId
             HAVING COUNT(*) > 1
           ) best ON e.tournamentId = best.tournamentId
                 AND e.playerId = best.playerId
           WHERE e.standing != best.best_standing
              OR (e.standing = best.best_standing AND e.id NOT IN (
                SELECT MIN(id) FROM Entry e2
                WHERE e2.tournamentId = e.tournamentId
                  AND e2.playerId = e.playerId
                  AND e2.standing = best.best_standing
              ))
         )`,
      )
      .run();

    console.log(
      pc.green(
        `✓ Deleted ${result.changes} duplicate Entry rows (kept best standing)`,
      ),
    );
  } else {
    console.log(pc.green('✓ No duplicate entries found'));
  }
} catch (error) {
  console.error(pc.red('Cleanup failed:'), error);
  process.exit(1);
} finally {
  db.close();
}
