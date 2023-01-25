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

  useEffect(() => {
    getCommanders().then((data) => {
      // console.log("Data:", data);
      const commanderRankings = getCommanderRankings(data, topX);
      setCommanders(commanderRankings);
      setIsLoading(false);
    });
  }, [topX]);

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
