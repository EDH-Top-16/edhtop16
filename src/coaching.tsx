import {coachingPage_CoachQuery} from '#genfiles/queries/coachingPage_CoachQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {Footer} from './components/footer';
import {Navigation} from './components/navigation';
import {Calendar, UsersRound} from 'lucide-react';
import {EntryPointComponent, usePreloadedQuery} from 'react-relay/hooks';
import {graphql} from 'relay-runtime';
import {formatPercent} from './lib/client/format';

/**
 * @route /coaching/:profile
 */
export const CoachingPage: EntryPointComponent<
  {coachRef: coachingPage_CoachQuery},
  {}
> = ({queries}) => {
  const {coach} = usePreloadedQuery(
    graphql`
      query coachingPage_CoachQuery($profile: String!)
      @throwOnFieldError
      @preloadable {
        coach(profile: $profile) {
          name
          topdeckProfile
          profileImage
          elo
          coachingBio
          coachingBookingUrl
          coachingRatePerHour
          bestDecks {
            commanderName
            colorId
            wins
            losses
            draws
            winRate
            conversionRate
            topCuts
            commander {
              cards {
                imageUrls
              }
            }
          }
          topFinishes {
            tournamentName
            tournamentDate
            tournamentSize
            standing
            wins
            losses
            draws
            winRate
            TID
            decklist
          }
        }
      }
    `,
    queries.coachRef,
  );

  if (!coach) {
    return (
      <>
        <title>Coach Not Found</title>
        <Navigation />
        <div className="mx-auto mt-8 w-full max-w-(--breakpoint-sm) px-8 text-center text-white">
          <h1 className="font-title text-4xl font-extrabold">
            Coach Not Found
          </h1>
          <p className="mt-4">
            The coach profile you're looking for doesn't exist.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <title>{`Coaching - ${coach.name}`}</title>
      <meta name="description" content={`cEDH coaching with ${coach.name}`} />
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-sm) px-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6 text-center text-white">
          <img
            src={
              coach.profileImage ||
              `https://topdeck.gg/img/avatar/${coach.topdeckProfile}`
            }
            alt={coach.name}
            className="h-48 w-48 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://topdeck.gg/img/logo/TopDeckNoBorder.png';
            }}
          />
          <div className="space-y-4">
            <h1 className="font-title mt-4 text-4xl font-extrabold">
              {coach.name}
            </h1>

            {coach.coachingBio && <p className="">{coach.coachingBio}</p>}
          </div>

          {/* Booking Actions */}
          <div className="flex w-full items-center gap-2">
            {coach.coachingBookingUrl ? (
              <a
                href={coach.coachingBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground flex-1 rounded-full bg-white px-6 py-2 transition hover:bg-white/90"
              >
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book a session
                </div>
              </a>
            ) : (
              <button className="text-primary-foreground flex-1 rounded-full bg-white px-6 py-2 transition hover:bg-white/90">
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book a session
                </div>
              </button>
            )}
            {coach.coachingRatePerHour && (
              <div className="no-wrap rounded-full border border-white/40 bg-white/8 px-6 py-2">
                ${coach.coachingRatePerHour} / hour
              </div>
            )}
            {coach.topdeckProfile && (
              <a
                href={`https://topdeck.gg/profile/${coach.topdeckProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/40 bg-white/8 px-4 py-3 hover:bg-white/16"
                title="View TopDeck profile"
              >
                <img
                  src="https://topdeck.gg/img/logo/TopDeckNoBorder.png"
                  className="h-4 w-4"
                  alt="TopDeck"
                />
              </a>
            )}
          </div>
        </div>

        {coach.bestDecks.length > 0 && (
          <>
            <hr className="my-8 border-white/20" />

            {/* Best Decks Section */}
            <section>
              <h2 className="font-title mb-4 text-center text-2xl font-bold text-white">
                Best Decks
              </h2>

              <div className="flex flex-col gap-4">
                {coach.bestDecks.map((deck) => (
                  <DeckCard
                    key={deck.commanderName}
                    name={deck.commanderName}
                    topCuts={deck.topCuts}
                    record={`${deck.wins}-${deck.losses}-${deck.draws}`}
                    winRate={formatPercent(deck.winRate)}
                    conversion={formatPercent(deck.conversionRate)}
                    colorId={deck.colorId}
                    imageUrls={deck.commander.cards.flatMap((c) => c.imageUrls)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {coach.topFinishes.length > 0 && (
          <>
            <hr className="my-8 border-white/20" />

            {/* Top Finishes Section */}
            <section className="pb-8">
              <h2 className="font-title mb-4 text-center text-2xl font-bold text-white">
                Top Finishes
              </h2>

              <div className="flex flex-col gap-4">
                {coach.topFinishes.map((finish, idx) => (
                  <FinishCard
                    key={`${finish.tournamentName}-${finish.standing}`}
                    tournamentName={finish.tournamentName}
                    placement={finish.standing}
                    totalPlayers={finish.tournamentSize}
                    date={new Date(finish.tournamentDate).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      },
                    )}
                    wins={finish.wins}
                    losses={finish.losses}
                    draws={finish.draws}
                    winRate={formatPercent(finish.winRate)}
                    featured={idx === 0 && finish.standing === 1}
                    TID={finish.TID}
                    decklist={finish.decklist}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

function DeckCard({
  name,
  topCuts,
  record,
  winRate,
  conversion,
  colorId,
  imageUrls = [],
}: {
  name: string;
  topCuts: number;
  record: string;
  winRate: string;
  conversion: string;
  colorId: string;
  imageUrls?: string[];
}) {
  // For partner commanders, show both images side by side
  const backgroundStyle =
    imageUrls.length === 2
      ? {
          backgroundImage: `linear-gradient(to right, transparent 0%, transparent 50%, transparent 50%, transparent 100%), url(${imageUrls[0]}), url(${imageUrls[1]})`,
          backgroundSize: '100% 100%, 50% 100%, 50% 100%',
          backgroundPosition: 'center, left, right',
          backgroundRepeat: 'no-repeat',
        }
      : imageUrls.length === 1
        ? {
            backgroundImage: `url(${imageUrls[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          };

  return (
    <div
      className="relative overflow-hidden rounded-3xl inset-shadow-sm inset-shadow-white/90"
      style={backgroundStyle}
    >
      <div className="relative z-10 flex flex-col gap-3 p-5">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="grid grid-cols-4 gap-2 rounded-3xl bg-black/50 px-2 py-4 text-center">
          <div className="space-y-0.5">
            <div className="text-lg font-bold">{topCuts}</div>
            <div className="text-sm tracking-wider text-white/60 uppercase">
              Top {topCuts === 1 ? 'Cut' : 'Cuts'}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-bold">{record}</div>
            <div className="text-sm tracking-wider text-white/60 uppercase">
              Record
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-bold">{winRate}</div>
            <div className="text-sm tracking-wider text-white/60 uppercase">
              WR
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-bold">{conversion}</div>
            <div className="text-sm tracking-wider text-white/60 uppercase">
              Conv
            </div>
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
  TID,
  decklist,
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
  TID: string;
  decklist: string | null;
}) {
  const decklistUrl = decklist || `https://topdeck.gg/tournament/${TID}`;

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-[#312d5a] p-5 text-white">
      <h3 className="flex items-center gap-2 text-2xl font-bold">
        {featured && <span>🥇</span>}
        {!featured && placement === 2 && <span>🥈</span>}
        {!featured && placement > 2 && placement <= 4 && <span>🥉</span>}
        {tournamentName}
      </h3>
      <div className="flex flex-col gap-1 text-white/70">
        <div className="flex items-center gap-2">
          <UsersRound className="text-muted-foreground h-4 w-4" />
          <span className="text-white">
            #{placement} of {totalPlayers} Players
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[#1a1833] px-2 py-4 text-center text-sm">
        <div>
          <div className="text-lgs font-bold">{wins}</div>
          <div className="text-sm tracking-wider text-white/60 uppercase">
            Wins
          </div>
        </div>
        <div>
          <div className="text-lgs font-bold">{losses}</div>
          <div className="text-sm tracking-wider text-white/60 uppercase">
            Losses
          </div>
        </div>
        <div>
          <div className="text-lgs font-bold">{draws}</div>
          <div className="text-sm tracking-wider text-white/60 uppercase">
            Draws
          </div>
        </div>
        <div>
          <div className="text-lgs font-bold">{winRate}</div>
          <div className="text-sm tracking-wider text-white/60 uppercase">
            WR
          </div>
        </div>
      </div>

      <a
        href={decklistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="nowrap flex w-full items-center justify-center gap-2 rounded-full border border-white/20 p-2 text-base transition hover:bg-white/10"
      >
        <img
          src="https://topdeck.gg/img/logo/TopDeckNoBorder.png"
          className="h-4 w-4"
        />{' '}
        View {decklist ? 'decklist' : 'tournament'}
      </a>
    </div>
  );
}
