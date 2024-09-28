import cn from "classnames";
import { format } from "date-fns";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, Suspense, useCallback, useMemo } from "react";
import { Tabs } from "react-aria-components";
import { useFragment, useLazyLoadQuery, usePreloadedQuery } from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { graphql } from "relay-runtime";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import { ColorIdentity } from "../../../assets/icons/colors";
import { Card } from "../../../components/card";
import { Edhtop16Fallback, LoadingIcon } from "../../../components/fallback";
import { Navigation } from "../../../components/navigation";
import { Tab, TabList } from "../../../components/tabs";
import { formatOrdinals, formatPercent } from "../../../lib/client/format";
import { getClientEnvironment } from "../../../lib/client/relay_client_environment";
import { TID_BreakdownGroupCard$key } from "../../../queries/__generated__/TID_BreakdownGroupCard.graphql";
import { TID_EntryCard$key } from "../../../queries/__generated__/TID_EntryCard.graphql";
import { TID_TournamentBanner$key } from "../../../queries/__generated__/TID_TournamentBanner.graphql";
import { TID_TournamentMeta$key } from "../../../queries/__generated__/TID_TournamentMeta.graphql";
import { TID_TournamentPageFallbackQuery } from "../../../queries/__generated__/TID_TournamentPageFallbackQuery.graphql";
import { TID_TournamentPageShell$key } from "../../../queries/__generated__/TID_TournamentPageShell.graphql";
import { TID_TournamentQuery } from "../../../queries/__generated__/TID_TournamentQuery.graphql";

function EntryCard({
  highlightFirst = true,
  ...props
}: {
  highlightFirst?: boolean;
  entry: TID_EntryCard$key;
}) {
  const entry = useFragment(
    graphql`
      fragment TID_EntryCard on Entry {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
        }

        commander {
          name
          imageUrls
          breakdownUrl
        }
      }
    `,
    props.entry,
  );

  let entryName = `${entry.player?.name ?? "Unknown Player"}`;
  if (entry.standing === 1) {
    entryName = `🥇 ${entryName}`;
  } else if (entry.standing === 2) {
    entryName = `🥈 ${entryName}`;
  } else if (entry.standing === 3) {
    entryName = `🥉 ${entryName}`;
  }

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
        "group",
        highlightFirst &&
          "first:md:col-span-2 lg:max-w-3xl first:lg:col-span-3 first:lg:w-full first:lg:justify-self-center",
      )}
      bottomText={bottomText}
      images={entry.commander.imageUrls.map((img) => ({
        src: img,
        alt: `${entry.commander.name} art`,
      }))}
    >
      <div className="flex h-32 flex-col space-y-2 group-first:lg:h-40">
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            className="line-clamp-2 text-xl font-bold underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            {entryName}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryName}</span>
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
  group: TID_BreakdownGroupCard$key;
}) {
  const { commander, conversionRate, entries, topCuts } = useFragment(
    graphql`
      fragment TID_BreakdownGroupCard on TournamentBreakdownGroup {
        commander {
          name
          imageUrls
          breakdownUrl
          colorId
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
      images={commander.imageUrls.map((img) => ({
        src: img,
        alt: `${commander.name} art`,
      }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <button
          // href={commander.breakdownUrl}
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

function TournamentBanner(props: { tournament: TID_TournamentBanner$key }) {
  const tournament = useFragment(
    graphql`
      fragment TID_TournamentBanner on Tournament {
        name
        size
        tournamentDate
        bracketUrl

        winner: entries(maxStanding: 1) {
          commander {
            imageUrls
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
      <div className="relative mx-auto flex h-full w-full max-w-screen-xl flex-col items-center justify-center space-y-4">
        <div className="absolute left-0 top-0 flex h-full w-full brightness-[40%]">
          {tournament.winner[0].commander.imageUrls.map(
            (src, _i, { length }) => {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={cn(
                    "flex-1 object-cover object-top",
                    length === 2 ? "w-1/2" : "w-full",
                  )}
                  key={src}
                  src={src}
                  alt={`${tournament.name} winner art`}
                />
              );
            },
          )}
        </div>

        {bracketUrl && (
          <div className="absolute right-4 top-0 z-10 text-xs md:text-sm">
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

        <h1 className="relative text-center font-title text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {tournament.name}
        </h1>
        <div className="relative flex w-full max-w-screen-md flex-col items-center justify-evenly gap-1 text-base text-white md:flex-row md:text-lg lg:text-xl">
          <span>{format(tournament.tournamentDate, "MMMM do yyyy")}</span>
          <span>{tournament.size} Players</span>
        </div>
      </div>
    </div>
  );
}

function TournamentMeta(props: { tournament: TID_TournamentMeta$key }) {
  const tournament = useFragment(
    graphql`
      fragment TID_TournamentMeta on Tournament {
        name
      }
    `,
    props.tournament,
  );

  return (
    <NextSeo
      title={tournament.name}
      description={`Top Performing cEDH decks at ${tournament.name}`}
    />
  );
}

function TournamentPageShell({
  tab,
  commanderName,
  onUpdateQueryParam,
  children,
  ...props
}: PropsWithChildren<{
  tab: string;
  commanderName?: string | null;
  tournament: TID_TournamentPageShell$key;
  onUpdateQueryParam?: (keys: [key: string, value: string | null][]) => void;
}>) {
  const tournament = useFragment(
    graphql`
      fragment TID_TournamentPageShell on Tournament {
        ...TID_TournamentBanner
        ...TID_TournamentMeta
      }
    `,
    props.tournament,
  );

  return (
    <>
      <Navigation />
      <TournamentMeta tournament={tournament} />
      <TournamentBanner tournament={tournament} />
      <Tabs
        className="mx-auto max-w-screen-md"
        isDisabled={onUpdateQueryParam == null}
        selectedKey={tab}
        onSelectionChange={(nextKey) => {
          const nextParams: [key: string, value: string | null][] = [
            ["tab", nextKey as string | null],
          ];

          if (nextKey !== "commander") nextParams.push(["commander", null]);
          onUpdateQueryParam?.(nextParams);
        }}
      >
        <TabList>
          <Tab id="entries">Standings</Tab>
          <Tab id="breakdown">Metagame Breakdown</Tab>
          <Tab id="commander">{commanderName}</Tab>
        </TabList>
      </Tabs>
      {children}
    </>
  );
}

const TournamentQuery = graphql`
  query TID_TournamentQuery(
    $TID: String!
    $commander: String
    $showStandings: Boolean!
    $showBreakdown: Boolean!
    $showBreakdownCommander: Boolean!
  ) {
    tournament(TID: $TID) {
      ...TID_TournamentPageShell

      entries @include(if: $showStandings) {
        id
        ...TID_EntryCard
      }

      breakdown @include(if: $showBreakdown) {
        commander {
          id
        }

        ...TID_BreakdownGroupCard
      }

      breakdownEntries: entries(commander: $commander)
        @include(if: $showBreakdownCommander) {
        id
        ...TID_EntryCard
      }
    }
  }
`;

function TournamentPage({
  preloadedQuery,
}: RelayProps<{}, TID_TournamentQuery>) {
  const { tournament } = usePreloadedQuery(TournamentQuery, preloadedQuery);

  const router = useRouter();
  const setQueryVariable = useCallback(
    (keys: [key: string, value: string | null][]) => {
      const nextUrl = new URL(window.location.href);
      for (const [key, value] of keys) {
        if (value != null) {
          nextUrl.searchParams.set(key, value);
        } else {
          nextUrl.searchParams.delete(key);
        }
      }
      router.replace(nextUrl, undefined, { shallow: true, scroll: false });
    },
    [router],
  );

  return (
    <TournamentPageShell
      tournament={tournament}
      commanderName={preloadedQuery.variables.commander}
      tab={
        preloadedQuery.variables.showBreakdown
          ? "breakdown"
          : preloadedQuery.variables.showBreakdownCommander
          ? "commander"
          : "entries"
      }
      onUpdateQueryParam={setQueryVariable}
    >
      {/* {preloadedQuery.variables.showBreakdownCommander && (
        <div className="mx-auto flex max-w-screen-md justify-between px-6 pt-4 text-white md:px-0">
          <button
            className="underline"
            onClick={() => {
              setQueryVariable("tab", "breakdown", { reset: true });
            }}
          >
            Back
          </button>

          <Link
            className="underline"
            href={`/v2/commander/${encodeURIComponent(
              preloadedQuery.variables.commander!,
            )}`}
          >
            {preloadedQuery.variables.commander}
          </Link>
        </div>
      )} */}

      <div className="mx-auto flex grid w-full max-w-screen-xl grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {preloadedQuery.variables.showStandings &&
          tournament.entries != null &&
          tournament.entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}

        {preloadedQuery.variables.showBreakdown &&
          tournament.breakdown &&
          tournament.breakdown.map((group) => (
            <BreakdownGroupCard
              key={group.commander.id}
              group={group}
              onClickGroup={(commanderName) => {
                setQueryVariable([
                  ["tab", "commander"],
                  ["commander", commanderName],
                ]);
              }}
            />
          ))}

        {preloadedQuery.variables.showBreakdownCommander &&
          tournament.breakdownEntries &&
          tournament.breakdownEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} highlightFirst={false} />
          ))}
      </div>
    </TournamentPageShell>
  );
}

function TournamentPageFallback() {
  const router = useRouter();

  const { tournament } = useLazyLoadQuery<TID_TournamentPageFallbackQuery>(
    graphql`
      query TID_TournamentPageFallbackQuery($TID: String!) {
        tournament(TID: $TID) {
          ...TID_TournamentPageShell
        }
      }
    `,
    { TID: router.query.TID as string },
    { fetchPolicy: "store-or-network" },
  );

  return (
    <TournamentPageShell
      tournament={tournament}
      tab={router.query.tab as string}
      commanderName={router.query.commander as string | undefined}
    >
      <LoadingIcon />
    </TournamentPageShell>
  );
}

export default withRelay(TournamentPage, TournamentQuery, {
  fallback: (
    <Suspense fallback={<Edhtop16Fallback />}>
      <TournamentPageFallback />
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
    return {
      TID: ctx.query.TID as string,
      commander: ctx.query.commander as string,
      showStandings:
        ctx.query.tab !== "breakdown" && ctx.query.tab !== "commander",
      showBreakdown: ctx.query.tab === "breakdown",
      showBreakdownCommander:
        ctx.query.tab === "commander" && ctx.query.commander != null,
    };
  },
});
