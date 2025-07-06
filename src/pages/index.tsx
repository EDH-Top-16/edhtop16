import {
  CommandersSortBy,
  pages_CommandersQuery,
  TimePeriod,
} from "#genfiles/queries/pages_CommandersQuery.graphql";
import { pages_topCommanders$key } from "#genfiles/queries/pages_topCommanders.graphql";
import { pages_TopCommandersCard$key } from "#genfiles/queries/pages_TopCommandersCard.graphql";
import { TopCommandersQuery } from "#genfiles/queries/TopCommandersQuery.graphql";
import { Link, useRouter } from "#genfiles/river/router";
import RectangleStackIcon from "@heroicons/react/24/solid/RectangleStackIcon";
import TableCellsIcon from "@heroicons/react/24/solid/TableCellsIcon";
import { useSeoMeta } from "@unhead/react";
import cn from "classnames";
import {
  PropsWithChildren,
  startTransition,
  useCallback,
  useMemo,
} from "react";
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
      <div className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]">
        <div>
          <ColorIdentity identity={commander.colorId} />
        </div>

        <Link
          href={commander.breakdownUrl}
          className="font-title mb-2 text-xl underline lg:mb-0 lg:font-sans lg:text-base"
        >
          {commander.name}
        </Link>

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
        <Link
          href={commander.breakdownUrl}
          className="text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
        >
          {commander.name}
        </Link>

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
  useSeoMeta({
    title: "cEDH Commanders",
    description: "Discover top performing commanders in cEDH!",
  });

  const [display, toggleDisplay] = useCommandersDisplay();

  return (
    <>
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white lg:mb-0">
            cEDH Metagame Breakdown
          </h1>

          <button className="cursor-pointer" onClick={toggleDisplay}>
            {display === "card" ? (
              <TableCellsIcon className="h-6 w-6 text-white" />
            ) : (
              <RectangleStackIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
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
  const { asRoute, replace } = useRouter();
  const { display } = asRoute("/");

  const toggleDisplay = useCallback(() => {
    replace((url) => {
      url.searchParams.set("display", display === "table" ? "card" : "table");
    });
  }, [display, replace]);

  return useMemo(() => {
    return [display === "table" ? "table" : "card", toggleDisplay] as const;
  }, [display, toggleDisplay]);
}

function useSetQueryVariable() {
  const { replace } = useRouter();
  return useCallback(
    (key: string, value: string | null) => {
      startTransition(() => {
        replace((url) => {
          if (value == null) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, value);
          }
        });
      });
    },
    [replace],
  );
}

/** @resource m#index */
export const CommandersPage: EntryPointComponent<
  { commandersQueryRef: pages_CommandersQuery },
  {}
> = ({ queries }) => {
  const query = usePreloadedQuery(
    graphql`
      query pages_CommandersQuery(
        $timePeriod: TimePeriod!
        $sortBy: CommandersSortBy!
        $minEntries: Int!
        $minTournamentSize: Int!
        $colorId: String
      ) @preloadable {
        ...pages_topCommanders
      }
    `,
    queries.commandersQueryRef,
  );

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
          <div className="sticky top-[68px] hidden w-full grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px] items-center gap-x-2 overflow-x-hidden bg-[#514f86] p-4 text-sm text-white lg:grid">
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
