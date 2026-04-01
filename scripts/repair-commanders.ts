import Database from 'better-sqlite3';
import {Kysely, SqliteDialect} from 'kysely';
import pc from 'picocolors';
import type {DB} from '../__generated__/db/types';
import {type ScryfallCard} from '../src/lib/server/scryfall.ts';
import fs from 'node:fs/promises';

const sqliteDb = new Database('edhtop16.db');
const db = new Kysely<DB>({
  dialect: new SqliteDialect({database: sqliteDb}),
});

// Load Scryfall oracle cards
console.log(pc.yellow('Loading Scryfall oracle cards...'));
const scryfallJson = (
  await fs.readFile('./oracle_cards.scryfall.json')
).toString();
const allCards: ScryfallCard[] = JSON.parse(scryfallJson);

// Build lookup from front-face name to full card, skipping art_series
const cardByFrontFace = new Map<string, ScryfallCard>();
for (const card of allCards) {
  if (card.layout === 'art_series') continue;
  cardByFrontFace.set(card.name, card);
  const frontFace = card.name.split(' // ')[0]!;
  if (frontFace !== card.name) {
    cardByFrontFace.set(frontFace, card);
  }
}

function wubrgify(colorIdentity: string[]): string {
  let buf = '';
  if (colorIdentity.includes('W')) buf += 'W';
  if (colorIdentity.includes('U')) buf += 'U';
  if (colorIdentity.includes('B')) buf += 'B';
  if (colorIdentity.includes('R')) buf += 'R';
  if (colorIdentity.includes('G')) buf += 'G';
  return buf.length === 0 ? 'C' : buf;
}

const commanders = await db.selectFrom('Commander').selectAll().execute();
let repaired = 0;

for (const commander of commanders) {
  const parts = commander.name.split(' / ');
  const resolvedCards = parts.map((part) => {
    // Try exact match first, then try front-face of a "Name // Name" artifact
    const frontFace = part.split(' // ')[0]!;
    return cardByFrontFace.get(part) ?? cardByFrontFace.get(frontFace);
  });

  const resolvedNames = parts.map((part, i) => resolvedCards[i]?.name ?? part);
  const canonicalName = resolvedNames.sort().join(' / ');

  const colorIdentity = wubrgify(
    resolvedCards.flatMap((c) => c?.color_identity ?? []),
  );

  if (canonicalName !== commander.name || colorIdentity !== commander.colorId) {
    // Check if canonical name already exists
    const existing = await db
      .selectFrom('Commander')
      .select('id')
      .where('name', '=', canonicalName)
      .where('id', '!=', commander.id)
      .executeTakeFirst();

    if (existing) {
      await db
        .updateTable('Entry')
        .set({commanderId: existing.id})
        .where('commanderId', '=', commander.id)
        .execute();
      await db.deleteFrom('Commander').where('id', '=', commander.id).execute();
      console.log(
        pc.yellow(
          `  Merged "${commander.name}" → "${canonicalName}" (id ${existing.id})`,
        ),
      );
    } else {
      await db
        .updateTable('Commander')
        .set({name: canonicalName, colorId: colorIdentity})
        .where('id', '=', commander.id)
        .execute();
      console.log(
        pc.green(
          `  Fixed "${commander.name}" → "${canonicalName}" [${commander.colorId} → ${colorIdentity}]`,
        ),
      );
    }
    repaired++;
  }
}

console.log(pc.green(`\nRepaired ${repaired} commanders.`));
await db.destroy();
