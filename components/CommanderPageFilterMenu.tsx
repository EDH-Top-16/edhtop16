'use client';

import {ListStyle} from '@/lib/schema/ViewerContext';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ColorSelection} from './color_selection';
import {Select} from './select';

export function DisplayStyleToggle({
  display,
  onChangeAction,
}: {
  display: ListStyle;
  onChangeAction: (value: 'table' | 'card') => void;
}) {
  function toggleDisplay() {
    onChangeAction(display === 'table' ? 'card' : 'table');
  }

  return (
    <button className="cursor-pointer" onClick={toggleDisplay}>
      {display === 'card' ? (
        <TableCellsIcon className="h-6 w-6 text-white" />
      ) : (
        <RectangleStackIcon className="h-6 w-6 text-white" />
      )}
    </button>
  );
}

export type CommanderPageFilters = {
  colorId: string;
  sortBy: string;
  timePeriod: string;
  minEntries: number;
  minSize: number;
};

export function CommanderPageFilterMenu({
  filters: {colorId, sortBy, timePeriod, minEntries, minSize},
}: {
  filters: CommanderPageFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function replaceRoute(filters: Partial<CommanderPageFilters>) {
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
    <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
      <div className="flex-1">
        <ColorSelection
          selected={colorId}
          onChange={(value) => {
            replaceRoute({colorId: value || undefined});
          }}
        />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap">
        <Select
          id="commanders-sort-by"
          label="Sort By"
          value={sortBy}
          onChange={(value) => {
            replaceRoute({sortBy: value});
          }}
        >
          <option value="CONVERSION">Conversion Rate</option>
          <option value="POPULARITY">Popularity</option>
          <option value="TOP_CUTS">Top Cuts</option>
        </Select>

        <Select
          id="commanders-time-period"
          label="Time Period"
          value={timePeriod}
          onChange={(value) => {
            replaceRoute({timePeriod: value});
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
          id="commanders-min-entries"
          label="Min. Entries"
          value={`${minEntries}`}
          onChange={(value) => {
            replaceRoute({minEntries: Number(value)});
          }}
        >
          <option value="0">All Commanders</option>
          <option value="20">20+ Entries</option>
          <option value="60">60+ Entries</option>
          <option value="120">120+ Entries</option>
        </Select>

        <Select
          id="commanders-min-size"
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
      </div>
    </div>
  );
}
