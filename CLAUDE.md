# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

**Core Development**

- `npm run dev` - Start development server
- `pnpm install` - Install dependencies (uses pnpm workspaces)

**Build Commands**

- `npm run build` - Full build (client + server)
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only (SSR)

**Code Generation**

- `npm run generate:relay` - Generate Relay artifacts (run after GraphQL
  changes)
- `npm run generate:db` - Regenerate SQLite database from scripts
- `npm run generate:dbtypes` - Generate TypeScript types from database schema
- `npm run generate:router` - Generate Router routing artifacts (see Pastoria
  System below)
- `npm run generate:schema` - Print GraphQL schema

**Database Migrations**

- `pnpm run migrate` - Apply all pending migrations to edhtop16.db
- `pnpm run migrate:create <name>` - Create new migration file

**Production**

- `npm start` - Start production server

## Architecture Overview

**Framework Stack**

- **React 19** with **Relay** for GraphQL data fetching
- **Vite** for build tooling with SSR support
- **Express** server with GraphQL Yoga
- **SQLite** (Better SQLite3) for local data
- **TailwindCSS** for styling
- **TypeScript** with strict configuration

**Key Architectural Patterns**

1. **Server-Side Rendering (SSR)**: Uses Vite SSR with custom Router routing
   system
   - Entry points: `src/entry-server.tsx` (SSR) and `src/entry-client.tsx`
     (hydration)
   - Custom Router system generates routes in `__generated__/router/`

2. **GraphQL with Relay**:
   - Schema defined in `src/lib/server/schema/` using Pothos
   - Relay queries in `__generated__/queries/`
   - Persisted queries in `__generated__/router/persisted_queries.json`

3. **Code Generation Pipeline**:
   - Relay compiler generates query artifacts
   - Kysely generates database types
   - Custom Router system generates routing code
   - All generated files go to `__generated__/`

**Directory Structure**

- `src/lib/server/` - Server-side GraphQL schema, database, and business logic
- `src/lib/client/` - Client-side utilities (Relay environment, search,
  formatting)
- `src/pages/` - React components with `.entrypoint.tsx` files for routing
- `src/components/` - Reusable UI components
- `__generated__/` - All auto-generated code (types, queries, routing)
- `packages/` - pnpm workspace packages (pastoria tooling)
- `scripts/` - Database generation and utility scripts

**Data Layer**

- Local SQLite database for core app data (regenerated nightly)
- Scryfall API integration for Magic card data
- TopDeck.gg API for tournament data

**Path Aliases**

- `#src/*` → `./src/*`
- `#genfiles/*` → `./__generated__/*`

## Database System

**Local SQLite** (`edhtop16.db`): Normalized, structured database for the
   application

**Database Generation** (`scripts/generate-database.ts`):

- Connects to MongoDB data warehouse using `ENTRIES_DB_URL` environment variable
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

## Workspace Configuration

This project uses **pnpm workspaces** for managing multiple packages:

- **Root workspace** (`/`) - Main application code
- **pastoria package** (`packages/pastoria/`) - Router code generation tooling

**Workspace Commands**:

- `pnpm install` - Install all workspace dependencies
- `pnpm --filter @edhtop16/pastoria <command>` - Run commands in specific
  workspace
- `pastoria` - Available as binary from pastoria workspace package

## Important Notes

- Always run `npm run generate:relay` after modifying GraphQL queries or schema
- Always run `npm run generate:schema` after modifying GraphQL schema code in
  `src/lib/server/schema/`
- Always run `npm run generate:router` after adding/modifying JSDoc route
  annotations
- Always run `pnpm run generate:dbtypes` after applying database migrations
- **Always format code with `vp fmt` before committing**
- Database regeneration completely rebuilds the SQLite database
- Uses experimental Node.js TypeScript support (`--experimental-strip-types`)
- Uses pnpm workspaces for managing pastoria tooling as separate package

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ commands take precedence over `package.json` scripts. If there is a `test` script defined in `scripts` that conflicts with the built-in `vp test` command, run it using `vp run test`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
