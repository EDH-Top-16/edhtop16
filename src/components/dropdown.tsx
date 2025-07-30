import {useState, useCallback} from 'react';
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
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  const handleOptionSelect = useCallback(
    (optionValue: T) => {
      onSelect(optionValue);
      setIsOpen(false);
    },
    [onSelect],
  );

  return (
    <div className={cn('relative flex flex-col', className)}>
      <label
        htmlFor={id}
        className="mb-1 text-center text-sm font-medium text-white"
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
            'rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-center text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
        />
        <div
          className={cn(
            'absolute top-full right-0 left-0 z-10 mt-1 rounded-md border border-gray-600 bg-gray-800',
            dropdownClassName,
            isOpen ? 'block' : 'hidden',
          )}
        >
          {options.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              className={cn(
                'cursor-pointer px-3 py-2 text-center text-white hover:bg-gray-700',
                index < options.length - 1 && 'border-b border-gray-600',
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
