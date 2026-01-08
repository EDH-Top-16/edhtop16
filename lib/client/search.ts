import {useEffect, useMemo, useState} from 'react';

const FuseLib = import('fuse.js').then((mod) => mod.default);

type SearchOp = (term: string) => {name: string; url: string}[];
function defaultSearchOperator(
  list: readonly {name: string; url: string}[],
): SearchOp {
  return (term: string) => {
    return list.filter((c) =>
      c.name.toLowerCase().includes(term.toLowerCase()),
    );
  };
}

export function useSearch(
  list: readonly {name: string; url: string}[],
  term: string,
) {
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
        return fuse.search(term).map((res) => res.item);
      });
    });
  }, [list]);

  return useMemo(() => {
    return searchOp(term);
  }, [searchOp, term]);
}
