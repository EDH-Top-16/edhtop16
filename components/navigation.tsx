'use client';

import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import cn from 'classnames';
import Link from 'next/link';
import {Suspense, use, useCallback, useRef, useState} from 'react';
import {useSearch} from '../lib/client/search';

type SearchResult = {
  name: string;
  url: string;
};

function Searchbar({searchResults}: {searchResults: Promise<SearchResult[]>}) {
  const [searchTerm, setSearchTerm] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const activeElement =
    typeof document === 'undefined' ? null : document.activeElement;
  // eslint-disable-next-line react-hooks/refs
  const isActive = activeElement === inputRef.current && searchTerm;

  return (
    <div className="relative z-10 w-full grow text-lg text-black md:max-w-[400px]">
      <input
        className={cn(
          'w-full rounded-xl border-0 bg-white px-4 py-2 outline-hidden transition-all duration-200',
          // eslint-disable-next-line react-hooks/refs
          isActive && 'rounded-b-none',
        )}
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Suspense fallback={null}>
        {
          // eslint-disable-next-line react-hooks/refs
          isActive && (
            <ul
              ref={suggestionsRef}
              className="absolute w-full rounded-b-xl bg-white"
            >
              <Suggestions
                searchTerm={searchTerm}
                searchResults={searchResults}
              />
            </ul>
          )
        }
      </Suspense>
    </div>
  );
}

function Suggestions({
  searchTerm,
  searchResults: searchResultsPromise,
}: {
  searchTerm: string;
  searchResults: Promise<SearchResult[]>;
}) {
  const searchResults = use(searchResultsPromise);
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
              'px-4 py-1 text-black hover:bg-gray-300',
              i === length - 1 && 'rounded-b-xl',
            )}
          >
            {suggestion.name}
          </li>
        </Link>
      ))}
    </>
  );
}

export function Navigation({
  searchResults,
}: {
  searchResults: Promise<SearchResult[]>;
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const toggleSearch = useCallback(() => {
    setMobileSearchOpen((open) => !open);
  }, []);

  return (
    <nav className="font-title sticky top-0 z-20 grid w-full grid-cols-[auto_auto_auto_1fr] items-center gap-x-6 gap-y-3 bg-[#312d5a] px-4 py-3 text-white sm:grid-cols-[auto_auto_auto_auto_1fr] md:px-8">
      <Link href="/" className="text-xl font-black">
        EDHTop16
      </Link>

      <Link
        href="/"
        className="hidden text-xs underline decoration-transparent transition-colors hover:decoration-inherit sm:inline md:text-sm"
      >
        Commanders
      </Link>

      <Link
        href="/tournaments"
        className="text-xs underline decoration-transparent transition-colors hover:decoration-inherit md:text-sm"
      >
        Tournaments
      </Link>

      <Link
        href="/staples"
        className="text-xs underline decoration-transparent transition-colors hover:decoration-inherit md:text-sm"
      >
        Staples
      </Link>

      <button
        className="block justify-self-end md:hidden"
        onClick={toggleSearch}
      >
        {mobileSearchOpen ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5" />
        )}
      </button>

      <div
        className={cn(
          'col-span-5 justify-end md:col-span-1 md:flex',
          mobileSearchOpen ? 'flex' : 'hidden',
        )}
      >
        <Searchbar searchResults={searchResults} />
      </div>
    </nav>
  );
}
