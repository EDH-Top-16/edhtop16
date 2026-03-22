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
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import cn from 'classnames';
import {format} from 'date-fns';
import {MouseEvent, Suspense, useCallback, useMemo, useState} from 'react';
import {
  EntryPoint,
  EntryPointContainer,
  graphql,
  useFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {z} from 'zod/v4-mini';

type SeatWinRateRow = {
  readonly seat1: number | null | undefined;
  readonly seat2: number | null | undefined;
  readonly seat3: number | null | undefined;
  readonly seat4: number | null | undefined;
  readonly drawRate: number | null | undefined;
};

function SeatWinRateRowCollapsed(props: {rates: SeatWinRateRow}) {
  const {rates} = props;
  if (
    rates.seat1 == null ||
    rates.seat2 == null ||
    rates.seat3 == null ||
    rates.seat4 == null
  ) {
    return null;
  }

  return (
    <div className="flex flex-1 items-stretch px-2 text-center text-xs whitespace-nowrap text-white sm:px-3 sm:text-sm">
      <span className="flex items-center py-2 text-white/60">Win Rate</span>
      <div className="mx-1.5 border-l border-white/60 sm:mx-2"> </div>
      <span className="flex items-center py-2">
        S1: {formatPercent(rates.seat1)}
      </span>
      <div className="mx-1.5 border-l border-white/60 sm:mx-2"> </div>
      <span className="flex items-center py-2">
        S2: {formatPercent(rates.seat2)}
      </span>
      <div className="mx-1.5 border-l border-white/60 sm:mx-2"> </div>
      <span className="flex items-center py-2">
        S3: {formatPercent(rates.seat3)}
      </span>
      <div className="mx-1.5 border-l border-white/60 sm:mx-2"> </div>
      <span className="flex items-center py-2">
        S4: {formatPercent(rates.seat4)}
      </span>
      {rates.drawRate != null && (
        <>
          <div className="mx-1.5 border-l border-white/60 sm:mx-2"> </div>
          <span className="flex items-center py-2">
            Draw: {formatPercent(rates.drawRate)}
          </span>
        </>
      )}
    </div>
  );
}

function SeatWinRateTableRow(props: {
  label: string;
  rates: SeatWinRateRow;
  hasDraws: boolean;
}) {
  const {label, rates, hasDraws} = props;
  if (
    rates.seat1 == null ||
    rates.seat2 == null ||
    rates.seat3 == null ||
    rates.seat4 == null
  ) {
    return null;
  }

  return (
    <div className="flex items-center text-center text-xs text-white sm:text-sm">
      <span className="w-18 shrink-0 px-1 text-white/60 sm:w-20 md:w-24">
        {label}
      </span>
      <span className="min-w-14 flex-1 border-l border-white/30 py-1.5 md:px-3">
        {formatPercent(rates.seat1)}
      </span>
      <span className="min-w-14 flex-1 border-l border-white/30 py-1.5 md:px-3">
        {formatPercent(rates.seat2)}
      </span>
      <span className="min-w-14 flex-1 border-l border-white/30 py-1.5 md:px-3">
        {formatPercent(rates.seat3)}
      </span>
      <span className="min-w-14 flex-1 border-l border-white/30 py-1.5 md:px-3">
        {formatPercent(rates.seat4)}
      </span>
      {hasDraws && (
        <span className="min-w-14 flex-1 border-l border-white/30 py-1.5 md:px-3">
          {rates.drawRate != null ? formatPercent(rates.drawRate) : '-'}
        </span>
      )}
    </div>
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
        topCut
        seatWinRatesByPhase {
          all {
            seat1
            seat2
            seat3
            seat4
            drawRate
          }
          swiss {
            seat1
            seat2
            seat3
            seat4
            drawRate
          }
          topCut {
            seat1
            seat2
            seat3
            seat4
            drawRate
          }
          finals {
            seat1
            seat2
            seat3
            seat4
            drawRate
          }
        }
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

  const [expanded, setExpanded] = useState(false);

  const allRates = tournament.seatWinRatesByPhase.all;
  const hasSeatData =
    allRates.seat1 != null &&
    allRates.seat2 != null &&
    allRates.seat3 != null &&
    allRates.seat4 != null;

  return (
    <div className="min-h-64 w-full bg-black/60 md:min-h-80">
      <div className="relative mx-auto flex min-h-64 w-full max-w-(--breakpoint-xl) flex-col items-center pb-0 md:min-h-80">
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

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <h1 className="font-title text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
            {tournament.name}
          </h1>
          <div className="mt-2 flex w-full max-w-(--breakpoint-md) flex-col items-center justify-evenly gap-1 text-base text-white md:flex-row md:text-lg lg:text-xl">
            <span>{format(tournament.tournamentDate, 'MMMM do yyyy')}</span>
            <span>{tournament.size} Players</span>
          </div>
        </div>

        {hasSeatData && (
          <div className="relative z-10 mt-auto w-full border-t border-white/60 bg-black/50 text-white sm:mt-6 sm:mb-3 sm:w-auto sm:rounded-lg sm:border">
            <div className="flex items-center">
              {expanded ? (
                <div className="flex flex-1 flex-col divide-y divide-white/30">
                  <div className="flex items-center text-center text-xs text-white/50">
                    <span className="w-18 shrink-0 sm:w-20 md:w-24"> </span>
                    <span className="min-w-14 flex-1 border-l border-white/30 py-1 md:px-3">
                      S1
                    </span>
                    <span className="min-w-14 flex-1 border-l border-white/30 py-1 md:px-3">
                      S2
                    </span>
                    <span className="min-w-14 flex-1 border-l border-white/30 py-1 md:px-3">
                      S3
                    </span>
                    <span className="min-w-14 flex-1 border-l border-white/30 py-1 md:px-3">
                      S4
                    </span>
                    {allRates.drawRate != null && (
                      <span className="min-w-14 flex-1 border-l border-white/30 py-1 md:px-3">
                        Draw
                      </span>
                    )}
                  </div>
                  <SeatWinRateTableRow
                    label="All Rounds"
                    rates={allRates}
                    hasDraws={allRates.drawRate != null}
                  />
                  <SeatWinRateTableRow
                    label="Swiss Only"
                    rates={tournament.seatWinRatesByPhase.swiss}
                    hasDraws={allRates.drawRate != null}
                  />
                  <SeatWinRateTableRow
                    label={`Top Cut (${tournament.topCut})`}
                    rates={tournament.seatWinRatesByPhase.topCut}
                    hasDraws={allRates.drawRate != null}
                  />
                  <SeatWinRateTableRow
                    label="Top 4"
                    rates={tournament.seatWinRatesByPhase.finals}
                    hasDraws={allRates.drawRate != null}
                  />
                </div>
              ) : (
                <SeatWinRateRowCollapsed rates={allRates} />
              )}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="shrink-0 cursor-pointer self-stretch border-l border-white/60 px-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    expanded && 'rotate-180',
                  )}
                />
              </button>
            </div>
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
