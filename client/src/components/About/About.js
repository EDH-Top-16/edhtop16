import APIDocs from "../APIDocs/APIDocs";
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
      <p className="text-2xl">
        We also offerf a robust <a class="font-bold text-bantextner dark:text-text" href="https://github.com/JasonQiu21/cedhtop16/blob/main/server/api_docs.md" target="_blank">API</a>, allowing developers and data enthusiasts to access and utilize our extensive database for various applications and customizations. Our mission is to foster a thriving EDH community by presenting accurate, up-to-date, and relevant information to enhance players' understanding and enjoyment of the game.
      </p>
      <p className="text-2xl">
        Our site is currently in open beta! Feel free to <a class="font-bold text-bantextner dark:text-text" href="https://github.com/JasonQiu21/cedhtop16/issues" target="_blank">submit an issue</a> if you see a bug or think of a feature you'd like to see. We'll be working hard to put together ways to view tournaments and individual players soon; thanks in advance for your patience.
      </p>
      <p className="text-2xl pb-24">
        If you're a tournament organizer and would like to see your tournaments added to our dataset, contact us! A Discord server will probably be coming soon, but feel free to message jqiu21#1280 in the meantime.
      </p>
    </div>
  </div>

  );
}