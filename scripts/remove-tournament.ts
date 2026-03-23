/**
 * @fileoverview Script to remove a tournament from the local SQLite database.
 * This allows re-scraping tournament results if they have changed.
 */

import Database from 'better-sqlite3';
import {Kysely, SqliteDialect} from 'kysely';
import {parseArgs} from 'node:util';
import pc from 'picocolors';
import type {DB} from '../__generated__/db/types';

const args = parseArgs({
  options: {
    tid: {
      type: 'string',
      short: 't',
      description: 'Tournament ID (TID) to remove',
    },
    'dry-run': {
      type: 'boolean',
      short: 'd',
      default: false,
      description: 'Show what would be deleted without actually deleting',
    },
  },
});

if (!args.values.tid) {
  console.error(pc.red('Must provide --tid <tournament_id>'));
  console.error(
    pc.yellow(
      'Usage: node --experimental-strip-types scripts/remove-tournament.ts --tid <TID>',
    ),
  );
  process.exit(1);
}

const tid = args.values.tid;
const dryRun = args.values['dry-run'];

/** Connection to local SQLite database. */
const sqliteDb = new Database('edhtop16.db');
const db = new Kysely<DB>({
  dialect: new SqliteDialect({database: sqliteDb}),
});

async function main() {
  if (dryRun) {
    info`Running in dry-run mode - no changes will be made`();
  }

  info`Looking up tournament with TID: ${tid}`();

  // Find the tournament
  const tournament = await db
    .selectFrom('Tournament')
    .select(['id', 'name', 'TID'])
    .where('TID', '=', tid)
    .executeTakeFirst();

  if (!tournament) {
    console.error(pc.red(`Tournament with TID "${tid}" not found in database`));
    process.exit(1);
  }

  success`Found tournament: ${tournament.name} (ID: ${tournament.id})`();

  // Get entries for this tournament
  const entries = await db
    .selectFrom('Entry')
    .select(['id'])
    .where('tournamentId', '=', tournament.id)
    .execute();

  const entryIds = entries.map((e) => e.id);
  info`Found ${entryIds.length} entries for this tournament`();

  // Count match seats that will be deleted
  let matchSeatCount = 0;
  if (entryIds.length > 0) {
    const matchSeats = await db
      .selectFrom('MatchSeat')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('entryId', 'in', entryIds)
      .executeTakeFirst();
    matchSeatCount = matchSeats?.count ?? 0;
  }

  info`Found ${matchSeatCount} match seats to delete`();

  // Count decklist items that will be deleted
  let decklistItemCount = 0;
  if (entryIds.length > 0) {
    const decklistItems = await db
      .selectFrom('DecklistItem')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('entryId', 'in', entryIds)
      .executeTakeFirst();
    decklistItemCount = decklistItems?.count ?? 0;
  }

  info`Found ${decklistItemCount} decklist items to delete`();

  if (dryRun) {
    info`Dry run complete. Would delete:`();
    console.log(pc.cyan(`  - ${matchSeatCount} match seats`));
    console.log(pc.cyan(`  - ${decklistItemCount} decklist items`));
    console.log(pc.cyan(`  - ${entryIds.length} entries`));
    console.log(pc.cyan(`  - 1 tournament`));
    return;
  }

  // Delete in order: MatchSeats -> DecklistItems -> Entries -> Tournament
  info`Deleting match seats...`();
  if (entryIds.length > 0) {
    await db.deleteFrom('MatchSeat').where('entryId', 'in', entryIds).execute();
  }
  success`Deleted ${matchSeatCount} match seats`();

  info`Deleting decklist items...`();
  if (entryIds.length > 0) {
    await db
      .deleteFrom('DecklistItem')
      .where('entryId', 'in', entryIds)
      .execute();
  }
  success`Deleted ${decklistItemCount} decklist items`();

  info`Deleting entries...`();
  await db
    .deleteFrom('Entry')
    .where('tournamentId', '=', tournament.id)
    .execute();
  success`Deleted ${entryIds.length} entries`();

  info`Deleting tournament...`();
  await db.deleteFrom('Tournament').where('id', '=', tournament.id).execute();
  success`Deleted tournament: ${tournament.name}`();

  success`Tournament ${tid} has been removed from the database`();
  info`You can now re-import it with: node --experimental-strip-types scripts/pull-database.ts --tid ${tid}`();
}

main()
  .catch((e) => {
    console.error('Error during tournament removal:');
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    sqliteDb.close();
  });

function formatLog(
  color: 'green' | 'yellow',
  strings: TemplateStringsArray,
  values: (string | number)[],
) {
  const parts = strings.map(
    (str, i) => pc[color](str) + (i < values.length ? pc.cyan(values[i]) : ''),
  );

  return parts.join('');
}

function info(strings: TemplateStringsArray, ...values: (string | number)[]) {
  const msg = formatLog('yellow', strings, values);
  return () => {
    console.log(msg);
  };
}

function success(
  strings: TemplateStringsArray,
  ...values: (string | number)[]
) {
  const msg = formatLog('green', strings, values);
  return () => {
    console.log(msg);
  };
}
