import cn from "classnames";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ColorSelection } from "./color_selection";

export interface FilterConfiguration {
  displayName: string;
  variableName:
    | string
    | {
        variableName: string;
        label: string;
        shortLabel?: string;
        currentValue?: string;
      }[];
  currentValue?: string;
  label?: string;
  inputType?: "date" | "colorId" | "number";
  selectOptions?: [string, string][];
}

interface FilterProps {
  options: FilterConfiguration[];
  onChange?: (nextPartialValues: Record<string, string | null>) => void;
}

export function Filters({ options, onChange }: FilterProps) {
  const resetAll = useCallback(() => {
    const allVariableNames = options.flatMap((o) =>
      typeof o.variableName === "string"
        ? [o.variableName]
        : o.variableName.map((oo) => oo.variableName),
    );

    const nextValues = Object.fromEntries(
      allVariableNames.map((v) => [v, null]),
    );

    onChange?.(nextValues);
  }, [onChange, options]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const activeVariableName = Array.isArray(option.variableName)
          ? option.variableName.find((v) => v.currentValue != null)
              ?.variableName ?? option.variableName[0].variableName
          : option.variableName;

        return (
          <FilterButton
            key={activeVariableName}
            filter={option}
            onChange={onChange}
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
  onChange?: (nextPartialValues: Record<string, string | null>) => void;
}

function FilterButton({ filter: option, onChange }: FilterButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [pendingValue, setPendingValue] = useState(
    option.currentValue ?? option.selectOptions?.[0][1],
  );

  const defaultVariableName = useMemo(
    () =>
      typeof option.variableName === "string"
        ? option.variableName
        : option.variableName.find((v) => v.currentValue != null)
            ?.variableName ?? option.variableName[0].variableName,
    [option.variableName],
  );

  const [pendingVariableName, setPendingVariableName] =
    useState(defaultVariableName);

  const defaultVariableState = useMemo((): Record<string, string | null> => {
    const allVariableNames =
      typeof option.variableName === "string"
        ? [option.variableName]
        : option.variableName.map((v) => v.variableName);

    return Object.fromEntries(allVariableNames.map((n) => [n, null] as const));
  }, [option.variableName]);

  const handleRemove = useCallback(() => {
    triggerRef.current?.focus();

    onChange?.(defaultVariableState);
    setPendingValue(undefined);
    setPendingVariableName(defaultVariableName);
  }, [defaultVariableName, defaultVariableState, onChange]);

  const currentValue = useMemo(() => {
    if (Array.isArray(option.variableName)) {
      return option.variableName.find((v) => v.currentValue)?.currentValue;
    }

    return option.currentValue;
  }, [option.currentValue, option.variableName]);

  const handleApply = useCallback(() => {
    triggerRef.current?.focus();

    const nextValue = pendingValue ?? currentValue;
    if (nextValue) {
      const nextState = { ...defaultVariableState };
      nextState[pendingVariableName] = nextValue;

      onChange?.(nextState);
      setPendingValue(undefined);
      setPendingVariableName(defaultVariableName);
    }
  }, [
    currentValue,
    defaultVariableName,
    defaultVariableState,
    onChange,
    pendingValue,
    pendingVariableName,
  ]);

  let buttonText = option.displayName;
  if (option.currentValue && option.selectOptions) {
    const selectedOptionText = option.selectOptions.find(
      ([, key]) => key === option.currentValue,
    )?.[0];

    if (selectedOptionText) buttonText += `: ${selectedOptionText}`;
  } else if (option.currentValue) {
    buttonText += `: ${option.currentValue}`;
  } else if (Array.isArray(option.variableName)) {
    const selected = option.variableName.find((v) => v.currentValue != null);
    if (selected) {
      buttonText += ` ${selected.shortLabel ?? selected.label} ${
        selected.currentValue
      }`;
    }
  }

  return (
    <DialogTrigger>
      <Button
        ref={triggerRef}
        className={cn(
          `flex items-center rounded-full border p-1 px-3 text-sm dark:border-gray dark:text-white`,
          !!currentValue
            ? "border-solid border-voilet text-cadet dark:border-gray"
            : "border-dashed border-text text-lightText dark:text-text",
        )}
      >
        {!currentValue && (
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

          {option.inputType === "colorId" && (
            <ColorSelection
              selected={(pendingValue ?? option.currentValue ?? "").split("")}
              onChange={(next) => {
                setPendingValue(next.join(""));
              }}
            />
          )}

          {(option.inputType === "number" || option.inputType === "date") && (
            <>
              <label htmlFor="filter-number-input" className="text-white">
                {option.label ?? option.displayName}
              </label>

              {Array.isArray(option.variableName) && (
                <select
                  value={pendingVariableName}
                  onChange={(e) => {
                    setPendingVariableName(e.target.value);
                  }}
                  className="rounded-lg border-2 border-solid border-transparent px-2 py-2 text-sm focus:border-accent focus-visible:outline-none"
                >
                  {option.variableName.map(({ label, variableName }) => (
                    <option key={variableName} value={variableName}>
                      {label}
                    </option>
                  ))}
                </select>
              )}

              <input
                type={option.inputType}
                id="filter-number-input"
                value={pendingValue ?? currentValue}
                onChange={(e) => {
                  setPendingValue(e.target.value);
                }}
              />
            </>
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
