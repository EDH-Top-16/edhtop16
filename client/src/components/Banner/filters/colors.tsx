import BaseFilter from "./base";
import allColors from "@/constants/allColors";

export default function Colors(): JSX.Element {
  return (
    <BaseFilter title={"Colors"} tag={"colors"}>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(allColors).map((color) => (
          <button className="[&>svg]:w-10">{color}</button>
        ))}
      </div>
    </BaseFilter>
  );
}
