/*
Etl is the next generation of EDHTop16's datapipeline.
It aims to make it faster, more reliable, and easier to debug.

`etl` uses a SQLite database stored on DigitalOcean Spaces as its source, and is
able to push and pull data from it. This SQLite database is later downloaded in
the container build process for EDHTop16.

Usage:

	etl [flags]

The flags are:

	--phases
		Default: All phases
		Comma-separated string of phases to run during the ETL process.
		Not all phases are able to be run if a prior phase is skipped, e.g `load`.

	--skip
		Default: None
		Comma-separated string of phases to skip during the ETL process. Skipping a
		phase takes priority over explicitly specifying one in `--phases`. E.g.
		`--phases=pull,load,materialize,push --skip=push` will not run `push`.

	--db
		Default: edhtop16.db
		Specifies the relative file path that should be used for reading and writing the
		local SQLite database.

	--tids
		Default: None
		Comma-separated string of specific TIDs to work against. If specified, only
		tournaments in this set will be used, and `--time-days` will be ignored.

	--time-days
		Default: 30
		If working within a time window (e.g. nightly jobs), how far to look back.

	--insert-mode
		Default: skip
		Possible values: skip, replace
		If inserts on Entry should replace the previous or update.

	--backup-name
		Defualt edhtop16.db.bak
		Specified the object name to backup the old database version to.

# Environment variables

DO_SPACES_KEY: API key used to connect to DigitalOcean.

MOXFIELD_API_KEY: API key used to connect to Moxfield.

TOPDECK_GG_API_KEY: API key used to connect to Topdeck.

# Phases

pull: Downloads the SQLite database in DigitalOcean spaces to the file path specified
by `--db`. This uses the Spaces S3 SDK and client.

pull_scryfall: Downloads the latest default_cards and oracle_cards collections from scryfall.

load: Loads the SQLite database at the file path specified by `--db` into an in-memory DuckDB instance.
Only certain tables are loaded into memory, namely: Tournament, TournamentTable, Player, Entry, Commander.

import_topdeck: Pulls tournaments from the Topdeck API into the in-memory DuckDB instance from
the time range in `--time-days`, or only those in `--tids` if specified.
Results are cached in `Tournament`, `Entry` and `Player`.

import_spicerack: Pulls tournaments from the Spicerack API into the in-memory DuckDB instance from the time range in `--time-days`.
Results are cached in `Tournament`, `Entry`, and `Player`.

reify_commanders: Uses the Moxfield API to scrape decklists, pulls the commander information into
the database, and the decklists into `Entry`, `Commander`, and `DecklistEntry`.

import_topdeck_profile: Refreshes Profile & Elo information from Topdeck for each player in the in-memory DeckDB instance
This data is not cached and is refreshed on each run.

import_topdeck_rounds: Loads round and table information for each tournament from Topdeck into the in-memory DuckDB instance.
Results are cached in `TournamentTable`.

materialize: Saves the in-memory DuckDB instance onto disk at the file path specified by `--db`.

backup: Backs up the old DigitalOcean Space object to the object specified by `--backup-name`.

push: Uploads from the file path specified by `--db` to the SQLite database in DigitalOcean spaces.
This uses the Spaces S3 SDK and client.
*/
package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/marcboeker/go-duckdb/v2"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"golang.org/x/sync/errgroup"
	"golang.org/x/time/rate"
)

/////////////////////
// Scryfall Client //
/////////////////////

type ScryfallClient struct {
	httpClient *http.Client
}

func NewScryfallClient() *ScryfallClient {
	client := &http.Client{}
	return &ScryfallClient{client}
}

type scryfallBulkDataResponse struct {
	Object string                   `json:"object"`
	Data   []scryfallBulkDataObject `json:"data"`
}

type scryfallBulkDataObject struct {
	Object          string `json:"object"`
	Type            string `json:"type"`
	DownloadUri     string `json:"download_uri"`
	ContentType     string `json:"content_type"`
	ContentEncoding string `json:"content_encoding"`
}

func (s *ScryfallClient) BulkDownloadUri(ctx context.Context) (map[string]string, error) {
	req, err := http.NewRequest("GET", "https://api.scryfall.com/bulk-data", nil)
	if err != nil {
		return nil, fmt.Errorf("could not create scryfall request: %w", err)
	}

	req.Header.Add("Accept", "*/*")
	req.Header.Add("User-Agent", "edhtop16/2.0")
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("could not perform request: %w", err)
	}
	defer resp.Body.Close()

	var scryfallBulkData scryfallBulkDataResponse
	err = json.NewDecoder(resp.Body).Decode(&scryfallBulkData)
	if err != nil {
		return nil, fmt.Errorf("could not decode scryfall response: %w", err)
	} else if scryfallBulkData.Object != "list" {
		return nil, fmt.Errorf("got unexpected scryfall response type: %s", scryfallBulkData.Object)
	}

	scryfallUri := make(map[string]string)
	for _, data := range scryfallBulkData.Data {
		if data.Object != "bulk_data" {
			continue
		}

		if data.Type == "default_cards" || data.Type == "oracle_cards" {
			scryfallUri[data.Type] = data.DownloadUri
		}
	}

	return scryfallUri, nil
}

////////////////////
// Topdeck Client //
////////////////////

type TopdeckListTournamentsRequest struct {
	Game    string   `json:"game"`
	Format  string   `json:"format"`
	Last    int32    `json:"last,omitempty"`
	Tid     []string `json:"TID,omitempty"`
	Columns []string `json:"columns"`
}

type TopdeckTournamentEntry struct {
	Name             string                          `json:"name"`
	Id               string                          `json:"id"`
	Decklist         string                          `json:"decklist"`
	Wins             int32                           `json:"wins"`
	WinsSwiss        int32                           `json:"winsSwiss"`
	WinsBracket      int32                           `json:"winsBracket"`
	Draws            int32                           `json:"draws"`
	Losses           int32                           `json:"losses"`
	LossesSwiss      int32                           `json:"lossesSwiss"`
	LossesBracket    int32                           `json:"lossesBracket"`
	DetailedDecklist *TopdeckTournamentEntryDecklist `json:"deckObj"`
}

type TopdeckTournamentEntryDecklist struct {
	Commanders map[string]TopdeckTournamentEntryDecklistItem `json:"Commanders"`
	Mainboard  map[string]TopdeckTournamentEntryDecklistItem `json:"Mainboard"`
	Metadata   TopdeckTournamentEntryDecklistMetadata        `json:"metadata"`
}

type TopdeckTournamentEntryDecklistMetadata struct {
	Game         string `json:"game"`
	Format       string `json:"format"`
	ImportedFrom string `json:"importedFrom"`
}

type TopdeckTournamentEntryDecklistItem struct {
	Id    string `json:"id"`
	Count int    `json:"count"`
}

type TopdeckTournamentResponse struct {
	Tid            string                   `json:"TID"`
	TournamentName string                   `json:"tournamentName"`
	SwissNum       int32                    `json:"swissNum"`
	StartDate      int64                    `json:"startDate"`
	Game           string                   `json:"game"`
	Format         string                   `json:"format"`
	AverageElo     float32                  `json:"averageElo"`
	ModeElo        float32                  `json:"modeElo"`
	MedianElo      float32                  `jsonmedianElo:""`
	TopElo         float32                  `json:"topElo"`
	TopCut         int32                    `json:"topCut,string"`
	Standings      []TopdeckTournamentEntry `json:"standings"`
}

type TopdeckClient struct {
	limiter    *rate.Limiter
	httpClient *http.Client

	apiKey string
}

func NewTopdeckClient() (*TopdeckClient, error) {
	apiKey, present := os.LookupEnv("TOPDECK_GG_API_KEY")
	if !present {
		return nil, fmt.Errorf("missing TOPDECK_GG_API_KEY environment variable")
	}

	limiter := rate.NewLimiter(rate.Every(time.Second), 1)
	client := &http.Client{}
	return &TopdeckClient{limiter, client, apiKey}, nil
}

func (t *TopdeckClient) makeTopdeckRequest(ctx context.Context, topdeckReq *TopdeckListTournamentsRequest) ([]TopdeckTournamentResponse, error) {
	t.limiter.Wait(ctx)
	reqBody, err := json.Marshal(topdeckReq)

	if err != nil {
		return nil, fmt.Errorf("could not create serialize json request: %w", err)
	}

	req, err := http.NewRequest("POST", "https://topdeck.gg/api/v2/tournaments", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("could not create request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", t.apiKey)
	req.Header.Add("Content-Type", "application/json")

	resp, err := t.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("could not perform request: %w", err)
	}
	defer resp.Body.Close()

	var topdeckTournaments []TopdeckTournamentResponse
	json.NewDecoder(resp.Body).Decode(&topdeckTournaments)

	return topdeckTournaments, nil
}

func (t *TopdeckClient) TournamentsFromLastDays(ctx context.Context, days int32) ([]TopdeckTournamentResponse, error) {
	return t.makeTopdeckRequest(ctx, &TopdeckListTournamentsRequest{
		Game:   "Magic: The Gathering",
		Format: "EDH",
		Last:   days,
		Columns: []string{
			"name",
			"id",
			"decklist",
			"wins",
			"winsSwiss",
			"winsBracket",
			"winRateSwiss",
			"winRateBracket",
			"draws",
			"losses",
			"lossesSwiss",
			"lossesBracket",
		},
	})
}

func (t *TopdeckClient) TournamentsByTids(ctx context.Context, tids []string) ([]TopdeckTournamentResponse, error) {
	return t.makeTopdeckRequest(ctx, &TopdeckListTournamentsRequest{
		Game:   "Magic: The Gathering",
		Format: "EDH",
		Tid:    tids,
		Columns: []string{
			"name",
			"id",
			"decklist",
			"wins",
			"winsSwiss",
			"winsBracket",
			"winRateSwiss",
			"winRateBracket",
			"draws",
			"losses",
			"lossesSwiss",
			"lossesBracket",
		},
	})
}

///////////////////////////////////
// Third Party Tournament Client //
///////////////////////////////////

type ThirdPartyTournamentEntry struct {
	Name          string `json:"name"`
	Decklist      string `json:"decklist"`
	WinsSwiss     int32  `json:"winsSwiss,omitempty"`
	LossesSwiss   int32  `json:"lossesSwiss,omitempty"`
	Draws         int32  `json:"draws"`
	WinsBracket   int32  `json:"winsBracket,omitempty"`
	LossesBracket int32  `json:"lossesBracket,omitempty"`
}

type ThirdPartyTournament struct {
	ThirdPartyID   string                      `json:"TID"`
	TournamentName string                      `json:"tournamentName"`
	Players        int32                       `json:"players"`
	StartDate      int32                       `json:"startDate"`
	SwissRounds    int32                       `json:"swissRounds"`
	TopCut         int32                       `json:"topCut"`
	BracketURL     string                      `json:"bracketUrl"`
	Standings      []ThirdPartyTournamentEntry `json:"standings"`
}

type ThirdPartyTournamentClient struct {
	limiter    *rate.Limiter
	httpClient *http.Client

	url string
}

func NewThirdPartyTournamentClient(url string) *ThirdPartyTournamentClient {
	limiter := rate.NewLimiter(rate.Every(time.Second), 1)
	client := &http.Client{}
	return &ThirdPartyTournamentClient{limiter, client, url}
}

// func (t *ThirdPartyTournamentClient) tournamentsFromPastDays(days int) ([]ThirdPartyTournament, error) {
// 	req, err := t.httpClient.Get(t.url)
// 	if err != nil {
// 		return nil, fmt.Errorf("could not create third party tournament request: %w", err)
// 	}

// 	return nil, nil
// }

/////////////////
// ETL Context //
/////////////////

type EtlPhase int

const (
	EtlPhasePull EtlPhase = iota + 1
	EtlPhasePullScryfall
	EtlPhaseLoad
	EtlPhaseImportTopdeck
	EtlPhaseImportSpicerack
	EtlPhaseReifyCommanders
	EtlPhaseImportTopdeckProfile
	EtlPhaseImportTopdeckRounds
	EtlPhaseMaterialize
	EtlPhaseBackup
	EtlPhasePush
)

var PhaseDisplayName = map[EtlPhase]string{
	EtlPhasePull:                 "pull",
	EtlPhasePullScryfall:         "pull_scryfall",
	EtlPhaseLoad:                 "load",
	EtlPhaseImportTopdeck:        "import_topdeck",
	EtlPhaseImportSpicerack:      "import_spicerack",
	EtlPhaseReifyCommanders:      "reify_commanders",
	EtlPhaseImportTopdeckProfile: "import_topdeck_profile",
	EtlPhaseImportTopdeckRounds:  "import_topdeck_rounds",
	EtlPhaseMaterialize:          "materialize",
	EtlPhaseBackup:               "backup",
	EtlPhasePush:                 "push",
}

type InsertMode int

const (
	InsertModeReplace InsertMode = iota + 1
	InsertModeSkip
)

type etlFlags struct {
	phases       string
	skipPhases   string
	dbPath       string
	dbOutPath    string
	tids         string
	insertMode   string
	backupObject string
}

func parseFlags() etlFlags {
	default_phases := []string{}
	for _, flagName := range PhaseDisplayName {
		default_phases = append(default_phases, flagName)
	}

	phasesFlag := flag.String("phases", strings.Join(default_phases, ","), "Phases to run")
	skipPhasesFlag := flag.String("skip", "", "Phases to skip")
	dbFlag := flag.String("db", "edhtop16.db", "On-disk location of the database")
	dbOutFlag := flag.String("out", "", "On-disk location to write to, defaults to db")
	tidsFlag := flag.String("tid", "", "Specific TIDs to run against")
	insertModeFlag := flag.String("insert-mode", "replace", "If inserts on Entry should replace the previous or update")
	backupObjectFlag := flag.String("backup", "edhtop16.back.db", "Object name to backup the old database to before uploading")
	flag.Parse()

	return etlFlags{
		phases:       *phasesFlag,
		skipPhases:   *skipPhasesFlag,
		dbPath:       *dbFlag,
		dbOutPath:    *dbOutFlag,
		tids:         *tidsFlag,
		insertMode:   *insertModeFlag,
		backupObject: *backupObjectFlag,
	}
}

func phasesFromFlags(flags etlFlags) map[EtlPhase]bool {
	phaseNames := map[string]bool{}
	for flagName := range strings.SplitSeq(flags.phases, ",") {
		phaseNames[flagName] = true
	}
	for flagName := range strings.SplitSeq(flags.skipPhases, ",") {
		phaseNames[flagName] = false
	}

	phases := map[EtlPhase]bool{}
	for phase, flagName := range PhaseDisplayName {
		if phaseNames[flagName] {
			phases[phase] = true
		}
	}

	return phases
}

func NewSpacesClient() (*minio.Client, error) {
	endpoint, present := os.LookupEnv("DO_SPACES_ENDPOINT")
	if !present {
		return nil, fmt.Errorf("DO_SPACES_ENDPOINT is required but not present")
	}

	accessKeyID, present := os.LookupEnv("DO_SPACES_ACCESS_KEY_ID")
	if !present {
		return nil, fmt.Errorf("DO_SPACES_ENDPOINT is required but not present")
	}

	secretAccessKey, present := os.LookupEnv("DO_SPACES_SECRET_ACCESS_KEY")
	if !present {
		return nil, fmt.Errorf("DO_SPACES_ENDPOINT is required but not present")
	}

	useSSL := true

	return minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
}

type EtlContext struct {
	ctx          context.Context
	logger       *log.Logger
	phases       map[EtlPhase]bool
	inputTids    []string
	insertMode   InsertMode
	backupObject string

	dbPath    string
	dbOutPath string
	db        *sql.DB

	scryfallClient *ScryfallClient
	topdeckClient  *TopdeckClient
	spacesClient   *minio.Client

	// ImportTopdeckPhase fields
	createdTids    map[int]string
	createdEntries map[int]*TopdeckTournamentEntry
}

func LoadEtlContext() (*EtlContext, error) {
	ctx := context.Background()
	flags := parseFlags()
	phases := phasesFromFlags(flags)

	spacesClient, err := NewSpacesClient()
	if err != nil {
		return nil, fmt.Errorf("could not create spaces client: %w", err)
	}

	topdeckClient, err := NewTopdeckClient()
	if err != nil {
		return nil, fmt.Errorf("could not create topdeck client: %w", err)
	}

	if flags.dbOutPath == "" {
		flags.dbOutPath = flags.dbPath
	}

	var insertMode InsertMode
	switch flags.insertMode {
	case "replace":
		insertMode = InsertModeReplace
	case "skip":
		insertMode = InsertModeSkip
	default:
		return nil, fmt.Errorf("unknown insert mode specified: %s", flags.insertMode)
	}

	etlCtx := EtlContext{
		ctx:          ctx,
		logger:       log.Default(),
		phases:       phases,
		inputTids:    strings.Split(flags.tids, ","),
		dbPath:       flags.dbPath,
		dbOutPath:    flags.dbOutPath,
		insertMode:   insertMode,
		backupObject: flags.backupObject,

		scryfallClient: NewScryfallClient(),
		topdeckClient:  topdeckClient,
		spacesClient:   spacesClient,

		createdTids:    make(map[int]string),
		createdEntries: make(map[int]*TopdeckTournamentEntry),
	}

	return &etlCtx, nil
}

///////////////////////////
// ETL Phase Definitions //
///////////////////////////

// PullPhase Downloads the SQLite database in DigitalOcean spaces to the file path specified
// by `--db`. This uses the Spaces S3 SDK and client.
func PullPhase(etl *EtlContext) error {
	opts := minio.GetObjectOptions{}
	return etl.spacesClient.FGetObject(etl.ctx, "edhtop16", "edhtop16.db", etl.dbPath, opts)
}

// PullScryfallPhase downloads the latest default_cards and oracle_cards collections from scryfall.
func PullScryfallPhase(etl *EtlContext) error {
	databaseDownloadUris, err := etl.scryfallClient.BulkDownloadUri(etl.ctx)
	if err != nil {
		return fmt.Errorf("could not get scryfall bulk data download uri: %w", err)
	}

	// For each bulk data collection from Scryfall, write it to desk under `collection_name.scryfall.json`.
	g, ctx := errgroup.WithContext(etl.ctx)
	for t, uri := range databaseDownloadUris {
		g.Go(func() error {
			etl.logger.Printf("Downloading Scryfall bulk database \"%s\" from: %s", t, uri)

			// Create HTTP request with the appropriate User-Agent header
			req, err := http.NewRequestWithContext(ctx, "GET", uri, nil)
			if err != nil {
				return fmt.Errorf("could not create request: %w", err)
			}
			req.Header.Set("User-Agent", "edhtop16/2.0")

			// Make the request to Scryfall.
			resp, err := etl.scryfallClient.httpClient.Do(req)
			if err != nil {
				return fmt.Errorf("could not download scryfall data: %w", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				return fmt.Errorf("bad status: %s", resp.Status)
			}

			// Create our output file using the collection name as the identified.
			outFileName := fmt.Sprintf("%s.scryfall.json", t)
			outFile, err := os.Create(outFileName)
			if err != nil {
				return fmt.Errorf("could not create output file: %w", err)
			}
			defer outFile.Close()

			// Copy the response body to the file.
			_, err = io.Copy(outFile, resp.Body)
			if err != nil {
				return fmt.Errorf("could not write to output file: %w", err)
			}

			etl.logger.Printf("Successfully downloaded Scryfall data to %s", outFileName)
			return nil
		})
	}

	return g.Wait()
}

// LoadPhase Loads the SQLite database at the file path specified by `--db` into an in-memory DuckDB instance.
// Only certain tables are loaded into memory, namely: Tournament, TournamentTable, Player, Entry, Commander.
func LoadPhase(etl *EtlContext) error {
	etl.logger.Printf("Loading database from %s\n", etl.dbPath)

	var err error
	etl.db, err = sql.Open("duckdb", "")
	if err != nil {
		return fmt.Errorf("could not create duckdb: %w", err)
	}

	scryfallJsonSchema := `columns={id:'VARCHAR', oracle_id:'VARCHAR', name: 'VARCHAR', scryfall_uri: 'VARCHAR', cmc: 'INT', color_identity: 'CHAR[]', type_line: 'VARCHAR', card_faces: 'JSON'}`

	loadQueries := []string{
		`INSTALL sqlite`,
		`LOAD sqlite`,
		fmt.Sprintf(`create table commander as select * from sqlite_scan('%s', 'Commander')`, etl.dbPath),
		`alter table commander add primary key (id)`,
		`create unique index commander_name_idx on commander (name)`,
		fmt.Sprintf(`create table player as select * from sqlite_scan('%s', 'Player')`, etl.dbPath),
		`alter table player add primary key (id)`,
		`create unique index player_topdeck_profile on player (topdeckProfile)`,
		fmt.Sprintf(`create table tournament as select * from sqlite_scan('%s', 'Tournament')`, etl.dbPath),
		`alter table tournament add primary key (id)`,
		`create unique index tournaments_tid_idx on tournament (tid)`,
		fmt.Sprintf(`create table entry as select * from sqlite_scan('%s', 'Entry')`, etl.dbPath),
		`alter table entry add primary key (id)`,
		`create unique index entry_tid_standing_idx on entry (tournamentId, standing)`,
		fmt.Sprintf(`create table decklist_item as select * from sqlite_scan('%s', 'DecklistItem')`, etl.dbPath),
		`create schema scryfall`,
		fmt.Sprintf(`create table scryfall.default_cards as select * from read_json('default_cards.scryfall.json', %s)`, scryfallJsonSchema),
		fmt.Sprintf(`create table scryfall.oracle_cards as select * from read_json('oracle_cards.scryfall.json', %s)`, scryfallJsonSchema),
	}

	etl.logger.Println("Running load queries")
	for _, query := range loadQueries {
		_, err := etl.db.ExecContext(etl.ctx, query, nil)
		if err != nil {
			return fmt.Errorf("failed to execute query \"%s\": %w", query, err)
		}
	}

	return nil
}

// ImportTopdeckPhase pulls tournaments from the Topdeck API into the in-memory DuckDB instance from
// the time range in `--time-days`, or only those in `--tids` if specified.
// Results are cached in `Tournament`, `Entry` and `Player`.
func ImportTopdeckPhase(etl *EtlContext) error {
	if etl.db == nil {
		return fmt.Errorf("database must be loaded to load topdeck tournaments")
	}

	// Load the tournaments we're interested in processing. If specified, only use specified tournament IDs,
	// otherwise all tournaments from the past 5 days.
	var err error
	var latestTournaments []TopdeckTournamentResponse
	if len(etl.inputTids) > 0 {
		latestTournaments, err = etl.topdeckClient.TournamentsByTids(etl.ctx, etl.inputTids)
	} else {
		latestTournaments, err = etl.topdeckClient.TournamentsFromLastDays(etl.ctx, 5)
	}

	if err != nil {
		return fmt.Errorf("could not load topdeck tournaments: %w", err)
	}

	etl.logger.Printf("Importing %d tournaments\n", len(latestTournaments))

	var maxTournamentId int32
	err = etl.db.QueryRowContext(etl.ctx, `select max(id) from tournament`).Scan(&maxTournamentId)
	if err != nil {
		return fmt.Errorf("could not get max tournament id: %w", err)
	}

	etl.logger.Printf("Start with new tournament_id: %d\n", maxTournamentId)
	_, err = etl.db.ExecContext(etl.ctx, fmt.Sprintf(`create sequence tournament_id_sequence start with %d`, maxTournamentId))
	if err != nil {
		return fmt.Errorf("could not create tournament_id: %w", err)
	}

	var maxEntryId int32
	err = etl.db.QueryRowContext(etl.ctx, `select max(id) from entry`).Scan(&maxEntryId)
	if err != nil {
		return fmt.Errorf("could not get max entry id: %w", err)
	}

	etl.logger.Printf("Start with new entry_id: %d\n", maxEntryId)
	_, err = etl.db.ExecContext(etl.ctx, fmt.Sprintf(`create sequence entry_id_sequence start with %d`, maxEntryId))
	if err != nil {
		return fmt.Errorf("could not create entry_id_sequence: %w", err)
	}

	insertMode := "ignore"
	if etl.insertMode == InsertModeReplace {
		insertMode = "replace"
	}

	g, ctx := errgroup.WithContext(etl.ctx)
	for _, t := range latestTournaments {
		g.Go(func() error {
			bracketUrl := fmt.Sprintf("https://topdeck.gg/bracket/%s", t.Tid)
			row := etl.db.QueryRowContext(ctx, fmt.Sprintf(
				`insert or %s into tournament
					("id", "TID", "name", "tournamentDate", "size", "swissRounds", "topCut", "bracketUrl")
				values
					(nextval('tournament_id_sequence'), ?, ?, epoch_ms(?), ?, ?, ?, ?)
				returning
					("id")`,
				insertMode), t.Tid, t.TournamentName, t.StartDate, len(t.Standings), t.SwissNum, t.TopCut, bracketUrl)

			var insertedTournamentId int
			err := row.Scan(&insertedTournamentId)
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("Could not insert tournament %s: %w", t.Tid, err)
			} else if err != nil {
				etl.logger.Printf("Skipping existing tournament %s", t.Tid)
			} else {
				etl.logger.Printf("Created tournament %s with id: %d", t.Tid, insertedTournamentId)
				etl.createdTids[insertedTournamentId] = t.Tid
			}

			g, ctx := errgroup.WithContext(ctx)
			for i, e := range t.Standings {
				g.Go(func() error {
					row := etl.db.QueryRowContext(ctx, fmt.Sprintf(
						`insert or %s into entry
							("id", "tournamentId", "playerId", "commanderId", "standing", "decklist", "winsSwiss", "winsBracket", "draws", "lossesSwiss", "lossesBracket")
						values
							(nextval('entry_id_sequence'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
						returning
							("id")`,
						insertMode), insertedTournamentId, "" /* TODO(ryan): replace with real playerId */, "" /* TODO(ryan): replace with commander id */, i+1, nil, e.WinsSwiss, e.WinsBracket, e.Draws, e.LossesSwiss, e.LossesBracket)

					var insertedEntryId int
					err := row.Scan(&insertedTournamentId)
					if err != nil {
						return fmt.Errorf("Could not insert entry %s/%d: %w", t.Tid, i+1, err)
					} else {
						etl.logger.Printf("Created entry %s/%d with id: %d", t.Tid, i+1, insertedEntryId)
						etl.createdEntries[insertedEntryId] = &e
					}

					return nil
				})
			}

			return g.Wait()
		})
	}

	return g.Wait()
}

func ImportSpicerackPhase(etl *EtlContext) error      { return nil }
func ReifyCommandersPhase(etl *EtlContext) error      { return nil }
func ImportTopdeckProfilePhase(etl *EtlContext) error { return nil }
func ImportTopdeckRoundsPhase(etl *EtlContext) error  { return nil }

func MaterializePhase(etl *EtlContext) error {
	if etl.db == nil {
		return fmt.Errorf("database must be loaded to materialize")
	}

	etl.logger.Printf("Exporting database to %s\n", etl.dbOutPath)

	err := os.Remove(etl.dbOutPath)
	if err != nil {
		return fmt.Errorf("could not remove existing database: %w", err)
	}

	materializeQueries := []string{
		fmt.Sprintf(`ATTACH '%s' AS materialized_db (TYPE sqlite)`, etl.dbOutPath),
		`create table materialized_db.Commander as from commander`,
		`create table materialized_db.Player as from player`,
		`create table materialized_db.Tournament as from tournament`,
		`create table materialized_db.Entry as from entry`,
		`create table materialized_db.DecklistItem as from decklist_item`,
		// TODO(ryan): Export relavant data into Card from scryfall.default_cards
	}

	etl.logger.Println("Running materialize queries")
	for _, query := range materializeQueries {
		_, err := etl.db.ExecContext(etl.ctx, query, nil)
		if err != nil {
			return fmt.Errorf("failed to execute query \"%s\": %w", query, err)
		}
	}

	return nil
}

// BackupPhase backs up the old DigitalOcean Space object to the object specified by `--backup-name`.
func BackupPhase(etl *EtlContext) error {
	etl.logger.Printf("Backing up database to %s...\n", etl.backupObject)

	// Get the source object from DigitalOcean Spaces.
	srcOpts := minio.GetObjectOptions{}
	srcObject, err := etl.spacesClient.GetObject(etl.ctx, "edhtop16", "edhtop16.db", srcOpts)
	if err != nil {
		return fmt.Errorf("could not get source object: %w", err)
	}
	defer srcObject.Close()

	// Get object info to determine size and content type.
	srcInfo, err := srcObject.Stat()
	if err != nil {
		return fmt.Errorf("could not stat source object: %w", err)
	}

	// Create the backup object by copying from the source.
	dstOpts := minio.PutObjectOptions{
		ContentType: srcInfo.ContentType,
	}

	uploadInfo, err := etl.spacesClient.PutObject(etl.ctx, "edhtop16", etl.backupObject, srcObject, srcInfo.Size, dstOpts)
	if err != nil {
		return fmt.Errorf("could not create backup object: %w", err)
	}

	etl.logger.Printf("Successfully backed up database to %s!\n", uploadInfo.Location)
	return nil
}

func PushPhase(etl *EtlContext) error {
	etl.logger.Printf("Uploading database from %s...\n", etl.dbPath)

	opts := minio.PutObjectOptions{}
	uploadInfo, err := etl.spacesClient.FPutObject(etl.ctx, "edhtop16", "edhtop16.db", etl.dbOutPath, opts)
	if err != nil {
		return fmt.Errorf("could not upload database: %w", err)
	}

	etl.logger.Printf("Successfully uploaded database to %s!\n", uploadInfo.Location)
	return nil
}

type PhaseAction func(etl *EtlContext) error
type PhaseExecutor struct {
	phase  EtlPhase
	action PhaseAction
}

var phases = []PhaseExecutor{
	{EtlPhasePull, PullPhase},
	{EtlPhasePullScryfall, PullScryfallPhase},
	{EtlPhaseLoad, LoadPhase},
	{EtlPhaseImportTopdeck, ImportTopdeckPhase},
	{EtlPhaseImportSpicerack, ImportSpicerackPhase},
	{EtlPhaseReifyCommanders, ReifyCommandersPhase},
	{EtlPhaseImportTopdeckProfile, ImportTopdeckProfilePhase},
	{EtlPhaseImportTopdeckRounds, ImportTopdeckRoundsPhase},
	{EtlPhaseMaterialize, MaterializePhase},
	{EtlPhaseBackup, BackupPhase},
	{EtlPhasePush, PushPhase},
}

//////////
// Main //
//////////

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Running without loading .env: %v\n", err)
	}

	etl, err := LoadEtlContext()
	if err != nil {
		err = fmt.Errorf("could not initialize etl context: %w", err)
		log.Panicln(err)
	}

	for _, executor := range phases {
		phaseName := PhaseDisplayName[executor.phase]
		if etl.phases[executor.phase] {
			etl.logger.Printf("Running phase: %s\n", phaseName)
			err = executor.action(etl)
			if err != nil {
				err = fmt.Errorf("error while executing phase \"%s\": %w", phaseName, err)
				log.Panicln(err)
			}
		} else {
			etl.logger.Printf("Skipping phase: %s\n", phaseName)
		}
	}

	if etl.db != nil {
		err = etl.db.Close()
		if err != nil {
			log.Panicf("could not close duckdb: %v", err)
		}
	}
}
