import FireIcon from "@heroicons/react/24/solid/FireIcon";
import { Navigation } from "./navigation";

export function Edhtop16Fallback() {
  return (
    <div className="relative min-h-screen bg-[#514f86]">
      <Navigation />
      <div className="flex w-full justify-center pt-24 text-white">
        <FireIcon className="h-12 w-12 animate-pulse" />
      </div>
    </div>
  );
}
