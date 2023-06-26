// import APIDocs from "../APIDocs/APIDocs";
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
      <p className="text-2xl mb-4">
        EDHTop16.com is a dedicated Magic: The Gathering website that specializes in aggregating and analyzing EDH tournament data. Our primary objective is to offer valuable insights into the competitive EDH landscape, allowing players and enthusiasts to better understand the meta and stay informed about popular decks and strategies.
      </p>
      <p className="text-2xl mb-4">
        Our platform is powered by <a class="font-bold text-bantextner dark:text-text" href="https://edh.events/subscribe" target="_blank" rel="noreferrer">Command Tower</a>, 
        a product of <a class="font-bold text-banner dark:text-text" href="https://eminence.events/" target="_blank" rel="noreferrer">Eminence Gaming</a>, 
        and presents a comprehensive overview of the decks being played, meta breakdowns, pilot profiles, event standings, and decklists from top-performing players. We also provide a few other statistics to help players optimize their decks for improved performance.
      </p>
      <p className="text-2xl mb-4">
        We also offer a robust <a class="font-bold text-bantextner dark:text-text" href="https://github.com/JasonQiu21/cedhtop16/blob/main/server/api_docs.md" target="_blank" rel="noreferrer">API</a>, allowing developers and data enthusiasts to access and utilize our extensive database for various applications and customizations. Our mission is to foster a thriving EDH community by presenting accurate, up-to-date, and relevant information to enhance players' understanding and enjoyment of the game.
      </p>
      <p className="text-2xl mb-4">
        Feel free to <a class="font-bold text-bantextner dark:text-text" href="https://github.com/JasonQiu21/cedhtop16/issues" target="_blank" rel="noreferrer">submit an issue</a> if you see a bug or think of a feature you'd like to see. You can also find us <a class="font-bold text-bantextner dark:text-text" href="https://discord.gg/gfpD6EFHGm" target="_blank">on Discord</a>.
        We'll be working hard to put together ways to view tournaments and individual players soon; thanks in advance for your patience.
      </p>
      <p className="text-2xl pb-24">
        If you would like to see a tournament added to our site, please contact us!
        Please have ready a list of players with their standings, decklists, and win/loss/draw records (alternatively, a point total is also fine if we can deterministically determine w/l/d from it).
        We wish to grow our dataset and have the most complete and accurate view of tournament EDH possible.
        Do note, all Command Tower events are automatically added. Join  <a class="font-bold text-bantextner dark:text-text" href="https://discord.gg/gfpD6EFHGm" target="_blank" rel="noreferrer">the Command Tower Discord server</a> to find us, or contact jqiu21 directly on discord.
      </p>
    </div>
  </div>

  );
}