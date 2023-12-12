import { useEffect, useState, useRef, useMemo } from "react";
import moment from "moment";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlinePlusCircle,
} from "react-icons/ai";

export default function Filter({
  getFilters,
  allFilters,
  terms,
  defaultFilters,
  ColorPicker = <></>,
}) {
  const [filters, setFilters] = useState(allFilters);
  const [openModal, setOpenModal] = useState(false);

  /**
   * Select function that keeps track of what filters you've selected
   * @TODO need to make string for the filters]
   */
  function select(filterBy, value, isTourneyFilter) {
    if (isTourneyFilter) {
      if (Object.keys(filters).includes("tourney_filter")) {
        // If tourney_filter exists
        let temp = { ...filters };
        if (!Object.keys(temp.tourney_filter).includes(filterBy)) {
          // If tourney_filter does not contain filterBy, append
          temp.tourney_filter = { ...temp.tourney_filter, [filterBy]: value };
        } else if (
          JSON.stringify(temp.tourney_filter[filterBy]) !==
          JSON.stringify(value)
        ) {
          // If tourney_filter contains filterBy and value is differemt, update
          temp.tourney_filter = { ...temp.tourney_filter, [filterBy]: value };
        } else {
          // If tourney_filter contains filterBy and value is the same, do nothing
          return;
        }
        setFilters(temp);
      } else {
        // If tourney_filter does not exist, create it
        setFilters({ ...filters, tourney_filter: { [filterBy]: value } });
      }
    } else {
      if (!Object.keys(filters).includes(filterBy)) {
        // If filters does not contain filterBy, append value
        setFilters({ ...filters, [filterBy]: value });
      } else {
        if (JSON.stringify(filters[filterBy]) !== JSON.stringify(value)) {
          // If filters contains filterBy and value is not the same, set filterBy
          setFilters({ ...filters, [filterBy]: value });
        } else {
          // If filters contsins filterBy and value is the same, do nothing
          return;
        }
      }
    }
  }

  function removeFilters(filterBy, isTourneyFilter) {
    if (isTourneyFilter) {
      if (Object.keys(filters).includes("tourney_filter")) {
        let temp = { ...filters };
        if (Object.keys(temp.tourney_filter).includes(filterBy)) {
          delete temp.tourney_filter[filterBy];
          setFilters(temp);
        }
      }
    } else {
      if (Object.keys(filters).includes(filterBy)) {
        // If filters does not contain filterBy, append value
        let temp = { ...filters };
        delete temp[filterBy];
        setFilters(temp);
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

  function handleReset() {
    setFilters(defaultFilters);
    // console.log(defaultFilters);
    // console.log(allFilters);
    // console.log(filters);
    setOpenModal(false);
  }

  useEffect(() => {
    getFilters(filters);
    // console.log(filters);
  }, [filters]);

  return (
    <div className="inline-block">
      <div className="flex gap-2 relative text-lg items-center flex-wrap">
        {ColorPicker}
        {terms?.map((term) => (
          <Term
            isTourneyFilter={true}
            removeFilters={removeFilters}
            term={term}
            key={term.tag}
            filter={
              term.isTourneyFilter
                ? (filters["tourney_filter"] || {})[term.tag]
                : filters[term.tag]
            }
            select={select}
          />
        ))}

        {terms ? (
          <>
            <button
              className="flex items-center px-2 bg-highlight text-white border-0 rounded-full text-sm py-1 px-2"
              onClick={() => handleReset()}
            >
              Reset
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

const Term = ({ term, filter, isTourneyFilter, removeFilters, select }) => {
  const parsedName = useMemo(() => {
    if (!filter) return "";
    let name = term.name;
    let [val] = Object.entries(filter);
    let cond = val[0];

    if (term.cond.find(c => !!c[cond])?.component === 'select') {
      return term.cond.find(c => !!c[cond]).values.find(v => v.value == val[1])?.name
    }

    if (cond === "$gte") {
      cond = "\u2265";
    } else if (cond === "$eq") {
      cond = "=";
    } else {
      cond = "\u2264";
    }
    let num = val[1];
    let parsed = `${name} ${cond} ${
      term.cond.find((item) => !!item[val[0]]).type === "date"
        ? moment.unix(num).format("MM/DD/YYYY")
        : num
    }`;
    return parsed;
  }, [filter, term]);

  const btnRef = useRef(null);
  const modalRef = useRef(null);

  const btnBox = btnRef.current?.getBoundingClientRect();

  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((o) => !o);
  };

  const [selectedCond, setSelectedCond] = useState(
    filter
      ? term.cond.find((item) => !!item[Object.keys(filter)[0]])
      : term.cond[0]
  );

  const [newValue, setNewValue] = useState();

  useEffect(() => {
    if (filter) {
      const cond = term.cond.find((item) => !!item[Object.keys(filter)[0]]);
      setSelectedCond(cond);
      setNewValue(
        cond.type === "date"
          ? moment.unix(Number(Object.values(filter)[0])).format("yyyy-MM-DD")
          : Object.values(filter)[0]
      );
    } else {
      resetDialog();
    }
  }, [filter, term]);

  // console.log(term.name, term.cond, filter, selectedCond);

  const resetDialog = () => {
    setNewValue();
    setSelectedCond(term.cond[0]);
  };

  const removeFilter = () => {
    removeFilters(term.tag, term.isTourneyFilter);
    resetDialog();
    setOpen(false);
  };

  const submit = (e) => {
    e.stopPropagation();
    let filterObj = {};

    const op = Object.keys(selectedCond).filter(val => val !== 'type' && val !== 'values')[0]

    // Check if input type is number
    if (selectedCond.type === "number") {
      // Check if input is a number
      // console.log("num");
      if (!isNaN(Number(newValue)) && Number(newValue) > 0) {
        // console.log(newValue, op);
        filterObj[op] = Number(newValue);
        select(term.tag, filterObj, term.isTourneyFilter);
      }
    }

    // Check if input type is date
    if (selectedCond.type === "date") {
      if (moment(newValue).isValid()) {
        filterObj[op] = Number(moment(newValue).unix());
        select(term.tag, filterObj, term.isTourneyFilter);
      }
    }
    setOpen(false);
  };

  return (
    <>
      <button
        className={`${
          !!filter
            ? "border-solid border-voilet text-cadet dark:border-gray"
            : "border-dashed border-text text-lightText dark:text-text"
        } border rounded-full text-sm px-3 p-1 dark:border-gray dark:text-white flex items-center`}
        ref={btnRef}
        onClick={() => toggleOpen()}
      >
        {/* {isTourneyFilter ? "Tournament " : ""} */}
        {!filter && (
          <div className="mr-1">
            <AiOutlinePlusCircle />
          </div>
        )}
        {filter ? parsedName : term.name}
        {filter && (
          <button
            className="ml-1"
            onClick={(e) => {
              e.stopPropagation();
              removeFilter();
            }}
          >
            <AiOutlineClose />
          </button>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          role="alert"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            setNewValue(filter ? Object.values(filter)[0] : "");
          }}
        >
          <div
            className="fixed z-50 rounded-xl dark:bg-cadet bg-white p-4 flex flex-col gap-2 shadow-modal"
            ref={modalRef}
            style={{
              top: btnBox?.bottom,
              left:
                btnBox?.left + 200 < window.screen.width
                  ? btnBox?.left
                  : undefined,
              right: btnBox?.left + 200 < window.screen.width ? undefined : 0,
              width: "200px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
          {term.cond.length > 1 && <select value={Object.keys(selectedCond)[0]} onChange={(e) => setSelectedCond(term.cond.find((item) => !!item[e.target.value]))} className="rounded-lg px-2 py-2 text-sm focus-visible:outline-none border-2 border-solid border-transparent focus:border-accent">
            {term.cond.map((cond) => {
              const op_name = Object.keys(cond).filter(val => val !== 'type')[0]
              return (
                <option key={op_name} value={op_name}>
                  {cond[op_name]}
                </option>
              )
            })}
          </select>}

          <FilterInput  condition={selectedCond} value={newValue} setValue={setNewValue}/>

            <div className="flex flex-row gap-2 flex-wrap">
              <button
                className="flex-grow rounded-lg p-2 text-white bg-accent text-sm"
                onClick={submit}
              >
                Apply
              </button>
              <button
                className="flex-grow rounded-lg p-2 dark:text-white bg-highlight text-sm"
                onClick={removeFilter}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FilterInput = ({ condition, value, setValue }) => {

  if (condition.component === 'select') {
    return (
      <select value={value} onChange={(e) => setValue(e.target.value)} className="rounded-lg px-2 py-2 text-sm focus-visible:outline-none border-2 border-solid border-transparent focus:border-accent">
        {condition.values.map((val) => {
          return (
            <option key={val.value} value={val.value} disabled={val.disabled ?? false} selected={val.selected ?? false}>
              {val.name}
            </option>
          )
        })}
      </select>
    )
  }

  return (
    <input className="rounded-lg text-sm px-2 py-1 focus-visible:outline-none border-2 border-solid border-transparent focus:border-accent" type={condition.type} value={value} onChange={(e) => setValue(e.target.value)}/>
  )
}
