import {
  Popover,
  DialogTrigger,
  OverlayArrow,
  Dialog,
  Button,
} from "react-aria-components";
import cn from "classnames";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { useCallback, useRef, useState } from "react";

export interface FilterConfiguration {
  displayName: string;
  variableName: string;
  selectOptions?: [string, string][];
  selectColor?: string[];
  currentValue?: string;
}

interface FilterProps {
  options: FilterConfiguration[];
  onChange?: (variableName: string, value: string | null) => void;
}

export function Filters({ options, onChange }: FilterProps) {
  return (
    <div className="flex space-x-2">
      {options.map((option) => {
        return (
          <FilterButton
            key={option.variableName}
            filter={option}
            onChange={(nextValue) => {
              onChange?.(option.variableName, nextValue);
            }}
          />
        );
      })}
    </div>
  );
}

interface FilterButtonProps {
  filter: FilterConfiguration;
  onChange?: (next: string | null) => void;
}

function FilterButton({ filter: option, onChange }: FilterButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleRemove = useCallback(() => {
    triggerRef.current?.focus();
    onChange?.(null);
  }, [onChange]);

  const [pendingValue, setPendingValue] = useState(
    option.selectOptions?.[0][1],
  );

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

        {option.currentValue && (
          <div
            className="ml-1"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <AiOutlineClose />
          </div>
        )}
      </Button>

      <Popover offset={0}>
        <Dialog className="flex max-w-[250px] flex-col gap-2 rounded-xl bg-white p-4 shadow-modal outline-0 dark:bg-cadet">
          {option.selectOptions && (
            <div className="flex-col">
              <select
                value={pendingValue ?? option.currentValue}
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
              Clear
            </button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
