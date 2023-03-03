import { useEffect, useState, useRef } from "react";

export default function Filter({ getFilters }) {
  const [filters, setFilters] = useState({
    tourney_filter: { size: { $gte: 64 } },
  });
  const [openModal, setOpenModal] = useState(false);

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

  function toggleModal() {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  }

  function handleClear() {
    setFilters({});
    setOpenModal(false);
  }

  useEffect(() => {
    getFilters(filters);
    // console.log(filters);
  }, [filters]);

  return (
    <div className="mt-4">
      <div className="relative">
        {filters ? (
          console.log(filters) &&
          Object.keys(filters).map((filter) => (
            <AppliedFilter filter={filter} />
          ))
        ) : (
          <></>
        )}
        {/* <button onClick={() => select("standing", { $lte: 16 })}>Top 16</button>
        <button onClick={() => select("standing", { $lte: 4 })}>Top 4</button>
        <button onClick={() => select("standing", { $lte: 1 })}>Top 1</button>
        <button onClick={() => select("size", { $gte: 64 }, true)}>
          Size {">"}= 64
        </button>
        <button
          onClick={() => select("dateCreated", { $gte: 1670054400 }, true)}
        >
          Date {">"}= 1670054400
        </button> */}
        <button onClick={toggleModal}>+</button>
        <button onClick={() => handleClear()}>Clear</button>
      </div>

      {openModal ? (
        <Modal
          select={select}
          terms={[
            {
              name: "Ranking",
              tag: "standing",
              cond: [
                { $gte: `is greater than (\u2265)` },
                { $eq: `is equal to (=)` },
                { $lte: `is less than (\u2264)` },
              ],
            },
            {
              name: "Tournament Size",
              tag: "size",
              isTourneyFilter: true,
              cond: [
                { $gte: `is greater than (\u2265)` },
                { $eq: `is equal to (=)` },
                { $lte: `is less than (\u2264)` },
              ],
            },
            {
              name: "Date",
              tag: "date",
              cond: [
                { $gte: `is greater than (\u2265)` },
                { $eq: `is equal to (=)` },
                { $lte: `is less than (\u2264)` },
              ],
            },
          ]}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

/**
 * @appliedfilter
 */
const AppliedFilter = ({ filter }) => {
  console.log(filter);
  return <button>{filter}</button>;
};

/**
 *
 * @modal
 */
const Modal = ({ select, terms }) => {
  const inputRef = useRef(null);

  const [filterSelection, setFilterSelection] = useState(terms[0]);
  // console.log("f", filterSelection);
  const [checked, setChecked] = useState(
    Object.keys(filterSelection.cond[0])[0]
  );

  let conds = filterSelection.cond;

  function handleFilterSelection(x) {
    if (x !== filterSelection) {
      let [selected] = terms.filter((obj) => {
        if (obj.name === x) {
          return obj;
        }
      });

      setFilterSelection(selected);
    }
  }

  function handleCheckbox(e) {
    if (checked !== e.target.value) {
      setChecked(e.target.value);
    } else {
      setChecked("");
    }
  }

  function handleSubmit() {
    let filterObj = {};
    filterObj[checked] = Number(inputRef.current.value);
    console.log(filterSelection.tag);
    select(filterSelection.tag, filterObj, filterSelection.isTourneyFilter);
  }

  return (
    <span className="absolute flex space-x-4 mt-4">
      {/* Filter selection */}
      <div className="max-w-max drop-shadow-xl flex flex-col overflow-clip items-start bg-nav border-0 rounded-lg h-min">
        {terms ? (
          terms.map((obj) => (
            <button
              className={`flex flex-wrap w-full px-4 py-2 text-lg text-white hover:bg-select ${
                obj.name === filterSelection.name ? "bg-select" : ""
              }`}
              onClick={() => handleFilterSelection(obj.name)}
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
        {conds ? (
          conds.map((obj) => (
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
                <input className="mx-4 my-2" type="number" ref={inputRef} />
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
          <button onClick={handleSubmit}>Apply</button>
          <button>Cancel</button>
        </div>
      </div>
    </span>
  );
};
