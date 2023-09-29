import React from "react";

import BaseFilter from "./base";
import allColors from "@/constants/allColors";

export default function Colors(): React.ReactElement {
  return (
    <BaseFilter title={"Colors"} tag={"colorID"}>
      {({ handleFilter }: any) => (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(allColors).map((color, i) => (
            <button
              onClick={() => handleFilter(color[0])}
              key={i}
              className="[&>svg]:w-10"
            >
              {color[1]}
            </button>
          ))}
        </div>
      )}
    </BaseFilter>
  );
}
