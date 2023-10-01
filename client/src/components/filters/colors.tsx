import React from "react";
import { useContext } from "react";

import { FilterContext } from "@/context/filter";
import BaseFilter from "./base";
import allColors from "@/constants/allColors";

export default function Colors(): React.ReactElement {
  const { filters } = useContext(FilterContext);

  // If filter has colorID, check which colors are enabled
  const enabled = filters.colorID?.split("");

  return (
    <BaseFilter title={"Colors"} tag={"colorID"}>
      {({ handleFilter }: any) => (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(allColors).map((color, i) => (
            <button
              onClick={() => handleFilter(color[0], true)}
              key={i}
              className={
                "[&>svg]:w-10" +
                (enabled?.includes(color[0])
                  ? " filter-btn-active"
                  : " filter-btn-inactive")
              }
            >
              {color[1]}
            </button>
          ))}
        </div>
      )}
    </BaseFilter>
  );
}
