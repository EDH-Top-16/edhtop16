import {page_CommanderBanner$key} from '#genfiles/queries/page_CommanderBanner.graphql';
import {page_CommanderMeta$key} from '#genfiles/queries/page_CommanderMeta.graphql';
import {page_CommanderShellQuery} from '#genfiles/queries/page_CommanderShellQuery.graphql';
import {page_CommanderStatsQuery} from '#genfiles/queries/page_CommanderStatsQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource';
import {useNavigation} from '#genfiles/router/router';
import {ColorIdentity} from '#src/assets/icons/colors';
import {LoadingIcon} from '#src/components/fallback';
import {Navigation} from '#src/components/navigation';
import {NitroAd} from '#src/components/nitro_ad';
import {FirstPartyPromo} from '#src/components/promo';
import {Select} from '#src/components/select';
import {Tab, TabList} from '#src/components/tabs';
import {formatPercent} from '#src/lib/client/format';
import cn from 'classnames';
import {PropsWithChildren, Suspense} from 'react';
import {
  EntryPoint,
  EntryPointContainer,
  graphql,
  PreloadedQuery,
  useFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {z} from 'zod/v4-mini';

function CommanderStats({
  statsQueryRef,
}: {
  statsQueryRef: PreloadedQuery<page_CommanderStatsQuery>;
}) {
  const {commander} = usePreloadedQuery(
    graphql`
      query page_CommanderStatsQuery(
        $commander: String!
        $timePeriod: TimePeriod!
        $minEventSize: Int!
      ) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          stats(filters: {timePeriod: $timePeriod, minSize: $minEventSize}) {
            conversionRate
            metaShare
            count
          }
        }
      }
    `,
    statsQueryRef,
  );

  return (
    <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
      {commander.stats.count} Entries
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(commander.stats.metaShare)} Meta%
      <div className="mr-1 ml-2 border-l border-white/60 py-2">&nbsp;</div>{' '}
      {formatPercent(commander.stats.conversionRate)} Conversion
    </div>
  );
}

function CommanderBanner({
  children,
  ...props
}: PropsWithChildren<{commander: page_CommanderBanner$key}>) {
  const commander = useFragment(
    graphql`
      fragment page_CommanderBanner on Commander @throwOnFieldError {
        name
        colorId
        cards {
          imageUrls
        }
      }
    `,
    props.commander,
  );

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center">
        <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
          {commander.cards
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
                  alt={`${commander.name} art`}
                />
              );
            })}
        </div>

        <h1 className="font-title relative m-0 mb-4 text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
        </h1>

        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>

        {children}
      </div>
    </div>
  );
}

function useCommanderMeta(commanderFromProps: page_CommanderMeta$key) {
  const commander = useFragment(
    graphql`
      fragment page_CommanderMeta on Commander @throwOnFieldError {
        name
      }
    `,
    commanderFromProps,
  );

  return commander;
}

export type Queries = {
  commanderShell: page_CommanderShellQuery;
  commanderStats: page_CommanderStatsQuery;
};

export type EntryPoints = {
  entries?: EntryPoint<
    ModuleType<'/commander/[commander]#entries'>,
    ModuleParams<'/commander/[commander]#entries'>
  >;

  staples?: EntryPoint<
    ModuleType<'/commander/[commander]#staples'>,
    ModuleParams<'/commander/[commander]#staples'>
  >;

  stapleDetails?: EntryPoint<
    ModuleType<'/commander/[commander]#staple_details'>,
    ModuleParams<'/commander/[commander]#staple_details'>
  >;
};

export type ExtraProps = {
  tab: string;
  cardName?: string | null;
  maxStanding?: number;
  minEventSize: number;
  sortBy: 'TOP' | 'NEW';
  timePeriod:
    | 'ALL_TIME'
    | 'ONE_MONTH'
    | 'ONE_YEAR'
    | 'POST_BAN'
    | 'SIX_MONTHS'
    | 'THREE_MONTHS';
};

export const schema = z.object({
  commander: z.pipe(z.string(), z.transform(decodeURIComponent)),
  tab: z.nullish(z.string()),
  card: z.nullish(z.string()),
  sortBy: z.nullish(z.string()),
  timePeriod: z.nullish(z.string()),
  maxStanding: z.nullish(z.coerce.number()),
  minEventSize: z.nullish(z.coerce.number()),
});

export const getPreloadProps: GetPreloadProps<'/commander/[commander]'> = ({
  queries,
  entryPoints,
  variables,
}) => {
  const tab = variables.tab ?? 'entries';
  const commander = variables.commander;
  const maxStanding = variables.maxStanding ?? undefined;
  const minEventSize = variables.minEventSize ?? 50;
  const sortBy = (variables.sortBy ?? 'TOP') as 'NEW' | 'TOP';
  const timePeriod = (variables.timePeriod ?? 'ONE_YEAR') as
    | 'ALL_TIME'
    | 'ONE_MONTH'
    | 'ONE_YEAR'
    | 'POST_BAN'
    | 'SIX_MONTHS'
    | 'THREE_MONTHS';

  return {
    queries: {
      commanderShell: queries.commanderShell({commander}),
      commanderStats: queries.commanderStats({
        commander,
        minEventSize,
        timePeriod,
      }),
    },
    entryPoints: {
      entries:
        tab === 'entries'
          ? entryPoints.entries({
              commander,
              maxStanding,
              minEventSize,
              sortBy,
              timePeriod,
            })
          : undefined,

      staples: tab === 'staples' ? entryPoints.staples({commander}) : undefined,

      stapleDetails:
        tab === 'card' && variables.card != null
          ? entryPoints.stapleDetails({commander, cardName: variables.card})
          : undefined,
    },
    extraProps: {
      tab,
      cardName: variables.card,
      minEventSize,
      sortBy,
      timePeriod,
      maxStanding,
    },
  } as const;
};

export default function CommanderPageShell({
  queries,
  entryPoints,
  extraProps: {tab, cardName, minEventSize, sortBy, timePeriod, maxStanding},
}: PastoriaPageProps<'/commander/[commander]'>) {
  const {commander, viewer} = usePreloadedQuery(
    graphql`
      query page_CommanderShellQuery($commander: String!)
      @preloadable
      @throwOnFieldError {
        viewer {
          hideAds
        }

        commander(name: $commander) @required(action: THROW) {
          name
          breakdownUrl
          ...page_CommanderBanner
          ...page_CommanderMeta

          promo {
            ...promo_EmbededPromo
          }
        }
      }
    `,
    queries.commanderShell,
  );

  const commanderMeta = useCommanderMeta(commander);
  const {pushRoute, replaceRoute} = useNavigation();

  return (
    <>
      <title>{commanderMeta.name}</title>
      <meta
        name="description"
        content={`Top Performing and Recent Decklists for ${commanderMeta.name} in cEDH`}
      />

      <Navigation />

      <CommanderBanner commander={commander}>
        <Suspense fallback={null}>
          <CommanderStats statsQueryRef={queries.commanderStats} />
        </Suspense>
      </CommanderBanner>

      {commander.promo && <FirstPartyPromo promo={commander.promo} />}

      {!viewer?.hideAds && (
        <div className="mx-auto flex max-w-full items-center justify-center overflow-hidden py-4">
          <NitroAd
            id="nitro-commander-top"
            className="h-[50px] w-full lg:h-[90px]"
            sizes={[
              ['728', '90'],
              ['320', '50'],
            ]}
            options={{
              report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right',
              },
            }}
          />
        </div>
      )}

      <TabList
        className="mx-auto max-w-(--breakpoint-md)"
        border={tab === 'staples' || tab === 'card'}
      >
        <Tab
          selected={tab === 'entries' || !tab}
          onClick={() => {
            pushRoute('/commander/[commander]', {
              commander: commander.name,
              tab: 'entries',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              // Explicitly clear card parameter
              card: undefined,
            });
          }}
        >
          Tournament Entries
        </Tab>

        <Tab
          selected={tab === 'staples'}
          onClick={() => {
            pushRoute('/commander/[commander]', {
              commander: commander.name,
              tab: 'staples',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              // Explicitly clear card parameter
              card: undefined,
            });
          }}
        >
          Staples
        </Tab>

        {cardName && tab === 'card' && (
          <Tab
            selected={tab === 'card'}
            onClick={() => {
              pushRoute('/commander/[commander]', {
                commander: commander.name,
                tab: 'card',
                card: cardName,
                sortBy,
                timePeriod,
                maxStanding,
                minEventSize,
              });
            }}
          >
            {cardName}
          </Tab>
        )}
      </TabList>

      {tab === 'entries' && (
        <div className="mx-auto grid max-w-(--breakpoint-md) grid-cols-2 gap-4 border-b border-white/40 p-6 text-center text-black sm:flex sm:flex-wrap sm:justify-center">
          <Select
            id="commander-sort-by"
            label="Sort By"
            value={sortBy}
            onChange={(e) => {
              replaceRoute('/commander/[commander]', {
                commander: commander.name,
                sortBy: e,
              });
            }}
          >
            <option value="TOP">Top Performing</option>
            <option value="NEW">Recent</option>
          </Select>

          <Select
            id="commanders-time-period"
            label="Time Period"
            value={timePeriod}
            onChange={(e) => {
              replaceRoute('/commander/[commander]', {
                commander: commander.name,
                timePeriod: e,
              });
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
            id="commander-event-size"
            label="Event Size"
            value={`${minEventSize}`}
            onChange={(e) => {
              replaceRoute('/commander/[commander]', {
                commander: commander.name,
                minEventSize: Number(e),
              });
            }}
          >
            <option value="0">All Events</option>
            <option value="16">16+ Players</option>
            <option value="30">30+ Players</option>
            <option value="50">50+ Players</option>
            <option value="100">100+ Players</option>
            <option value="250">250+ Players</option>
          </Select>

          <Select
            id="commander-event-size"
            label="Standing"
            value={`${maxStanding}`}
            onChange={(e) => {
              replaceRoute('/commander/[commander]', {
                commander: commander.name,
                maxStanding: e == '' ? undefined : Number(e),
              });
            }}
          >
            <option value="">All Players</option>
            <option value="16">Top 16</option>
            <option value="4">Top 4</option>
            <option value="1">Winner</option>
          </Select>
        </div>
      )}

      {entryPoints.entries && (
        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.entries}
            props={{}}
          />
        </Suspense>
      )}

      {entryPoints.staples && (
        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.staples}
            props={{}}
          />
        </Suspense>
      )}

      {entryPoints.stapleDetails && (
        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.stapleDetails}
            props={{sortBy}}
          />
        </Suspense>
      )}
    </>
  );
}
