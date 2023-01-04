import Banner from "./Banner";

export default function DeckView() {
  return (
    <div className="w-11/12 ml-auto mr-0">
      <Banner title={"View Decks"} enableSearchbar={true} />
      <h1>Hello world</h1>
    </div>
  );
}
