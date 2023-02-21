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
    if (isTourrneyFilter) {
      if (Object.keys(filters).includes("tourney_filter")) {
        let temp = { ...filters };
        if (!Object.keys(temp.tourney_filter).includes(filterBy)) {
          temp.tourney_filter = { ...temp.tourney_filter, [filterBy]: value };
        } else if (
          JSON.stringify(temp.tourney_filter[filterBy]) ===
          JSON.stringify(value)
        ) {
          delete temp.tourney_filter[filterBy];
        } else {
          temp.tourney_filter = { ...temp.tourney_filter, [filterBy]: value };
        }
        setFilters(temp);
      } else {
        setFilters({ ...filters, tourney_filter: { [filterBy]: value } });
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
      <div>
        <button onClick={() => select("standing", { $lte: 16 })}>Top 16</button>
        <button onClick={() => select("standing", { $lte: 4 })}>Top 4</button>
        <button onClick={() => select("standing", { $lte: 1 })}>Top 1</button>
        <button onClick={() => select("size", { $gte: 64 }, true)}>
          Size {">"}= 64
        </button>
        <button
          onClick={() => select("dateCreated", { $gte: 1670054400 }, true)}
        >
          Date {">"}= 1670054400
        </button>
        <button onClick={() => setFilters({})}>Clear</button>
      </div>
      <Modal
        select={select}
        terms={[
          { name: "Ranking", display: "" },
          { name: "Tournament Size", display: "" },
          { name: "Date", display: "" },
        ]}
        cond={[
          { gte: `is greater than (\u2265)` },
          { eq: `is equal to (=)` },
          { lte: `is less than (\u2264)` },
        ]}
      />
    </div>
  );
}

const Modal = ({ select, terms, cond }) => {
  const [checked, setChecked] = useState(Object.keys(cond[0])[0]);
  const [filterSelection, setFilterSelection] = useState();

  function handleFilterSelection() {}

  function handleCheckbox(e) {
    if (checked !== e.target.value) {
      setChecked(e.target.value);
    } else {
      setChecked("");
    }
  }

  return (
    <span className="absolute flex space-x-4">
      {/* Filter selection */}
      <div className="max-w-max drop-shadow-xl flex flex-col overflow-clip items-start bg-nav border-0 rounded-lg h-min">
        {terms ? (
          terms.map((obj) => (
            <button
              className="flex flex-wrap w-full px-4 py-2 text-lg text-white hover:bg-select"
              onClick={() => handleFilterSelection()}
            >
              {obj.name}
            </button>
          ))
        ) : (
          <></>
        )}
      </div>
      {/* Filter Values */}
      <div className="drop-shadow-xl flex flex-col items-start bg-nav border-0 rounded-lg h-min">
        {cond ? (
          cond.map((obj) => (
            <>
              <div className="px-4 py-2 space-x-2">
                <input
                  value={Object.keys(obj)[0]}
                  className="border-0 rounded-lg"
                  type="checkbox"
                  checked={checked === Object.keys(obj)[0]}
                  onChange={handleCheckbox}
                />

                <label className="text-lg text-white">
                  {Object.values(obj)[0]}
                </label>
              </div>
              {checked === Object.keys(obj)[0] ? (
                <input className="mx-4 my-2" type="text" />
              ) : (
                <></>
              )}
            </>
          ))
        ) : (
          <></>
        )}
        {/* Confirmations */}
        <div className="flex space-x-4 mx-4 my-2">
          <button>Apply</button>
          <button>Cancel</button>
        </div>
      </div>
    </span>
  );
};
