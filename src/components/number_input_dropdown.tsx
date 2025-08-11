import cn from 'classnames';
import {memo, useCallback, useRef} from 'react';

export interface NumberInputDropdownOption {
  value: number | null;
  label: string;
}

export interface NumberInputDropdownProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  min: string;
  options: NumberInputDropdownOption[];
  onChange: (value: string) => void;
  onSelect: (value: number | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  className?: string;
  disabled?: boolean;
  dropdownClassName: string;
}

export const NumberInputDropdown = memo(function NumberInputDropdown({
  id,
  label,
  value,
  placeholder,
  min,
  options,
  onChange,
  onSelect,
  onKeyDown,
  className,
  disabled = false,
  dropdownClassName,
}: NumberInputDropdownProps) {
  const isOpenRef = useRef(false);
  const wasFocusedRef = useRef(false);

  const handleOptionSelect = useCallback(
    (optionValue: number | null) => {
      onSelect(optionValue);
      isOpenRef.current = false;
    },
    [onSelect],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    wasFocusedRef.current = document.activeElement === e.target;
  }, []);

  const handleInputClick = useCallback(
    (e: React.MouseEvent) => {
      if (wasFocusedRef.current && isOpenRef.current) {
        const dropdown = (e.target as HTMLElement).parentElement?.querySelector(
          `.${dropdownClassName}`,
        );
        if (dropdown) {
          dropdown.classList.add('hidden');
        }
        isOpenRef.current = false;
        (e.target as HTMLInputElement).blur();
      }
    },
    [dropdownClassName],
  );

  return (
    <>
      <label
        htmlFor={id}
        className="mb-1 text-center text-sm font-medium text-white"
      >
        {label}
      </label>
      <div className="relative">
        <input
          style={{textAlign: 'center'}}
          id={id}
          type="number"
          min={min}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onMouseDown={handleMouseDown}
          onClick={handleInputClick}
          onFocus={(e) => {
            const dropdown = e.target.parentElement?.querySelector(
              `.${dropdownClassName}`,
            );
            if (dropdown) {
              dropdown.classList.remove('hidden');
            }
            isOpenRef.current = true;
          }}
          onBlur={(e) => {
            setTimeout(() => {
              const dropdown = e.target.parentElement?.querySelector(
                `.${dropdownClassName}`,
              );
              if (dropdown) {
                dropdown.classList.add('hidden');
              }
              isOpenRef.current = false;
            }, 150);
          }}
          className={cn(
            'rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-center text-white',
            'focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none',
            'cursor-pointer placeholder-gray-400',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          placeholder={placeholder}
        />
        <div
          className={cn(
            dropdownClassName,
            'absolute top-full right-0 left-0 z-10 mt-1 hidden rounded-md border border-gray-600 bg-gray-800',
          )}
        >
          {options.map((option, index) => (
            <div
              key={option.value ?? 'null'}
              className={cn(
                'cursor-pointer px-3 py-2 text-center text-white hover:bg-gray-700',
                index < options.length - 1 && 'border-b border-gray-600',
              )}
              onMouseDown={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default NumberInputDropdown;
