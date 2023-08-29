import React, { createContext, useState } from "react";
import { FiltersType } from "@/constants/allFilters";

type TFilterContext = {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  enabled: string[];
  setEnabled: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FilterContext = createContext<TFilterContext>({
  filters: {},
  setFilters: () => {},
  enabled: [],
  setEnabled: () => {},
});

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<FiltersType>({});
  const [enabled, setEnabled] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, enabled, setEnabled }}
    >
      {children}
    </FilterContext.Provider>
  );
};
