import { ColorSelection } from "./color_selection";
import { Filters } from "./filters";
import { Searchbar } from "./searchbar";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";

interface BannerProps {
  title: string;
  enableSearchbar?: boolean;
  enableColors?: boolean;
  enableFilters?: boolean;
  terms?: unknown;
  defaultFilters?: unknown;
  backEnabled?: boolean;
  enableMetaBreakdownButton?: boolean;
  metabreakdownMessage?: string;
  toggleMetabreakdown?: () => void;
}

export function Banner({
  title,
  enableSearchbar = false,
  enableFilters = false,
  backEnabled = false,
  enableMetaBreakdownButton = false,
  metabreakdownMessage = "",
  toggleMetabreakdown,
}: BannerProps) {
  function toggleNav() {}
  function back() {}

  return (
    <div className="relative flex w-full flex-col gap-4 border-0 border-b border-solid border-banner p-4 dark:bg-banner md:px-8 md:py-6">
      <h1 className="flex flex-row gap-2 text-3xl font-bold text-banner dark:text-text ">
        <button
          className="inline text-cadet dark:text-white md:hidden"
          onClick={toggleNav}
        >
          <AiOutlineMenu />
        </button>
        {backEnabled && (
          <button
            className="hidden text-cadet dark:text-white md:inline"
            onClick={back}
          >
            <IoIosArrowBack />
          </button>
        )}
        {title}
      </h1>
      {backEnabled && (
        <button
          className="flex flex-row items-center gap-1 text-cadet dark:text-text md:hidden"
          onClick={back}
        >
          <IoIosArrowBack />
          Back to tournaments
        </button>
      )}

      <div className="flex flex-wrap items-center gap-4 md:max-w-[600px]">
        {enableSearchbar && <Searchbar />}
      </div>

      {enableFilters && (
        <div className="flex flex-wrap gap-2">
          <Filters
            options={[
              {
                displayName: "Entries",
                variableName: "minSize",
                currentValue: "64",
                selectOptions: [
                  ["≥ 64", "64"],
                  ["≥ 128", "128"],
                  ["≥ 256", "256"],
                ],
              },
              {
                displayName: "Standing",
                variableName: "standing",
                currentValue: undefined,
                selectOptions: [
                  ["≥ 64", "64"],
                  ["≥ 128", "128"],
                  ["≥ 256", "256"],
                ],
              },
            ]}
          />

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
