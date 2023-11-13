import React, { createContext, useState } from "react";
import { AllFiltersType } from "../utils/types/filters";

interface TFilterContext {
  filters: AllFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<AllFiltersType>>;
  enabled: string[];
  setEnabled: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FilterContext = createContext<TFilterContext>({
  filters: {},
  setFilters: () => {},
  enabled: [],
  setEnabled: () => {},
});

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<AllFiltersType>({});
  const [enabled, setEnabled] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, enabled, setEnabled }}
    >
      {children}
    </FilterContext.Provider>
  );
};
