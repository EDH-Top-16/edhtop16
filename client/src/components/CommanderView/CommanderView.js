import Banner from "../Banner/Banner";
import Entry from "./Entry";

export default function CommanderView() {
  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      <Banner title={"View Decks"} enableSearchbar={true} enableColors={true} />
      <div className="px-24 py-12">
        <Entry rank={1} name="Tymna/Kraum" colors={["W", "U", "B", "R"]} />
      </div>
    </div>
  );
}
