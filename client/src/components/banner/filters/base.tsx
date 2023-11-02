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
}: BaseFilterProps): JSX.Element {
  const { filters } = useContext(FilterContext);

  const [popup, setPopup] = useState(false);

  return (
    <span>
      {Object.keys(filters).includes(tag) ? (
        <button className="filter-btn-active">
          <p>{title}</p>
          <AiOutlineClose />
        </button>
      ) : (
        <button onClick={() => setPopup(true)} className="filter-btn-inactive">
          <AiOutlinePlusCircle />
          <p>{title}</p>
        </button>
      )}
      {popup && <Popup setPopup={setPopup}>{children}</Popup>}
    </span>
  );
}

type PopupProps = {
  children: JSX.Element | string;
  setPopup: (value: boolean) => void;
};

function Popup({ children, setPopup }: PopupProps): JSX.Element {
  const popupRef = useRef(null);

  useClickOutside(popupRef, () => setPopup(false));

  return (
    <div ref={popupRef} className="popup absolute">
      {children}
    </div>
  );
}
