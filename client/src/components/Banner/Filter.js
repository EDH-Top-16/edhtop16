import { useEffect, useState } from "react";

export default function Filter({ getFilters }) {
  const [filters, setFilters] = useState([]);

  /**
   * Select function that keeps track of what filters you've selected
   * @TODO need to make string for the filters
   */
  function select(filter) {
    if (!filters.includes(filter)) {
      setFilters((prev) => [...prev, filter]);
    } else {
      setFilters(filters.filter((x) => x !== filter));
    }
  }

  useEffect(() => {
    getFilters(filters);
  }, [filters]);

  return (
    <div className="flex">
      <button>Filter</button>

      <div>
        <button onClick={() => select({ standing: { $lt: 17 } })}>
          Top 16
        </button>
        <button onClick={() => select({ $lt: 5 })}>Top 4</button>
        <button onClick={() => select({ $lt: 2 })}>Top 1</button>
      </div>
    </div>
  );
}
