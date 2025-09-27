import {PropsWithChildren} from 'react';

export function Select({
  id,
  value,
  label,
  onChange,
  disabled,
  children,
}: PropsWithChildren<{
  id: string;
  value: string;
  label: string;
  disabled?: boolean;
  onChange?: (next: string) => void;
}>) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-sm text-white">
        {label}
      </label>

      <div className="w-full rounded-xl bg-white p-2 text-sm">
        <select
          id={id}
          value={value}
          disabled={disabled}
          className="w-full bg-white"
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
