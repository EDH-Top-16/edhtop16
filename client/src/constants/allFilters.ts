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
type OperatorType<T> = {
  $lte?: T;
  $eq?: T;
  $gte?: T;
};

export interface BaseFiltersType {
  name?: string;
  profile?: string;
  decklist?: string;
  wins?: OperatorType<number>;
  winsSwiss?: OperatorType<number>;
  winsBracket?: OperatorType<number>;
  winRate?: OperatorType<number>;
  winRateSwiss?: OperatorType<number>;
  winRateBracket?: OperatorType<number>;
  draws?: OperatorType<number>;
  losses?: OperatorType<number>;
  lossesSwiss?: OperatorType<number>;
  lossesBracket?: OperatorType<number>;
  standing?: OperatorType<number>;
  colorID?: string;
  commander?: string;
}

export interface TournamentFiltersType {
  date?: OperatorType<Date>;
  dateCreated?: OperatorType<number>;
  size?: OperatorType<number>;
  TID?: string;
  tournamentName?: string;
  swissNum?: OperatorType<number>;
  topCut?: OperatorType<number>;
}

export interface FiltersType extends BaseFiltersType {
  tournament_filter?: TournamentFiltersType;
}
