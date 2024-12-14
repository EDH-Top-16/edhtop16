import cn from "classnames";
import { useCallback } from "react";
import { ColorIcon } from "../assets/icons/colors";

interface ColorSelectionProps {
  selected: string;
  onChange?: (next: string) => void;
}

export function ColorSelection({ selected, onChange }: ColorSelectionProps) {
  const handleSelect = useCallback(
    (nextColor: string) => {
      const nextColors = new Set(Array.from(selected));
      if (nextColors.has(nextColor)) {
        nextColors.delete(nextColor);
      } else {
        nextColors.add(nextColor);
      }

      let sortedColors = "";
      ["W", "U", "B", "R", "G", "C"].forEach((color) => {
        if (nextColors.has(color)) {
          sortedColors += color;
        }
      });

      onChange?.(sortedColors);
    },
    [onChange, selected],
  );

  return (
    <div className="flex space-x-2 md:space-x-1">
      {["W", "U", "B", "R", "G", "C"].map((color) => (
        <button
          key={color}
          role="button"
          onClick={() => handleSelect(color)}
          className={cn(
            "aspect-square w-12 rounded-full border-2 transition-all duration-200 md:w-10",
            !selected.includes(color)
              ? "border-transparent brightness-50"
              : "border-highlight",
          )}
        >
          <ColorIcon color={color} height="100%" width="100%" />
        </button>
      ))}
    </div>
  );
}
