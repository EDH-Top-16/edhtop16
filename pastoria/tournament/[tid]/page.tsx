import {ColorIdentity} from '#src/assets/icons/colors.js';
import {Card} from '#components/card.js';
import {Footer} from '#components/footer.js';
import {Navigation} from '#components/navigation.js';
import {FirstPartyPromo} from '#components/promo.js';
import {Tab, TabList} from '#components/tabs.js';
import {formatOrdinals, formatPercent} from '#src/lib/client/format.js';
import {page_BreakdownGroupCard$key} from '#genfiles/queries/page_BreakdownGroupCard.graphql.js';
import {page_EntryCard$key} from '#genfiles/queries/page_EntryCard.graphql.js';
import {page_TournamentBanner$key} from '#genfiles/queries/page_TournamentBanner.graphql.js';
import {page_TournamentMeta$key} from '#genfiles/queries/page_TournamentMeta.graphql.js';
import page_TournamentPageQuery from '#genfiles/queries/page_TournamentPageQuery.graphql.js';
import {Link, useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import cn from 'classnames';
import {format} from 'date-fns';
import {MouseEvent, useCallback, useMemo} from 'react';
import {graphql, useFragment, usePreloadedQuery} from 'react-relay/hooks';

export const queries = {
  tournamentQueryRef: page_TournamentPageQuery,
};

function EntryCard({
  highlightFirst = true,
  ...props
}: {
  highlightFirst?: boolean;
  entry: page_EntryCard$key;
}) {
  const entry = useFragment(
    graphql`
      fragment page_EntryCard on Entry @throwOnFieldError {
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
    props.entry,
  );

  let entryName = `${entry.player?.name ?? 'Unknown Player'}`;
  if (entry.standing === 1) {
    entryName = `🥇 ${entryName}`;
  } else if (entry.standing === 2) {
    entryName = `🥈 ${entryName}`;
  } else if (entry.standing === 3) {
    entryName = `🥉 ${entryName}`;
  }

  const entryNameNode = (
    <span className="relative flex items-baseline">
      {entryName}
      {entry.player?.isKnownCheater && (
        <span className="absolute right-0 rounded-full bg-red-600 px-2 py-1 text-xs uppercase">
          Cheater
        </span>
      )}
    </span>
  );

  const bottomText = (
    <div className="flex">
      <span className="flex-1">{formatOrdinals(entry.standing)} place</span>
      <span>
        Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
      </span>
    </div>
  );

  return (
    <Card
      className={cn(
        'group',
        highlightFirst &&
          'md:first:col-span-2 lg:max-w-3xl lg:first:col-span-3 lg:first:w-full lg:first:justify-self-center',
      )}
      bottomText={bottomText}
      images={entry.commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${entry.commander.name} art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2 lg:group-first:h-40">
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
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
}

function BreakdownGroupCard({
  onClickGroup,
  ...props
}: {
  onClickGroup?: (groupName: string) => void;
  group: page_BreakdownGroupCard$key;
}) {
  const {commander, conversionRate, entries, topCuts} = useFragment(
    graphql`
      fragment page_BreakdownGroupCard on TournamentBreakdownGroup
      @throwOnFieldError {
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
    props.group,
  );

  return (
    <Card
      bottomText={
        <div className="flex flex-wrap justify-between gap-1">
          <span>Top Cuts: {topCuts}</span>
          <span>Entries: {entries}</span>
          <span>Conversion: {formatPercent(conversionRate)}</span>
        </div>
      }
      images={commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${commander.name} art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <button
          className="text-left text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
          onClick={() => {
            onClickGroup?.(commander.name);
          }}
        >
          {commander.name}
        </button>

        <ColorIdentity identity={commander.colorId} />
      </div>
    </Card>
  );
}

function TournamentBanner(props: {tournament: page_TournamentBanner$key}) {
  const tournament = useFragment(
    graphql`
      fragment page_TournamentBanner on Tournament @throwOnFieldError {
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
    props.tournament,
  );

  const bracketUrl = useMemo(() => {
    try {
      if (!tournament.bracketUrl) return null;
      return new URL(tournament.bracketUrl);
    } catch (e) {
      return null;
    }
  }, [tournament]);

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center space-y-4">
        {tournament.winner[0] != null && (
          <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
            {tournament.winner[0].commander.cards
              .flatMap((c) => c.imageUrls)
              .map((src, _i, {length}) => {
                return (
                  <img
                    className={cn(
                      'flex-1 object-cover object-top',
                      length === 2 ? 'w-1/2' : 'w-full',
                    )}
                    key={src}
                    src={src}
                    alt={`${tournament.name} winner art`}
                  />
                );
              })}
          </div>
        )}

        {bracketUrl && (
          <div className="absolute top-4 right-4 z-10 text-xs md:text-sm">
            <a
              href={bracketUrl.href}
              target="_blank"
              rel="noopener norefferer"
              className="text-white underline"
            >
              View Bracket <ArrowRightIcon className="inline h-3 w-3" />
            </a>
          </div>
        )}

        <h1 className="font-title relative text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {tournament.name}
        </h1>
        <div className="relative flex w-full max-w-(--breakpoint-md) flex-col items-center justify-evenly gap-1 text-base text-white md:flex-row md:text-lg lg:text-xl">
          <span>{format(tournament.tournamentDate, 'MMMM do yyyy')}</span>
          <span>{tournament.size} Players</span>
        </div>
      </div>
    </div>
  );
}

function useTournamentMeta(tournamentFromProps: page_TournamentMeta$key) {
  const tournament = useFragment(
    graphql`
      fragment page_TournamentMeta on Tournament @throwOnFieldError {
        name
      }
    `,
    tournamentFromProps,
  );

  return tournament;
}

export default function TournamentPage({
  queries,
}: PageProps<'/tournament/[tid]'>) {
  const {tab = 'entries', commander} = useRouteParams('/tournament/[tid]');

  const {tournament} = usePreloadedQuery(
    graphql`
      query page_TournamentPageQuery($tid: String!, $commander: String)
      @preloadable
      @throwOnFieldError {
        tournament(TID: $tid) {
          TID
          ...page_TournamentBanner
          ...page_TournamentMeta

          promo {
            ...promo_EmbededPromo
          }

          entries {
            id
            ...page_EntryCard
          }

          breakdown {
            commander {
              id
            }
            ...page_BreakdownGroupCard
          }

          breakdownEntries: entries(commander: $commander) {
            id
            ...page_EntryCard
          }
        }
      }
    `,
    queries.tournamentQueryRef,
  );

  const tournamentMeta = useTournamentMeta(tournament);

  const {replaceRoute} = useNavigation();
  const setSelectedTab = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const nextKey = (e.target as HTMLButtonElement).id;
      replaceRoute('/tournament/[tid]', {
        tid: tournament.TID,
        tab: nextKey,
        commander: null,
      });
    },
    [replaceRoute, tournament.TID],
  );

  const showStandings = tab !== 'breakdown' && tab !== 'commander';
  const showBreakdown = tab === 'breakdown';
  const showBreakdownCommander = tab === 'commander' && commander != null;

  return (
    <>
      <title>{tournamentMeta.name}</title>
      <meta
        name="description"
        content={`Top Performing cEDH decks at ${tournamentMeta.name}`}
      />
      <Navigation />
      <TournamentBanner tournament={tournament} />
      {tournament.promo && <FirstPartyPromo promo={tournament.promo} />}

      <TabList className="mx-auto max-w-(--breakpoint-md)">
        <Tab id="entries" selected={tab === 'entries'} onClick={setSelectedTab}>
          Standings
        </Tab>

        <Tab
          id="breakdown"
          selected={tab === 'breakdown'}
          onClick={setSelectedTab}
        >
          Metagame Breakdown
        </Tab>

        {commander != null && (
          <Tab id="commander" selected={tab === 'commander'}>
            {commander}
          </Tab>
        )}
      </TabList>

      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {showStandings &&
          tournament.entries != null &&
          tournament.entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}

        {showBreakdown &&
          tournament.breakdown &&
          tournament.breakdown.map((group) => (
            <BreakdownGroupCard
              key={group.commander.id}
              group={group}
              onClickGroup={(commanderName) => {
                replaceRoute('/tournament/[tid]', {
                  tid: tournament.TID,
                  tab: 'commander',
                  commander: commanderName,
                });
              }}
            />
          ))}

        {showBreakdownCommander &&
          tournament.breakdownEntries &&
          tournament.breakdownEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} highlightFirst={false} />
          ))}
      </div>

      <Footer />
    </>
  );
}
