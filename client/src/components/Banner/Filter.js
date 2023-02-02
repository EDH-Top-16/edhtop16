import { useEffect, useState } from "react";
import { enhanceManualRouteObjects } from "react-router/dist/lib/components";

export default function Filter({ getFilters }) {
  const [filters, setFilters] = useState({});

  /**
   * Select function that keeps track of what filters you've selected
   * @TODO need to make string for the filters
   * {
   *  standing: {
   *    le/eq/ge: x
   *  },
   *  tourney_filter: {
   *    entries: {
   *      le/eq/ge: x
   *    },
   *    date: {
   *      le/eq/ge: week/month(s)/year/alltime
   *    }
   *  }
   * }
   */
  function select(filterBy, value) {
    if (!Object.keys(filters).includes(filterBy)) {
      setFilters({ ...filters, [filterBy]: value });
    } else {
      // if (Object.values().includes(value)) {
      //   delete filters[filterBy];
      // }
      // filters[filterBy] = value;
    }
  }

  useEffect(() => {
    getFilters(filters);
  }, [filters]);

  return (
    <div className="flex">
      <button>Filter</button>

      <div>
        <button onClick={() => select("standing", { $lte: 16 })}>Top 16</button>
        <button onClick={() => select("standing", { $lte: 4 })}>Top 4</button>
        <button onClick={() => select("standing", { $lte: 1 })}>Top 1</button>
        <button onClick={() => setFilters({})}>Clear</button>
      </div>
    </div>
  );
}

const topXButton = () => {
  return <button></button>;
};
