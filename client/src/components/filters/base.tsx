import React from "react";
import { useContext, useRef, useState } from "react";

import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { FilterContext } from "@/context/filter";
import { useClickOutside } from "@/utils/useClickOutside";

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

  const handleFilter = (value: any) => {
    setFilters({ ...filters, [tag]: value });
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
