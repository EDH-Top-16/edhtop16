import cn from "classnames";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ServerSafeSuspense } from "../../lib/client/suspense";
import { searchbar_CommanderNamesQuery } from "../../queries/__generated__/searchbar_CommanderNamesQuery.graphql";

export function Searchbar() {
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const activeElement =
    typeof document === "undefined" ? null : document.activeElement;
  const isActive = activeElement === inputRef.current && searchTerm;

  return (
    <div className="relative z-10 w-full grow text-lg md:w-1/3">
      <input
        className={cn(
          "w-full rounded-xl border-0 bg-searchbar px-4 py-2 outline-none transition-all duration-200",
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
            className="absolute w-full rounded-b-xl bg-nav dark:bg-searchbar"
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
      <li className="rounded-b-xl px-4 py-1 text-white dark:text-gray">
        No results found.
      </li>
    );
  }

  return (
    <>
      {suggestions.slice(0, 20).map((suggestion) => (
        <Link
          key={suggestion}
          href={`/commander/${encodeURIComponent(suggestion)}`}
        >
          <li
            className="px-4 py-1 text-white hover:bg-select dark:text-gray"
            key={suggestion}
          >
            {suggestion}
          </li>
        </Link>
      ))}
    </>
  );
}
