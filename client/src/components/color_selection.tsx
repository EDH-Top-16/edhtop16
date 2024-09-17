import cn from "classnames";
import { useCallback } from "react";
import { ColorIcon } from "../assets/icons/colors";

interface ColorSelectionProps {
  selected: string[];
  onChange: (next: string[]) => void;
}

export function ColorSelection({ selected, onChange }: ColorSelectionProps) {
  const handleSelect = useCallback(
    (nextColor: string) => {
      const nextColors = new Set(selected);
      nextColors.add(nextColor);

      const sortedColors: string[] = [];
      ["W", "U", "B", "R", "G", "C"].forEach((color) => {
        if (nextColors.has(color)) {
          sortedColors.push(color);
        }
      });

      onChange(sortedColors);
    },
    [onChange, selected],
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      {["W", "U", "B", "R", "G", "C"].map((color) => (
        <button
          key={color}
          role="button"
          onClick={() => handleSelect(color)}
          className={cn(
            "aspect-square w-12 rounded-full border-2 transition-all duration-200",
            !selected.includes(color)
              ? "border-transparent"
              : "border-highlight",
          )}
        >
          <ColorIcon color={color} height="100%" width="100%" />
        </button>
      ))}
    </div>
  );
}
