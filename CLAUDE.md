# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Next.js Rewrite

We're currently rewriting the code to use Next.js. Here's what's left to do:

- [x] Implement next-page fetching for Commanders
- [x] Implement next-page fetching for Tournament
- [x] Implement next-page fetching for Commander entries
- [x] Use Next.js's metadata instead of manual <title> tags

Bugs we **must** fix before shipping:

- [x] Commander cards don't take up the full width of the grid
- [ ] Commander page scroll to top when loading more entries

## Development Commands

**Core Development**

- `pnpm dev` - Start development server
- `pnpm install` - Install dependencies (uses pnpm workspaces)

**Build Commands**

- `pnpm build` - Full build (client + server)

**Code Generation**

- `npm run db:generate` - Regenerate SQLite database from scripts
- `npm run db:generate-types` - Generate TypeScript types from database schema

**Database Migrations**

- `pnpm run db:migrate` - Apply all pending migrations to edhtop16.db

**Production**

- `pnpm start` - Start production server

## Architecture Overview

**Framework Stack**

- **React 19** with **Next,js**
- **Express** server with GraphQL Yoga
- **SQLite** (Better SQLite3) for local data
- **TailwindCSS** for styling
- **TypeScript** with strict configuration

**Directory Structure**

- `app/` - React components using Next.js's App Router
- `components/` - Reusable UI components
- `lib/schema/` - Server-side entities, database, and business logic
- `lib/client/` - Client-side utilities, search,
  formatting)
- `__generated__/` - All auto-generated code (types, queries, routing)
- `scripts/` - Database generation and utility scripts

**Data Layer**

- Local SQLite database for core app data (regenerated nightly)
- Scryfall API integration for Magic card data
- TopDeck.gg API for tournament data

## Database System

**Local SQLite** (`edhtop16.db`): Normalized, structured database for the
   application

**Database Generation** (`scripts/generate-database.ts`):

- Connects to Topdeck.gg API
- Downloads Scryfall bulk data (Magic card information)
- Processes and normalizes tournament data into SQLite schema
- Creates optimized indexes for fast queries
- Calculates card play rates for the last year

**Key Data Processing**:

- **Card Data**: Integrated with Scryfall API for Magic card details and Oracle
  IDs
- **Decklist Parsing**: Handles both structured `deckObj` data and raw decklist
  text formats
- **Commander Normalization**: Uses Scryfall Oracle IDs to normalize commander
  names
- **Play Rate Calculation**: Generates statistics for card popularity within
  color identities

**SQLite Schema**:

- `Tournament` - Tournament metadata (TID, name, size, rounds)
- `Player` - Player information with TopDeck.gg profile linking
- `Commander` - Normalized commander names and color identities
- `Entry` - Individual tournament entries with standings and records
- `Card` - Magic card data with Oracle IDs and Scryfall integration
- `DecklistItem` - Many-to-many relationship between entries and cards

**Database Migrations**:

This project uses Kysely's built-in migration system for schema evolution.

**Migration Workflow**:

1. Create migration: `pnpm run migrate:create <name>`
2. Implement up/down functions in generated file:
   `scripts/migrations/{timestamp}_{name}.ts`
3. Test locally: `pnpm run migrate`
4. Regenerate types: `pnpm run generate:dbtypes`
5. Update application code to use new schema
6. Commit migration file and push

**Migration Files**:

- Location: `scripts/migrations/`
- Naming: `{YYYYMMDD}_{HHMMSS}_{name}.ts` (e.g.,
  `20250130_143022_add_player_email.ts`)
- Template: Exports `up` and `down` async functions
- Tracking: Kysely automatically maintains `kysely_migration` table

**Migration Best Practices**:

- Use Kysely schema builder API (`db.schema.*`)
- Never import `#genfiles/db/types` or application code
- Keep migrations self-contained and reversible
- Implement both `up()` and `down()` functions
- Use transactions for multi-step migrations
- Test on database copy first

**CI/CD Integration**:

- Migrations run automatically in GitHub Actions before data generation
- Failed migrations stop the workflow (prevents bad schema from deploying)
- S3 backups created after successful workflow runs

## Important Notes

- **Always format code with `pnpm exec prettier --write <files>` before committing**
- Uses experimental Node.js TypeScript support (`--experimental-strip-types`)
