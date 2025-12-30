import {tournamentView_BreakdownGroupCard$key} from '#genfiles/queries/tournamentView_BreakdownGroupCard.graphql';
import {tournamentView_EntryCard$key} from '#genfiles/queries/tournamentView_EntryCard.graphql';
import {tournamentView_EntryCard_tournament$key} from '#genfiles/queries/tournamentView_EntryCard_tournament.graphql';
import {tournamentView_TournamentBanner$key} from '#genfiles/queries/tournamentView_TournamentBanner.graphql';
import {tournamentView_TournamentMeta$key} from '#genfiles/queries/tournamentView_TournamentMeta.graphql';
import {tournamentView_TournamentPageShellQuery} from '#genfiles/queries/tournamentView_TournamentPageShellQuery.graphql.js';
import {tournamentView_TournamentQuery} from '#genfiles/queries/tournamentView_TournamentQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {Link, useNavigation} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback.jsx';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import cn from 'classnames';
import {format} from 'date-fns';
import {MouseEvent, Suspense, useCallback, useMemo} from 'react';
import {
  EntryPoint,
  EntryPointComponent,
  EntryPointContainer,
  useFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {graphql} from 'relay-runtime';
import {ColorIdentity} from './assets/icons/colors';
import {Card} from './components/card';
import {Footer} from './components/footer';
import {Navigation} from './components/navigation';
import {FirstPartyPromo} from './components/promo';
import {Tab, TabList} from './components/tabs';
import {formatOrdinals, formatPercent} from './lib/client/format';
import {Layers, Users2} from 'lucide-react';

function EntryCard({
  highlightFirst = true,
  ...props
}: {
  highlightFirst?: boolean;
  entry: tournamentView_EntryCard$key;
  tournament: tournamentView_EntryCard_tournament$key;
}) {
  const entry = useFragment(
    graphql`
      fragment tournamentView_EntryCard on Entry @throwOnFieldError {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
          isKnownCheater
          offersCoaching
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

  const tournament = useFragment(
    graphql`
      fragment tournamentView_EntryCard_tournament on Tournament
      @throwOnFieldError {
        size
      }
    `,
    props.tournament,
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
    <span className="relative flex items-baseline justify-between">
      {entryName}
      {entry.player?.isKnownCheater && (
        <span className="absolute right-0 rounded-full bg-red-600 px-2 py-1 text-xs uppercase">
          Cheater
        </span>
      )}
    </span>
  );

  return (
    <Card
      className={cn(
        'group',
        highlightFirst &&
          'md:first:col-span-2 lg:max-w-3xl lg:first:col-span-3 lg:first:w-full lg:first:justify-self-center',
      )}
      hoverEffect={false}
      images={entry.commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${entry.commander.name} art`,
        }))}
    >
      <div className="flex h-full flex-col justify-between gap-2 lg:group-first:h-48">
        <div className="flex flex-col">
          <div className="items-flex-startr flex justify-between gap-2">
            <span className="text-xl font-semibold">{entryNameNode}</span>
            {entry.decklist && entry.commander.name && (
              <a
                href={entry.decklist}
                target="_blank"
                className="flex h-fit flex-shrink-0 items-center gap-1 rounded border border-white/40 px-2 py-1 text-sm font-medium transition-colors hover:bg-white/20"
              >
                <img
                  src={'https://topdeck.gg/img/logo/TopDeckNoBorder.png'}
                  alt="View decklist on TopDeck.gg"
                  className="h-4 w-4"
                />
                Decklist
              </a>
            )}
          </div>
          <div className="space-x-1">
            {entry.player?.isKnownCheater && (
              <span className="w-fit rounded-sm border border-white/30 bg-red-600 px-1 py-0.5 text-xs font-semibold">
                Cheater
              </span>
            )}
            {/* TODO(@ryan): conditional here for team */}
            <span className="w-fit rounded-sm border border-white/30 bg-[#9593C8] px-1 py-0.5 text-xs font-semibold">
              C4BL<span className="font-normal opacity-60">#1</span>
            </span>
            {/* TODO(@ryan): conditional here for coach */}
            {!entry.player?.isKnownCheater && (
              <span className="w-fit rounded-sm border border-white/30 bg-[#5E96F6] px-1 py-0.5 text-xs font-semibold">
                Offers coaching
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2 text-base md:text-sm">
            <div className="mt-[3px]">
              <Users2 className="h-4 w-4 text-white/50" />
            </div>
            <span className="text-white/80">
              #{entry.standing} of {tournament.size} players
            </span>
          </div>
          <div className="flex items-start gap-2 text-base md:text-sm">
            <div className="mt-[3px]">
              <Layers className="h-4 w-4 text-white/50" />
            </div>
            {entry.commander.name ? (
              <Link
                href={entry.commander.breakdownUrl}
                className="text-white/80 underline decoration-transparent transition-colors hover:decoration-inherit"
              >
                {entry.commander.name}
              </Link>
            ) : (
              <span className="text-muted-foreground">Unknown commander</span>
            )}
          </div>
        </div>
        <div className="mt-2 flex justify-around gap-2 justify-self-end rounded-xl bg-black/45 px-8 py-2">
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium">{entry.wins}</span>
            <span className="text-muted-foreground text-sm tracking-wider uppercase">
              Wins
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium">{entry.losses}</span>
            <span className="text-muted-foreground text-sm tracking-wider uppercase">
              Losses
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium">{entry.draws}</span>
            <span className="text-muted-foreground text-sm tracking-wider uppercase">
              Draws
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BreakdownGroupCard({
  onClickGroup,
  ...props
}: {
  onClickGroup?: (groupName: string) => void;
  group: tournamentView_BreakdownGroupCard$key;
}) {
  const {commander, conversionRate, entries, topCuts} = useFragment(
    graphql`
      fragment tournamentView_BreakdownGroupCard on TournamentBreakdownGroup
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

function TournamentBanner(props: {
  tournament: tournamentView_TournamentBanner$key;
}) {
  const tournament = useFragment(
    graphql`
      fragment tournamentView_TournamentBanner on Tournament
      @throwOnFieldError {
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

function useTournamentMeta(
  tournamentFromProps: tournamentView_TournamentMeta$key,
) {
  const tournament = useFragment(
    graphql`
      fragment tournamentView_TournamentMeta on Tournament @throwOnFieldError {
        name
      }
    `,
    tournamentFromProps,
  );

  return tournament;
}

/** @resource m#tournament_page_shell */
export const TournamentPageShell: EntryPointComponent<
  {tournamentRef: tournamentView_TournamentPageShellQuery},
  {tournamentContent: EntryPoint<ModuleType<'m#tournament_view'>>},
  {},
  {tab: string; commanderName?: string | null}
> = ({queries, entryPoints, extraProps: {tab, commanderName}}) => {
  const {tournament} = usePreloadedQuery(
    graphql`
      query tournamentView_TournamentPageShellQuery($tid: String!)
      @preloadable
      @throwOnFieldError {
        tournament(TID: $tid) {
          TID
          ...tournamentView_TournamentBanner
          ...tournamentView_TournamentMeta

          promo {
            ...promo_EmbededPromo
          }
        }
      }
    `,
    queries.tournamentRef,
  );

  const tournamentMeta = useTournamentMeta(tournament);

  const {replaceRoute} = useNavigation();
  const setSelectedTab = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const nextKey = (e.target as HTMLButtonElement).id;
      replaceRoute('/tournament/:tid', {
        tid: tournament.TID,
        tab: nextKey,
        commander: null,
      });
    },
    [replaceRoute, tournament.TID],
  );

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

        {commanderName != null && (
          <Tab id="commander" selected={tab === 'commander'}>
            {commanderName}
          </Tab>
        )}
      </TabList>

      <Suspense fallback={<LoadingIcon />}>
        <EntryPointContainer
          entryPointReference={entryPoints.tournamentContent}
          props={{}}
        />
      </Suspense>
    </>
  );
};

/** @resource m#tournament_view */
export const TournamentViewPage: EntryPointComponent<
  {tournamentQueryRef: tournamentView_TournamentQuery},
  {}
> = ({queries}) => {
  const {tournament} = usePreloadedQuery(
    graphql`
      query tournamentView_TournamentQuery(
        $TID: String!
        $commander: String
        $showStandings: Boolean!
        $showBreakdown: Boolean!
        $showBreakdownCommander: Boolean!
      ) @preloadable @throwOnFieldError {
        tournament(TID: $TID) {
          ...tournamentView_EntryCard_tournament

          entries @include(if: $showStandings) {
            id
            ...tournamentView_EntryCard
          }

          breakdown @include(if: $showBreakdown) {
            commander {
              id
            }

            ...tournamentView_BreakdownGroupCard
          }

          breakdownEntries: entries(commander: $commander)
            @include(if: $showBreakdownCommander) {
            id
            ...tournamentView_EntryCard
          }
        }
      }
    `,
    queries.tournamentQueryRef,
  );

  const {replaceRoute} = useNavigation();

  const top4Entries = tournament.entries?.slice(0, 4) ?? [];
  const remainingEntries = tournament.entries?.slice(4) ?? [];

  return (
    <>
      {queries.tournamentQueryRef.variables.showStandings &&
        tournament.entries != null && (
          <div className="mx-auto w-full max-w-(--breakpoint-xl) space-y-4 px-2 py-6">
            {/* Top 4 in 2x2 grid */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {top4Entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  tournament={tournament}
                  highlightFirst={false}
                />
              ))}
            </div>
            {/* Remaining entries in 3-column grid */}
            {remainingEntries.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {remainingEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    tournament={tournament}
                    highlightFirst={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 px-2 py-6 md:grid-cols-2 lg:grid-cols-3">
        {queries.tournamentQueryRef.variables.showBreakdown &&
          tournament.breakdown &&
          tournament.breakdown.map((group) => (
            <BreakdownGroupCard
              key={group.commander.id}
              group={group}
              onClickGroup={(commanderName) => {
                replaceRoute('/tournament/:tid', {
                  tid: queries.tournamentQueryRef.variables.TID,
                  tab: 'commander',
                  commander: commanderName,
                });
              }}
            />
          ))}

        {queries.tournamentQueryRef.variables.showBreakdownCommander &&
          tournament.breakdownEntries &&
          tournament.breakdownEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              tournament={tournament}
              highlightFirst={false}
            />
          ))}
      </div>

      <Footer />
    </>
  );
};
