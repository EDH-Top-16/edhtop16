import moment from "moment";

import { FiltersType } from "./allFilters";

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

type DefaultFiltersType = {
  [key: string]: FiltersType;
};

export const enabledFilters = {
  commanders: [
    "colors",
    "standing",
    "entries",
    "tournamentSize",
    "tournamentDate",
  ],
};

export const defaultFilters: DefaultFiltersType = {
  commanders: {
    tournament_filters: {
      size: { $gte: 64 },
      dateCreated: { $gte: moment().subtract(1, "year").unix() },
    },
  },
};
