import {useState, useCallback, useEffect} from 'react';
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

// Debug helper
const debugLog = (component: string, event: string, data?: any) => {
  if (typeof window !== 'undefined') {
    console.log(`[${component}] ${event}`, {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...data
    });
  }
};

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

  useEffect(() => {
    debugLog('Dropdown', 'Component mounted', { id, optionsCount: options.length });
  }, []);

  useEffect(() => {
    debugLog('Dropdown', 'isOpen changed', { id, isOpen });
  }, [isOpen, id]);

  const handleClick = useCallback(() => {
    debugLog('Dropdown', 'handleClick called', { id, disabled, currentIsOpen: isOpen });
    if (!disabled) {
      setIsOpen((prev) => {
        debugLog('Dropdown', 'setIsOpen transition', { id, from: prev, to: !prev });
        return !prev;
      });
    }
  }, [disabled, id, isOpen]);

  const handleBlur = useCallback(() => {
    debugLog('Dropdown', 'handleBlur called', { id });
    setTimeout(() => {
      debugLog('Dropdown', 'handleBlur timeout executed', { id });
      setIsOpen(false);
    }, 150);
  }, [id]);

  const handleOptionSelect = useCallback(
    (optionValue: T, event: React.MouseEvent) => {
      debugLog('Dropdown', 'handleOptionSelect called', { 
        id, 
        optionValue, 
        eventType: event.type,
        target: event.target 
      });
      onSelect(optionValue);
      setIsOpen(false);
    },
    [onSelect, id],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent, optionValue: T) => {
    debugLog('Dropdown', 'option mouseDown', { id, optionValue });
    e.preventDefault();
    handleOptionSelect(optionValue, e);
  }, [handleOptionSelect, id]);

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
          onFocus={() => debugLog('Dropdown', 'input focused', { id })}
          onTouchStart={() => debugLog('Dropdown', 'input touchStart', { id })}
          onTouchEnd={() => debugLog('Dropdown', 'input touchEnd', { id })}
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
          onTouchStart={() => debugLog('Dropdown', 'dropdown touchStart', { id })}
        >
          {options.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              className={cn(
                'cursor-pointer px-3 py-2 text-center text-white hover:bg-gray-700',
                index < options.length - 1 && 'border-b border-gray-600',
              )}
              onMouseDown={(e) => handleMouseDown(e, option.value)}
              onTouchStart={() => debugLog('Dropdown', 'option touchStart', { id, option: option.value })}
              onTouchEnd={() => debugLog('Dropdown', 'option touchEnd', { id, option: option.value })}
              onClick={(e) => {
                debugLog('Dropdown', 'option clicked', { id, option: option.value });
                handleOptionSelect(option.value, e);
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
