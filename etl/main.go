package main

import (
	"flag"
	"log"
	"strings"
)

type EtlPhase int

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

var phaseFlagName = map[string]EtlPhase{
	"pull":                   EtlPhasePull,
	"load":                   EtlPhaseLoad,
	"import_topdeck":         EtlPhaseImportTopdeck,
	"import_spicerack":       EtlPhaseImportSpicerack,
	"reify_commanders":       EtlPhaseReifyCommanders,
	"import_topdeck_profile": EtlPhaseImportTopdeckProfile,
	"import_topdeck_rounds":  EtlPhaseImportTopdeckRounds,
	"import_scryfall_cards":  EtlPhaseImportScryfallCards,
	"materialize":            EtlPhaseMaterialize,
	"push":                   EtlPhasePush,
}

type EtlContext struct {
	logger *log.Logger
	phases map[EtlPhase]bool
}

func LoadEtlContext() *EtlContext {
	default_phases := []string{}
	for flagName := range phaseFlagName {
		default_phases = append(default_phases, flagName)
	}

	phases_flag := flag.String("phases", strings.Join(default_phases, ","), "Phases to run")
	skip_phases_flag := flag.String("skip", "", "Phases to skip")
	flag.Parse()

	phases := map[EtlPhase]bool{}
	for flagName := range strings.SplitSeq(*phases_flag, ",") {
		if phase, ok := phaseFlagName[flagName]; ok {
			phases[phase] = true
		}
	}

	for flagName := range strings.SplitSeq(*skip_phases_flag, ",") {
		if phase, ok := phaseFlagName[flagName]; ok {
			phases[phase] = false
		}
	}

	return &EtlContext{
		logger: log.Default(),
		phases: phases,
	}
}

func main() {
	ctx := LoadEtlContext()

	if ctx.phases[EtlPhasePull] {
		ctx.logger.Println("Running phase: pull")
		PullPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: pull")
	}

	if ctx.phases[EtlPhaseLoad] {
		ctx.logger.Println("Running phase: load")
		LoadPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: load")
	}

	if ctx.phases[EtlPhaseImportTopdeck] {
		ctx.logger.Println("Running phase: import_topdeck")
		ImportTopdeckPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: import_topdeck")
	}

	if ctx.phases[EtlPhaseImportSpicerack] {
		ctx.logger.Println("Running phase: import_spicerack")
		ImportSpicerackPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: import_spicerack")
	}

	if ctx.phases[EtlPhaseReifyCommanders] {
		ctx.logger.Println("Running phase: reify_commanders")
		ReifyCommanderPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: reify_commanders")
	}

	if ctx.phases[EtlPhaseImportTopdeckProfile] {
		ctx.logger.Println("Running phase: import_topdeck_profile")
		ImportTopdeckProfilePhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: import_topdeck_profile")
	}

	if ctx.phases[EtlPhaseImportTopdeckRounds] {
		ctx.logger.Println("Running phase: import_topdeck_rounds")
		ImportTopdeckRoundsPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: import_topdeck_rounds")
	}

	if ctx.phases[EtlPhaseImportScryfallCards] {
		ctx.logger.Println("Running phase: import_scryfall_cards")
		ImportScryfallCardsPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: import_scryfall_cards")
	}

	if ctx.phases[EtlPhaseMaterialize] {
		ctx.logger.Println("Running phase: materialize")
		MaterializePhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: materialize")
	}

	if ctx.phases[EtlPhasePush] {
		ctx.logger.Println("Running phase: push")
		PushPhase(ctx)
	} else {
		ctx.logger.Println("Skipping phase: push")
	}
}

func PullPhase(ctx *EtlContext)                 {}
func LoadPhase(ctx *EtlContext)                 {}
func ImportTopdeckPhase(ctx *EtlContext)        {}
func ImportSpicerackPhase(ctx *EtlContext)      {}
func ReifyCommanderPhase(ctx *EtlContext)       {}
func ImportTopdeckProfilePhase(ctx *EtlContext) {}
func ImportTopdeckRoundsPhase(ctx *EtlContext)  {}
func ImportScryfallCardsPhase(ctx *EtlContext)  {}
func MaterializePhase(ctx *EtlContext)          {}
func PushPhase(ctx *EtlContext)                 {}
