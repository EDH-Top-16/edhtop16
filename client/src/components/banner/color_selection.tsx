import cn from "classnames";
import { useCallback, useRef, useState } from "react";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { ColorIcon } from "../../assets/icons/colors";

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

  const [open, setOpen] = useState(false);
  const removeColors = () => {
    onChange([]);
    setOpen(false);
  };

  const toggleOpen = () => {
    setOpen((o) => !o);
  };

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const buttonBox = buttonRef.current?.getBoundingClientRect();

  const modalRef = useRef(null);

  return (
    <>
      <button
        className={cn(
          "flex items-center rounded-full border p-1 px-3 text-sm dark:border-gray dark:text-white",
          selected.length > 0
            ? "border-solid border-voilet text-cadet dark:border-gray"
            : "border-dashed border-text text-lightText dark:text-text",
        )}
        ref={buttonRef}
        onClick={toggleOpen}
      >
        {selected.length === 0 && (
          <div className="mr-1">
            <AiOutlinePlusCircle />
          </div>
        )}

        <div className="flex flex-row gap-2">
          {selected.length > 0
            ? selected.map((color) => <ColorIcon key={color} color={color} />)
            : "Colors"}
        </div>

        {selected.length > 0 && (
          <button
            className="ml-1"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          >
            <AiOutlineClose />
          </button>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          role="alert"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className="fixed z-50 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-modal dark:bg-cadet"
            ref={modalRef}
            style={{
              top: buttonBox?.bottom,
              left:
                (buttonBox?.left ?? 0) + 200 < window.screen.width
                  ? buttonBox?.left
                  : undefined,
              right:
                (buttonBox?.left ?? 0) + 200 < window.screen.width
                  ? undefined
                  : 0,
              width: "200px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row flex-wrap gap-3">
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
                  <ColorIcon color={color} />
                </button>
              ))}
            </div>
            <div className="flex flex-row flex-wrap md:gap-2">
              <button
                className="flex-grow rounded-lg bg-highlight p-2 text-sm dark:text-white"
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
