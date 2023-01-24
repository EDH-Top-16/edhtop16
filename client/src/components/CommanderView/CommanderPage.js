import Banner from "../Banner/Banner";
export default function CommanderPage({ commander }) {
  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      <Banner
        title={"View Decks for " + commander}
        enableSearchbar={true}
        enableColors={true}
        enableFilters={true}
      />
    </div>
  );
}
