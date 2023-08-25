import { useState, useContext, useRef } from "react";
import { AiOutlineDown } from "react-icons/ai";

import { FilterContext } from "@/context/filter";
import { componentMap } from "./filters";
import { onClickOutside } from "@/utils/onClickOutside";

export default function Filter(): JSX.Element {
  const { enabled } = useContext(FilterContext);

  const [openFilters, setOpenFilters] = useState(false);

  return (
    <>
      <div className="flex space-x-4">
        <div className="relative">
          <button
            className="filter-btn-inactive md:hidden"
            onClick={() => setOpenFilters(!openFilters)}
          >
            <p>Filters</p>
            <AiOutlineDown />
          </button>

          <div
            className={
              "popup absolute flex-col space-y-4 md:relative md:flex md:flex-row md:space-x-4 md:space-y-0 " +
              (openFilters ? "flex" : "hidden")
            }
          >
            <FilterDropdown setOpenFilters={setOpenFilters} />
          </div>
        </div>
        <button className="filter-btn md:ml-4">Reset</button>
      </div>
    </>
  );
}

type FilterDropdownProps = {
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
};

function FilterDropdown({ setOpenFilters }: FilterDropdownProps) {
  const { enabled } = useContext(FilterContext);
  const dropdownRef = useRef(null);

  onClickOutside(dropdownRef, () => setOpenFilters(false));

  return enabled.map((filter, i) => {
    const Filter = componentMap[filter];
  return Filter ? <Filter key={i} /> : null;
  });
}
