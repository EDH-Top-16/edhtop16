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

## Pastoria Routing System

**Overview**: Custom routing framework that generates type-safe routes via JSDoc
annotations

**How Pastoria Works**:

1. **Annotation-Based**: Uses JSDoc tags to declare routes and resources
   - `@route <route-name>` - Creates a new route
   - `@resource <resource-name>` - Marks exports for lazy loading
   - `@param <name> <type>` - Documents route parameters with TypeScript types

2. **Code Generation** (pastoria workspace package):
   - Located in `packages/pastoria/` as a separate pnpm workspace package
   - Scans all TypeScript files for JSDoc annotations
   - Generates three files from templates in `packages/pastoria/templates/`:
     - `__generated__/router/js_resource.ts` - Resource configuration for lazy
       loading
     - `__generated__/router/router.tsx` - Client-side router with type-safe
       routes
     - `__generated__/router/server_router.ts` - Server-side router
       configuration
   - Auto-creates Zod schemas for route parameters enabling runtime validation
   - Executable via `pastoria` binary command

3. **Type Safety**:
   - Route parameters are validated at runtime using generated Zod schemas
   - TypeScript compiler integration via ts-morph for accurate type extraction
   - Strongly typed navigation functions

**Usage Example**:

```tsx
/**
 * @route /commander/[commander]
 * @param commander string
 * @resource commander-page
 */
export function CommanderPage() { ... }
```

**Integration**: Router connects to the SSR system via `src/entry-server.tsx`
which calls `createRouterServerApp()` and processes special HTML directives like
`<!-- @router:render -->`

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
- **Always format code with `pnpm exec prettier --write <files>` before committing**
- Database regeneration completely rebuilds the SQLite database
- Uses experimental Node.js TypeScript support (`--experimental-strip-types`)
- Uses pnpm workspaces for managing pastoria tooling as separate package
