import {Footer} from '@/components/footer';
import {Navigation} from '@/components/navigation';
import {FirstPartyPromo} from '@/components/promo';
import {TournamentTabNavigation} from '@/components/TournamentTabNavigation';
import {searchResults, SearchResultType} from '@/lib/schema/search';
import {Tournament} from '@/lib/schema/tournament';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import {cn} from '@/lib/utils';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {format} from 'date-fns';

async function TournamentBanner({tournament}: {tournament: Tournament}) {
  const winnerEntries = await tournament.entries(undefined, 1);
  const winnerCommander = await winnerEntries[0]?.commander();
  const cards = (await winnerCommander?.cards()) ?? [];

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center space-y-4">
        {cards.length > 0 && (
          <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
            {cards
              .flatMap((c) => c.imageUrls())
              .map((src, _i, {length}) => {
                return (
                  <img
                    className={cn(
                      'flex-1 object-cover object-top',
                      length === 2 ? 'w-1/2' : 'w-full',
                    )}
                    key={src}
                    src={src}
                    alt={`${tournament.name} winner art`}
                  />
                );
              })}
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 text-xs md:text-sm">
          <a
            href={tournament.bracketUrl}
            target="_blank"
            rel="noopener norefferer"
            className="text-white underline"
          >
            View Bracket <ArrowRightIcon className="inline h-3 w-3" />
          </a>
        </div>

        <h1 className="font-title relative text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {tournament.name}
        </h1>
        <div className="relative flex w-full max-w-(--breakpoint-md) flex-col items-center justify-evenly gap-1 text-base text-white md:flex-row md:text-lg lg:text-xl">
          <span>{format(tournament.tournamentDate, 'MMMM do yyyy')}</span>
          <span>{tournament.size} Players</span>
        </div>
      </div>
    </div>
  );
}

export default async function TournamentPageLayout(
  props: LayoutProps<'/tournament/[tid]'>,
) {
  const {tid} = await props.params;

  const vc = await ViewerContext.forRequest();
  const tournament = await Tournament.tournament(vc, tid);
  const promo = tournament.promo();

  return (
    <>
      <title>{tournament.name}</title>
      <meta
        name="description"
        content={`Top Performing cEDH decks at ${tournament.name}`}
      />

      <Navigation
        searchResults={searchResults([SearchResultType.TOURNAMENT])}
      />

      <TournamentBanner tournament={tournament} />
      {promo && <FirstPartyPromo promo={promo} />}
      <TournamentTabNavigation />

      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {props.children}
      </div>

      <Footer />
    </>
  );
}
