package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

/////////////////
// ETL Context //
/////////////////

type EtlPhase int
type EtlContext struct {
	ctx          context.Context
	logger       *log.Logger
	phases       map[EtlPhase]bool
	spacesClient *minio.Client
	dbPath       string
}

const (
	EtlPhasePull EtlPhase = iota + 1
	EtlPhaseLoad
	EtlPhaseImportTopdeck
	EtlPhaseImportSpicerack
	EtlPhaseReifyCommanders
	EtlPhaseImportTopdeckProfile
	EtlPhaseImportTopdeckRounds
	EtlPhaseImportScryfallCards
	EtlPhaseMaterialize
	EtlPhasePush
)

var PhaseDisplayName = map[EtlPhase]string{
	EtlPhasePull:                 "pull",
	EtlPhaseLoad:                 "load",
	EtlPhaseImportTopdeck:        "import_topdeck",
	EtlPhaseImportSpicerack:      "import_spicerack",
	EtlPhaseReifyCommanders:      "reify_commanders",
	EtlPhaseImportTopdeckProfile: "import_topdeck_profile",
	EtlPhaseImportTopdeckRounds:  "import_topdeck_rounds",
	EtlPhaseImportScryfallCards:  "import_scryfall_cards",
	EtlPhaseMaterialize:          "materialize",
	EtlPhasePush:                 "push",
}

type etlFlags struct {
	phases     string
	skipPhases string
	dbPath     string
}

func parseFlags() etlFlags {
	default_phases := []string{}
	for _, flagName := range PhaseDisplayName {
		default_phases = append(default_phases, flagName)
	}

	phasesFlag := flag.String("phases", strings.Join(default_phases, ","), "Phases to run")
	skipPhasesFlag := flag.String("skip", "", "Phases to skip")
	dbFlag := flag.String("db", "edhtop16.db", "On-disk location of the database")
	flag.Parse()

	return etlFlags{
		phases:     *phasesFlag,
		skipPhases: *skipPhasesFlag,
		dbPath:     *dbFlag,
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

func createS3Client() (*minio.Client, error) {
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

func LoadEtlContext() (*EtlContext, error) {
	flags := parseFlags()
	phases := phasesFromFlags(flags)
	spacesClient, err := createS3Client()
	if err != nil {
		return nil, fmt.Errorf("could not create S3 client: %w", err)
	}

	etlCtx := EtlContext{
		ctx:          context.Background(),
		logger:       log.Default(),
		phases:       phases,
		spacesClient: spacesClient,
		dbPath:       flags.dbPath,
	}

	return &etlCtx, nil
}

///////////////////////////
// ETL Phase Definitions //
///////////////////////////

func PullPhase(etl *EtlContext) error {
	opts := minio.GetObjectOptions{}
	return etl.spacesClient.FGetObject(etl.ctx, "edhtop16", "edhtop16.db", etl.dbPath, opts)
}

func LoadPhase(etl *EtlContext) error                 { return nil }
func ImportTopdeckPhase(etl *EtlContext) error        { return nil }
func ImportSpicerackPhase(etl *EtlContext) error      { return nil }
func ReifyCommandersPhase(etl *EtlContext) error      { return nil }
func ImportTopdeckProfilePhase(etl *EtlContext) error { return nil }
func ImportTopdeckRoundsPhase(etl *EtlContext) error  { return nil }
func ImportScryfallCardsPhase(etl *EtlContext) error  { return nil }
func MaterializePhase(etl *EtlContext) error          { return nil }

func PushPhase(etl *EtlContext) error {
	etl.logger.Printf("Uploading database from %s...\n", etl.dbPath)

	opts := minio.PutObjectOptions{}
	uploadInfo, err := etl.spacesClient.FPutObject(etl.ctx, "edhtop16", "edhtop16.db", etl.dbPath, opts)
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
	PhaseExecutor{EtlPhasePull, PullPhase},
	PhaseExecutor{EtlPhaseLoad, LoadPhase},
	PhaseExecutor{EtlPhaseImportTopdeck, ImportTopdeckPhase},
	PhaseExecutor{EtlPhaseImportSpicerack, ImportSpicerackPhase},
	PhaseExecutor{EtlPhaseReifyCommanders, ReifyCommandersPhase},
	PhaseExecutor{EtlPhaseImportTopdeckProfile, ImportTopdeckProfilePhase},
	PhaseExecutor{EtlPhaseImportTopdeckRounds, ImportTopdeckRoundsPhase},
	PhaseExecutor{EtlPhaseImportScryfallCards, ImportScryfallCardsPhase},
	PhaseExecutor{EtlPhaseMaterialize, MaterializePhase},
	PhaseExecutor{EtlPhasePush, PushPhase},
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
}
