import Banner from "../Banner/BannerPage";

export default function About() {
  return (
  <div className="w-11/12 flex flex-col flex-grow overflow-auto">
    {/* Banner */}
    <Banner
      title={"About EDH Top 16"}
    />
    <div className="w-11/12 ml-auto mr-auto h-screen flex flex-col dark:text-white p-4 md:px-8 md:py-6 flex flex-col gap-4">
      <h1 className="text-4xl font-bold">About the site</h1>
      <hr class="h-px my-2 bg-gray-200 dark:bg-gray-700" />
      <p className="text-2xl">
        EDHTop16.com is a dedicated Magic: The Gathering website that specializes in aggregating and analyzing EDH tournament data. Our primary objective is to offer valuable insights into the competitive EDH landscape, allowing players and enthusiasts to better understand the meta and stay informed about popular decks and strategies.
      </p>
      <p className="text-2xl">
        Our platform is powered by <a class="font-bold text-bantextner dark:text-text" href="https://edh.events/subscribe" target="_blank">Command Tower</a>, 
        a product of <a class="font-bold text-banner dark:text-text" href="https://eminence.events/" target="_blank">Eminence Gaming</a>, 
        and presents a comprehensive overview of the decks being played, meta breakdowns, pilot profiles, event standings, and decklists from top-performing players. In addition, we provide conversion rates, helping users optimize their decks for improved performance.
      </p>
      <p className="text-2xl pb-24">
        EDHTop16.com also offers a robust API (coming soon), allowing developers and data enthusiasts to access and utilize our extensive database for various applications and customizations. Our mission is to foster a thriving EDH community by presenting accurate, up-to-date, and relevant information to enhance players' understanding and enjoyment of the game.
      </p>
    </div>
  </div>

  );
}