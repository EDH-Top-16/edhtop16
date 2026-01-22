import FireIcon from '@heroicons/react/24/solid/FireIcon';
import cn from 'classnames';
import {Navigation} from './navigation';

export function LoadingIcon({
  padding = true,
  className,
}: {
  padding?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full justify-center text-white',
        padding && 'pt-24',
        className,
      )}
    >
      <FireIcon className="h-12 w-12 animate-pulse" />
    </div>
  );
}

export function Edhtop16Fallback() {
  return (
    <>
      <Navigation />
      <LoadingIcon />
    </>
  );
}
