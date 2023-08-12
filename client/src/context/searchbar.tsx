import React, { createContext, useState } from "react";

type TSearchbarContext = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const SearchbarContext = createContext<TSearchbarContext>({
  searchValue: "",
  setSearchValue: () => {},
});

export const SearchbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <SearchbarContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchbarContext.Provider>
  );
};

export default SearchbarContext;
