export default function Banner({
  title,
  enableSearchbar,
  enableColors,
  enableFilters,
}) {
  return (
    <div className="relative w-full h-full bg-banner top-16 px-24 py-12">
      <h1>{title}</h1>
      {enableSearchbar ? <div></div> : <></>}
    </div>
  );
}
