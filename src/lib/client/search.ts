import {useEffect, useMemo, useState} from 'react';

const FuseLib = import('fuse.js').then((mod) => mod.default);

interface SearchItem {
  name: string;
  url: string;
  tournamentDate?: string | null;
  size?: number | null;
  topdeckUrl?: string | null;
  winnerName?: string | null;
}

type SearchOp = (term: string) => SearchItem[];

function sortByDate(items: SearchItem[]): SearchItem[] {
  return items.sort((a, b) => {
    // Items with dates come before items without
    if (a.tournamentDate && !b.tournamentDate) return -1;
    if (!a.tournamentDate && b.tournamentDate) return 1;
    if (!a.tournamentDate && !b.tournamentDate) return 0;
    // Sort by date descending (most recent first)
    return b.tournamentDate!.localeCompare(a.tournamentDate!);
  });
}

function defaultSearchOperator(list: readonly SearchItem[]): SearchOp {
  return (term: string) => {
    const filtered = list.filter((c) =>
      c.name.toLowerCase().includes(term.toLowerCase()),
    );
    return sortByDate([...filtered]);
  };
}

export function useSearch(list: readonly SearchItem[], term: string) {
  const [searchOp, setSearchOp] = useState<SearchOp>(() =>
    defaultSearchOperator(list),
  );

  useEffect(() => {
    FuseLib.then((Fuse) => {
      const fuse = new Fuse(list, {
        threshold: 0.3,
        keys: ['name'],
      });

      setSearchOp(() => (term: string) => {
        const results = fuse.search(term).map((res) => res.item);
        return sortByDate([...results]);
      });
    });
  }, [list]);

  return useMemo(() => {
    return searchOp(term);
  }, [searchOp, term]);
}
