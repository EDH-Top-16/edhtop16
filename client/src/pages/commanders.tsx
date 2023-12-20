import { useContext, useEffect } from "react";
import { Banner } from "../components/banner/banner";
import { Navigation } from "../components/nav";
import { defaultFilters, enabledFilters } from "../constants/filters";
import { FilterContext } from "../context/filter";

import { graphql, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { getClientEnvironment } from "../lib/client/relay_client_environment";
import { commanders_CommandersQuery } from "../queries/__generated__/commanders_CommandersQuery.graphql";

const CommandersQuery = graphql`
  query commanders_CommandersQuery {
    commanders {
      name
      colorID
      wins
      winsSwiss
      winsBracket
      draws
      losses
      lossesSwiss
      lossesBracket
      count
      winRate
      winRateSwiss
      winRateBracket
      topCuts
      conversionRate
      colorID
    }
  }
`;

function CommandersPage({
  preloadedQuery,
}: RelayProps<{}, commanders_CommandersQuery>) {
  const { commanders } = usePreloadedQuery(CommandersQuery, preloadedQuery);

  // Get the filters from the context
  const { filters, setFilters, setEnabled } = useContext(FilterContext);

  // Set the default filters for the commanders view
  useEffect(() => {
    setEnabled(enabledFilters.commanders);
    setFilters(defaultFilters.commanders);
  }, [setEnabled, setFilters]);

  return (
    <div className="flex h-screen w-screen bg-secondary">
      <Navigation />
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner title={"Commander Decks"} />
        <main className="w-full bg-secondary px-8 py-4 text-white">
          <table className="w-full">
            <thead>
              <tr>
                <td>#</td>
                <td>Name</td>
                <td>Top 16s</td>
                <td>Entries</td>
                <td>Conversion</td>
                <td>Colors</td>
              </tr>
            </thead>
            <tbody>
              {/* Commanders is an object with key being commander name */}
              {commanders.map((c, i) => (
                <tr key={c.name}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.topCuts}</td>
                  <td>{c.count}</td>
                  <td>{Math.round((c.conversionRate ?? 0) * 100)}%</td>
                  <td>{c.colorID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default withRelay(CommandersPage, CommandersQuery, {
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
});
