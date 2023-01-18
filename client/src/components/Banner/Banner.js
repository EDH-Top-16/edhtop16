import ColorSelection from "./ColorSelection";
import Searchbar from "./Searchbar";

export default function Banner({
  title,
  enableSearchbar,
  enableColors,
  enableFilters,
}) {
  return (
    <div className="relative w-full h-full bg-banner mt-16 px-24 py-12">
      <h1 className="text-3xl font-bold text-text">{title}</h1>
      <div className="flex w-3/6 space-x-32 mt-12">
        {enableSearchbar ? <Searchbar /> : <></>}
        {enableColors ? <ColorSelection /> : <></>}
      </div>
    </div>
  );
}
