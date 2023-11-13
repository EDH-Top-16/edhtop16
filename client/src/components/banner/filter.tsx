import { useContext, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { FilterContext } from "../../context/filter";
import { useClickOutside } from "../../utils/useClickOutside";
import { Colors } from "./filters/colors";
import { Standing } from "./filters/standing";

export function Filter() {
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
              "absolute flex-col space-y-4 md:relative md:flex md:flex-row md:space-x-4 md:space-y-0 " +
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

  useClickOutside(dropdownRef, () => setOpenFilters(false));

  return enabled.map((filter, i) => {
    switch (filter) {
      case "colors":
        return <Colors key={i} />;
      case "standing":
        return <Standing key={i} />;
      default:
        return null;
    }
  });
}
