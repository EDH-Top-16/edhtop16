import cn from 'classnames';
import React, {PropsWithChildren} from 'react';

function Edhtop16TabList({
  children,
  className,
}: PropsWithChildren<{className?: string}>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-center gap-6 border-b border-white/40 p-6 text-center',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface Edhtop16TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

function Edhtop16Tab({
  children,
  className,
  selected,
  ...props
}: PropsWithChildren<Edhtop16TabProps>) {
  return (
    <button
      {...props}
      className={cn(
        'cursor-pointer border-white text-lg text-white/60 outline-hidden transition-colors',
        selected && 'border-b-2 text-white',
        props.disabled && 'border-white/60 text-white/60',
        className,
      )}
    >
      {children}
    </button>
  );
}

export {Edhtop16Tab as Tab, Edhtop16TabList as TabList};
