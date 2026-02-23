import {page_EditorsNote$key} from '#genfiles/queries/page_EditorsNote.graphql';
import {page_TournamentBanner$key} from '#genfiles/queries/page_TournamentBanner.graphql';
import {page_TournamentMeta$key} from '#genfiles/queries/page_TournamentMeta.graphql';
import {page_TournamentPageShellQuery} from '#genfiles/queries/page_TournamentPageShellQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {useNavigation} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback';
import {Navigation} from '#src/components/navigation';
import {FirstPartyPromo} from '#src/components/promo';
import {Tab, TabList} from '#src/components/tabs';
import {formatPercent} from '#src/lib/client/format';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import cn from 'classnames';
import {format} from 'date-fns';
import {MouseEvent, Suspense, useCallback, useMemo} from 'react';
import {
  EntryPoint,
  EntryPointContainer,
  graphql,
  useFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {z} from 'zod/v4-mini';

function TournamentBanner(props: {tournament: page_TournamentBanner$key}) {
  const tournament = useFragment(
    graphql`
      fragment page_TournamentBanner on Tournament @throwOnFieldError {
        name
        size
        tournamentDate
        bracketUrl
        seatWinRate1
        seatWinRate2
        seatWinRate3
        seatWinRate4
        drawRate

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

        {tournament.seatWinRate1 != null &&
          tournament.seatWinRate2 != null &&
          tournament.seatWinRate3 != null &&
          tournament.seatWinRate4 != null && (
            <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
              <span className="text-white/60">Win Rate</span>
              <div className="mr-1 ml-2 border-l border-white/60 py-2">
                &nbsp;
              </div>{' '}
              Seat 1: {formatPercent(tournament.seatWinRate1)}
              <div className="mr-1 ml-2 border-l border-white/60 py-2">
                &nbsp;
              </div>{' '}
              Seat 2: {formatPercent(tournament.seatWinRate2)}
              <div className="mr-1 ml-2 border-l border-white/60 py-2">
                &nbsp;
              </div>{' '}
              Seat 3: {formatPercent(tournament.seatWinRate3)}
              <div className="mr-1 ml-2 border-l border-white/60 py-2">
                &nbsp;
              </div>{' '}
              Seat 4: {formatPercent(tournament.seatWinRate4)}
              {tournament.drawRate != null && (
                <>
                  <div className="mr-1 ml-2 border-l border-white/60 py-2">
                    &nbsp;
                  </div>{' '}
                  Draws: {formatPercent(tournament.drawRate)}
                </>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

function TournamentEditorsNote(props: {tournament: page_EditorsNote$key}) {
  const {editorsNote} = useFragment(
    graphql`
      fragment page_EditorsNote on Tournament {
        editorsNote
      }
    `,
    props.tournament,
  );

  if (!editorsNote) return null;

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-6 pt-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <span className="font-semibold">Editor's note:</span> {editorsNote}
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

export const schema = z.object({
  tid: z.string(),
  commander: z.nullish(z.string()),
  tab: z.nullish(z.string()),
});

export type Queries = {
  tournamentRef: page_TournamentPageShellQuery;
};

export type EntryPoints = {
  tournamentEntries?: EntryPoint<
    ModuleType<'/tournament/[tid]#standings'>,
    ModuleParams<'/tournament/[tid]#standings'>
  >;

  tournamentBreakdown?: EntryPoint<
    ModuleType<'/tournament/[tid]#breakdown'>,
    ModuleParams<'/tournament/[tid]#breakdown'>
  >;

  commanderBreakdown?: EntryPoint<
    ModuleType<'/tournament/[tid]#commander_breakdown'>,
    ModuleParams<'/tournament/[tid]#commander_breakdown'>
  >;
};

export type ExtraProps = {
  commanderName?: string | null;
  tab: string;
};

export const getPreloadProps: GetPreloadProps<'/tournament/[tid]'> = ({
  queries,
  variables,
  entryPoints,
}) => {
  const tab = variables.tab ?? 'entries';
  return {
    queries: {
      tournamentRef: queries.tournamentRef(variables),
    },
    extraProps: {
      commanderName: variables.commander,
      tab,
    },
    entryPoints: {
      tournamentEntries:
        tab === 'entries'
          ? entryPoints.tournamentEntries({tid: variables.tid})
          : undefined,

      tournamentBreakdown:
        tab === 'breakdown'
          ? entryPoints.tournamentBreakdown({tid: variables.tid})
          : undefined,

      commanderBreakdown:
        tab === 'commander' && variables.commander != null
          ? entryPoints.commanderBreakdown({
              tid: variables.tid,
              commander: variables.commander,
            })
          : undefined,
    },
  };
};

export default function TournamentPageShell({
  queries,
  entryPoints,
  extraProps: {commanderName, tab},
}: PastoriaPageProps<'/tournament/[tid]'>) {
  const {tournament} = usePreloadedQuery(
    graphql`
      query page_TournamentPageShellQuery($tid: String!)
      @preloadable
      @throwOnFieldError {
        tournament(TID: $tid) {
          TID
          ...page_TournamentBanner
          ...page_TournamentMeta
          ...page_EditorsNote

          promo {
            ...promo_EmbededPromo
          }

          editorsNote
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
      replaceRoute('/tournament/[tid]', {
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
      <TournamentEditorsNote tournament={tournament} />

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

      {entryPoints.tournamentEntries && (
        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.tournamentEntries}
            props={{}}
          />
        </Suspense>
      )}

      {entryPoints.tournamentBreakdown && (
        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.tournamentBreakdown}
            props={{}}
          />
        </Suspense>
      )}

      {entryPoints.commanderBreakdown && (
        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.commanderBreakdown}
            props={{}}
          />
        </Suspense>
      )}
    </>
  );
}
