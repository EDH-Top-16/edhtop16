import cn from "classnames";
import { format } from "date-fns";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { PropsWithChildren, Suspense, useCallback, useMemo } from "react";
import {
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { graphql } from "relay-runtime";
import { ColorIdentity } from "../../../assets/icons/colors";
import { Card } from "../../../components/card";
import { Edhtop16Fallback, LoadingIcon } from "../../../components/fallback";
import { Footer } from "../../../components/footer";
import { LoadMoreButton } from "../../../components/load_more";
import { Navigation } from "../../../components/navigation";
import { Select } from "../../../components/select";
import { formatOrdinals, formatPercent } from "../../../lib/client/format";
import { getClientEnvironment } from "../../../lib/client/relay_client_environment";
import { Commander_CommanderBanner$key } from "../../../queries/__generated__/Commander_CommanderBanner.graphql";
import { Commander_CommanderMeta$key } from "../../../queries/__generated__/Commander_CommanderMeta.graphql";
import { Commander_CommanderPageFallbackQuery } from "../../../queries/__generated__/Commander_CommanderPageFallbackQuery.graphql";
import { Commander_CommanderPageShell$key } from "../../../queries/__generated__/Commander_CommanderPageShell.graphql";
import { Commander_CommanderPromo$key } from "../../../queries/__generated__/Commander_CommanderPromo.graphql";
import {
  Commander_CommanderQuery,
  EntriesSortBy,
  TimePeriod,
} from "../../../queries/__generated__/Commander_CommanderQuery.graphql";
import { Commander_entries$key } from "../../../queries/__generated__/Commander_entries.graphql";
import { Commander_EntryCard$key } from "../../../queries/__generated__/Commander_EntryCard.graphql";
import { CommanderEntriesQuery } from "../../../queries/__generated__/CommanderEntriesQuery.graphql";

function EntryCard(props: { entry: Commander_EntryCard$key }) {
  const entry = useFragment(
    graphql`
      fragment Commander_EntryCard on Entry {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
        }

        tournament {
          name
          size
          tournamentDate
          TID
        }
      }
    `,
    props.entry,
  );

  let entryName = `${entry.player?.name ?? "Unknown Player"}`;
  if (entry.standing === 1) {
    entryName = `🥇 ${entryName}`;
  } else if (entry.standing <= 4) {
    entryName = `🥈 ${entryName}`;
  } else if (entry.standing <= 16) {
    entryName = `🥉 ${entryName}`;
  }

  const bottomText = (
    <div className="flex">
      <span className="flex-1">
        {formatOrdinals(entry.standing)}&nbsp;/&nbsp;
        {entry.tournament.size} players
      </span>

      <span>
        Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
      </span>
    </div>
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
            {entryName}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryName}</span>
        )}

        <a
          href={`/tournament/${entry.tournament.TID}`}
          className="line-clamp-2 pt-2 underline decoration-transparent transition-colors hover:decoration-inherit"
        >
          {entry.tournament.name}
        </a>
        <span className="line-clamp-1 text-sm opacity-70">
          {format(entry.tournament.tournamentDate, "MMMM do yyyy")}
        </span>
      </div>
    </Card>
  );
}

function CommanderBanner(props: { commander: Commander_CommanderBanner$key }) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderBanner on Commander {
        name
        colorId
        cards {
          imageUrls
        }

        stats(filters: { timePeriod: $timePeriod, minSize: $minEventSize }) {
          conversionRate
          metaShare
          count
        }
      }
    `,
    props.commander,
  );

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-screen-xl flex-col items-center justify-center">
        <div className="absolute left-0 top-0 flex h-full w-full brightness-[40%]">
          {commander.cards
            .flatMap((c) => c.imageUrls)
            .map((src, _i, { length }) => {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={cn(
                    "flex-1 object-cover object-top",
                    length === 2 ? "w-1/2" : "w-full",
                  )}
                  key={src}
                  src={src}
                  alt={`${commander.name} art`}
                />
              );
            })}
        </div>

        <h1 className="relative m-0 mb-4 text-center font-title text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
        </h1>

        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>

        <div className="absolute bottom-0 z-10 mx-auto flex w-full items-center justify-around border-t border-white/60 bg-black/50 px-3 text-center text-sm text-white sm:bottom-3 sm:w-auto sm:rounded-lg sm:border">
          {commander.stats.count} Entries
          <div className="ml-2 mr-1 border-l border-white/60 py-2">
            &nbsp;
          </div>{" "}
          {formatPercent(commander.stats.metaShare)} Meta%
          <div className="ml-2 mr-1 border-l border-white/60 py-2">
            &nbsp;
          </div>{" "}
          {formatPercent(commander.stats.conversionRate)} Conversion
        </div>
      </div>
    </div>
  );
}

function CommanderPromo(props: { promo: Commander_CommanderPromo$key }) {
  const promo = useFragment(
    graphql`
      fragment Commander_CommanderPromo on CommanderPromo {
        title
        description
        buttonText
        backgroundImageUrl
        imageUrl
        href
      }
    `,
    props.promo,
  );

  return (
    <div className="relative mx-auto my-4 w-full max-w-screen-lg overflow-hidden rounded-none bg-cover bg-center md:w-4/5 md:rounded-md lg:w-3/4">
      <div className="absolute left-0 top-0 flex h-full w-full brightness-[40%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="promo"
          className={"w-full flex-1 object-cover object-center"}
          src={promo.backgroundImageUrl}
        />
      </div>

      <div className="absolute inset-0 bg-black/40"></div>
      <a
        href={promo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 block px-4 py-3 md:p-6"
      >
        <div className="group mx-auto flex max-w-screen-lg">
          <div className="flex-1">
            <h2 className="mb-1 text-lg font-bold text-white md:mb-2 md:text-xl lg:text-2xl">
              {promo.title}
            </h2>

            <p className="mb-2 text-xs text-white/90 md:mb-3 md:text-sm lg:text-base">
              {promo.description.map((text, i) => {
                return (
                  <span key={i} className="block">
                    {text}
                  </span>
                );
              })}
            </p>

            <div className="inline-block rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-black transition-colors group-hover:bg-amber-600 md:px-4 md:py-2 md:text-base">
              {promo.buttonText}
            </div>
          </div>

          {promo.imageUrl && (
            <div
              className="h-min-content flex-1 -rotate-12 bg-contain bg-center bg-no-repeat transition group-hover:rotate-6 group-hover:scale-110"
              style={{
                maxWidth: "13rem",
                backgroundImage: `url('${promo.imageUrl}')`,
              }}
            />
          )}
        </div>
      </a>
    </div>
  );
}

function CommanderMeta(props: { commander: Commander_CommanderMeta$key }) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderMeta on Commander {
        name
      }
    `,
    props.commander,
  );

  return (
    <NextSeo
      title={commander.name}
      description={`Top Performing and Recent Decklists for ${commander.name} in cEDH`}
    />
  );
}

export function CommanderPageShell({
  disableNavigation,
  children,
  ...props
}: PropsWithChildren<{
  disableNavigation?: boolean;
  commander: Commander_CommanderPageShell$key;
}>) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderPageShell on Commander {
        breakdownUrl
        ...Commander_CommanderBanner
        ...Commander_CommanderMeta

        promo {
          ...Commander_CommanderPromo
        }
      }
    `,
    props.commander,
  );

  const router = useRouter();
  const { maxStanding, minEventSize, sortBy, timePeriod } = useMemo(() => {
    return queryVariablesFromParsedUrlQuery(router.query);
  }, [router.query]);

  const setQueryVariable = useCallback(
    (key: string, value: string | null) => {
      const nextUrl = new URL(window.location.href);
      if (value != null) {
        nextUrl.searchParams.set(key, value);
      } else {
        nextUrl.searchParams.delete(key);
      }

      router.replace(nextUrl, undefined, { shallow: true, scroll: false });
    },
    [router],
  );

  return (
    <>
      <Navigation />
      <CommanderMeta commander={commander} />
      <CommanderBanner commander={commander} />
      {commander.promo && <CommanderPromo promo={commander.promo} />}

      <div className="mx-auto grid max-w-screen-md grid-cols-2 gap-4 border-b border-white/40 p-6 text-center text-black sm:flex sm:flex-wrap sm:justify-center">
        <Select
          id="commander-sort-by"
          label="Sort By"
          value={sortBy}
          disabled={setQueryVariable == null}
          onChange={(e) => {
            setQueryVariable?.("sortBy", e);
          }}
        >
          <option value="TOP">Top Performing</option>
          <option value="NEW">Recent</option>
        </Select>

        <Select
          id="commanders-time-period"
          label="Time Period"
          value={timePeriod}
          disabled={setQueryVariable == null}
          onChange={(e) => {
            setQueryVariable?.("timePeriod", e);
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
          disabled={setQueryVariable == null}
          onChange={(e) => {
            setQueryVariable?.("minEventSize", e);
          }}
        >
          <option value="0">All Events</option>
          <option value="32">32+ Players</option>
          <option value="60">60+ Players</option>
          <option value="100">100+ Players</option>
        </Select>

        <Select
          id="commander-event-size"
          label="Standing"
          value={`${maxStanding}`}
          disabled={setQueryVariable == null}
          onChange={(e) => {
            setQueryVariable?.("maxStanding", e ? e : null);
          }}
        >
          <option value="">All Players</option>
          <option value="16">Top 16</option>
          <option value="4">Top 4</option>
          <option value="1">Winner</option>
        </Select>
      </div>
      {children}
    </>
  );
}

function queryVariablesFromParsedUrlQuery(query: ParsedUrlQuery) {
  const commander = query.commander as string;
  const timePeriod = (query.timePeriod as TimePeriod) ?? "ONE_YEAR";
  const sortBy = (query.sortBy as EntriesSortBy) ?? "TOP";
  const minEventSize =
    typeof query.minEventSize === "string" ? Number(query.minEventSize) : 60;
  const maxStanding =
    typeof query.maxStanding === "string"
      ? Number(query.maxStanding)
      : undefined;

  return { commander, timePeriod, sortBy, minEventSize, maxStanding };
}

const CommanderQuery = graphql`
  query Commander_CommanderQuery(
    $commander: String!
    $sortBy: EntriesSortBy!
    $minEventSize: Int!
    $maxStanding: Int
    $timePeriod: TimePeriod!
  ) {
    commander(name: $commander) {
      ...Commander_CommanderPageShell
      ...Commander_entries
    }
  }
`;

function CommanderPage({
  preloadedQuery,
}: RelayProps<{}, Commander_CommanderQuery>) {
  const { commander } = usePreloadedQuery(CommanderQuery, preloadedQuery);

  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment<
    CommanderEntriesQuery,
    Commander_entries$key
  >(
    graphql`
      fragment Commander_entries on Commander
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 48 }
      )
      @refetchable(queryName: "CommanderEntriesQuery") {
        entries(
          first: $count
          after: $cursor
          sortBy: $sortBy
          filters: {
            minEventSize: $minEventSize
            maxStanding: $maxStanding
            timePeriod: $timePeriod
          }
        ) @connection(key: "Commander_entries") {
          edges {
            node {
              id
              ...Commander_EntryCard
            }
          }
        }
      }
    `,
    commander,
  );

  return (
    <CommanderPageShell commander={commander}>
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {data.entries.edges.map(({ node }) => (
          <EntryCard key={node.id} entry={node} />
        ))}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={loadNext}
      />

      <Footer />
    </CommanderPageShell>
  );
}

function CommanderPageFallback() {
  const router = useRouter();
  const queryVariables = useMemo(() => {
    return queryVariablesFromParsedUrlQuery(router.query);
  }, [router.query]);

  const { commander } = useLazyLoadQuery<Commander_CommanderPageFallbackQuery>(
    graphql`
      query Commander_CommanderPageFallbackQuery(
        $commander: String!
        $timePeriod: TimePeriod!
        $minEventSize: Int!
      ) {
        commander(name: $commander) {
          ...Commander_CommanderPageShell
        }
      }
    `,
    queryVariables,
    { fetchPolicy: "store-or-network" },
  );

  return (
    <CommanderPageShell commander={commander} disableNavigation>
      <LoadingIcon />
    </CommanderPageShell>
  );
}

export default withRelay(CommanderPage, CommanderQuery, {
  fallback: (
    <Suspense fallback={<Edhtop16Fallback />}>
      <CommanderPageFallback />
    </Suspense>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "../../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    return queryVariablesFromParsedUrlQuery(ctx.query);
  },
});
