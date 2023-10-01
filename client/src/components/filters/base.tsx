import React from "react";
import { useContext, useRef, useState } from "react";

import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { FilterContext } from "@/context/filter";
import { useClickOutside } from "@/utils/useClickOutside";
import { WUBRGify } from "@/utils/wubrgify";

type BaseFilterProps = {
  children: any;
  title: string;
  tag: string;
};

export default function BaseFilter({
  children,
  title,
  tag,
}: BaseFilterProps): React.ReactElement {
  const { filters, setFilters } = useContext(FilterContext);
  const [popup, setPopup] = useState(false);

  const handleFilter = (value: any, color: Boolean = false) => {
    // If filter is color
    if (color) {
      let colorID = filters.colorID;
      // Check if colorID string already has color
      const colorExists = filters.colorID && filters.colorID.includes(value);
      if (colorExists) {
        // If color exists, remove color from string
        colorID = filters.colorID?.replace(value, "");
      } else {
        // Otherwise, add color to string
        colorID = WUBRGify((filters.colorID || "") + value);
      }

      setFilters({ ...filters, colorID });
      return;
    }

    // Otherwise
    setFilters({ ...filters, [tag]: value.target.value });
  };

  return (
    <span>
      {Object.keys(filters).includes(tag) ? (
        <button onClick={() => setPopup(true)} className="filter-btn-active">
          <p>{title}</p>
          <AiOutlineClose onClick={() => setFilters({})} />
        </button>
      ) : (
        <button onClick={() => setPopup(true)} className="filter-btn-inactive">
          <AiOutlinePlusCircle />
          <p>{title}</p>
        </button>
      )}
      {popup && <Popup setPopup={setPopup}>{children({ handleFilter })}</Popup>}
    </span>
  );
}

type PopupProps = {
  children: React.ReactElement | string;
  setPopup: (value: boolean) => void;
};

function Popup({ children, setPopup }: PopupProps): React.ReactElement {
  const popupRef = useRef(null);

  useClickOutside(popupRef, () => setPopup(false));

  return (
    <div ref={popupRef} className="popup absolute">
      {children}
    </div>
  );
}
