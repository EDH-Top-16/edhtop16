import React, { createContext, useState } from "react";

type TFilterValues = {
  color?: string[];
};

type TFilterContext = {
  filterValues: object;
  setFilterValues: React.Dispatch<React.SetStateAction<TFilterValues>>;
  enabled: string[];
  setEnabled: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FilterContext = createContext<TFilterContext>({
  filterValues: {},
  setFilterValues: () => {},
  enabled: [],
  setEnabled: () => {},
});

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterValues, setFilterValues] = useState<TFilterValues>({});
  const [enabled, setEnabled] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{ filterValues, setFilterValues, enabled, setEnabled }}
    >
      {children}
    </FilterContext.Provider>
  );
};
