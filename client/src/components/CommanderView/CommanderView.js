import { useEffect, useState } from "react";
import moment from "moment";
import { HiSwitchHorizontal } from "react-icons/hi";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import {
  getCommanders,
  getCommanderRankings,
  sortCommanders,
} from "../../data/Commanders";

/**
 * @TODO create sorting for each heading
 */

export default function CommanderView() {
  const [commanders, setCommanders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topX, setTopX] = useState(16);
  const [colors, setColors] = useState([]);
  const [filters, setFilters] = useState({
    tourney_filter: {
      size: { $gte: 64 },
      dateCreated: { $gte: moment().subtract(1, "year").unix() },
    },
  });
  const [allFilters, setAllFilters] = useState({
    tourney_filter: {
      size: { $gte: 64 },
      dateCreated: { $gte: moment().subtract(1, "year").unix() },
    },
  });
  const [sort, setSort] = useState("topX");
  const [toggled, setToggled] = useState(false);

  /**
   * @TODO Build filterString from colors and filters
   */
  useEffect(() => {
    // console.log(filters, colors);
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
      // console.log("Data:", data);
      const commanderRankings = getCommanderRankings(data, topX);
      // console.log("Commander Rankings:", commanderRankings);
      const sortedCommanders = sortCommanders(commanderRankings, sort, toggled);
      setCommanders(sortedCommanders);
      setIsLoading(false);
    });
  }, [sort, toggled, topX, allFilters]);

  /**
   * These two functions get data from colorSelection and filters child components
   */
  function getColors(data) {
    setColors(data);
  }
  function getFilters(data) {
    setFilters(data);
  }

  /**
   * Changes the sort order
   */
  function handleSort(x) {
    setSort(x);
    if (x === sort) {
      setToggled(!toggled);
    }
  }

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
        allFilters={allFilters}
        terms={[
          {
            name: "Standing",
            tag: "standing",
            cond: [
              { $gte: `is greater than (\u2265)`, type: "number" },
              { $eq: `is equal to (=)`, type: "number" },
              { $lte: `is less than (\u2264)`, type: "number" },
            ],
          },
          {
            name: "Tournament Size",
            tag: "size",
            isTourneyFilter: true,
            cond: [
              { $gte: `is greater than (\u2265)`, type: "number" },
              { $eq: `is equal to (=)`, type: "number" },
              { $lte: `is less than (\u2264)`, type: "number" },
            ],
          },
          {
            name: "Date",
            tag: "dateCreated",
            isTourneyFilter: true,
            cond: [
              { $gte: `is after (\u2265)`, type: "date" },
              { $eq: `is (=)`, type: "date" },
              { $lte: `is before (\u2264)`, type: "date" },
            ],
          },
        ]}
        getColors={getColors}
      />

      {/* Table of commanders */}
      <table className="block mx-24 my-12 table-fixed">
        <tbody className="[&>tr]:space-y-6 [&>tr>td]:w-max [&>tr>td]:px-2 [&>tr>td]:py-4 [&>tr>td>p]:cursor-pointer [&>tr>td>p]:w-fit">
          <tr className="text-subtext text-lg underline">
            <td>
              <p className="cursor-normal">#</p>
            </td>
            <td>
              <p onClick={() => handleSort("commander")}>Name</p>
            </td>
            <td className="space-x-2">
              <p className="inline-block" onClick={() => handleSort("topX")}>
                Top {topX}s
              </p>
              <HiSwitchHorizontal
                onClick={() => changeTopX()}
                size={24}
                className="cursor-pointer inline-block"
              />
            </td>
            <td>
              <p onClick={() => handleSort("count")}>Entries</p>
            </td>
            <td>
              <p onClick={() => handleSort("conversion")}>Conversion</p>
            </td>
            <td>
              <p>Colors</p>
            </td>
          </tr>
          {isLoading ? (
            <tr>Loading...</tr>
          ) : (
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
