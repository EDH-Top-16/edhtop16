import { useState } from "react";

import { W, U, B, R, G, C } from "../../images/index";

/*
 * TODO: implement communication with filter
 */
export default function ColorSelection() {
  // We store colors into an array which will impact the filter
  const [colors, setColors] = useState([]);
  const [toggle, setToggle] = useState(true);
  // Safeguard against invalid inputs; also used to create each button
  const validColors = ["W", "U", "B", "R", "G", "C"];
  // Used to help the map function display each image
  const images = { W, U, B, R, G, C };

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
          src={images[color]}
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
