import React, { PropsWithChildren, createContext, useState } from "react";

type TSearchbarContext = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchbarContext = createContext<TSearchbarContext>({
  searchValue: "",
  setSearchValue: () => {},
});

export function SearchbarProvider({ children }: PropsWithChildren<{}>) {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <SearchbarContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchbarContext.Provider>
  );
}
