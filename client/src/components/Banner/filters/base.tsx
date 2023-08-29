import { useContext, useRef, useState } from "react";

import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { FilterContext } from "@/context/filter";
import { onClickOutside } from "@/utils/onClickOutside";

type BaseFilterProps = {
  children: JSX.Element | string;
  tag: string;
};

export default function BaseFilter({
  children,
  tag,
}: BaseFilterProps): JSX.Element {
  const { filters } = useContext(FilterContext);

  const [popup, setPopup] = useState(false);

  return (
    <span>
      {Object.keys(filters).includes(tag) ? (
        <button className="filter-btn-active">
          <p>{children}</p>
          <AiOutlineClose />
        </button>
      ) : (
        <button onClick={() => setPopup(true)} className="filter-btn-inactive">
          <AiOutlinePlusCircle />
          <p>{children}</p>
        </button>
      )}
      {popup && <Popup tag={tag} setPopup={setPopup} />}
    </span>
  );
}

type PopupProps = {
  tag: string;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

function Popup({ tag, setPopup }: PopupProps): JSX.Element {
  const popupRef = useRef(null);

  onClickOutside(popupRef, () => setPopup(false));

  if (tag === "colors")
    return (
      <div ref={popupRef} className="absolute">
        colors
      </div>
    );
  else {
    return (
      <div ref={popupRef} className="absolute">
        {tag}
      </div>
    );
  }
}
