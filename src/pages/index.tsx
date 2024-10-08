import FireIcon from "@heroicons/react/24/solid/FireIcon";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { ColorIdentity } from "../assets/icons/colors";
import { Card } from "../components/card";
import { Navigation } from "../components/navigation";
import { Select } from "../components/select";
import { formatPercent } from "../lib/client/format";
import { getClientEnvironment } from "../lib/client/relay_client_environment";
import {
  pages_CommandersQuery,
  TimePeriod,
  TopCommandersSortBy,
} from "../queries/__generated__/pages_CommandersQuery.graphql";
import { pages_TopCommandersCard$key } from "../queries/__generated__/pages_TopCommandersCard.graphql";
import { Footer } from "../components/footer";

function TopCommandersCard({
  secondaryStatistic,
  ...props
}: {
  secondaryStatistic: "topCuts" | "count";
  commander: pages_TopCommandersCard$key;
}) {
  const commander = useFragment(
    graphql`
      fragment pages_TopCommandersCard on Commander {
        name
        colorId
        imageUrls
        conversionRate(filters: { timePeriod: $timePeriod })
        topCuts(filters: { timePeriod: $timePeriod })
        count(filters: { timePeriod: $timePeriod })
        breakdownUrl
      }
    `,
    props.commander,
  );

  const commanderStats = useMemo(() => {
    const stats = [
      `Conversion Rate: ${formatPercent(commander.conversionRate)}`,
    ];

    if (secondaryStatistic === "count") {
      stats.push(`Entries: ${commander.count}`);
    } else if (secondaryStatistic === "topCuts") {
      stats.push(`Top Cuts: ${commander.topCuts}`);
    }

    return stats.join(" / ");
  }, [commander, secondaryStatistic]);

  return (
    <Card
      bottomText={commanderStats}
      images={commander.imageUrls.map((img) => ({
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
  onUpdateQueryParam,
  children,
}: PropsWithChildren<{
  sortBy: TopCommandersSortBy;
  timePeriod: TimePeriod;
  onUpdateQueryParam?: (key: string, value: string) => void;
}>) {
  return (
    <>
      <Navigation />
      <NextSeo
        title="cEDH Commanders"
        description="Discover top performing commanders in cEDH!"
      />

      <div className="mx-auto mt-8 w-full max-w-screen-xl px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="flex-1 font-title text-5xl font-extrabold text-white">
            cEDH Metagame Breakdown
          </h1>

          <div className="flex space-x-4">
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
            </Select>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

const CommandersQuery = graphql`
  query pages_CommandersQuery(
    $timePeriod: TimePeriod!
    $sortBy: TopCommandersSortBy!
  ) {
    topCommanders(timePeriod: $timePeriod, sortBy: $sortBy) {
      id
      ...pages_TopCommandersCard
    }
  }
`;

function Commanders({ preloadedQuery }: RelayProps<{}, pages_CommandersQuery>) {
  const { topCommanders } = usePreloadedQuery(CommandersQuery, preloadedQuery);

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
    <CommandersPageShell
      sortBy={preloadedQuery.variables.sortBy}
      timePeriod={preloadedQuery.variables.timePeriod}
      onUpdateQueryParam={setQueryVariable}
    >
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {topCommanders.map((c) => (
          <TopCommandersCard
            key={c.id}
            commander={c}
            secondaryStatistic={
              preloadedQuery.variables.sortBy === "CONVERSION"
                ? "topCuts"
                : "count"
            }
          />
        ))}
      </div>

      <Footer />
    </CommandersPageShell>
  );
}

function CommandersPagePlaceholder() {
  const router = useRouter();

  return (
    <CommandersPageShell
      sortBy={
        (router.query.sortBy as TopCommandersSortBy | undefined) ?? "CONVERSION"
      }
      timePeriod={
        (router.query.timePeriod as TimePeriod | undefined) ?? "SIX_MONTHS"
      }
    >
      <div className="flex w-full justify-center pt-24 text-white">
        <FireIcon className="h-12 w-12 animate-pulse" />
      </div>
    </CommandersPageShell>
  );
}

export default withRelay(Commanders, CommandersQuery, {
  fallback: <CommandersPagePlaceholder />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    return {
      timePeriod: (ctx.query.timePeriod as TimePeriod) ?? "SIX_MONTHS",
      sortBy: (ctx.query.sortBy as TopCommandersSortBy) ?? "CONVERSION",
    };
  },
});
