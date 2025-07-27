import cn from 'classnames';
import {memo, useCallback} from 'react';

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
  dropdownClassName: string; // e.g., 'min-entries-dropdown'
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
  const handleOptionSelect = useCallback((optionValue: number | null) => {
    onSelect(optionValue);
  }, [onSelect]);

  return (
    <>
      <label 
        htmlFor={id} 
        className="text-center text-sm font-medium mb-1 text-white"
      >
        {label}
      </label>
      <div className="relative">
        <input
          style={{ textAlign: 'center' }}
          id={id}
          type="number"
          min={min}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            const dropdown = e.target.parentElement?.querySelector(`.${dropdownClassName}`);
            if (dropdown) {
              dropdown.classList.remove('hidden');
            }
          }}
          onBlur={(e) => {
            // Delay hiding to allow clicking on dropdown options
            setTimeout(() => {
              const dropdown = e.target.parentElement?.querySelector(`.${dropdownClassName}`);
              if (dropdown) {
                dropdown.classList.add('hidden');
              }
            }, 150);
          }}
          className={cn(
            'px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500',
            'placeholder-gray-400',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          placeholder={placeholder}
        />
        <div 
          className={cn(
            dropdownClassName,
            'absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 z-10 hidden'
          )}
        >
          {options.map((option, index) => (
            <div
              key={option.value ?? 'null'}
              className={cn(
                'px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer',
                index < options.length - 1 && 'border-b border-gray-600'
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