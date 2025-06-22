import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import cn from "classnames";
import { useCallback, useState } from "react";
import { Searchbar } from "./searchbar";
import { Link } from "../lib/river/router";

export function Navigation({
  searchType,
}: {
  searchType?: "commander" | "tournament";
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const toggleSearch = useCallback(() => {
    setMobileSearchOpen((open) => !open);
  }, []);

  return (
    <nav className="sticky top-0 z-20 grid w-full grid-cols-[auto_auto_auto_1fr] items-center gap-x-6 gap-y-3 bg-[#312d5a] px-4 py-3 font-title text-white md:px-8">
      <Link href="/" className="text-xl font-black">
        EDHTop16
      </Link>

      <Link
        href="/"
        className="text-xs underline decoration-transparent transition-colors hover:decoration-inherit md:text-sm"
      >
        Commanders
      </Link>

      <Link
        href="/tournaments"
        className="text-xs underline decoration-transparent transition-colors hover:decoration-inherit md:text-sm"
      >
        Tournaments
      </Link>

      <button
        className="block justify-self-end	md:hidden"
        onClick={toggleSearch}
      >
        {mobileSearchOpen ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5" />
        )}
      </button>

      <div
        className={cn(
          "col-span-4 justify-end md:col-span-1 md:flex",
          mobileSearchOpen ? "flex" : "hidden",
        )}
      >
        <Searchbar searchType={searchType} />
      </div>
    </nav>
  );
}
