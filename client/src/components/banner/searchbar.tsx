interface SearchbarProps {
  placeholder: string;
}

export function Searchbar({ placeholder }: SearchbarProps) {
  return (
    <>
      <label htmlFor="searchbar" className="hidden"></label>
      <input
        id="searchbar"
        className="w-full md:w-2/6"
        type="text"
        placeholder={placeholder}
      />
    </>
  );
}
