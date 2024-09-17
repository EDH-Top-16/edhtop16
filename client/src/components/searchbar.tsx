import cn from "classnames";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ServerSafeSuspense } from "../lib/client/suspense";
import { searchbar_CommanderNamesQuery } from "../queries/__generated__/searchbar_CommanderNamesQuery.graphql";

export function Searchbar() {
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
          "w-full rounded-xl border-0 px-4 py-2 outline-none transition-all duration-200",
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
            <Suggestions search={searchTerm} />
          </ul>
        )}
      </ServerSafeSuspense>
    </div>
  );
}

function Suggestions({ search }: { search: string }) {
  const { commanderNames } = useLazyLoadQuery<searchbar_CommanderNamesQuery>(
    graphql`
      query searchbar_CommanderNamesQuery {
        commanderNames
      }
    `,
    {},
  );

  const suggestions = useMemo(
    () =>
      commanderNames.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase()),
      ),
    [commanderNames, search],
  );

  if (suggestions.length === 0) {
    return (
      <li className="rounded-b-xl px-4 py-1 text-black">No results found.</li>
    );
  }

  return (
    <>
      {suggestions.slice(0, 20).map((suggestion, i, { length }) => (
        <Link
          key={suggestion}
          href={`https://edhtop16.com/commander/${encodeURIComponent(
            suggestion,
          )}`}
        >
          <li
            className={cn(
              "px-4 py-1 text-black hover:bg-gray-300",
              i === length - 1 && "rounded-b-xl",
            )}
            key={suggestion}
          >
            {suggestion}
          </li>
        </Link>
      ))}
    </>
  );
}
