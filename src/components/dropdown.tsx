import { useState, useCallback } from 'react';
import cn from 'classnames';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

interface DropdownProps<T = string> {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  options: DropdownOption<T>[];
  onSelect: (value: T) => void;
  className?: string;
  dropdownClassName?: string;
  disabled?: boolean;
}

export function Dropdown<T = string>({
  id,
  label,
  value,
  placeholder = '',
  options,
  onSelect,
  className = '',
  dropdownClassName = '',
  disabled = false,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  const handleOptionSelect = useCallback((optionValue: T) => {
    onSelect(optionValue);
    setIsOpen(false);
  }, [onSelect]);

  return (
    <div className={cn("relative flex flex-col", className)}>
      <label 
        htmlFor={id} 
        className="text-sm font-medium mb-1 text-white text-center"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={handleClick}
          onBlur={handleBlur}
          className={cn(
            "px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
        />
        <div 
          className={cn(
            "absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 z-10",
            dropdownClassName,
            isOpen ? "block" : "hidden"
          )}
        >
          {options.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              className={cn(
                "px-3 py-2 text-white text-center hover:bg-gray-700 cursor-pointer",
                index < options.length - 1 && "border-b border-gray-600"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOptionSelect(option.value);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}