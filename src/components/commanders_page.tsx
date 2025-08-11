import React, {PropsWithChildren, useMemo} from 'react';
import {useFragment, graphql} from 'react-relay/hooks';
import {useSeoMeta} from '@unhead/react';
import cn from 'classnames';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import {Link} from '#genfiles/river/router';

import {ColorIdentity} from '../assets/icons/colors';
import {Card} from './card';
import {ColorSelection} from './color_selection';
import {Footer} from './footer';
import {LoadMoreButton} from './load_more';
import {Navigation} from './navigation';
import {NumberInputDropdown} from './number_input_dropdown';
import {Dropdown} from './dropdown';
import {formatPercent} from '../lib/client/format';
import type {PreferencesMap} from '../lib/client/cookies';
import type {commandersPage_TopCommandersCard$key} from '#genfiles/queries/commandersPage_TopCommandersCard.graphql';

// Constants
export const TIME_PERIOD_LABELS = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
  ALL_TIME: 'All Time',
  POST_BAN: 'Post Ban',
} as const;

export const SORT_BY_OPTIONS = [
  {value: 'CONVERSION' as const, label: 'Top Performing'},
  {value: 'POPULARITY' as const, label: 'Most Popular'},
];

export const TIME_PERIOD_OPTIONS = [
  {value: 'ONE_MONTH' as const, label: '1 Month'},
  {value: 'THREE_MONTHS' as const, label: '3 Months'},
  {value: 'SIX_MONTHS' as const, label: '6 Months'},
  {value: 'ONE_YEAR' as const, label: '1 Year'},
  {value: 'ALL_TIME' as const, label: 'All Time'},
  {value: 'POST_BAN' as const, label: 'Post Ban'},
];

export const MIN_ENTRIES_OPTIONS = [
  {value: null, label: 'All Entries'},
  {value: 20, label: '20+ Entries'},
  {value: 40, label: '40+ Entries'},
  {value: 60, label: '60+ Entries'},
  {value: 100, label: '100+ Entries'},
];

export const EVENT_SIZE_OPTIONS = [
  {value: null, label: 'All Tournaments'},
  {value: 30, label: '30+ - Medium Events'},
  {value: 60, label: '60+ - Large Events'},
  {value: 100, label: '100+ - Major Events'},
];

// Component interfaces
interface TopCommandersCardProps {
  display?: 'table' | 'card';
  secondaryStatistic: 'topCuts' | 'count';
  commander: commandersPage_TopCommandersCard$key;
}

interface CommandersFiltersProps {
  currentPreferences: {
    sortBy: 'CONVERSION' | 'POPULARITY';
    timePeriod: keyof typeof TIME_PERIOD_LABELS;
    colorId: string;
    minEntries: number | null;
    minTournamentSize: number | null;
    display: 'card' | 'table';
  };
  localMinEntries: string;
  setLocalMinEntries: (value: string) => void;
  localEventSize: string;
  setLocalEventSize: (value: string) => void;
  inputHandlers: any;
  onDisplayToggle: () => void;
  onSortByChange: (value: 'CONVERSION' | 'POPULARITY') => void;
  onTimePeriodChange: (value: keyof typeof TIME_PERIOD_LABELS) => void;
  onColorChange: (value: string) => void;
}

interface CommandersHeaderProps {
  display: 'card' | 'table';
  onDisplayToggle: () => void;
  isAuthenticated?: boolean;
}

interface CommandersGridProps {
  commanders: Array<{
    node: {id: string} & commandersPage_TopCommandersCard$key;
  }>;
  display: 'card' | 'table';
  secondaryStatistic: 'topCuts' | 'count';
}

interface CommandersTableHeaderProps {
  display: 'card' | 'table';
}

// Pure UI Components
export const TopCommandersCard = React.memo<TopCommandersCardProps>(
  function TopCommandersCard({
    display = 'card',
    secondaryStatistic,
    commander: commanderRef,
  }) {
    const commander = useFragment(
      graphql`
        fragment commandersPage_TopCommandersCard on Commander {
          name
          colorId
          breakdownUrl
          stats {
            conversionRate
            topCuts
            count
            metaShare
          }
          cards {
            imageUrls
          }
        }
      `,
      commanderRef,
    );

    const commanderStats = useMemo(() => {
      if (secondaryStatistic === 'count') {
        return `Meta Share: ${formatPercent(commander.stats.metaShare)} / Entries: ${commander.stats.count}`;
      }
      return `Conversion Rate: ${formatPercent(commander.stats.conversionRate)} / Top Cuts: ${commander.stats.topCuts}`;
    }, [commander.stats, secondaryStatistic]);

    const images = useMemo(
      () =>
        commander.cards
          .flatMap((c) => c.imageUrls)
          .map((img) => ({
            src: img,
            alt: `${commander.name} card art`,
          })),
      [commander.cards, commander.name],
    );

    if (display === 'table') {
      return (
        <div className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]">
          <ColorIdentity identity={commander.colorId} />
          <Link
            href={commander.breakdownUrl}
            className="font-title mb-2 text-xl underline lg:mb-0 lg:font-sans lg:text-base"
          >
            {commander.name}
          </Link>
          <div className="text-sm opacity-75 lg:hidden">Entries:</div>
          <div className="text-sm">{commander.stats.count}</div>
          <div className="text-sm opacity-75 lg:hidden">Meta Share:</div>
          <div className="text-sm">
            {formatPercent(commander.stats.metaShare)}
          </div>
          <div className="text-sm opacity-75 lg:hidden">Top Cuts:</div>
          <div className="text-sm">{commander.stats.topCuts}</div>
          <div className="text-sm opacity-75 lg:hidden">Conversion Rate:</div>
          <div className="text-sm">
            {formatPercent(commander.stats.conversionRate)}
          </div>
        </div>
      );
    }

    return (
      <Card bottomText={commanderStats} images={images}>
        <div className="flex h-32 flex-col space-y-2">
          <Link
            href={commander.breakdownUrl}
            className="text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
          >
            {commander.name}
          </Link>
          <ColorIdentity identity={commander.colorId} />
        </div>
      </Card>
    );
  },
);

export function CommandersHeader({
  display,
  onDisplayToggle,
  isAuthenticated,
}: CommandersHeaderProps) {
  return (
    <div className="flex w-full items-baseline gap-4">
      <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white lg:mb-0">
        cEDH Metagame Breakdown
        {isAuthenticated && (
          <span className="ml-2 text-sm font-normal text-green-400">
            (Session Active)
          </span>
        )}
      </h1>
      <button
        className="cursor-pointer"
        onClick={onDisplayToggle}
        aria-label={`Switch to ${display === 'table' ? 'card' : 'table'} view`}
      >
        {display === 'card' ? (
          <TableCellsIcon className="h-6 w-6 text-white" />
        ) : (
          <RectangleStackIcon className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );
}

export function CommandersFilters({
  currentPreferences,
  localMinEntries,
  setLocalMinEntries,
  localEventSize,
  setLocalEventSize,
  inputHandlers,
  onDisplayToggle,
  onSortByChange,
  onTimePeriodChange,
  onColorChange,
}: CommandersFiltersProps) {
  const currentSortByLabel = useMemo(
    () =>
      currentPreferences?.sortBy === 'POPULARITY'
        ? 'Most Popular'
        : 'Top Performing',
    [currentPreferences?.sortBy],
  );

  const currentTimePeriodLabel = useMemo(
    () => TIME_PERIOD_LABELS[currentPreferences?.timePeriod] || '1 Month',
    [currentPreferences?.timePeriod],
  );

  return (
    <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
      <div className="flex-1">
        <ColorSelection
          selected={currentPreferences.colorId}
          onChange={onColorChange}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 lg:flex-nowrap lg:justify-end">
        <div className="relative flex flex-col">
          <Dropdown
            id="commanders-sort-by"
            label="Sort By"
            value={currentSortByLabel}
            options={SORT_BY_OPTIONS}
            onSelect={onSortByChange}
          />
        </div>
        <div className="relative flex flex-col">
          <Dropdown
            id="commanders-time-period"
            label="Time Period"
            value={currentTimePeriodLabel}
            options={TIME_PERIOD_OPTIONS}
            onSelect={onTimePeriodChange}
          />
        </div>
        <div className="relative flex flex-col">
          <NumberInputDropdown
            id="commanders-min-entries"
            label="Commander Entries"
            value={localMinEntries}
            placeholder="Commander Entries"
            min="1"
            dropdownClassName="min-entries-dropdown"
            options={MIN_ENTRIES_OPTIONS}
            onChange={(value) =>
              inputHandlers.handleMinEntriesChange(value, setLocalMinEntries)
            }
            onSelect={(value) =>
              inputHandlers.handleMinEntriesSelect(value, setLocalMinEntries)
            }
            onKeyDown={inputHandlers.handleKeyDown}
          />
        </div>
        <div className="relative flex flex-col">
          <NumberInputDropdown
            id="commanders-event-size"
            label="Event Size"
            value={localEventSize}
            placeholder="Event Size"
            min="1"
            dropdownClassName="event-size-dropdown"
            options={EVENT_SIZE_OPTIONS}
            onChange={(value) =>
              inputHandlers.handleEventSizeChange(value, setLocalEventSize)
            }
            onSelect={(value) =>
              inputHandlers.handleEventSizeSelect(value, setLocalEventSize)
            }
            onKeyDown={inputHandlers.handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export function CommandersTableHeader({display}: CommandersTableHeaderProps) {
  if (display !== 'table') return null;

  return (
    <div className="sticky top-[68px] hidden w-full grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px] items-center gap-x-2 overflow-x-hidden bg-[#514f86] p-4 text-sm text-white lg:grid">
      <div>Color</div>
      <div>Commander</div>
      <div>Entries</div>
      <div>Meta %</div>
      <div>Top Cuts</div>
      <div>Cnvr. %</div>
    </div>
  );
}

export function CommandersGrid({
  commanders,
  display,
  secondaryStatistic,
}: CommandersGridProps) {
  const gridClasses = useMemo(
    () =>
      cn(
        'mx-auto grid w-full pb-4',
        display === 'table'
          ? 'w-full grid-cols-1 gap-2'
          : 'w-fit gap-4 md:grid-cols-2 xl:grid-cols-3',
      ),
    [display],
  );

  return (
    <div className={gridClasses}>
      <CommandersTableHeader display={display} />
      {commanders.map(({node}) => (
        <TopCommandersCard
          key={node.id}
          display={display}
          commander={node}
          secondaryStatistic={secondaryStatistic}
        />
      ))}
    </div>
  );
}

export function CommandersPageShell({children}: PropsWithChildren) {
  useSeoMeta({
    title: 'cEDH Commanders',
    description: 'Discover top performing commanders in cEDH!',
  });

  return (
    <>
      <Navigation />
      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        {children}
      </div>
    </>
  );
}
