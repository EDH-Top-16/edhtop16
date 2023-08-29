/**
 * All the filters
 */
export const allFilters = [
  "name",
  "profile",
  "decklist",
  "wins",
  "winsSwiss",
  "winsBracket",
  "winRate",
  "winRateSwiss",
  "winRateBracket",
  "draws",
  "losses",
  "lossesSwiss",
  "lossesBracket",
  "standing",
  "colorID",
  "commander",
  "date",
  "dateCreated",
  "size",
  "TID",
  "tournamentName",
  "swissNum",
  "topCut",
];

/**
 * Types for the filters
 */
export interface BaseFiltersType {
  name?: string;
  profile?: string;
  decklist?: string;
  wins?: number;
  winsSwiss?: number;
  winsBracket?: number;
  winRate?: number;
  winRateSwiss?: number;
  winRateBracket?: number;
  draws?: number;
  losses?: number;
  lossesSwiss?: number;
  lossesBracket?: number;
  standing?: number;
  colorID?: string;
  commander?: string;
}

export interface TournamentFiltersType {
  date?: Date;
  dateCreated?: number;
  size?: number;
  TID?: string;
  tournamentName?: string;
  swissNum?: number;
  topCut?: number;
}

export interface FiltersType extends BaseFiltersType {
  tourney_filters?: TournamentFiltersType;
}
