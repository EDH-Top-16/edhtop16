// Import the Relay-generated types
import type { CommandersSortBy, TimePeriod } from '#genfiles/queries/pages_CommandersQuery.graphql';

export interface CommandersPreferences {
  sortBy?: CommandersSortBy;
  timePeriod?: TimePeriod;
  colorId?: string;
  minEntries?: number;
  minTournamentSize?: number;
  display?: 'card' | 'table';
}

export interface EntryPreferences {
  maxStanding?: number | null;
  minEventSize?: number | null;
  sortBy?: 'TOP' | 'NEW';
  timePeriod?: TimePeriod;
}

export interface TournamentPreferences {
  tab?: 'entries' | 'breakdown' | 'commander';
  commander?: string | null;
}

export interface TournamentsPreferences {
  sortBy?: 'PLAYERS' | 'DATE';
  timePeriod?: TimePeriod;
  minSize?: number;
}

export type PreferencesMap = {
  commanders?: CommandersPreferences;
  entry?: EntryPreferences;
  tournament?: TournamentPreferences;
  tournaments?: TournamentsPreferences;
};

export const DEFAULT_PREFERENCES: PreferencesMap = {
  commanders: {
    sortBy: 'CONVERSION' as CommandersSortBy,
    timePeriod: 'ONE_MONTH' as TimePeriod,
    display: 'card',
    minEntries: 0,
    minTournamentSize: 0,
    colorId: '',
  },
  entry: {
    maxStanding: null,
    minEventSize: null,
    sortBy: 'TOP',
    timePeriod: 'ONE_YEAR' as TimePeriod,
  },
  tournament: {
    tab: 'entries',
    commander: null,
  },
  tournaments: {
    sortBy: 'DATE',
    timePeriod: 'ALL_TIME' as TimePeriod,
    minSize: 0,
  },
};
