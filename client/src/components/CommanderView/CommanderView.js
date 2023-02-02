import { useEffect, useState } from "react";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getCommanders, getCommanderRankings } from "../../data/Commanders";

/**
 * @TODO create sorting for each heading
 */

export default function CommanderView() {
  const [commanders, setCommanders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topX, setTopX] = useState(16);
  const [colors, setColors] = useState([]);
  const [filters, setFilters] = useState([]);
  const [allFilters, setAllFilters] = useState([]);

  /**
   * These two functionsg get data from colorSelection and filters child components
   */
  function getColors(data) {
    setColors(data);
  }
  function getFilters(data) {
    setFilters(data);
  }

  /**
   * @TODO Build filterString from colors and filters
   */
  useEffect(() => {
    console.log(filters, colors);
    if (colors !== [] && colors.join("") !== "") {
      setAllFilters({
        ...filters,
        colorID: colors.join(""),
      });
    } else {
      setAllFilters(filters);
    }
  }, [colors, filters]);

  /**
   * Main getCommanders() API call
   */
  useEffect(() => {
    getCommanders(allFilters).then((data) => {
      console.log("Data:", data);
      const commanderRankings = getCommanderRankings(data, topX);
      setCommanders(commanderRankings);
      setIsLoading(false);
    });
  }, [topX, allFilters]);

  /**
   * Changes the topX filter
   * @TODO Probably should move to backend (?)
   */
  function changeTopX() {
    setTopX(topX === 16 ? 4 : topX === 4 ? 1 : 16);
  }

  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      {/* Banner */}
      <Banner
        title={"View Decks"}
        enableSearchbar={true}
        enableColors={true}
        enableFilters={true}
        getFilters={getFilters}
        getColors={getColors}
      />

      {/* Table of commanders */}
      <table className="block mx-24 my-12 table-fixed">
        <tbody className="[&>tr]:space-y-6 [&>tr>td]:w-max [&>tr>td]:px-2 [&>tr>td]:py-4">
          <tr className="text-subtext text-lg underline">
            <td>#</td>
            <td>Name</td>
            <td className="cursor-pointer" onClick={() => changeTopX()}>
              Top {topX}s
            </td>
            <td>Entries</td>
            <td>Conversion</td>
            <td>Colors</td>
          </tr>
          {isLoading ? (
            <tr>Loading...</tr>
          ) : (
            commanders &&
            commanders.map((v, i) => (
              <Entry
                enableLink={true}
                slug={commanders[i].slug}
                rank={i + 1}
                name={commanders[i].commander}
                metadata={[
                  commanders[i].topX,
                  commanders[i].count,
                  ((commanders[i].topX / commanders[i].count) * 100).toFixed(
                    2
                  ) + "%",
                ]}
                colors={commanders[i].colorID}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
