import FireIcon from "@heroicons/react/24/solid/FireIcon";
import { Navigation } from "./navigation";

export function LoadingIcon() {
  return (
    <div className="flex w-full justify-center pt-24 text-white">
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
