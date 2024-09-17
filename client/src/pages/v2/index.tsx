import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import FireIcon from "@heroicons/react/24/solid/FireIcon";
import cn from "classnames";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useState } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { ColorIdentity } from "../../assets/icons/colors";
import { Searchbar } from "../../components/banner/searchbar";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { Select } from "../../lib/client/select";
import { v2_TopCommandersCard$key } from "../../queries/__generated__/v2_TopCommandersCard.graphql";
import {
  TopCommandersSortBy,
  TopCommandersTimePeriod,
  v2Query,
} from "../../queries/__generated__/v2Query.graphql";

function TopCommandersCard(props: { commander: v2_TopCommandersCard$key }) {
  const commander = useFragment(
    graphql`
      fragment v2_TopCommandersCard on Commander {
        name
        colorId
        imageUrls
        conversionRate(filters: { timePeriod: $timePeriod })
        topCuts(filters: { timePeriod: $timePeriod })
      }
    `,
    props.commander,
  );

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg">
      <div className="absolute left-0 top-0 flex h-full w-full brightness-50 transition group-hover:brightness-[40%]">
        {commander.imageUrls.map((img, i, { length }) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={cn(
                "flex-1 object-cover object-top",
                length === 2 ? "w-1/2" : "w-full",
              )}
              key={img}
              src={img}
              alt={`${commander.name} card art`}
            />
          );
        })}
      </div>

      <div className="relative px-4 py-5 text-white sm:p-6">
        <div className="flex h-28 flex-col space-y-2">
          <p className="text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit">
            {commander.name}
          </p>

          <ColorIdentity identity={commander.colorId} />
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-black/60 px-2 py-2 text-white">
        Conversion Rate: {Math.floor(commander.conversionRate * 10000) / 100}% /
        Top Cuts: {commander.topCuts}
      </div>
    </div>
  );
}

function Navigation() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const toggleSearch = useCallback(() => {
    setMobileSearchOpen((open) => !open);
  }, []);

  return (
    <nav className="sticky top-0 z-20 mb-8 grid w-full grid-cols-[auto_auto_auto_1fr] items-center gap-x-6 gap-y-3 bg-[#312d5a] px-4 py-3 font-title text-white md:px-8">
      <span className="text-xl font-black">EDHTop16</span>

      <span className="text-xs underline decoration-transparent transition-colors hover:decoration-inherit md:text-sm">
        Commanders
      </span>

      <span className="text-xs underline decoration-transparent transition-colors hover:decoration-inherit md:text-sm">
        Tournaments
      </span>

      <button
        className="block justify-self-end	md:hidden"
        onClick={toggleSearch}
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "col-span-4 justify-end md:col-span-1 md:flex",
          mobileSearchOpen ? "flex" : "hidden",
        )}
      >
        <Searchbar />
      </div>
    </nav>
  );
}

const V2Query = graphql`
  query v2Query(
    $timePeriod: TopCommandersTimePeriod
    $sortBy: TopCommandersSortBy
  ) {
    topCommanders(timePeriod: $timePeriod, sortBy: $sortBy) {
      id
      ...v2_TopCommandersCard
    }
  }
`;

function V2PageShell({
  sortBy,
  timePeriod,
  onUpdateQueryParam,
  children,
}: PropsWithChildren<{
  sortBy: TopCommandersSortBy;
  timePeriod: TopCommandersTimePeriod;
  onUpdateQueryParam?: (key: string, value: string) => void;
}>) {
  return (
    <div className="relative min-h-screen bg-[#514f86]">
      <Navigation />
      <div className="mx-auto w-fit max-w-screen-xl px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="flex-1 text-5xl font-extrabold text-white">
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
    </div>
  );
}

function V2Page({ preloadedQuery }: RelayProps<{}, v2Query>) {
  const { topCommanders } = usePreloadedQuery(V2Query, preloadedQuery);

  const router = useRouter();
  const setVariable = useCallback(
    (key: string, value: string) => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set(key, value);
      router.replace(nextUrl, undefined, { shallow: true, scroll: false });
    },
    [router],
  );

  return (
    <V2PageShell
      sortBy={preloadedQuery.variables.sortBy ?? "CONVERSION"}
      timePeriod={preloadedQuery.variables.timePeriod ?? "SIX_MONTHS"}
      onUpdateQueryParam={setVariable}
    >
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {topCommanders.map((c) => (
          <TopCommandersCard key={c.id} commander={c} />
        ))}
      </div>
    </V2PageShell>
  );
}

function V2PagePlaceholder() {
  const router = useRouter();

  return (
    <V2PageShell
      sortBy={router.query.sortBy as TopCommandersSortBy}
      timePeriod={router.query.timePeriod as TopCommandersTimePeriod}
    >
      <div className="flex w-screen justify-center pt-24 text-white">
        <FireIcon className="h-12 w-12 animate-pulse" />
      </div>
    </V2PageShell>
  );
}

export default withRelay(V2Page, V2Query, {
  fallback: <V2PagePlaceholder />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    return {
      timePeriod:
        (ctx.query.timePeriod as TopCommandersTimePeriod) ?? "SIX_MONTHS",
      sortBy: (ctx.query.sortBy as TopCommandersSortBy) ?? "CONVERSION",
    };
  },
});
