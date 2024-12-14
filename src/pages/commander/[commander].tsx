import cn from "classnames";
import { format } from "date-fns";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { PropsWithChildren, Suspense, useCallback } from "react";
import { Tabs } from "react-aria-components";
import {
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { graphql } from "relay-runtime";
import { ColorIdentity } from "../../assets/icons/colors";
import { Card } from "../../components/card";
import { Edhtop16Fallback, LoadingIcon } from "../../components/fallback";
import { Footer } from "../../components/footer";
import { LoadMoreButton } from "../../components/load_more";
import { Navigation } from "../../components/navigation";
import { Select } from "../../components/select";
import { Tab, TabList } from "../../components/tabs";
import { formatOrdinals } from "../../lib/client/format";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { Commander_CommanderBanner$key } from "../../queries/__generated__/Commander_CommanderBanner.graphql";
import { Commander_CommanderMeta$key } from "../../queries/__generated__/Commander_CommanderMeta.graphql";
import { Commander_CommanderPageFallbackQuery } from "../../queries/__generated__/Commander_CommanderPageFallbackQuery.graphql";
import { Commander_CommanderPageShell$key } from "../../queries/__generated__/Commander_CommanderPageShell.graphql";
import {
  Commander_CommanderQuery,
  EntriesSortBy,
} from "../../queries/__generated__/Commander_CommanderQuery.graphql";
import { Commander_entries$key } from "../../queries/__generated__/Commander_entries.graphql";
import { Commander_EntryCard$key } from "../../queries/__generated__/Commander_EntryCard.graphql";
import { CommanderEntriesQuery } from "../../queries/__generated__/CommanderEntriesQuery.graphql";

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

        <span>{format(entry.tournament.tournamentDate, "MMMM do yyyy")}</span>
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

        <h1 className="relative text-center font-title font-title text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
        </h1>
        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>
      </div>
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

function CommanderPageShell({
  sortBy,
  onUpdateQueryParam,
  children,
  ...props
}: PropsWithChildren<{
  sortBy: EntriesSortBy;
  commander: Commander_CommanderPageShell$key;
  onUpdateQueryParam?: (key: string, value: string) => void;
}>) {
  const commander = useFragment(
    graphql`
      fragment Commander_CommanderPageShell on Commander {
        ...Commander_CommanderBanner
        ...Commander_CommanderMeta
      }
    `,
    props.commander,
  );

  return (
    <>
      <Navigation />
      <CommanderMeta commander={commander} />
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
    </>
  );
}

function RecentEntriesFilterCard({
  minEventSize,
  maxStanding,
  setQueryVariable,
}: {
  minEventSize: number;
  maxStanding: number | undefined | null;
  setQueryVariable?: (key: string, value: string | null) => void;
}) {
  return (
    <Card hoverEffect={false}>
      <div className="flex flex-col gap-4">
        <span className="border-b border-white text-white">
          Search Settings
        </span>

        <div className="flex gap-4 text-black">
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
            <option value="60">60+ Players</option>
            <option value="100">100+ Players</option>
          </Select>

          <Select
            id="commander-event-size"
            label="Player Standing"
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
      </div>
    </Card>
  );
}

const CommanderQuery = graphql`
  query Commander_CommanderQuery(
    $commander: String!
    $sortBy: EntriesSortBy!
    $minEventSize: Int!
    $maxStanding: Int
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

  const router = useRouter();
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
          filters: { minEventSize: $minEventSize, maxStanding: $maxStanding }
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
    <CommanderPageShell
      commander={commander}
      sortBy={preloadedQuery.variables.sortBy}
      onUpdateQueryParam={setQueryVariable}
    >
      <div className="mx-auto flex grid w-full max-w-screen-xl grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {preloadedQuery.variables.sortBy === "NEW" && (
          <RecentEntriesFilterCard
            minEventSize={preloadedQuery.variables.minEventSize}
            maxStanding={preloadedQuery.variables.maxStanding}
            setQueryVariable={setQueryVariable}
          />
        )}

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
      sortBy={router.query.sortBy as EntriesSortBy}
    >
      {router.query.sortBy === "NEW" ? (
        <div className="mx-auto flex grid w-full max-w-screen-xl grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          <RecentEntriesFilterCard
            minEventSize={Number(router.query.minEventSize || "60")}
            maxStanding={
              !router.query.maxStanding
                ? undefined
                : Number(router.query.maxStanding)
            }
          />
          <LoadingIcon padding={false} className="self-center" />
        </div>
      ) : (
        <LoadingIcon />
      )}
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
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    return {
      commander: ctx.query.commander as string,
      sortBy: (ctx.query.sortBy ?? "TOP") as EntriesSortBy,
      minEventSize:
        ctx.query.sortBy === "TOP"
          ? 60
          : Number(ctx.query.minEventSize || "60"),
      maxStanding:
        ctx.query.sortBy === "TOP" || !ctx.query.maxStanding
          ? undefined
          : Number(ctx.query.maxStanding),
    };
  },
});
