import React, {
  useMemo,
  useCallback,
  memo,
  MouseEvent,
  PropsWithChildren,
} from 'react';
import {useFragment} from 'react-relay/hooks';
import {useSeoMeta} from '@unhead/react';
import {graphql} from 'relay-runtime';
import cn from 'classnames';
import {format} from 'date-fns';
import {Link} from '#genfiles/river/router';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';

import {tournamentPage_BreakdownGroupCard$key} from '#genfiles/queries/tournamentPage_BreakdownGroupCard.graphql';
import {tournamentPage_EntryCard$key} from '#genfiles/queries/tournamentPage_EntryCard.graphql';
import {tournamentPage_TournamentBanner$key} from '#genfiles/queries/tournamentPage_TournamentBanner.graphql';
import {tournamentPage_TournamentMeta$key} from '#genfiles/queries/tournamentPage_TournamentMeta.graphql';
import {tournamentPage_TournamentPageShell$key} from '#genfiles/queries/tournamentPage_TournamentPageShell.graphql';

import {SessionStatus} from './session_status';
import {ColorIdentity} from '../assets/icons/colors';
import {Card} from './card';
import {Navigation} from './navigation';
import {FirstPartyPromo} from './promo';
import {Tab, TabList} from './tabs';
import {formatOrdinals, formatPercent} from '../lib/client/format';
import type {PreferencesMap} from '../lib/client/cookies';

interface EntryCardProps {
  highlightFirst?: boolean;
  entry: tournamentPage_EntryCard$key;
}

interface BreakdownGroupCardProps {
  onClickGroup?: (groupName: string) => void;
  group: tournamentPage_BreakdownGroupCard$key;
}

interface TournamentBannerProps {
  tournament: tournamentPage_TournamentBanner$key;
  isAuthenticated?: boolean;
}

interface TournamentPageShellProps {
  tab: string;
  commanderName?: string | null;
  updatePreference: (
    key: keyof PreferencesMap['tournament'],
    value: any,
  ) => void;
  tournament: tournamentPage_TournamentPageShell$key;
  isAuthenticated?: boolean;
  children?: React.ReactNode;
}

interface TournamentContentProps {
  contentType: 'entries' | 'breakdown' | 'commander';
  entries?: readonly any[];
  breakdownCards?: readonly any[];
  commanderEntries?: readonly any[];
  onCommanderSelect?: (commanderName: string) => void;
}

export const EntryCard = memo<EntryCardProps>(function EntryCard({
  highlightFirst = true,
  entry: entryProp,
}) {
  const entry = useFragment(
    graphql`
      fragment tournamentPage_EntryCard on Entry {
        standing
        wins
        losses
        draws
        decklist
        player {
          name
          isKnownCheater
        }
        commander {
          name
          breakdownUrl
          cards {
            imageUrls
          }
        }
      }
    `,
    entryProp,
  );

  const entryName = useMemo(() => {
    const playerName = entry.player?.name ?? 'Unknown Player';
    if (entry.standing === 1) return `🥇 ${playerName}`;
    if (entry.standing === 2) return `🥈 ${playerName}`;
    if (entry.standing === 3) return `🥉 ${playerName}`;
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
        <span className="flex-1">{formatOrdinals(entry.standing)} place</span>
        <span>
          Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
        </span>
      </div>
    ),
    [entry.standing, entry.wins, entry.losses, entry.draws],
  );

  const cardImages = useMemo(
    () =>
      entry.commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${entry.commander.name} art`,
        })),
    [entry.commander.cards, entry.commander.name],
  );

  const cardClassName = useMemo(
    () =>
      cn(
        'group',
        highlightFirst &&
          'md:first:col-span-2 lg:max-w-3xl lg:first:col-span-3 lg:first:w-full lg:first:justify-self-center',
      ),
    [highlightFirst],
  );

  return (
    <Card className={cardClassName} bottomText={bottomText} images={cardImages}>
      <div className="flex h-32 flex-col space-y-2 lg:group-first:h-40">
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 text-xl font-bold underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            {entryNameNode}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryNameNode}</span>
        )}

        <Link
          href={entry.commander.breakdownUrl}
          className="underline decoration-transparent transition-colors hover:decoration-inherit"
        >
          {entry.commander.name}
        </Link>
      </div>
    </Card>
  );
});

export const BreakdownGroupCard = memo<BreakdownGroupCardProps>(
  function BreakdownGroupCard({onClickGroup, group: groupProp}) {
    const {commander, conversionRate, entries, topCuts} = useFragment(
      graphql`
        fragment tournamentPage_BreakdownGroupCard on TournamentBreakdownGroup {
          commander {
            name
            breakdownUrl
            colorId
            cards {
              imageUrls
            }
          }
          entries
          topCuts
          conversionRate
        }
      `,
      groupProp,
    );

    const bottomText = useMemo(
      () => (
        <div className="flex flex-wrap justify-between gap-1">
          <span>Top Cuts: {topCuts}</span>
          <span>Entries: {entries}</span>
          <span>Conversion: {formatPercent(conversionRate)}</span>
        </div>
      ),
      [topCuts, entries, conversionRate],
    );

    const cardImages = useMemo(
      () =>
        commander.cards
          .flatMap((c) => c.imageUrls)
          .map((img) => ({
            src: img,
            alt: `${commander.name} art`,
          })),
      [commander.cards, commander.name],
    );

    const handleClick = useCallback(() => {
      onClickGroup?.(commander.name);
    }, [onClickGroup, commander.name]);

    return (
      <Card bottomText={bottomText} images={cardImages}>
        <div className="flex h-32 flex-col space-y-2">
          <button
            className="text-left text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
            onClick={handleClick}
          >
            {commander.name}
          </button>
          <ColorIdentity identity={commander.colorId} />
        </div>
      </Card>
    );
  },
);

export const TournamentBanner = memo<TournamentBannerProps>(
  function TournamentBanner({tournament: tournamentProp, isAuthenticated}) {
    const tournament = useFragment(
      graphql`
        fragment tournamentPage_TournamentBanner on Tournament {
          name
          size
          tournamentDate
          bracketUrl
          winner: entries(maxStanding: 1) {
            commander {
              cards {
                imageUrls
              }
            }
          }
        }
      `,
      tournamentProp,
    );

    const bracketUrl = useMemo(() => {
      try {
        return tournament.bracketUrl ? new URL(tournament.bracketUrl) : null;
      } catch {
        return null;
      }
    }, [tournament.bracketUrl]);

    const formattedDate = useMemo(
      () => format(tournament.tournamentDate, 'MMMM do yyyy'),
      [tournament.tournamentDate],
    );

    const winnerImages = useMemo(
      () =>
        tournament.winner[0]?.commander.cards.flatMap((c) => c.imageUrls) || [],
      [tournament.winner],
    );

    const hasWinner = tournament.winner[0] != null;

    return (
      <div className="relative h-64 w-full bg-black/60 md:h-80">
        {/* Add session status in top left corner 
      <div className="absolute top-4 left-4 z-20">
        <SessionStatus showDetails={false} />
      </div>*/}

        <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center space-y-4">
          {hasWinner && (
            <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
              {winnerImages.map((src, _i, {length}) => (
                <img
                  className={cn(
                    'flex-1 object-cover object-top',
                    length === 2 ? 'w-1/2' : 'w-full',
                  )}
                  key={src}
                  src={src}
                  alt={`${tournament.name} winner art`}
                />
              ))}
            </div>
          )}

          {bracketUrl && (
            <div className="absolute top-4 right-4 z-10 text-xs md:text-sm">
              <a
                href={bracketUrl.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline"
              >
                View Bracket <ArrowRightIcon className="inline h-3 w-3" />
              </a>
            </div>
          )}

          <h1 className="font-title relative text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
            {tournament.name}
            {isAuthenticated && (
              <span className="ml-2 text-sm font-normal text-green-400">
                (Session Active)
              </span>
            )}
          </h1>
          <div className="relative flex w-full max-w-(--breakpoint-md) flex-col items-center justify-evenly gap-1 text-base text-white md:flex-row md:text-lg lg:text-xl">
            <span>{formattedDate}</span>
            <span>{tournament.size} Players</span>
          </div>
        </div>
      </div>
    );
  },
);

function useTournamentMeta(
  tournamentFromProps: tournamentPage_TournamentMeta$key,
) {
  const tournament = useFragment(
    graphql`
      fragment tournamentPage_TournamentMeta on Tournament {
        name
      }
    `,
    tournamentFromProps,
  );

  useSeoMeta({
    title: tournament.name,
    description: `Top Performing cEDH decks at ${tournament.name}`,
  });
}

export const TournamentPageShell = memo<TournamentPageShellProps>(
  function TournamentPageShell({
    tab,
    commanderName,
    updatePreference,
    tournament: tournamentProp,
    isAuthenticated,
    children,
  }) {
    const tournament = useFragment(
      graphql`
        fragment tournamentPage_TournamentPageShell on Tournament {
          TID
          ...tournamentPage_TournamentBanner
          ...tournamentPage_TournamentMeta
          promo {
            ...promo_EmbededPromo
          }
        }
      `,
      tournamentProp,
    );

    useTournamentMeta(tournament);

    const setSelectedTab = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        const nextKey = (e.target as HTMLButtonElement).id as
          | 'entries'
          | 'breakdown'
          | 'commander';

        updatePreference('tab' as keyof PreferencesMap['tournament'], nextKey);

        if (nextKey !== 'commander') {
          updatePreference(
            'commander' as keyof PreferencesMap['tournament'],
            null,
          );
        }
      },
      [updatePreference],
    );

    const showCommanderTab = commanderName != null;

    return (
      <>
        <Navigation />
        <TournamentBanner
          tournament={tournament}
          isAuthenticated={isAuthenticated}
        />
        {tournament.promo && <FirstPartyPromo promo={tournament.promo} />}

        <TabList className="mx-auto max-w-(--breakpoint-md)">
          <Tab
            id="entries"
            selected={tab === 'entries'}
            onClick={setSelectedTab}
          >
            Standings
          </Tab>
          <Tab
            id="breakdown"
            selected={tab === 'breakdown'}
            onClick={setSelectedTab}
          >
            Metagame Breakdown
          </Tab>
          {showCommanderTab && (
            <Tab id="commander" selected={tab === 'commander'}>
              {commanderName}
            </Tab>
          )}
        </TabList>

        {children}
      </>
    );
  },
);

export function TournamentContent({
  contentType,
  entries = [],
  breakdownCards = [],
  commanderEntries = [],
  onCommanderSelect,
}: TournamentContentProps) {
  const content = useMemo(() => {
    switch (contentType) {
      case 'breakdown':
        return breakdownCards.map((group) => (
          <BreakdownGroupCard
            key={group.commander.id}
            group={group}
            onClickGroup={onCommanderSelect}
          />
        ));
      case 'commander':
        return commanderEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} highlightFirst={false} />
        ));
      default:
        return entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ));
    }
  }, [
    contentType,
    entries,
    breakdownCards,
    commanderEntries,
    onCommanderSelect,
  ]);

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {content}
    </div>
  );
}
