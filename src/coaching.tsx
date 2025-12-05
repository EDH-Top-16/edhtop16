import {Footer} from './components/footer';
import {Navigation} from './components/navigation';
import { Calendar, ChartSpline, Clock, Languages, UsersRound } from 'lucide-react';

/**
 * @route /coaching
 * @resource m#coaching
 */
export function CoachingPage() {
  return (
    <>
      <title>Coaching - Max Pfeferman</title>
      <meta name="description" content="cEDH coaching with Max Pfeferman" />
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-sm) px-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center text-white gap-6">
          <img
            src="https://imagedelivery.net/kN_u_RUfFF6xsGMKYWhO1g/7aa0ec20-5434-4e3f-505a-990b13438900/square"
            alt="Max Pfeferman"
            className="h-48 w-48 rounded-full object-cover"
          />
          <div className="space-y-4">
            <h1 className="font-title mt-4 text-4xl font-extrabold">
              Max Pfeferman
            </h1>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex gap-2 items-center">
                <ChartSpline className="h-4 w-4 text-muted-foreground" /> 1720 (#32)
              </div>
              <div className="flex gap-2 items-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
                GMT-5:00
              </div>
              <div className="flex gap-2 items-center">
                <Languages className="h-4 w-4 text-muted-foreground" />
                English, German
              </div>
            </div>

            <p className="">
              I'm Max Pfeferman — a long-time grinder, brewer, and content creator
              in the cEDH community. I started playing cEDH in 2021 and quickly
              fell in love with the format's depth, the social dynamics, and the
              puzzle of building and refining decks...{' '}
              <button className="font-semibold underline">Read more</button>
            </p>
          </div>

          {/* Booking Actions */}
          <div className="flex w-full items-center gap-2">
            <button className="flex-1 rounded-full bg-white px-6 py-2 text-primary-foreground transition hover:bg-white/90">
              <div className="inline-flex gap-2 items-center">
                <Calendar className="h-4 w-4" />
                Book a session
              </div>
            </button>
            <button className="rounded-full bg-white/8 hover:bg-white/16 px-6 py-2 border-white/40 border no-wrap" title="Rate" >
              $50 / hour
            </button>
            <button className="rounded-full bg-white/8 hover:bg-white/16 px-4 py-3 border-white/40 border" title="View TopDeck profile" >
              {/* topdeck logo */}
              <img src="https://topdeck.gg/img/logo/TopDeckNoBorder.png" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <hr className="my-8 border-white/20" />

        {/* Best Decks Section */}
        <section>
          <h2 className="font-title mb-4 text-center text-2xl font-bold text-white">
            Best Decks
          </h2>

          <div className="flex flex-col gap-4">
            <DeckCard
              name="Kinnan, Bonder Prodigy"
              topCuts={34}
              record="133-120-83"
              winRate="42.5%"
              conversion="78.79%"
              imgUrl="https://cards.scryfall.io/art_crop/front/6/3/63cda4a0-0dff-4edb-ae67-a2b7e2971350.jpg?1761053650"
            />
            <DeckCard
              name="Kraum, Ludevic's Opus / Tymna the Weaver"
              topCuts={34}
              record="133-120-83"
              winRate="42.5%"
              conversion="78.79%"
              imgUrl="https://cards.scryfall.io/art_crop/front/6/3/63cda4a0-0dff-4edb-ae67-a2b7e2971350.jpg?1761053650"
            />
            <DeckCard
              name="Vivi Ornitier"
              topCuts={34}
              record="133-120-83"
              winRate="42.5%"
              conversion="78.79%"
              imgUrl="https://cards.scryfall.io/art_crop/front/6/3/63cda4a0-0dff-4edb-ae67-a2b7e2971350.jpg?1761053650"
            />
          </div>
        </section>

        <hr className="my-8 border-white/20" />

        {/* Top Finishes Section */}
        <section className="pb-8">
          <h2 className="font-title mb-4 text-center text-2xl font-bold text-white">
            Best Decks
          </h2>

          <div className="flex flex-col gap-4">
            <FinishCard
              tournamentName="Frenzy at the Falls - t/CEDH $15k-$25,000"
              placement={2}
              totalPlayers={239}
              date="November 29th, 2025"
              wins={5}
              losses={2}
              draws={1}
              winRate="56%"
              featured
            />
            <FinishCard
              tournamentName="Frenzy at the Falls - t/CEDH $15k-$25,000"
              placement={4}
              totalPlayers={239}
              date="November 29th, 2025"
              wins={5}
              losses={2}
              draws={1}
              winRate="56%"
            />
            <FinishCard
              tournamentName="TopDeck Invitational"
              placement={15}
              totalPlayers={239}
              date="November 29th, 2025"
              wins={5}
              losses={2}
              draws={1}
              winRate="56%"
            />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

function DeckCard({
  name,
  topCuts,
  record,
  winRate,
  conversion,
  imgUrl,
}: {
  name: string;
  topCuts: number;
  record: string;
  winRate: string;
  conversion: string;
  imgUrl: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-cover inset-shadow-sm inset-shadow-white/90"
      style={{backgroundImage: `url(${imgUrl})`}}
    >
      <div className="relative z-10 flex flex-col gap-3 p-5">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="grid grid-cols-4 gap-2 text-center bg-black/50 px-2 py-4 rounded-3xl">
          <div className="space-y-0.5">
            <div className="font-bold text-lg">{topCuts}</div>
            <div className="text-sm uppercase text-white/60 tracking-wider">Top 4</div>
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-lg">{record}</div>
            <div className="text-sm uppercase text-white/60 tracking-wider">Record</div>
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-lg">{winRate}</div>
            <div className="text-sm uppercase text-white/60 tracking-wider">WR</div>
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-lg">{conversion}</div>
            <div className="text-sm uppercase text-white/60 tracking-wider">Conv</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

function FinishCard({
  tournamentName,
  placement,
  totalPlayers,
  date,
  wins,
  losses,
  draws,
  winRate,
  featured = false,
}: {
  tournamentName: string;
  placement: number;
  totalPlayers: number;
  date: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
  featured?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-[#312d5a] p-5 text-white flex flex-col gap-3">
      <h3 className="flex gap-2 items-center text-2xl font-bold">
        {featured && <span>🥈</span>}
        {tournamentName}
      </h3>
      <div className="flex flex-col gap-1 text-white/70">
        <div className="flex gap-2 items-center">
          <UsersRound className="h-4 w-4 text-muted-foreground" />
          <span className='text-white'>#{placement} of {totalPlayers} Players</span>
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{date}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[#1a1833] px-2 py-4 text-center text-sm">
        <div>
          <div className="font-bold text-lgs">{wins}</div>
          <div className="text-sm uppercase text-white/60 tracking-wider">Wins</div>
        </div>
        <div>
          <div className="font-bold text-lgs">{losses}</div>
          <div className="text-sm uppercase text-white/60 tracking-wider">Losses</div>
        </div>
        <div>
          <div className="font-bold text-lgs">{draws}</div>
          <div className="text-sm uppercase text-white/60 tracking-wider">Draws</div>
        </div>
        <div>
          <div className="font-bold text-lgs">{winRate}</div>
          <div className="text-sm uppercase text-white/60 tracking-wider">WR</div>
        </div>
      </div>

      <button className="flex gap-2  items-center justify-center w-full rounded-full border text-base border-white/20 nowrap p-2 transition hover:bg-white/10">
        <img src="https://topdeck.gg/img/logo/TopDeckNoBorder.png" className="w-4 h-4" /> View decklist
      </button>
    </div>
  );
}
