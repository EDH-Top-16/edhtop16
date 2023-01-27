import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getCommanders, getDeckRankings } from "../../data/Commanders";

/**
 * Takes commander name and @returns the corresponding decks
 */
export default function DeckView() {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [filters, setFilters] = useState([]);
  const [allFilters, setAllFilters] = useState([]);

  let params = useParams();
  const commander = params["*"].replaceAll("+", "/");

  /**
   * These two functionsg get data from colorSelection and filters child components
   */
  function getColors(data) {
    setColors(data);
  }
  function getFilters(data) {
    setFilters(data);
  }

  useEffect(() => {
    getCommanders({
      commander: commander,
    }).then((data) => {
      console.log("Data:", data);
      const deckRankings = getDeckRankings(data);
      setDecks(deckRankings);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      {/* Banner */}
      <Banner
        title={commander}
        enableFilters={true}
        getFilters={getFilters}
        getColors={getColors}
      />

      {/* Table of decks */}
      <table className="block mx-24 my-12 table-fixed">
        <tbody className="[&>tr]:space-y-6 [&>tr>td]:w-max [&>tr>td]:px-2 [&>tr>td]:py-4">
          <tr className="text-subtext text-lg underline">
            <td>#</td>
            <td>Player Name</td>
            <td>Wins</td>
            <td>Losses</td>
            <td>Draws</td>
            <td>Tournament</td>
          </tr>
          {isLoading ? (
            <tr>Loading...</tr>
          ) : (
            decks &&
            decks.map((x, i) => (
              <Entry
                rank={i + 1}
                name={decks[i].name}
                mox={decks[i].decklist}
                metadata={[decks[i].wins, decks[i].losses, decks[i].draws]}
                tournament={decks[i].tournamentName}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
