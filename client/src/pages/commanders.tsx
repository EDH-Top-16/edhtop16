import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { getCommanders } from "../api/commander";
import { Banner } from "../components/banner/banner";
import { Navigation } from "../components/nav";
import { defaultFilters, enabledFilters } from "../constants/filters";
import { FilterContext } from "../context/filter";
import { CommandersType } from "../utils/types/commanders";

export default function CommandersPage() {
  // Get the filters from the context
  const { filters, setFilters, setEnabled } = useContext(FilterContext);

  const [commanders, setCommanders] = useState<CommandersType>();

  // Set the default filters for the commanders view
  useEffect(() => {
    setEnabled(enabledFilters.commanders);
    setFilters(defaultFilters.commanders);
  }, [setEnabled, setFilters]);

  // Fetch the commanders
  useEffect(() => {
    if (_.isEmpty(filters)) return; // If filters is empty, don't fetch

    (async () => {
      try {
        const data = await getCommanders(filters);
        setCommanders(data);
      } catch (e) {
        console.error(e);
        setCommanders(undefined);
      }
    })();
  }, [filters]);

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
              {commanders &&
                Object.keys(commanders).map((name: string, i: number) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{name}</td>
                    <td>{commanders[name]?.topCuts}</td>
                    <td>{commanders[name]?.count}</td>
                    <td>
                      {Math.round((commanders[name].conversionRate ?? 0) * 100)}
                      %
                    </td>
                    <td>{commanders[name]?.colors as any}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
