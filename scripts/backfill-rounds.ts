/**
 * @fileoverview Script to backfill MatchSeat data for existing tournaments
 * that don't yet have round data.
 *
 * Usage:
 *   node --experimental-strip-types scripts/backfill-rounds.ts
 *   node --experimental-strip-types scripts/backfill-rounds.ts --tid <TID>
 */

import {chunkedWorkerPool} from '@reverecre/promise';
import Database from 'better-sqlite3';
import {type InsertObject, Kysely, SqliteDialect} from 'kysely';
import {parseArgs} from 'node:util';
import pc from 'picocolors';
import type {DB} from '../__generated__/db/types';
import {TopDeckClient} from './lib/topdeck-client.ts';

try {
  process.loadEnvFile();
} catch {
  // No .env file, continue
}

const args = parseArgs({
  options: {
    tid: {
      type: 'string',
      multiple: true,
    },
  },
});

if (!process.env.TOPDECK_GG_API_KEY) {
  console.error(pc.red('Must provide TOPDECK_GG_API_KEY!'));
  process.exit(1);
}

const topdeckClient = new TopDeckClient(process.env.TOPDECK_GG_API_KEY);

const sqliteDb = new Database('edhtop16.db');
const db = new Kysely<DB>({
  dialect: new SqliteDialect({database: sqliteDb}),
});

function info(strings: TemplateStringsArray, ...values: (string | number)[]) {
  const parts = strings.map(
    (str, i) => pc.yellow(str) + (i < values.length ? pc.cyan(values[i]) : ''),
  );
  return () => {
    console.log(parts.join(''));
  };
}

function success(
  strings: TemplateStringsArray,
  ...values: (string | number)[]
) {
  const parts = strings.map(
    (str, i) => pc.green(str) + (i < values.length ? pc.cyan(values[i]) : ''),
  );
  return () => {
    console.log(parts.join(''));
  };
}

async function main({tid: targetTids}: {tid?: string[]}) {
  // Build lookup: (TID, topdeckProfile) → Entry.id
  info`Building entry lookup table...`();
  const entryRows = await db
    .selectFrom('Entry as e')
    .innerJoin('Player as p', 'p.id', 'e.playerId')
    .innerJoin('Tournament as t', 't.id', 'e.tournamentId')
    .select(['e.id as entryId', 't.TID', 'p.topdeckProfile'])
    .execute();

  const entryIdByTidAndProfile = new Map<string, number>();
  for (const row of entryRows) {
    if (row.topdeckProfile) {
      entryIdByTidAndProfile.set(
        `${row.TID}:${row.topdeckProfile}`,
        row.entryId,
      );
    }
  }

  info`Loaded ${entryIdByTidAndProfile.size} entry mappings`();

  // Find tournaments to backfill
  let tournaments: {id: number; TID: string; name: string}[];

  if (targetTids && targetTids.length > 0) {
    tournaments = await db
      .selectFrom('Tournament')
      .select(['id', 'TID', 'name'])
      .where('TID', 'in', targetTids)
      .execute();
  } else {
    // Find tournaments with zero MatchSeat rows
    tournaments = await db
      .selectFrom('Tournament as t')
      .select(['t.id', 't.TID', 't.name'])
      .where(
        't.id',
        'not in',
        db
          .selectFrom('Entry as e')
          .innerJoin('MatchSeat as ms', 'ms.entryId', 'e.id')
          .select('e.tournamentId')
          .distinct(),
      )
      .execute();
  }

  info`Found ${tournaments.length} tournaments to backfill`();

  let totalSeats = 0;
  for (let ti = 0; ti < tournaments.length; ti++) {
    const t = tournaments[ti];
    if (ti > 0) await new Promise((r) => setTimeout(r, 200));

    let rounds;
    try {
      rounds = await topdeckClient.getRounds(t.TID);
    } catch (e) {
      info`Skipping ${t.name} (${t.TID}): ${String(e)}`();
      continue;
    }

    const rows: InsertObject<DB, 'MatchSeat'>[] = [];

    for (const round of rounds) {
      const roundLabel = String(round.round);

      for (const table of round.tables) {
        const isBye =
          table.table === 'Byes' ||
          String(table.table) === 'Byes' ||
          table.status === 'Bye'
            ? 1
            : 0;
        const tableNumber =
          typeof table.table === 'number' ? table.table : null;
        const isDraw =
          table.winner_id === 'Draw' || table.winner === 'Draw' ? 1 : 0;

        for (let i = 0; i < table.players.length; i++) {
          const player = table.players[i];
          const entryId = entryIdByTidAndProfile.get(`${t.TID}:${player.id}`);
          if (entryId == null) continue;

          rows.push({
            entryId,
            round: roundLabel,
            tableNumber,
            seatNumber: i,
            isWinner: table.winner_id === player.id ? 1 : 0,
            isDraw,
            isBye,
          });
        }
      }
    }

    if (rows.length === 0) {
      info`No round data for ${t.name} (${t.TID})`();
      continue;
    }

    await chunkedWorkerPool(
      rows,
      async (chunk) => {
        await db
          .insertInto('MatchSeat')
          .values(chunk)
          .onConflict((oc) =>
            oc.columns(['entryId', 'round']).doUpdateSet((eb) => ({
              tableNumber: eb.ref('excluded.tableNumber'),
              seatNumber: eb.ref('excluded.seatNumber'),
              isWinner: eb.ref('excluded.isWinner'),
              isDraw: eb.ref('excluded.isDraw'),
              isBye: eb.ref('excluded.isBye'),
            })),
          )
          .execute();
        return chunk;
      },
      {chunkSize: 120, workers: 1},
    );

    totalSeats += rows.length;
    success`Backfilled ${rows.length} seats for ${t.name} (${t.TID})`();
  }

  success`Done! Backfilled ${totalSeats} total match seats across ${tournaments.length} tournaments.`();
}

main(args.values)
  .catch((e) => {
    console.error('Error during backfill:');
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    sqliteDb.close();
  });
