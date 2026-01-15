import {searchbar_CommanderNamesQuery} from '#genfiles/queries/searchbar_CommanderNamesQuery.graphql';
import {Link} from '#genfiles/router/router';
import cn from 'classnames';
import {format} from 'date-fns';
import {useMemo, useRef, useState} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay/hooks';
import {useSearch} from '../lib/client/search';
import {ServerSafeSuspense} from '../lib/client/suspense';

export function Searchbar({
  searchType = 'commander',
}: {
  searchType?: 'commander' | 'tournament';
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const activeElement =
    typeof document === 'undefined' ? null : document.activeElement;
  const isActive = activeElement === inputRef.current && searchTerm;

  return (
    <div className="relative z-10 w-full grow text-lg text-black md:max-w-[400px]">
      <input
        className={cn(
          'w-full rounded-xl border-0 bg-white px-4 py-2 outline-hidden transition-all duration-200',
          isActive && 'rounded-b-none',
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
            className="absolute max-h-[90vh] min-h-80 w-full overflow-y-auto rounded-b-xl bg-white"
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
  searchType: 'commander' | 'tournament';
}) {
  const searchTypes = useMemo(() => {
    if (searchType === 'commander') {
      return ['COMMANDER'] as const;
    } else {
      return ['TOURNAMENT'] as const;
    }
  }, [searchType]);

  const {searchResults} = useLazyLoadQuery<searchbar_CommanderNamesQuery>(
    graphql`
      query searchbar_CommanderNamesQuery($searchTypes: [SearchResultType!]!)
      @throwOnFieldError {
        searchResults(types: $searchTypes) {
          name
          url
          tournamentDate
          size
          topdeckUrl
          winnerName
        }
      }
    `,
    {searchTypes},
  );

  const suggestions = useSearch(searchResults, searchTerm);
  if (suggestions.length === 0) {
    return (
      <li className="rounded-b-xl px-4 py-1 text-black">No results found.</li>
    );
  }

  return (
    <>
      {suggestions.slice(0, 20).map((suggestion, i, {length}) => (
        <Link key={suggestion.url} href={suggestion.url}>
          <li
            className={cn(
              'px-4 py-2 text-black hover:bg-gray-300',
              i === length - 1 && 'rounded-b-xl',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium">{suggestion.name}</span>
              {suggestion.topdeckUrl && (
                <a
                  href={suggestion.topdeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 text-gray-400 hover:text-blue-600"
                  title="View on TopDeck.gg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
            {suggestion.tournamentDate && (
              <div className="text-sm text-gray-500">
                {format(suggestion.tournamentDate, 'MMM d, yyyy')}
                {suggestion.size != null && ` · ${suggestion.size} players`}
                {suggestion.winnerName && ` · ${suggestion.winnerName}`}
              </div>
            )}
          </li>
        </Link>
      ))}
    </>
  );
}
