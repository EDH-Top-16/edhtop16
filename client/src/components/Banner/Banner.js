import ColorSelection from "./ColorSelection";
import Searchbar from "./Searchbar";
import Filter from "./Filter";

export default function Banner({
  title,
  enableSearchbar,
  enableColors,
  enableFilters,
  getFilters,
  allFilters,
  terms,
  getColors,
  defaultFilters
}) {
  return (
    <div className="relative w-full h-full bg-banner mt-16 p-4 md:px-8 md:py-6">
      <h1 className="text-3xl font-bold text-text">{title}</h1>
      <div className="flex flex-wrap items-center gap-4 mt-12">
        {enableSearchbar ? <Searchbar /> : <></>}
      </div>
      {enableFilters ? (
        <Filter getFilters={getFilters} allFilters={allFilters} terms={terms} defaultFilters={defaultFilters} ColorPicker={enableColors ? <ColorSelection getColors={getColors} /> : <></>} />
      ) : (
        <></>
      )}
    </div>
  );
}
