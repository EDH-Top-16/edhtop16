import { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";

import { validColors, colorImages } from "../../images/index";

export default function ColorSelection({ defaultColors = [], getColors }) {
  // We store colors into an array which will impact the filter
  const [colors, setColors] = useState(defaultColors);

  /**
   * Select function that keeps track of what colors you've selected
   */
  function select(color) {
    if (validColors.indexOf(color) === -1) {
      return;
    }

    if (color === "C" && !colors.includes(color)) {
      setColors(["C"]);
    } else if (!colors.includes(color)) {
      setColors((prev) => [...prev.filter((x) => x !== "C"), color]);
    } else {
      setColors(colors.filter((x) => x !== color));
    }
  }

  useEffect(() => {
    let sortedColors = [];
    ["W", "U", "B", "R", "G", "C"].forEach((color) => {
      if (colors.includes(color)) {
        sortedColors.push(color);
      }
    });
    console.log("Updating colors", colors);
    getColors(sortedColors);
  }, [colors]);

  const removeColors = () => {
    setColors([]);
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((o) => !o);
  };

  const btnRef = useRef(null);
  const modalRef = useRef(null);

  const btnBox = btnRef.current?.getBoundingClientRect();

  return (
    <>
      <button
        className={`${
          colors.length > 0 ? "border-solid border-voilet text-cadet dark:border-gray" : "border-dashed border-text text-text"
        } border rounded-full text-sm px-3 p-1 dark:border-gray dark:text-white flex items-center`}
        ref={btnRef}
        onClick={() => toggleOpen()}
      >
        {/* {isTourneyFilter ? "Tournament " : ""} */}
        {colors.length === 0 && (
          <div className="mr-1">
            <AiOutlinePlusCircle />
          </div>
        )}
        <div className="flex flex-row gap-2">

        {colors.length > 0
          ? colors.map((color) => (
              <img
                key={color}
                className={`rounded-full transition-all duration-200 aspect-square w-6`}
                src={colorImages[color]}
                alt={color}
              />
            ))
          : "Colors"}
        </div>
        {colors.length > 0 && (
          <button
            className="ml-1"
            onClick={(e) => {
              e.stopPropagation();
              setColors([]);
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
              right:
                btnBox?.left + 200 < window.screen.width
                  ? undefined
                  : 0, 
              width: "200px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row gap-3 flex-wrap">
            {validColors.map((color) => (
              <img
                key={color}
                className={`${
                  !colors.includes(color)
                    ? "border-transparent"
                    : "border-highlight"
                } border-2 rounded-full transition-all duration-200 aspect-square w-12`}
                onClick={() => select(color)}
                src={colorImages[color]}
                alt={color}
                role="button"
              />
            ))}
</div>
            <div className="flex flex-row md:gap-2 flex-wrap">
              {/* <button className="flex-grow rounded-lg p-2 text-white bg-accent text-sm" onClick={select()}>Apply</button> */}
              <button
                className="flex-grow rounded-lg p-2 dark:text-white bg-highlight text-sm"
                onClick={removeColors}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
