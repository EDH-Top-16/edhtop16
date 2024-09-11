import cn from "classnames";
import { useCallback, useState } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { ColorIdentity } from "../../assets/icons/colors";
import { Searchbar } from "../../components/banner/searchbar";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { v2Query } from "../../queries/__generated__/v2Query.graphql";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { v2_TopCommandersCard$key } from "../../queries/__generated__/v2_TopCommandersCard.graphql";

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
      <img
        className="absolute left-0 top-0 h-full w-full object-cover object-top brightness-50 transition group-hover:brightness-[40%]"
        src={commander.imageUrls[0]}
      />

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
    <nav className="sticky top-0 z-20 mb-8 grid w-full grid-cols-[auto_auto_auto_1fr] items-center gap-x-6 gap-y-3 bg-[#312d5a] px-8 py-3 font-title text-white">
      <span className="text-xl font-black">EDHTop16</span>

      <span className="underline decoration-transparent transition-colors hover:decoration-inherit">
        Commanders
      </span>

      <span className="underline decoration-transparent transition-colors hover:decoration-inherit">
        Tournaments
      </span>

      <button
        className="block justify-self-end	md:hidden"
        onClick={toggleSearch}
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
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
  query v2Query($timePeriod: TopCommandersTimePeriod) {
    topCommanders(timePeriod: $timePeriod) {
      id
      ...v2_TopCommandersCard
    }
  }
`;

function V2Page({ preloadedQuery }: RelayProps<{}, v2Query>) {
  const { topCommanders } = usePreloadedQuery(V2Query, preloadedQuery);

  return (
    <div className="relative bg-[#514f86]">
      <Navigation />
      <div className="mx-auto w-fit max-w-screen-xl px-8">
        <h1 className="mb-8 text-5xl font-extrabold text-white">
          cEDH Metagame Breakdown
        </h1>

        <div className="grid w-fit grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topCommanders.map((c) => (
            <TopCommandersCard key={c.id} commander={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withRelay(V2Page, V2Query, {
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: () => {
    return { timePeriod: "SIX_MONTHS" } as const;
  },
});
