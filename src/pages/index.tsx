/** @module m#index */
import RectangleStackIcon from "@heroicons/react/24/solid/RectangleStackIcon";
import TableCellsIcon from "@heroicons/react/24/solid/TableCellsIcon";
import cn from "classnames";
import type { ParsedUrlQuery } from "querystring";
import { PropsWithChildren, useCallback, useMemo } from "react";
import {
  EntryPointComponent,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { ColorIdentity } from "../assets/icons/colors";
import { Card } from "../components/card";
import { ColorSelection } from "../components/color_selection";
import { Footer } from "../components/footer";
import { LoadMoreButton } from "../components/load_more";
import { Navigation } from "../components/navigation";
import { Select } from "../components/select";
import { formatPercent } from "../lib/client/format";
import {
  CommandersSortBy,
  pages_CommandersQuery,
  TimePeriod,
} from "../queries/__generated__/pages_CommandersQuery.graphql";
import { pages_topCommanders$key } from "../queries/__generated__/pages_topCommanders.graphql";
import { pages_TopCommandersCard$key } from "../queries/__generated__/pages_TopCommandersCard.graphql";
import { TopCommandersQuery } from "../queries/__generated__/TopCommandersQuery.graphql";

function TopCommandersCard({
  display = "card",
  secondaryStatistic,
  ...props
}: {
  display?: "table" | "card";
  secondaryStatistic: "topCuts" | "count";
  commander: pages_TopCommandersCard$key;
}) {
  const commander = useFragment(
    graphql`
      fragment pages_TopCommandersCard on Commander {
        name
        colorId
        breakdownUrl
        stats(
          filters: { timePeriod: $timePeriod, minSize: $minTournamentSize }
        ) {
          conversionRate
          topCuts
          count
          metaShare
        }

        cards {
          imageUrls
        }
      }
    `,
    props.commander,
  );

  const commanderStats = useMemo(() => {
    const stats: string[] = [];

    if (secondaryStatistic === "count") {
      stats.push(
        `Meta Share: ${formatPercent(commander.stats.metaShare)}`,
        `Entries: ${commander.stats.count}`,
      );
    } else if (secondaryStatistic === "topCuts") {
      stats.push(
        `Conversion Rate: ${formatPercent(commander.stats.conversionRate)}`,
        `Top Cuts: ${commander.stats.topCuts}`,
      );
    }

    return stats.join(" / ");
  }, [commander, secondaryStatistic]);

  if (display === "table") {
    return (
      <div className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,_1fr)_100px_100px_100px_100px]">
        <div>
          <ColorIdentity identity={commander.colorId} />
        </div>

        <a
          href={commander.breakdownUrl}
          className="mb-2 font-title text-xl underline lg:mb-0 lg:font-sans lg:text-base"
        >
          {commander.name}
        </a>

        <div className="text-sm opacity-75 lg:hidden">Entries:</div>
        <div className="text-sm">{commander.stats.count}</div>
        <div className="text-sm opacity-75 lg:hidden">Meta Share:</div>
        <div className="text-sm">
          {formatPercent(commander.stats.metaShare)}
        </div>
        <div className="text-sm opacity-75 lg:hidden">Top Cuts:</div>
        <div className="text-sm">{commander.stats.topCuts}</div>
        <div className="text-sm opacity-75 lg:hidden">Conversion Rate:</div>
        <div className="text-sm">
          {formatPercent(commander.stats.conversionRate)}
        </div>
      </div>
    );
  }

  return (
    <Card
      bottomText={commanderStats}
      images={commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${commander.name} card art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <a
          href={commander.breakdownUrl}
          className="text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
        >
          {commander.name}
        </a>

        <ColorIdentity identity={commander.colorId} />
      </div>
    </Card>
  );
}

function CommandersPageShell({
  sortBy,
  timePeriod,
  colorId,
  minEntries,
  minTournamentSize,
  onUpdateQueryParam,
  children,
}: PropsWithChildren<{
  colorId: string;
  minEntries: number;
  minTournamentSize: number;
  sortBy: CommandersSortBy;
  timePeriod: TimePeriod;
  onUpdateQueryParam?: (key: string, value: string | null) => void;
}>) {
  const [display, toggleDisplay] = useCommandersDisplay();

  return (
    <>
      <Navigation />
      {/* <NextSeo
        title="cEDH Commanders"
        description="Discover top performing commanders in cEDH!"
      /> */}

      <div className="mx-auto mt-8 w-full max-w-screen-xl px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="mb-8 flex-1 font-title text-5xl font-extrabold text-white lg:mb-0">
            cEDH Metagame Breakdown
          </h1>

          <button className="" /* onClick={toggleDisplay} */>
            {display === "card" ? (
              <TableCellsIcon className="h-6 w-6 text-white" />
            ) : (
              <RectangleStackIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <ColorSelection
              selected={colorId}
              onChange={(value) => {
                onUpdateQueryParam?.("colorId", value || null);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap">
            <Select
              id="commanders-sort-by"
              label="Sort By"
              value={sortBy}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("sortBy", value);
              }}
            >
              <option value="CONVERSION">Conversion Rate</option>
              <option value="POPULARITY">Popularity</option>
              <option value="TOP_CUTS">Top Cuts</option>
            </Select>

            <Select
              id="commanders-time-period"
              label="Time Period"
              value={timePeriod}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("timePeriod", value);
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
              id="commanders-min-entries"
              label="Min. Entries"
              value={`${minEntries}`}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("minEntries", value);
              }}
            >
              <option value="0">All Commanders</option>
              <option value="20">20+ Entries</option>
              <option value="60">60+ Entries</option>
              <option value="120">120+ Entries</option>
            </Select>

            <Select
              id="commanders-min-size"
              label="Tournament Size"
              value={`${minTournamentSize}`}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("minSize", value);
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="32">32+ Players</option>
              <option value="60">60+ Players</option>
              <option value="100">100+ Players</option>
            </Select>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

function useCommandersDisplay() {
  // const [{ display }, setParams] = useQueryParams({
  //   display: QueryParamKind.STRING,
  // });

  // const toggleDisplay = useCallback(() => {
  //   setParams({ display: display === "table" ? "card" : "table" });
  // }, [display, setParams]);

  // return useMemo(() => {
  //   return [display === "table" ? "table" : "card", toggleDisplay] as const;
  // }, [display, toggleDisplay]);

  return ["card" as "card" | "table", (d: string) => {}] as const;
}

function useSetQueryVariable() {
  // const router = useRouter();
  return useCallback((key: string, value: string | null) => {
    const nextUrl = new URL(window.location.href);
    if (value == null) {
      nextUrl.searchParams.delete(key);
    } else {
      nextUrl.searchParams.set(key, value);
    }
    // router.replace(nextUrl, undefined, { shallow: true, scroll: false });
  }, []);
}

function queryVariablesFromParsedUrlQuery(query: ParsedUrlQuery) {
  const timePeriod = (query.timePeriod as TimePeriod) ?? "SIX_MONTHS";
  const sortBy = (query.sortBy as CommandersSortBy) ?? "POPULARITY";
  const colorId = query.colorId as string | undefined;
  const minEntries =
    typeof query.minEntries === "string" ? Number(query.minEntries) : 20;
  const minTournamentSize =
    typeof query.minSize === "string" ? Number(query.minSize) : 60;

  return { timePeriod, sortBy, colorId, minEntries, minTournamentSize };
}

const CommandersQuery = graphql`
  query pages_CommandersQuery(
    $timePeriod: TimePeriod!
    $sortBy: CommandersSortBy!
    $minEntries: Int!
    $minTournamentSize: Int!
    $colorId: String
  ) @preloadable {
    ...pages_topCommanders
  }
`;

export const CommandersPage: EntryPointComponent<
  { commandersQueryRef: pages_CommandersQuery },
  {}
> = ({ queries }) => {
  const query = usePreloadedQuery(CommandersQuery, queries.commandersQueryRef);
  const setQueryVariable = useSetQueryVariable();
  const [display] = useCommandersDisplay();

  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment<
    TopCommandersQuery,
    pages_topCommanders$key
  >(
    graphql`
      fragment pages_topCommanders on Query
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 48 }
      )
      @refetchable(queryName: "TopCommandersQuery") {
        commanders(
          first: $count
          after: $cursor
          timePeriod: $timePeriod
          sortBy: $sortBy
          colorId: $colorId
          minEntries: $minEntries
          minTournamentSize: $minTournamentSize
        ) @connection(key: "pages__commanders") {
          edges {
            node {
              id
              ...pages_TopCommandersCard
            }
          }
        }
      }
    `,
    query,
  );

  return (
    <CommandersPageShell
      sortBy={queries.commandersQueryRef.variables.sortBy}
      timePeriod={queries.commandersQueryRef.variables.timePeriod}
      colorId={queries.commandersQueryRef.variables.colorId || ""}
      minEntries={queries.commandersQueryRef.variables.minEntries}
      minTournamentSize={queries.commandersQueryRef.variables.minTournamentSize}
      onUpdateQueryParam={setQueryVariable}
    >
      <div
        className={cn(
          "mx-auto grid w-full pb-4",
          display === "table"
            ? "w-full grid-cols-1 gap-2"
            : "w-fit gap-4 md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {display === "table" && (
          <div className="sticky top-[68px] hidden w-full grid-cols-[130px_minmax(350px,_1fr)_100px_100px_100px_100px] items-center gap-x-2 overflow-x-hidden bg-[#514f86] p-4 text-sm text-white lg:grid">
            <div>Color</div>
            <div>Commander</div>
            <div>Entries</div>
            <div>Meta %</div>
            <div>Top Cuts</div>
            <div>Cnvr. %</div>
          </div>
        )}

        {data.commanders.edges.map(({ node }) => (
          <TopCommandersCard
            key={node.id}
            display={display}
            commander={node}
            secondaryStatistic={
              queries.commandersQueryRef.variables.sortBy === "CONVERSION" ||
              queries.commandersQueryRef.variables.sortBy === "TOP_CUTS"
                ? "topCuts"
                : "count"
            }
          />
        ))}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={loadNext}
      />

      <Footer />
    </CommandersPageShell>
  );
};

// function CommandersPagePlaceholder() {
//   const setQueryVariable = useSetQueryVariable();
//   const router = useRouter();
//   const { sortBy, colorId, minEntries, timePeriod, minTournamentSize } =
//     queryVariablesFromParsedUrlQuery(router.query);

//   return (
//     <CommandersPageShell
//       sortBy={sortBy}
//       timePeriod={timePeriod}
//       colorId={colorId ?? ""}
//       minEntries={minEntries}
//       minTournamentSize={minTournamentSize}
//       onUpdateQueryParam={setQueryVariable}
//     >
//       <div className="flex w-full justify-center pt-24 text-white">
//         <FireIcon className="h-12 w-12 animate-pulse" />
//       </div>
//     </CommandersPageShell>
//   );
// }

// export default withRelay(Commanders, CommandersQuery, {
//   fallback: <CommandersPagePlaceholder />,
//   createClientEnvironment: () => getClientEnvironment()!,
//   createServerEnvironment: async () => {
//     const { createServerEnvironment } = await import(
//       "../lib/server/relay_server_environment"
//     );

//     return createServerEnvironment();
//   },
//   variablesFromContext: (ctx) => {
//     return queryVariablesFromParsedUrlQuery(ctx.query);
//   },
// });
