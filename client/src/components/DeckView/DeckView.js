import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Banner from "../Banner/Banner";

/**
 * Takes commander name and @returns the corresponding decks
 */
export default function DeckView() {
  let params = useParams();
  const commander = params["*"];

  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      {/* Banner */}
      <Banner
        title={commander}
        enableSearchbar={true}
        enableColors={true}
        enableFilters={true}
      />
    </div>
  );
}
