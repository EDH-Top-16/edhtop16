import ColorSelection from "./ColorSelection";
import Searchbar from "./Searchbar";
import Filter from "./Filter";
import { AiOutlineMenu } from "react-icons/ai";
import { useContext } from "react";
import NavContext from "../../contexts/NavContext";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Banner({
  title,
  enableSearchbar,
  enableColors,
  enableFilters,
  getFilters,
  allFilters,
  terms,
  getColors,
  defaultColors,
  defaultFilters,
  backEnabled = false,
  enableMetaBreakdownButton = false,
  metabreakdownMessage = "",
  toggleMetabreakdown = null,
}) {
  const { toggle: toggleNav } = useContext(NavContext);
  const navigate = useNavigate();
  return (
    <div className="relative w-full dark:bg-banner border-0 border-b border-solid border-banner p-4 md:px-8 md:py-6 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-banner dark:text-text flex flex-row gap-2 ">
        <button
          className={`md:hidden inline text-cadet dark:text-white`}
          onClick={toggleNav}
        >
          <AiOutlineMenu />
        </button>
        {backEnabled && (
          <button
            className={`hidden md:inline text-cadet dark:text-white`}
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack />
          </button>
        )}
        {title}
      </h1>
      {backEnabled && (
        <button
          className={`hidden flex flex-row gap-1 items-center text-cadet dark:text-text`}
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack />
          Back to tournaments
        </button>
      )}
      <div className="flex flex-wrap items-center gap-4 md:max-w-[600px]">
        {enableSearchbar ? <Searchbar /> : <></>}
      </div>

      {enableFilters ? (
        <div class="flex gap-2 flex-wrap">
          <Filter
            getFilters={getFilters}
            allFilters={allFilters}
            terms={terms}
            defaultFilters={defaultFilters}
            ColorPicker={
              enableColors ? (
                <ColorSelection
                  defaultColors={defaultColors}
                  getColors={getColors}
                />
              ) : (
                <></>
              )
            }
          />
          {enableMetaBreakdownButton && (
            <div class="inline-block">
              <button
                class="flex items-center px-2 bg-blue-500 hover:bg-blue-700 text-white border-0 rounded-full text-sm py-1 px-3"
                onClick={() => toggleMetabreakdown()}
              >
                {metabreakdownMessage}
              </button>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
