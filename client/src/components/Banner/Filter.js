import { useEffect, useState } from "react";

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

  function select(filterBy, value, isTourrneyFilter) {
    if ( isTourrneyFilter ){
      if (Object.keys(filters).includes("tourney_filter")){
        let temp = { ...filters };
        if(!Object.keys(temp.tourney_filter).includes(filterBy)){
          temp.tourney_filter = { ...temp.tourney_filter, [filterBy]: value}
        } else if (JSON.stringify(temp.tourney_filter[filterBy]) === JSON.stringify(value)){
          delete temp.tourney_filter[filterBy];
        } else {
          temp.tourney_filter = {...temp.tourney_filter, [filterBy]: value};
        }
        setFilters(temp);
      } else {
        setFilters({ ...filters, tourney_filter: {[filterBy]: value}});
      }
    } else {
      if (!Object.keys(filters).includes(filterBy)) {
        setFilters({ ...filters, [filterBy]: value });
      } else {
        if (JSON.stringify(filters[filterBy]) === JSON.stringify(value)) {
          let temp = { ...filters };
          delete temp[filterBy];
          setFilters(temp);
        } else {
          setFilters({ ...filters, [filterBy]: value });
        }
      }
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
        <button onClick={() => select("size", {$gte: 64}, true)}>Size {'>'}= 64</button>
        <button onClick={() => select("dateCreated", {$gte: 1670054400}, true)}>Date {'>'}= 1670054400</button>
        <button onClick={() => setFilters({})}>Clear</button>
      </div>
    </div>
  );
}

const topXButton = () => {
  return <button></button>;
};
