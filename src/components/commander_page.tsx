import React, { useMemo, memo } from 'react';
import { useFragment } from 'react-relay/hooks';
import { useSeoMeta } from '@unhead/react';
import { graphql } from 'relay-runtime';
import cn from 'classnames';
import { format } from 'date-fns';
import { Link } from '#genfiles/river/router';

import {
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/useCommanderPage_CommanderQuery.graphql';
import { commanderPage_CommanderBanner$key } from '#genfiles/queries/commanderPage_CommanderBanner.graphql';
import { commanderPage_CommanderMeta$key } from '#genfiles/queries/commanderPage_CommanderMeta.graphql';
import { commanderPage_CommanderPageShell$key } from '#genfiles/queries/commanderPage_CommanderPageShell.graphql';
import { commanderPage_EntryCard$key } from '#genfiles/queries/commanderPage_EntryCard.graphql';

import { SessionStatus } from './session_status';
import { ColorIdentity } from '../assets/icons/colors';
import { Card } from './card';
import { Dropdown } from './dropdown';
import { Navigation } from './navigation';
import { NumberInputDropdown } from './number_input_dropdown';
import { FirstPartyPromo } from './promo';
import { formatOrdinals, formatPercent } from '../lib/client/format';
import type { PreferencesMap } from '../lib/client/cookies';

// Constants
const TIME_PERIOD_LABELS: Partial<Record<TimePeriod, string>> = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
  ALL_TIME: 'All Time',
  POST_BAN: 'Post Ban',
};

const DROPDOWN_OPTIONS = {
  sortBy: [
    {value: 'TOP' as EntriesSortBy, label: 'Top Performing'},
    {value: 'NEW' as EntriesSortBy, label: 'Recent'},
  ],
  timePeriod: [
    {value: 'ONE_MONTH', label: '1 Month'},
    {value: 'THREE_MONTHS', label: '3 Months'},
    {value: 'SIX_MONTHS', label: '6 Months'},
    {value: 'ONE_YEAR', label: '1 Year'},
    {value: 'ALL_TIME', label: 'All Time'},
    {value: 'POST_BAN', label: 'Post Ban'},
  ],
  eventSize: [
    {value: null, label: 'All Events'},
    {value: 32, label: '32+ - Medium Events'},
    {value: 60, label: '60+ - Large Events'},
    {value: 100, label: '100+ - Major Events'},
  ],
  maxStanding: [
    {value: null, label: 'All Players'},
    {value: 1, label: 'Tournament Winners'},
    {value: 4, label: 'Top 4'},
    {value: 16, label: 'Top 16'},
  ],
};

// Component Interfaces
interface CommanderBannerProps {
  commander: commanderPage_CommanderBanner$key;
  dynamicStats?: {
    count: number;
    metaShare: number;
    conversionRate: number;
    topCuts: number;
    topCutBias: number;
  };
  isAuthenticated?: boolean;
}

interface CommanderPageShellProps {
  commander: commanderPage_CommanderPageShell$key;
  maxStanding?: number | null;
  minEventSize?: number | null;
  sortBy: EntriesSortBy;
  timePeriod: TimePeriod;
  updatePreference: (key: keyof PreferencesMap['entry'], value: any) => void;
  preferences: PreferencesMap['entry'];
  dynamicStatsFromData?: {
    count: number;
    metaShare: number;
    conversionRate: number;
    topCuts: number;
    topCutBias: number;
  } | null;
  isAuthenticated?: boolean;
  localEventSize: string;
  localMaxStanding: string;
  onSortBySelect: (value: EntriesSortBy) => void;
  onTimePeriodSelect: (value: string) => void;
  onEventSizeChange: (value: string) => void;
  onEventSizeSelect: (value: number | null) => void;
  onMaxStandingChange: (value: string) => void;
  onMaxStandingSelect: (value: number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children?: React.ReactNode;
}

interface EntryCardProps {
  entry: commanderPage_EntryCard$key;
}

interface CommanderFiltersProps {
  sortBy: EntriesSortBy;
  timePeriod: TimePeriod;
  preferences: PreferencesMap['entry'];
  localEventSize: string;
  localMaxStanding: string;
  onSortBySelect: (value: EntriesSortBy) => void;
  onTimePeriodSelect: (value: string) => void;
  onEventSizeChange: (value: string) => void;
  onEventSizeSelect: (value: number | null) => void;
  onMaxStandingChange: (value: string) => void;
  onMaxStandingSelect: (value: number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

// Pure UI Components
export const EntryCard = memo<EntryCardProps>(function EntryCard({ entry: entryRef }) {
  const entry = useFragment(
    graphql`
      fragment commanderPage_EntryCard on Entry {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
          isKnownCheater
        }

        tournament {
          name
          size
          tournamentDate
          TID
        }
      }
    `,
    entryRef,
  );

  const entryName = useMemo(() => {
    const playerName = entry.player?.name ?? 'Unknown Player';
    if (entry.standing === 1) {
      return `🥇 ${playerName}`;
    } else if (entry.standing <= 4) {
      return `🥈 ${playerName}`;
    } else if (entry.standing <= 16) {
      return `🥉 ${playerName}`;
    }
    return playerName;
  }, [entry.player?.name, entry.standing]);

  const entryNameNode = useMemo(
    () => (
      <span className="relative flex items-baseline">
        {entryName}
        {entry.player?.isKnownCheater && (
          <span className="absolute right-0 rounded-full bg-red-600 px-2 py-1 text-xs uppercase">
            Cheater
          </span>
        )}
      </span>
    ),
    [entryName, entry.player?.isKnownCheater],
  );

  const bottomText = useMemo(
    () => (
      <div className="flex">
        <span className="flex-1">
          {formatOrdinals(entry.standing)}&nbsp;/&nbsp;
          {entry.tournament.size} players
        </span>
        <span>
          Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
        </span>
      </div>
    ),
    [
      entry.standing,
      entry.tournament.size,
      entry.wins,
      entry.losses,
      entry.draws,
    ],
  );

  const formattedDate = useMemo(
    () => format(entry.tournament.tournamentDate, 'MMMM do yyyy'),
    [entry.tournament.tournamentDate],
  );

  return (
    <Card bottomText={bottomText}>
      <div className="flex h-32 flex-col">
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            className="line-clamp-1 text-xl font-bold underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            {entryNameNode}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryNameNode}</span>
        )}

        <Link
          href={`/tournament/${entry.tournament.TID}`}
          className="line-clamp-2 pt-2 underline decoration-transparent transition-colors hover:decoration-inherit"
        >
          {entry.tournament.name}
        </Link>
        <span className="line-clamp-1 text-sm opacity-70">{formattedDate}</span>
      </div>
    </Card>
  );
});

export const CommanderBanner = memo<CommanderBannerProps>(function CommanderBanner({
  commander: commanderRef,
  dynamicStats,
  isAuthenticated,
}) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CommanderBanner on Commander {
        name
        colorId
        cards {
          imageUrls
        }

        stats {
          conversionRate
          topCuts
          count
          metaShare
          topCutBias
        }
      }
    `,
    commanderRef,
  );

  const stats = useMemo(
    () => dynamicStats || commander.stats,
    [dynamicStats, commander.stats],
  );

  const cardImages = useMemo(
    () => commander.cards.flatMap((c) => c.imageUrls),
    [commander.cards],
  );

  const topCutBiasValue = useMemo(
    () =>
      stats.topCutBias > 0
        ? (stats.topCuts / stats.topCutBias).toFixed(1)
        : '0.0',
    [stats.topCuts, stats.topCutBias],
  );

  const statsDisplay = useMemo(
    () => ({
      entries: stats.count,
      metaShare: formatPercent(stats.metaShare),
      conversionRate: formatPercent(stats.conversionRate),
      topCutBias: topCutBiasValue,
    }),
    [stats.count, stats.metaShare, stats.conversionRate, topCutBiasValue],
  );

  return (
    <div className="h-64 w-full bg-black/60 md:h-80 relative">
      {/* Add session status in top right corner of banner 
       <div className="absolute top-4 right-4 z-20">
       <SessionStatus showDetails={false} />
      </div>*/}

      <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center">
        <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
          {cardImages.map((src, _i, {length}) => (
            <img
              className={cn(
                'flex-1 object-cover object-top',
                length === 2 ? 'w-1/2' : 'w-full',
              )}
              key={src}
              src={src}
              alt={`${commander.name} art`}
            />
          ))}
        </div>

        <h1 className="font-title relative m-0 mb-4 text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
          {isAuthenticated && (
            <span className="ml-2 text-sm text-green-400 font-normal">
              (Session Active)
            </span>
          )}
        </h1>

        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>

        <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
          {statsDisplay.entries} Entries
          <div className="mr-1 ml-2 border-l border-white/60 py-2">
            &nbsp;
          </div>{' '}
          {statsDisplay.metaShare} Meta%
          <div className="mr-1 ml-2 border-l border-white/60 py-2">
            &nbsp;
          </div>{' '}
          {statsDisplay.conversionRate} Conversion
          <div className="mr-1 ml-2 border-l border-white/60 py-2">
            &nbsp;
          </div>{' '}
          {statsDisplay.topCutBias} Top Cut Bias
        </div>
      </div>
    </div>
  );
});

function useCommanderMeta(commanderFromProps: commanderPage_CommanderMeta$key) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CommanderMeta on Commander {
        name
      }
    `,
    commanderFromProps,
  );

  useSeoMeta({
    title: commander.name,
    description: `Top Performing and Recent Decklists for ${commander.name} in cEDH`,
  });
}

export function CommanderFilters({
  sortBy,
  timePeriod,
  preferences,
  localEventSize,
  localMaxStanding,
  onSortBySelect,
  onTimePeriodSelect,
  onEventSizeChange,
  onEventSizeSelect,
  onMaxStandingChange,
  onMaxStandingSelect,
  onKeyDown,
}: CommanderFiltersProps) {
  const currentTimePeriodLabel = useMemo(
    () =>
      TIME_PERIOD_LABELS[preferences?.timePeriod || timePeriod || undefined] ||
      TIME_PERIOD_LABELS.ONE_YEAR,
    [preferences?.timePeriod, timePeriod],
  );

  const currentSortByLabel = useMemo(
    () => (sortBy === 'TOP' ? 'Top Performing' : 'Recent'),
    [sortBy],
  );

  return (
    <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4 lg:flex-nowrap">
      <div className="relative flex flex-col">
        <Dropdown
          id="commander-sort-by"
          label="Sort By"
          value={currentSortByLabel}
          options={DROPDOWN_OPTIONS.sortBy}
          onSelect={onSortBySelect}
        />
      </div>

      <div className="relative flex flex-col">
        <Dropdown
          id="commander-time-period"
          label="Time Period"
          value={currentTimePeriodLabel || ''}
          options={DROPDOWN_OPTIONS.timePeriod}
          onSelect={onTimePeriodSelect}
        />
      </div>

      <div className="relative flex flex-col">
        <NumberInputDropdown
          id="commander-event-size"
          label="Event Size"
          value={localEventSize}
          placeholder="Event Size"
          min="0"
          dropdownClassName="event-size-dropdown"
          options={DROPDOWN_OPTIONS.eventSize}
          onChange={onEventSizeChange}
          onSelect={onEventSizeSelect}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className="relative flex flex-col">
        <NumberInputDropdown
          id="commander-max-standing"
          label="Standing Cutoff"
          value={localMaxStanding}
          placeholder="Standing Cutoff"
          min="1"
          dropdownClassName="max-standing-dropdown"
          options={DROPDOWN_OPTIONS.maxStanding}
          onChange={onMaxStandingChange}
          onSelect={onMaxStandingSelect}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}

export const CommanderPageShell = memo<CommanderPageShellProps>(function CommanderPageShell({
  commander: commanderRef,
  maxStanding,
  minEventSize,
  sortBy,
  timePeriod,
  updatePreference,
  preferences,
  dynamicStatsFromData,
  isAuthenticated,
  localEventSize,
  localMaxStanding,
  onSortBySelect,
  onTimePeriodSelect,
  onEventSizeChange,
  onEventSizeSelect,
  onMaxStandingChange,
  onMaxStandingSelect,
  onKeyDown,
  children,
}) {
  const commander = useFragment(
    graphql`
      fragment commanderPage_CommanderPageShell on Commander
      @argumentDefinitions(
        minEventSize: {type: "Int"}
        maxStanding: {type: "Int"}
        timePeriod: {type: "TimePeriod!"}
      ) {
        name
        breakdownUrl
        ...commanderPage_CommanderBanner
        ...commanderPage_CommanderMeta

        # Add the new filteredStats field
        filteredStats(
          minEventSize: $minEventSize
          maxStanding: $maxStanding
          timePeriod: $timePeriod
        ) {
          conversionRate
          topCuts
          count
          metaShare
          topCutBias
        }

        promo {
          ...promo_EmbededPromo
        }
      }
    `,
    commanderRef,
  );

  useCommanderMeta(commander);

  const dynamicStats = useMemo(
    () => dynamicStatsFromData || commander.filteredStats,
    [dynamicStatsFromData, commander.filteredStats],
  );

  return (
    <>
      <Navigation />
      <CommanderBanner commander={commander} dynamicStats={dynamicStats} isAuthenticated={isAuthenticated} />
      {commander.promo && <FirstPartyPromo promo={commander.promo} />}

      <CommanderFilters
        sortBy={sortBy}
        timePeriod={timePeriod}
        preferences={preferences}
        localEventSize={localEventSize}
        localMaxStanding={localMaxStanding}
        onSortBySelect={onSortBySelect}
        onTimePeriodSelect={onTimePeriodSelect}
        onEventSizeChange={onEventSizeChange}
        onEventSizeSelect={onEventSizeSelect}
        onMaxStandingChange={onMaxStandingChange}
        onMaxStandingSelect={onMaxStandingSelect}
        onKeyDown={onKeyDown}
      />
      
      {children}
    </>
  );
});

export function CommanderEntryGrid({ entryCards }: { entryCards: any[] }) {
  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {entryCards.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}