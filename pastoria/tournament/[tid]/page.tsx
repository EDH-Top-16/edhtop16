import {page_EditorsNote$key} from '#genfiles/queries/page_EditorsNote.graphql';
import {page_SeatWinRates$key} from '#genfiles/queries/page_SeatWinRates.graphql';
import {page_SeatWinRatesByPhaseQuery} from '#genfiles/queries/page_SeatWinRatesByPhaseQuery.graphql';
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
  useLazyLoadQuery,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {z} from 'zod/v4-mini';

const SeatWinRatesFragment = graphql`
  fragment page_SeatWinRates on SeatWinRates {
    seat1
    seat2
    seat3
    seat4
    drawRate
  }
`;

function useSeatWinRates(ratesRef: page_SeatWinRates$key) {
  return useFragment(SeatWinRatesFragment, ratesRef);
}

function SeatWinRateTableRow(props: {
  label: string;
  rates: page_SeatWinRates$key;
  hasDraws: boolean;
}) {
  const {label, hasDraws} = props;
  const rates = useSeatWinRates(props.rates);
  if (
    rates.seat1 == null ||
    rates.seat2 == null ||
    rates.seat3 == null ||
    rates.seat4 == null
  ) {
    return null;
  }

  const values: (number | null | undefined)[] = [
    rates.seat1,
    rates.seat2,
    rates.seat3,
    rates.seat4,
  ];
  if (hasDraws) {
    values.push(rates.drawRate ?? null);
  }

  return (
    <div className="flex items-center text-center text-xs text-white sm:text-sm">
      <span className="w-18 shrink-0 px-1 text-white/60 sm:w-20 md:w-24">
        {label}
      </span>
      {values.map((value, i) => (
        <span
          key={i}
          className={cn(
            'min-w-14 flex-1 border-l border-white/30 py-1.5 md:px-3',
            value === 0 && 'text-white/30',
          )}
        >
          {value != null ? formatPercent(value) : '-'}
        </span>
      ))}
    </div>
  );
}

function SeatWinRateExpandedTable(props: {tid: string; hasDraws: boolean}) {
  const {tid, hasDraws} = props;
  const {tournament} = useLazyLoadQuery<page_SeatWinRatesByPhaseQuery>(
    graphql`
      query page_SeatWinRatesByPhaseQuery($tid: String!) @throwOnFieldError {
        tournament(TID: $tid) {
          topCut
          seatWinRatesByPhase {
            all {
              ...page_SeatWinRates
            }
            swiss {
              ...page_SeatWinRates
            }
            topCut {
              ...page_SeatWinRates
            }
            finals {
              ...page_SeatWinRates
            }
          }
        }
      }
    `,
    {tid},
  );

  const phases = tournament.seatWinRatesByPhase;

  return (
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
        {hasDraws && (
          <span className="min-w-14 flex-1 border-l border-white/30 py-1 md:px-3">
            Draw
          </span>
        )}
      </div>
      <SeatWinRateTableRow
        label="All Rounds"
        rates={phases.all}
        hasDraws={hasDraws}
      />
      <SeatWinRateTableRow
        label="Swiss"
        rates={phases.swiss}
        hasDraws={hasDraws}
      />
      <SeatWinRateTableRow
        label={`Top Cut (${tournament.topCut})`}
        rates={phases.topCut}
        hasDraws={hasDraws}
      />
      <SeatWinRateTableRow
        label="Top 4"
        rates={phases.finals}
        hasDraws={hasDraws}
      />
    </div>
  );
}

function TournamentBanner(props: {tournament: page_TournamentBanner$key}) {
  const tournament = useFragment(
    graphql`
      fragment page_TournamentBanner on Tournament @throwOnFieldError {
        TID
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

  const [expanded, setExpanded] = useState(false);

  const hasSeatData =
    tournament.seatWinRate1 != null &&
    tournament.seatWinRate2 != null &&
    tournament.seatWinRate3 != null &&
    tournament.seatWinRate4 != null;

  return (
    <div
      className={cn(
        'w-full bg-black/60',
        expanded ? 'h-96 md:h-[28rem]' : 'h-64 md:h-80',
      )}
    >
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

        {hasSeatData && (
          <div className="absolute bottom-0 z-10 mx-auto flex w-full flex-col items-stretch bg-black/50 text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border sm:border-white/60">
            <div className="flex items-center border-t border-white/60 sm:border-t-0">
              {expanded ? (
                <Suspense
                  fallback={
                    <LoadingIcon padding={false} className="px-16 py-6" />
                  }
                >
                  <SeatWinRateExpandedTable
                    tid={tournament.TID}
                    hasDraws={tournament.drawRate != null}
                  />
                </Suspense>
              ) : (
                <div className="flex flex-1 items-center justify-around px-3 text-center text-sm">
                  <span className="text-white/60">Win Rate</span>
                  <div className="mr-1 ml-2 border-l border-white/60 py-2">
                    &nbsp;
                  </div>{' '}
                  Seat 1: {formatPercent(tournament.seatWinRate1!)}
                  <div className="mr-1 ml-2 border-l border-white/60 py-2">
                    &nbsp;
                  </div>{' '}
                  Seat 2: {formatPercent(tournament.seatWinRate2!)}
                  <div className="mr-1 ml-2 border-l border-white/60 py-2">
                    &nbsp;
                  </div>{' '}
                  Seat 3: {formatPercent(tournament.seatWinRate3!)}
                  <div className="mr-1 ml-2 border-l border-white/60 py-2">
                    &nbsp;
                  </div>{' '}
                  Seat 4: {formatPercent(tournament.seatWinRate4!)}
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
