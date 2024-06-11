import cn from "classnames";
import { useCallback, useRef, useState } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ColorSelection } from "./color_selection";

export interface FilterConfiguration {
  displayName: string;
  variableName: string;
  currentValue?: string;
  inputType?: "date" | "colorId";
  selectOptions?: [string, string][];
}

interface FilterProps {
  options: FilterConfiguration[];
  onChange?: (nextPartialValues: Record<string, string | null>) => void;
}

export function Filters({ options, onChange }: FilterProps) {
  const resetAll = useCallback(() => {
    const nextValues = Object.fromEntries(
      options.map((o) => [o.variableName, null]),
    );

    onChange?.(nextValues);
  }, [onChange, options]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        return (
          <FilterButton
            key={option.variableName}
            filter={option}
            onChange={(nextValue) => {
              onChange?.({ [option.variableName]: nextValue });
            }}
          />
        );
      })}

      <button
        className="rounded-full bg-red-400 px-2 py-1 text-sm text-white"
        onClick={resetAll}
      >
        Reset
      </button>
    </div>
  );
}

interface FilterButtonProps {
  filter: FilterConfiguration;
  onChange?: (next: string | null) => void;
}

function FilterButton({ filter: option, onChange }: FilterButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [pendingValue, setPendingValue] = useState(
    option.currentValue ?? option.selectOptions?.[0][1],
  );

  const handleRemove = useCallback(() => {
    triggerRef.current?.focus();
    onChange?.(null);
    setPendingValue(undefined);
  }, [onChange]);

  const handleApply = useCallback(() => {
    triggerRef.current?.focus();
    if (pendingValue) {
      onChange?.(pendingValue);
      setPendingValue(undefined);
    }
  }, [onChange, pendingValue]);

  let buttonText = option.displayName;
  if (option.currentValue && option.selectOptions) {
    const selectedOptionText = option.selectOptions.find(
      ([, key]) => key === option.currentValue,
    )?.[0];

    if (selectedOptionText) buttonText += `: ${selectedOptionText}`;
  } else if (option.currentValue) {
    buttonText += `: ${option.currentValue}`;
  }

  return (
    <DialogTrigger>
      <Button
        ref={triggerRef}
        className={cn(
          `flex items-center rounded-full border p-1 px-3 text-sm dark:border-gray dark:text-white`,
          !!option.currentValue
            ? "border-solid border-voilet text-cadet dark:border-gray"
            : "border-dashed border-text text-lightText dark:text-text",
        )}
      >
        {!option.currentValue && (
          <div className="mr-1">
            <AiOutlinePlusCircle />
          </div>
        )}

        {buttonText}
      </Button>

      <Popover offset={0}>
        <Dialog className="flex max-w-[250px] flex-col gap-2 rounded-xl bg-white p-4 shadow-modal outline-0 dark:bg-cadet">
          {option.selectOptions && (
            <div className="flex-col">
              <select
                value={pendingValue || option.currentValue}
                onChange={(e) => {
                  setPendingValue(e.target.value);
                }}
                className="rounded-lg border-2 border-solid border-transparent px-2 py-2 text-sm focus:border-accent focus-visible:outline-none"
              >
                {option.selectOptions.map(([displayName, value]) => (
                  <option key={value} value={value}>
                    {displayName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {option.inputType === "date" && (
            <>
              <label htmlFor="filter-date-input" className="text-white">
                Tournament is after:
              </label>

              <input
                type="date"
                id="filter-date-input"
                value={pendingValue ?? option.currentValue}
                min="2016-01-01"
                onChange={(e) => {
                  setPendingValue(e.target.value);
                }}
              />
            </>
          )}

          {option.inputType === "colorId" && (
            <ColorSelection
              selected={(pendingValue ?? option.currentValue ?? "").split("")}
              onChange={(next) => {
                setPendingValue(next.join(""));
              }}
            />
          )}

          <div className="flex flex-row flex-wrap gap-2">
            <button
              onClick={handleApply}
              className="flex-grow rounded-lg bg-accent p-2 text-sm text-white"
            >
              Apply
            </button>
            <button
              className="flex-grow rounded-lg bg-highlight p-2 text-sm dark:text-white"
              onClick={handleRemove}
            >
              Reset
            </button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
