import {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

interface TooltipProps {
  content: string;
}

export function Tooltip({content, children}: PropsWithChildren<TooltipProps>) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({top: 0, left: 0});

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [isVisible]);

  return (
    <span
      ref={triggerRef}
      className="inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            className="pointer-events-none fixed z-[9999] mb-2 w-max max-w-sm -translate-x-1/2 -translate-y-full rounded-md bg-black px-3 py-2 text-sm text-white shadow-lg"
            style={{
              top: position.top - 8,
              left: position.left,
            }}
          >
            {content}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </span>,
          document.body,
        )}
    </span>
  );
}

export function InfoIcon({className = ''}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block size-4 ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
