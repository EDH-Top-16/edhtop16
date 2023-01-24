import Banner from "../Banner/Banner";
export default function CommanderPage(commander){

return (
  <Banner
    title={"View Decks for" + commander}
    enableSearchbar={true}
    enableColors={true}
    enableFilters={true}
  />);
}