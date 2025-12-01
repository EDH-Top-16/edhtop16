import Database from 'better-sqlite3';
import {Kysely, SqliteDialect, Migrator, FileMigrationProvider} from 'kysely';
import {parseArgs} from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';

/**
 * Create a write-enabled database connection for migrations.
 * Unlike the read-only connection in src/lib/server/db.ts, this connection
 * allows schema modifications.
 */
function createMigrationDb() {
  const database = new Database('edhtop16.db', {
    fileMustExist: true,
    // NOT readonly - migrations need write access
  });

  return new Kysely<any>({
    dialect: new SqliteDialect({database}),
  });
}

/**
 * Generate a new migration file with timestamp and name.
 * Creates the migrations directory if it doesn't exist.
 */
async function generateMigrationFile(name: string): Promise<void> {
  const now = new Date();
  // Format: YYYYMMDD_HHMMSS
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .slice(0, 15);

  const fileName = `${timestamp}_${name}.ts`;
  const filePath = path.join('scripts', 'migrations', fileName);

  const template = `import {type Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // TODO: Implement migration
}

export async function down(db: Kysely<any>): Promise<void> {
  // TODO: Implement rollback
}
`;

  await fs.mkdir(path.dirname(filePath), {recursive: true});
  await fs.writeFile(filePath, template);
  console.log(pc.green(`✓ Created migration: ${filePath}`));
}

/**
 * Run all pending migrations using Kysely's Migrator.
 */
async function runMigrations(): Promise<void> {
  const db = createMigrationDb();

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'scripts', 'migrations'),
    }),
  });

  console.log(pc.yellow('Running migrations...'));
  const {error, results} = await migrator.migrateToLatest();

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(pc.green(`✓ ${result.migrationName}`));
    } else if (result.status === 'Error') {
      console.error(pc.red(`✗ ${result.migrationName}`));
    }
  });

  await db.destroy();

  if (error) {
    console.error(pc.red('Migration failed:'));
    console.error(error);
    process.exit(1);
  }

  if (!results || results.length === 0) {
    console.log(pc.blue('No pending migrations.'));
  } else {
    console.log(
      pc.green(`✓ Completed ${results.length} migration(s) successfully!`),
    );
  }
}

/**
 * Main entry point for the migration script.
 * Supports two modes:
 * 1. Default: Apply all pending migrations
 * 2. --create <name>: Generate a new migration file
 */
async function main() {
  const {values} = parseArgs({
    options: {
      create: {type: 'string', short: 'c'},
    },
  });

  if (values.create) {
    await generateMigrationFile(values.create);
  } else {
    await runMigrations();
  }
}

main().catch((error) => {
  console.error(pc.red('Error:'), error);
  process.exit(1);
});
