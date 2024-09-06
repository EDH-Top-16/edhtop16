import { AiOutlineMenu } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { FilterConfiguration, Filters } from "./filters";
import { Searchbar } from "./searchbar";
import Link from "next/link";

interface BannerProps {
  title: string;
  filters?: FilterConfiguration[];
  onFilterChange?: (nextPartialValues: Record<string, string | null>) => void;
  enableSearchbar?: boolean;
  enableColors?: boolean;
  terms?: unknown;
  defaultFilters?: unknown;
  backHref?: string;
  enableMetaBreakdownButton?: boolean;
  metabreakdownMessage?: string;
  toggleMetabreakdown?: () => void;
}

export function Banner({
  title,
  filters,
  onFilterChange,
  enableSearchbar = false,
  backHref,
  enableMetaBreakdownButton = false,
  metabreakdownMessage = "",
  toggleMetabreakdown,
}: BannerProps) {
  function toggleNav() {}

  return (
    <div className="relative flex w-full flex-col gap-4 border-0 border-b border-solid border-banner p-4 dark:bg-banner md:px-8 md:py-6">
      <h1 className="flex flex-row items-center gap-2 text-3xl font-bold text-banner dark:text-text ">
        <button
          className="inline text-cadet dark:text-white md:hidden"
          onClick={toggleNav}
        >
          <AiOutlineMenu />
        </button>

        {backHref && (
          <Link
            className="hidden text-cadet dark:text-white md:inline"
            href={backHref}
          >
            <IoIosArrowBack />
          </Link>
        )}
        {title}
      </h1>

      {backHref && (
        <Link
          className="flex flex-row items-center gap-1 text-cadet dark:text-text md:hidden"
          href={backHref}
        >
          <IoIosArrowBack />
          Back to tournaments
        </Link>
      )}

      <div className="flex flex-wrap items-center gap-4 md:max-w-[600px]">
        {enableSearchbar && <Searchbar />}
      </div>

      {filters != null && (
        <div className="flex flex-wrap gap-2">
          <Filters options={filters} onChange={onFilterChange} />

          {enableMetaBreakdownButton && (
            <div className="inline-block">
              <button
                className="flex items-center rounded-full border-0 bg-blue-500 px-2 px-3 py-1 text-sm text-white hover:bg-blue-700"
                onClick={toggleMetabreakdown}
              >
                {metabreakdownMessage}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
