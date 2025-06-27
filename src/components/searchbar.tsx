import cn from "classnames";
import { useMemo, useRef, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useSearch } from "../lib/client/search";
import { ServerSafeSuspense } from "../lib/client/suspense";
import { searchbar_CommanderNamesQuery } from "../queries/__generated__/searchbar_CommanderNamesQuery.graphql";
import { Link } from "../lib/river/router";

export function Searchbar({
  searchType = "commander",
}: {
  searchType?: "commander" | "tournament";
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const activeElement =
    typeof document === "undefined" ? null : document.activeElement;
  const isActive = activeElement === inputRef.current && searchTerm;

  return (
    <div className="relative z-10 w-full grow text-lg text-black md:max-w-[400px]">
      <input
        className={cn(
          "w-full rounded-xl border-0 bg-white px-4 py-2 outline-hidden transition-all duration-200",
          isActive && "rounded-b-none",
        )}
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ServerSafeSuspense fallback={null}>
        {isActive && (
          <ul
            ref={suggestionsRef}
            className="absolute w-full rounded-b-xl bg-white"
          >
            <Suggestions searchTerm={searchTerm} searchType={searchType} />
          </ul>
        )}
      </ServerSafeSuspense>
    </div>
  );
}

function Suggestions({
  searchTerm,
  searchType,
}: {
  searchTerm: string;
  searchType: "commander" | "tournament";
}) {
  const searchTypes = useMemo(() => {
    if (searchType === "commander") {
      return ["COMMANDER"] as const;
    } else {
      return ["TOURNAMENT"] as const;
    }
  }, [searchType]);

  const { searchResults } = useLazyLoadQuery<searchbar_CommanderNamesQuery>(
    graphql`
      query searchbar_CommanderNamesQuery($searchTypes: [SearchResultType!]!) {
        searchResults(types: $searchTypes) {
          name
          url
        }
      }
    `,
    { searchTypes },
  );

  const suggestions = useSearch(searchResults, searchTerm);
  if (suggestions.length === 0) {
    return (
      <li className="rounded-b-xl px-4 py-1 text-black">No results found.</li>
    );
  }

  return (
    <>
      {suggestions.slice(0, 20).map((suggestion, i, { length }) => (
        <Link key={suggestion.name} href={suggestion.url}>
          <li
            className={cn(
              "px-4 py-1 text-black hover:bg-gray-300",
              i === length - 1 && "rounded-b-xl",
            )}
          >
            {suggestion.name}
          </li>
        </Link>
      ))}
    </>
  );
}
