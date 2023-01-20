import { useEffect, useState } from "react";
import axios from "axios";

import Banner from "../Banner/Banner";
import Entry from "./Entry";
import { getCommanders } from "../../data/Commanders";

export default function CommanderView() {
  const [commanders, setCommanders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCommanders().then((data) => {
      setCommanders(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      <Banner title={"View Decks"} enableSearchbar={true} enableColors={true} />
      <table className="block mx-24 my-12 table-fixed">
        <tbody className="[&>tr]:space-y-6 [&>tr>td]:w-max [&>tr>td]:px-4">
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>%</td>
            <td>Colors</td>
          </tr>
          {isLoading ? (
            <></>
          ) : (
            commanders &&
            commanders.map((k, v) => (
              <Entry
                key={v}
                name={commanders[v].commander}
                metadata={[]}
                colors={commanders[v].colorID}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
