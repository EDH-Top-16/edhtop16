import {Navigation} from './components/navigation';

/**
 * @route /about
 * @resource route(/about)
 */
export function AboutPage() {
  return (
    <>
      <title>About</title>
      <meta name="description" content="About Us" />
      <Navigation />

      <div className="mx-auto my-8 flex w-full max-w-(--breakpoint-md) flex-col items-center gap-6 px-8 text-white">
        <h1 className="font-title flex-1 text-5xl font-extrabold text-white">
          About Us
        </h1>

        <p>
          EDHTop16 is a dedicated Magic: The Gathering website that specializes
          in aggregating and analyzing EDH tournament data. Our primary
          objective is to offer valuable insights into the competitive EDH
          landscape, allowing players and enthusiasts to better understand the
          meta and stay informed about popular decks and strategies.
        </p>

        <p>
          Our platform is sponsored by{' '}
          <a
            href="https://topdeck.gg/subscribe"
            className="underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            Topdeck.gg
          </a>
          , and presents a comprehensive overview of the decks being played,
          meta breakdowns, pilot profiles, event standings, and decklists from
          top-performing players. We also provide a few other statistics to help
          players optimize their decks for improved performance.
        </p>

        <p>
          We also offer a robust API, allowing developers and data enthusiasts
          to access and utilize our extensive database for various applications
          and customizations. Our mission is to foster a thriving EDH community
          by presenting accurate, up-to-date, and relevant information to
          enhance players&apos; understanding and enjoyment of the game.{' '}
        </p>

        <p className="w-full">
          Feel free to{' '}
          <a
            href="https://github.com/EDH-Top-16/edhtop16/issues"
            className="underline"
          >
            submit an issue
          </a>{' '}
          if you see a bug or think of a feature you&apos;d like to see.
        </p>

        <p>
          If you would like to see a tournament added to our site, please
          contact us! We wish to grow our dataset and have the most complete and
          accurate view of tournament EDH possible. Do note, all Command Tower
          events are automatically added. You can contact us in our{' '}
          <a href="https://discord.gg/UwbA42nruw" className="underline">
            Discord server
          </a>{' '}
          for further questions.
        </p>

        <h1 className="font-title flex-1 text-5xl font-extrabold text-white">
          Our Team
        </h1>

        <p className="w-full">
          EDHTop16 is developed and maintained by Ryan Delaney and Jason Qiu.
          When we&apos;re not working on this site, we are active cEDH
          tournament grinders, but we&apos;re probably stuck at our day jobs.
          We&apos;re grateful for our community&apos;s support of this project
          and happy that we can give back!
        </p>
      </div>
    </>
  );
}
