import cn from "classnames";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback } from "react";
import { Tabs } from "react-aria-components";
import { useFragment, useLazyLoadQuery, usePreloadedQuery } from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { graphql } from "relay-runtime";
import { ColorIdentity } from "../../../assets/icons/colors";
import { Card } from "../../../components/card";
import { Edhtop16Fallback } from "../../../components/fallback";
import { Navigation } from "../../../components/navigation";
import { Tab, TabList } from "../../../components/tabs";
import { formatOrdinals } from "../../../lib/client/format";
import { getClientEnvironment } from "../../../lib/client/relay_client_environment";
import { ServerSafeSuspense } from "../../../lib/client/suspense";
import { Commander_CommanderBanner$key } from "../../../queries/__generated__/Commander_CommanderBanner.graphql";
import { Commander_CommanderPageFallbackQuery } from "../../../queries/__generated__/Commander_CommanderPageFallbackQuery.graphql";
import { Commander_CommanderPageShell$key } from "../../../queries/__generated__/Commander_CommanderPageShell.graphql";
import {
  Commander_CommanderQuery,
  TopCommandersTopEntriesSortBy,
} from "../../../queries/__generated__/Commander_CommanderQuery.graphql";
import { Commander_EntryCard$key } from "../../../queries/__generated__/Commander_EntryCard.graphql";

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
        }
      }
    `,
    props.entry,
  );

  let entryName = `${entry.player?.name ?? "Unknown Player"} @ ${
    entry.tournament.name
  }`;

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
      <div className="flex h-32 flex-col space-y-2">
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            className="line-clamp-2 text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
          >
            {entryName}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryName}</span>
        )}

        <span>{format(entry.tournament.tournamentDate, "MMMM dd yyyy")}</span>
      </div>
    </Card>
  );
}

function CommanderBanner(props: { commander: Commander_CommanderBanner$key }) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderBanner on Commander {
        name
        imageUrls
        colorId
      }
    `,
    props.commander,
  );

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-screen-xl flex-col items-center justify-center space-y-4">
        <div className="absolute left-0 top-0 flex h-full w-full brightness-[40%]">
          {commander.imageUrls.map((src, _i, { length }) => {
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

        <h1 className="relative text-center font-title text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
        </h1>
        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>
      </div>
    </div>
  );
}

function CommanderPageShell({
  sortBy,
  onUpdateQueryParam,
  children,
  ...props
}: PropsWithChildren<{
  sortBy: TopCommandersTopEntriesSortBy;
  commander: Commander_CommanderPageShell$key;
  onUpdateQueryParam?: (key: string, value: string) => void;
}>) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderPageShell on Commander {
        ...Commander_CommanderBanner
      }
    `,
    props.commander,
  );

  return (
    <div className="relative min-h-screen bg-[#514f86]">
      <Navigation />
      <CommanderBanner commander={commander} />
      <Tabs
        className="mx-auto max-w-screen-md"
        isDisabled={onUpdateQueryParam == null}
        selectedKey={sortBy}
        onSelectionChange={(nextKey) =>
          onUpdateQueryParam?.("sortBy", nextKey as string)
        }
      >
        <TabList>
          <Tab id="TOP">Top Performing Decklists</Tab>
          <Tab id="NEW">Recent Decklists</Tab>
        </TabList>
      </Tabs>
      {children}
    </div>
  );
}

const CommanderQuery = graphql`
  query Commander_CommanderQuery(
    $commander: String!
    $sortBy: TopCommandersTopEntriesSortBy!
  ) {
    commander(name: $commander) {
      ...Commander_CommanderPageShell

      topEntries(sortBy: $sortBy, timePeriod: SIX_MONTHS) {
        id
        ...Commander_EntryCard
      }
    }
  }
`;

function CommanderPage({
  preloadedQuery,
}: RelayProps<{}, Commander_CommanderQuery>) {
  const { commander } = usePreloadedQuery(CommanderQuery, preloadedQuery);

  const router = useRouter();
  const setQueryVariable = useCallback(
    (key: string, value: string) => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set(key, value);
      router.replace(nextUrl, undefined, { shallow: true, scroll: false });
    },
    [router],
  );

  return (
    <CommanderPageShell
      commander={commander}
      sortBy={preloadedQuery.variables.sortBy}
      onUpdateQueryParam={setQueryVariable}
    >
      <div className="mx-auto flex grid w-full max-w-screen-xl grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {commander.topEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </CommanderPageShell>
  );
}

function CommanderPageFallback() {
  const router = useRouter();

  const { commander } = useLazyLoadQuery<Commander_CommanderPageFallbackQuery>(
    graphql`
      query Commander_CommanderPageFallbackQuery($commander: String!) {
        commander(name: $commander) {
          ...Commander_CommanderPageShell
        }
      }
    `,
    { commander: router.query.commander as string },
    { fetchPolicy: "store-or-network" },
  );

  return (
    <CommanderPageShell
      commander={commander}
      sortBy={router.query.sortBy as TopCommandersTopEntriesSortBy}
    />
  );
}

export default withRelay(CommanderPage, CommanderQuery, {
  fallback: (
    <ServerSafeSuspense fallback={<Edhtop16Fallback />}>
      <CommanderPageFallback />
    </ServerSafeSuspense>
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
      commander: ctx.query.commander as string,
      sortBy: (ctx.query.sortBy ?? "TOP") as TopCommandersTopEntriesSortBy,
    };
  },
});
