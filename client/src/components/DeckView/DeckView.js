import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { RxCaretSort, RxChevronDown } from "react-icons/rx";
import axios from "axios";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getCommanders, sortCommanders } from "../../data/Commanders";
import { defaultFormat } from "moment";
import moment from "moment";
import { compressObject, insertIntoObject } from "../../utils";

const TERMS = [
          {
            name: "Standing",
            tag: "standing",
            cond: [
              {
                $lte: `Top X:`, 
                component: "select",
                type: 'number',
                values: [
                  {
                    value: 1,
                    name: 'Winner'
                  },
                  {
                    value: 4,
                    name: 'Top 4'
                  },
                  {
                    value: 16,
                    name: 'Top 16'
                  },
                  {
                    value: 32,
                    name: 'Top 32'
                  },
                  {
                    value: 64,
                    name: 'Top 64'
                  },
                ]
                

              },
              // { $eq: `is equal to (=)`, type: "number" },
              // { $lte: `is less than (\u2264)`, type: "number" },
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
            name: "Tournament Date",
            tag: "dateCreated",
            isTourneyFilter: true,
            cond: [
              { $gte: `is after (\u2265)`, type: "date" },
              { $eq: `is (=)`, type: "date" },
              { $lte: `is before (\u2264)`, type: "date" },
            ],
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
        ]

/**
 * Takes commander name and @returns the corresponding decks
 */
export default function DeckView({ setCommanderExist }) {
  const defaultFilters = {tourney_filter: {
    size: { $gte: 64 },
    dateCreated: { $gte: moment().subtract(1, "year").unix() },
  },
};

  const loadFilters = useMemo(() => {
    const params = new URLSearchParams(window.location.search)

    let generated_filters = {
    }
    params.forEach((val, key) => {
      generated_filters = insertIntoObject(generated_filters, key.split('__'), val)
    })

    return Object.entries(generated_filters).length > 0 ? generated_filters : defaultFilters;
  }, [])

  const navigate = useNavigate();

  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState((loadFilters.colorID ?? "").split(''));
  const [filters, setFilters] = useState(loadFilters);
  const [allFilters, setAllFilters] = useState(loadFilters);
  const [sort, setSort] = useState("standing");
  const [toggled, setToggled] = useState(false);

  let params = useParams();
  const commander = params["*"].replaceAll("+", "/");

  // useEffect to get commanders
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_uri + "/api/req", { commander: commander })
      .then((res) => {
        console.log(commander, res.data, res.data.length > 0);
        if (res.data.length > 0) {
          setCommanderExist(true);
        } else {
          setCommanderExist(false);
        }
      });
  }, [commander]);

  useEffect(() => {
    // console.log(filters, colors);
    let newFilters = {...filters}

    if (newFilters != allFilters) {
      setAllFilters(newFilters);


      navigate({
        search: `${createSearchParams(compressObject(newFilters))}`
      }, {replace: true})
    }
  }, [filters]);

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
   * Changes the sort order
   */
  function handleSort(x) {
    setSort(x);
    if (x === sort) {
      setToggled(!toggled);
    }
  }

  useEffect(() => {
    // console.log("Filters:", allFilters);
    getCommanders({ ...allFilters, commander }).then((data) => {
      const sortedCommanders = sortCommanders(data, sort, toggled);
      setDecks(sortedCommanders);
      setIsLoading(false);
    });
  }, [sort, toggled, allFilters]);

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      {/* Banner */}
      <Banner
        title={commander}
        enableFilters={true}
        getFilters={getFilters}
        allFilters={allFilters}
        defaultFilters={defaultFilters}
        terms={TERMS}
        getColors={getColors}
        backEnabled
      />

      {/* Table of decks */}
      <table className="mx-2 md:mx-6 my-2 border-spacing-y-3 border-separate">
        <thead className="hidden md:table-row-group [&>tr>td>p]:cursor-pointer [&>tr>td]:px-4">
          <tr className="text-subtext dark:text-white text-lg ">
            <td className="font-bold">#</td>
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
                onClick={() => handleSort("standing")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Standing
                  
                {sort === "standing" ? (
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
              <p onClick={() => handleSort("losses")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Losses
                  
                {sort ==="losses" ? (
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
              <p onClick={() => handleSort("draws")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Draws
                  
                {sort ==="draws" ? (
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
              <p onClick={() => handleSort("winrate")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Winrate
                  
                {sort ==="winrate" ? (
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
                onClick={() => handleSort("tournament")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Tournament
                  
                {sort === "tournament" ? (
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
          ) : (
            decks && decks.length === 0 ? <div className="w-full flex justify-center items-center text-accent dark:text-text font-bold text-2xl">No data available</div> : 
            decks.map((deck, i) => (
              <Entry
                rank={i + 1}
                name={deck.name}
                mox={deck.decklist}
                metadata={[
                  deck.standing,
                  deck.wins,
                  deck.losses,
                  deck.draws,
                  Number(deck.winRate  * 100).toFixed(2) + "%",
                ]}
                layout="WLD"
                metadata_fields={['Standing', 'Wins', 'Losses', 'Draws', 'Win rate']}
                tournament={deck.tournamentName}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
