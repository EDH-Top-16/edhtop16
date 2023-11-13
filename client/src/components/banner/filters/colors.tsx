import { allColors } from "../../../constants/allColors";
import { BaseFilter } from "./base";

export function Colors() {
  return (
    <BaseFilter title={"Colors"} tag={"colors"}>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(allColors).map((color, i) => (
          <button key={i} className="[&>svg]:w-10">
            {color}
          </button>
        ))}
      </div>
    </BaseFilter>
  );
}
