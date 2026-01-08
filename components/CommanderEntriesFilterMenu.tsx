'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Select} from './select';

type CommanderEntriesFilters = {
  sortBy: string;
  timePeriod: string;
  minEventSize: number;
  maxStanding?: number;
};

export function CommanderEntriesFilterMenu({
  filters: {sortBy, timePeriod, minEventSize, maxStanding},
}: {
  filters: CommanderEntriesFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function replaceRoute(filters: Partial<CommanderEntriesFilters>) {
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
    <div className="mx-auto grid max-w-(--breakpoint-md) grid-cols-2 gap-4 border-b border-white/40 p-6 text-center text-black sm:flex sm:flex-wrap sm:justify-center">
      <Select
        id="commander-sort-by"
        label="Sort By"
        value={sortBy}
        onChange={(e) => {
          replaceRoute({sortBy: e});
        }}
      >
        <option value="TOP">Top Performing</option>
        <option value="NEW">Recent</option>
      </Select>

      <Select
        id="commanders-time-period"
        label="Time Period"
        value={timePeriod}
        onChange={(e) => {
          replaceRoute({timePeriod: e});
        }}
      >
        <option value="ONE_MONTH">1 Month</option>
        <option value="THREE_MONTHS">3 Months</option>
        <option value="SIX_MONTHS">6 Months</option>
        <option value="ONE_YEAR">1 Year</option>
        <option value="ALL_TIME">All Time</option>
        <option value="POST_BAN">Post Ban</option>
      </Select>

      <Select
        id="commander-event-size"
        label="Event Size"
        value={`${minEventSize}`}
        onChange={(e) => {
          replaceRoute({minEventSize: Number(e)});
        }}
      >
        <option value="0">All Events</option>
        <option value="16">16+ Players</option>
        <option value="30">30+ Players</option>
        <option value="50">50+ Players</option>
        <option value="100">100+ Players</option>
        <option value="250">250+ Players</option>
      </Select>

      <Select
        id="commander-event-size"
        label="Standing"
        value={`${maxStanding}`}
        onChange={(e) => {
          replaceRoute({maxStanding: Number(e)});
        }}
      >
        <option value="">All Players</option>
        <option value="16">Top 16</option>
        <option value="4">Top 4</option>
        <option value="1">Winner</option>
      </Select>
    </div>
  );
}
