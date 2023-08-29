import moment from "moment";

import { FiltersType } from "./allFilters";

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
    colorID: "",
    tourney_filter: {
      size: { $gte: 64 },
      dateCreated: { $gte: moment().subtract(1, "year").unix() },
    },
  },
};
