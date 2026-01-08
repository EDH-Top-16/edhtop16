'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Select} from './select';

export function CommanderCardEntriesSortMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortBy') ?? 'TOP';

  return (
    <Select
      id="card-entries-sort"
      label="Sort By"
      value={currentSort}
      onChange={(sortBy) => {
        const nextSearch = new URLSearchParams();
        nextSearch.set('sortBy', sortBy);
        router.replace(`${pathname}?${nextSearch}`, {scroll: false});
      }}
    >
      <option value="TOP">Top Performing</option>
      <option value="NEW">Recent</option>
    </Select>
  );
}
