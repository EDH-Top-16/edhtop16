'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Select} from './select';

export type TournamentsPageFilters = {
  sortBy: string;
  minSize: number;
  timePeriod: string;
};

export function TournamentsPageFilterMenu({
  filters: {sortBy, minSize, timePeriod},
}: {
  filters: TournamentsPageFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function replaceRoute(filters: Partial<TournamentsPageFilters>) {
    const nextSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        nextSearchParams.set(key, `${value}`);
      } else {
        nextSearchParams.delete(key);
      }
    }

    router.replace(`${pathname}?${nextSearchParams}`);
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <Select
        id="tournaments-sort-by"
        label="Sort By"
        value={sortBy}
        onChange={(value) => {
          replaceRoute({sortBy: value});
        }}
      >
        <option value="PLAYERS">Tournament Size</option>
        <option value="DATE">Date</option>
      </Select>

      <Select
        id="tournaments-players"
        label="Tournament Size"
        value={`${minSize}`}
        onChange={(value) => {
          replaceRoute({minSize: Number(value)});
        }}
      >
        <option value="0">All Tournaments</option>
        <option value="16">16+ Players</option>
        <option value="30">30+ Players</option>
        <option value="50">50+ Players</option>
        <option value="100">100+ Players</option>
        <option value="250">250+ Players</option>
      </Select>

      <Select
        id="tournaments-time-period"
        label="Time Period"
        value={timePeriod}
        onChange={(value) => {
          replaceRoute({timePeriod: value});
        }}
      >
        <option value="ONE_MONTH">1 Month</option>
        <option value="THREE_MONTHS">3 Months</option>
        <option value="SIX_MONTHS">6 Months</option>
        <option value="POST_BAN">Post Ban</option>
        <option value="ONE_YEAR">1 Year</option>
        <option value="ALL_TIME">All Time</option>
      </Select>
    </div>
  );
}
