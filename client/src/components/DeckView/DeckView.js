import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getCommanders, sortCommanders } from "../../data/Commanders";
import { defaultFormat } from "moment";

/**
 * Takes commander name and @returns the corresponding decks
 */
export default function DeckView({ setCommanderExist }) {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const defaultFilters = {};
  const [filters, setFilters] = useState(defaultFilters);
  const [allFilters, setAllFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("winrate");
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
    setAllFilters(filters);
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
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      {/* Banner */}
      <Banner
        title={commander}
        enableFilters={true}
        getFilters={getFilters}
        allFilters={allFilters}
        defaultFilters={defaultFilters}
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
        ]}
        getColors={getColors}
      />

      {/* Table of decks */}
      <table className="block mx-24 my-12 table-fixed">
        <tbody className="[&>tr]:space-y-6 [&>tr>td]:w-max [&>tr>td]:px-2 [&>tr>td]:py-4 [&>tr>td>p]:cursor-pointer [&>tr>td>p]:w-fit">
          <tr className="text-subtext text-lg underline">
            <td>#</td>
            <td>
              <p onClick={() => handleSort("name")}>Player Name</p>
            </td>
            <td>
              <p onClick={() => handleSort("wins")}>Wins</p>
            </td>
            <td>
              <p onClick={() => handleSort("losses")}>Losses</p>
            </td>
            <td>
              <p onClick={() => handleSort("draws")}>Draws</p>
            </td>
            <td>
              <p onClick={() => handleSort("winrate")}>Winrate</p>
            </td>
            <td>
              <p onClick={() => handleSort("tournament")}>Tournament</p>
            </td>
          </tr>
          {isLoading ? (
            <tr className="text-text text-lg">Loading...</tr>
          ) : (
            decks &&
            decks.map((x, i) => (
              <Entry
                rank={i + 1}
                name={decks[i].name}
                mox={decks[i].decklist}
                metadata={[
                  decks[i].wins,
                  decks[i].losses,
                  decks[i].draws,
                  Number(decks[i].winRate).toFixed(2),
                ]}
                tournament={decks[i].tournamentName}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
