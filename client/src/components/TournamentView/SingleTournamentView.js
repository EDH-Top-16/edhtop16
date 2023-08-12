import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { RxCaretSort, RxChevronDown } from "react-icons/rx";
import axios from "axios";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getCommanders, sortEntries } from "../../data/Commanders";
import { compressObject, insertIntoObject } from "../../utils";
import CommanderView from "../CommanderView/CommanderView";

const TERMS = [
  {
    name: "Standing",
    tag: "standing",
    cond: [
      {
        $lte: `Top X:`,
        component: "select",
        type: "number",
        values: [
          {
            value: null,
            name: "Filter By Top X",
            disabled: true,
            selected: true,
          },
          {
            value: 1,
            name: "Top 1",
          },
          {
            value: 4,
            name: "Top 4",
          },
          {
            value: 16,
            name: "Top 16",
          },
          {
            value: 32,
            name: "Top 32",
          },
          {
            value: 64,
            name: "Top 64",
          },
        ],
      },
      // { $eq: `is equal to (=)`, type: "number" },
      // { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Commander",
    tag: "commander",
    cond: [],
  },
  {
    name: "Colors",
    tag: "colors",
    cond: [],
  },
  {
    name: "Wins",
    tag: "wins",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Losses",
    tag: "losses",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Draws",
    tag: "draws",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Win Rate",
    tag: "winRate",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
];

export default function SingleTournamentView({ setCommanderExist }) {
  const { TID } = useParams();

  const defaultFilters = {
    tourney_filter: {
      TID: TID,
    },
  };

  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [allFilters, setAllFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("standing");
  const [toggled, setToggled] = useState(false);
  const [metabreakdown, setMetabreakdown] = useState(false); // Whether or not insigt view is displayed
  const [tournamentName, setTournamentName] = useState("");

  axios
    .post(
      process.env.REACT_APP_uri + "/api/list_tourneys",
      defaultFilters.tourney_filter
    )
    .then((res) => {
      // console.log(res);
      if ("tournamentName" in res.data[0]) {
        setTournamentName(res.data[0].tournamentName);
      }
    });

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_uri + "/api/req", defaultFilters)
      .then((res) => {
        // console.log(defaultFilters, res.data, res.data.length > 0);
        if (res.data.length > 0) {
          setCommanderExist(true);
        } else {
          setCommanderExist(false);
        }
      });
  }, [defaultFilters]);

  function getFilters(data) {
    setFilters(data);
  }
  
  function toggleMetabreakdown(){
    setMetabreakdown(!metabreakdown);
  }

  useEffect(() => {
    let newFilters = { ...filters };

    if (newFilters !== allFilters) {
      setAllFilters(newFilters);

      navigate(
        {
          search: `${createSearchParams(compressObject(newFilters))}`,
        },
        { replace: true }
      );
    }
  }, [filters]);

  /**
   * Changes the sort order
   */
  function handleSort(x) {
    // console.log("sort", x);
    setSort(x);
    if (x === sort) {
      setToggled(!toggled);
    }
  }

  useEffect(() => {
    // Deep copy b/c useState needs a new object
    const entries_copy = JSON.parse(JSON.stringify(entries));
    const sortedEntries = sortEntries(entries_copy, sort, toggled);
    setEntries(sortedEntries);
    setIsLoading(false);
  }, [sort, toggled]);

  useEffect(() => {
    // console.log("getCommanders useEffect allFilters:", allFilters);
    getCommanders(allFilters).then((data) => {
      const sortedEntries = sortEntries(data, sort, toggled);
      setEntries(sortedEntries);
      setIsLoading(false);
    });
  }, [allFilters]);
  // console.log(entries);

  return !metabreakdown ? (
    <div className="flex flex-col flex-grow overflow-auto">
      <Banner
        title={
          !tournamentName ? "View Tournaments" : tournamentName
        }
        enableFilters={true}
        getFilters={getFilters}
        allFilters={allFilters}
        defaultFilters={defaultFilters}
        terms={TERMS}
        enablecolors={false}
        backEnabled
        enableMetaBreakdownButton = {true}
        metabreakdownMessage="Meta Breakdown"
        toggleMetabreakdown={toggleMetabreakdown}
      />

      <table className="mx-2 md:mx-6 my-2 border-spacing-y-3 border-separate">
        <thead className="hidden md:table-row-group [&>tr>td>p]:cursor-pointer [&>tr>td]:px-4">
          <tr className="text-subtext dark:text-white text-lg ">
            <td>
              <p
                onClick={() => handleSort("standing")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                #
                {sort === "name" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("name")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                Player Name
                {sort === "name" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("commander")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                Commander
                {sort === "commander" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("wins")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                Wins
                {sort === "wins" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("losses")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                Losses
                {sort === "losses" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("draws")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                Draws
                {sort === "draws" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("winrate")}
                className="flex flex-row items-center gap-1 font-bold"
              >
                Winrate
                {sort === "winrate" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p onClick={() => handleSort("colors")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Colors
                  
                {sort ==="colors" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
                  </p>
            </td>
          </tr>
        </thead>
        <tbody className="[&>tr>td>p]:cursor-pointer [&>tr>td]:px-4 md:[&>tr>td]:px-4 [&>tr]:my-3 ">
          {isLoading ? (
            <tr className="text-text text-lg">Loading...</tr>
          ) : entries && entries.length === 0 ? (
            <div className="w-full flex justify-center items-center text-accent dark:text-text font-bold text-2xl">
              No data available
            </div>
          ) : (

            entries && entries.length === 0 ? <div className="w-full flex justify-center items-center text-accent dark:text-text font-bold text-2xl">No data available</div> :
              entries.map((entry, i) => (
                <Entry
                  rank={entry.standing}
                  name={entry.name}
                  mox={entry.decklist}
                  metadata={[
                    entry.commander,
                    entry.wins,
                    entry.losses,
                    entry.draws,
                    Number(entry.winRate  * 100).toFixed(2) + "%",
                  ]}
                  colors={entry.colorID}
                  layout="WLD"
                  metadata_fields={['Commander', 'Wins', 'Losses', 'Draws', 'Win rate']} 
                  filters={allFilters}
                />
              ))
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <CommanderView setCommanderExist={setCommanderExist} _filters={defaultFilters}></CommanderView>
  );
}
