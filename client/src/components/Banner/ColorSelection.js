import { useState } from "react";

import { validColors, colorImages } from "../../images/index";

/*
 * TODO: implement communication with filter
 */
export default function ColorSelection() {
  // We store colors into an array which will impact the filter
  const [colors, setColors] = useState([]);

  /**
   * Select function that keeps track of what colors you've selected
   */
  function select(color) {
    if (validColors.indexOf(color) === -1) {
      return;
    }

    if (!colors.includes(color)) {
      setColors((prev) => [...prev, color]);
    } else {
      setColors(colors.filter((x) => x !== color));
    }
  }

  return (
    <div
      className={
        "flex space-x-4 items-end drop-shadow-3xl [&>img]:cursor-pointer [&>img]:w-8"
      }
    >
      {validColors.map((color) => (
        <img
          key={color}
          className={
            !colors.includes(color)
              ? ""
              : "border-2 border-highlight rounded-3xl"
          }
          onClick={() => select(color)}
          src={colorImages[color]}
          alt={color}
        />
      ))}

      <a
        className="cursor-pointer underline text-lg text-text"
        onClick={() => setColors([])}
      >
        Clear
      </a>
    </div>
  );
}
