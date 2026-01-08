'use client';

import {useRouter} from 'next/navigation';
import {ColorSelection} from './color_selection';
import {usePathname, useSearchParams} from 'next/navigation';
import {Select} from './select';

export type StaplesPageFilters = {
  colorId?: string;
  type?: string;
};

export function StaplesPageFilterMenu({
  filters: {colorId = '', type = ''},
}: {
  filters: StaplesPageFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function replaceRoute(filters: Partial<StaplesPageFilters>) {
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
    <div className="mb-8 flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-y-0">
      <div className="flex-1">
        <ColorSelection
          selected={colorId}
          onChange={(value) => {
            replaceRoute({
              colorId: value || undefined,
              type: type || undefined,
            });
          }}
        />
      </div>

      <div className="w-full md:w-auto">
        <Select
          id="staples-type-filter"
          label="Type Filter"
          value={type || 'all'}
          onChange={(value) => {
            replaceRoute({
              colorId: colorId || undefined,
              type: value === 'all' ? undefined : value,
            });
          }}
        >
          <option value="all">All Types</option>
          <option value="creature">Creature</option>
          <option value="instant">Instant</option>
          <option value="sorcery">Sorcery</option>
          <option value="artifact">Artifact</option>
          <option value="enchantment">Enchantment</option>
          <option value="planeswalker">Planeswalker</option>
          <option value="land">Land</option>
        </Select>
      </div>
    </div>
  );
}
