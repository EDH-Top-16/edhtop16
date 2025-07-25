# EDHTop16 ETL Design

`etl` is the next generation of EDHTop16's datapipeline, and aims to make it
faster, more reliable, and easier to debug.

`etl` uses a SQLite database stored on DigitalOcean Spaces as its source, and is
able to push and pull data from it. This SQLite database is later downloaded in
the container build process for EDHTop16.

The initial version of this tool is designed to consume and output the same
database format from `npm run generate:db`. This is to ease the transition
period such that CI can go from:

1. **GH Action:** `load_topdeck_tournaments` ➡️ Mongo
2. **GH Action:** `load_third_party_tournaments` ➡️ Mongo
3. **GH Action:** `scrape_commanders` ➡️ Mongo
4. **Container Build:** Mongo ➡️ `npm run generate:db` ➡️ `data/edhtop16.db`

to:

1.  **GH Action:** DO spaces ➡️ `etl` ➡️ DO spaces
2.  **Container Build:** DO Spaces ➡️ Container

The goals here are to:

1. Shut down the MongoDB droplet, removing the only "live" data we maintain.
2. Speed up the build time of our containers by removing it from the data
   pipeline.

`etl` will need a one-time bootstrapping of its initial database using
`npm run generate:db && etl --phase=push`.

## Example Usage

```sh
$ etl --phases=pull,load,import_topdeck,import_spicerack,reify_commanders,materialize,push \
      --db=edhtop16.db \
      --tids=XYZ,789
```

## Arguments

### `--phases`

**Default:** All phases

Comma-separated string of phases to run during the ETL process.

Not all phases are able to be run if a prior phase is skipped, e.g `load`.

### `--db`

**Default:** `edhtop16.com`

Specifies the relative file path that should be used for reading and writing the
local SQLite database.

### `--skip`

**Default:** None

Comma-separated string of phases to skip during the ETL process. Skipping a
phase takes priority over explicitly specifying one in `--phases`. E.g.
`--phases=pull,load,materialize,push --skip=push` will not run `push`.

Not all phases are able to be run if a prior phase is skipped, e.g `load`.

### `--tids`

**Default:** None

Comma-separated string of specific TIDs to work against. If specified, only
tournaments in this set will be used, and `--time-days` will be ignored.

### `--time-days`

**Default:** `30`

If working within a time window (e.g. nightly jobs), how far to look back.

## Environment Variables

### `DO_SPACES_KEY`

API key used to connect to DigitalOcean.

### `MOXFIELD_API_KEY`

API key used to connect to Moxfield.

### `TOPDECK_GG_API_KEY`

API key used to connect to Topdeck.

## Phases

### `pull`

Downloads the SQLite database in DigitalOcean spaces to the file path specified
by `--db`. This uses the Spaces S3 SDK and client.

### `load`

Loads the SQLite database at the file path specified by `--db` into an in-memory
DuckDB instance. Only certain tables are loaded into memory, namely:

- `Tournament`
- `TournamentTable`
- `Player`
- `Entry`
- `Commander`

### `import_topdeck`

Pulls tournaments from the Topdeck API into the in-memory DuckDB instance from
the time range in `--time-days`, or only those in `--tids` if specified. Results
are cached in `Tournament`, `Entry` and `Player`.

### `import_spicerack`

Pulls tournaments from the Spicerack API into the in-memory DuckDB instance from
the time range in `--time-days`. Results are cached in `Tournament`, `Entry`,
and `Player`.

### `reify_commanders`

Uses the Moxfield API to scrape decklists, pulls the commander information into
the database, and the decklists into `Entry`, `Commander`, and `DecklistEntry`.

### `import_topdeck_profile`

Refreshes Profile & Elo information from Topdeck for each player in the
in-memory DeckDB instance. This data is not cached and is refreshed on each run.

### `import_topdeck_rounds`

Loads round and table information for each tournament from Topdeck into the
in-memory DuckDB instance. Results are cached in `TournamentTable`.

### `import_scryfall_cards`

Loads card information from Scryfall into the in-memory DuckDB instance. The
cards loaded are limited to those actually used in decklists. This data is not
cached and is refreshed on each run.

### `materialize`

Saves the in-memory DuckDB instance onto disk at the file path specified by
`--db`.

### `push`

Uploads from the file path specified by `--db` to the SQLite database in
DigitalOcean spaces. This uses the Spaces S3 SDK and client.
