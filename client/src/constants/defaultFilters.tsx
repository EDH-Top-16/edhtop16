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
  commanders: {},
};
