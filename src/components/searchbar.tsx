import {searchbar_CommanderNamesQuery} from '#genfiles/queries/searchbar_CommanderNamesQuery.graphql';
import {useNavigation} from '#genfiles/router/router';
import cn from 'classnames';
import {format, parseISO} from 'date-fns';
import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay/hooks';
import {SearchItem, useSearch} from '../lib/client/search';
import {ServerSafeSuspense} from '../lib/client/suspense';

const MAX_DISPLAYED_RESULTS = 20;

export function Searchbar({
  searchType = 'commander',
}: {
  searchType?: 'commander' | 'tournament';
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isActive = isOpen && !!searchTerm;

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, []);

  const handleEscape = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, []);

  const handleArrowDown = useCallback((resultCount: number) => {
    const maxIndex = Math.min(resultCount, MAX_DISPLAYED_RESULTS) - 1;
    setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  }, []);

  const handleArrowUp = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full grow text-lg text-black md:max-w-[400px]"
    >
      <ServerSafeSuspense fallback={null}>
        <SearchInput
          inputRef={inputRef}
          searchTerm={searchTerm}
          isActive={isActive}
          searchType={searchType}
          selectedIndex={selectedIndex}
          onSearchTermChange={(term) => {
            setSearchTerm(term);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onArrowDown={handleArrowDown}
          onArrowUp={handleArrowUp}
          onEscape={handleEscape}
          onNavigate={handleClose}
        />
      </ServerSafeSuspense>
    </div>
  );
}

function SearchInput({
  inputRef,
  searchTerm,
  isActive,
  searchType,
  selectedIndex,
  onSearchTermChange,
  onFocus,
  onArrowDown,
  onArrowUp,
  onEscape,
  onNavigate,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchTerm: string;
  isActive: boolean;
  searchType: 'commander' | 'tournament';
  selectedIndex: number;
  onSearchTermChange: (term: string) => void;
  onFocus: () => void;
  onArrowDown: (resultCount: number) => void;
  onArrowUp: () => void;
  onEscape: () => void;
  onNavigate: () => void;
}) {
  const {push} = useNavigation();

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
          entries
          topCuts
          metaShare
        }
      }
    `,
    {searchTypes},
  );

  const listboxId = useId();
  const suggestions = useSearch(searchResults, searchTerm);
  const displayedSuggestions = suggestions.slice(0, MAX_DISPLAYED_RESULTS);

  const navigateTo = useCallback(
    (url: string) => {
      push(url);
      onNavigate();
    },
    [push, onNavigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          onArrowDown(suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onArrowUp();
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && displayedSuggestions[selectedIndex]) {
            navigateTo(displayedSuggestions[selectedIndex].url);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onEscape();
          break;
      }
    },
    [
      onArrowDown,
      onArrowUp,
      onEscape,
      selectedIndex,
      displayedSuggestions,
      navigateTo,
      suggestions.length,
    ],
  );

  const activeDescendantId =
    selectedIndex >= 0 ? `${listboxId}-option-${selectedIndex}` : undefined;

  return (
    <>
      <input
        className={cn(
          'w-full rounded-xl border-0 bg-white px-4 py-2 outline-hidden transition-all duration-200',
          isActive && 'rounded-b-none',
        )}
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isActive}
        aria-haspopup="listbox"
        aria-controls={isActive ? listboxId : undefined}
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
      />

      {isActive && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute max-h-[90vh] min-h-80 w-full overflow-y-auto rounded-b-xl bg-white"
        >
          <Suggestions
            listboxId={listboxId}
            suggestions={displayedSuggestions}
            selectedIndex={selectedIndex}
            onNavigate={navigateTo}
          />
        </ul>
      )}
    </>
  );
}

function Suggestions({
  listboxId,
  suggestions,
  selectedIndex,
  onNavigate,
}: {
  listboxId: string;
  suggestions: SearchItem[];
  selectedIndex: number;
  onNavigate: (url: string) => void;
}) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) {
    return (
      <li role="option" className="rounded-b-xl px-4 py-1 text-black">
        No results found.
      </li>
    );
  }

  return (
    <>
      {suggestions.map((suggestion, i, {length}) => (
        <li
          key={suggestion.url}
          id={`${listboxId}-option-${i}`}
          role="option"
          aria-selected={selectedIndex === i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className={cn(
            'cursor-pointer px-4 py-2 text-black',
            selectedIndex === i ? 'bg-gray-200' : 'hover:bg-gray-300',
            i === length - 1 && 'rounded-b-xl',
          )}
          onClick={() => onNavigate(suggestion.url)}
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
              {format(parseISO(suggestion.tournamentDate), 'MMM d, yyyy')}
              {suggestion.size != null && ` · ${suggestion.size} players`}
              {suggestion.winnerName && ` · ${suggestion.winnerName}`}
            </div>
          )}
          {suggestion.metaShare != null && (
            <div className="text-sm text-gray-500">
              {(suggestion.metaShare * 100).toFixed(1)}% meta
              {suggestion.topCuts != null &&
                ` · ${suggestion.topCuts} top cuts`}
              {suggestion.entries != null && ` · ${suggestion.entries} entries`}
            </div>
          )}
        </li>
      ))}
    </>
  );
}
