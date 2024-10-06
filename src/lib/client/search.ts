import { useEffect, useMemo, useState } from "react";

const FuseLib = import("fuse.js").then((mod) => mod.default);

type SearchOp = (term: string) => string[];
function defaultSearchOperator(list: readonly string[]): SearchOp {
  return (term: string) => {
    return list.filter((c) => c.toLowerCase().includes(term.toLowerCase()));
  };
}

export function useSearch(list: readonly string[], term: string) {
  const [searchOp, setSearchOp] = useState<SearchOp>(() =>
    defaultSearchOperator(list),
  );

  useEffect(() => {
    FuseLib.then((Fuse) => {
      const fuse = new Fuse(list, { threshold: 0.3 });
      setSearchOp(() => (term: string) => {
        return fuse.search(term).map((res) => res.item);
      });
    });
  }, [list]);

  return useMemo(() => {
    return searchOp(term);
  }, [searchOp, term]);
}
