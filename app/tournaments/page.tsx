import {Card} from '@/components/card';
import {Footer} from '@/components/footer';
import {Navigation} from '@/components/navigation';
import {FirstPartyPromo} from '@/components/promo';
import {TournamentsPageFilterMenu} from '@/components/TournamentsPageFilterMenu';
import {tournamentPagePromo} from '@/lib/schema/promo';
import {searchResults, SearchResultType} from '@/lib/schema/search';
import {Tournament, TournamentSortBy} from '@/lib/schema/tournament';
import {TimePeriod} from '@/lib/schema/types';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import {format} from 'date-fns';
import Link from 'next/link';
import {z} from 'zod/v4';

async function TournamentCard({tournament}: {tournament: Tournament}) {
  const tournamentWinner = (await tournament.entries(undefined, 1))?.[0];
  const winnerCommander = await tournamentWinner?.commander();
  const winnerCards = await winnerCommander?.cards();

  const tournamentStats = (
    <div className="flex justify-between">
      <span>Players: {tournament.size}</span>
      {tournamentWinner != null && (
        <span>Winner: {tournamentWinner.player?.name}</span>
      )}
    </div>
  );
  return (
    <Card
      bottomText={tournamentStats}
      images={winnerCards
        ?.flatMap((c) => c.imageUrls())
        .map((img) => ({
          src: img,
          alt: `${tournament.name} winner card art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <Link
          href={`/tournament/${tournament.TID}`}
          className="line-clamp-2 text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
        >
          {tournament.name}
        </Link>

        <span>{format(tournament.tournamentDate, 'MMMM do yyyy')}</span>
      </div>
    </Card>
  );
}

export default async function TournamentsPage(
  props: PageProps<'/tournaments'>,
) {
  const {timePeriod, sortBy, minSize} = z
    .object({
      timePeriod: z.enum(TimePeriod).optional().default(TimePeriod.ALL_TIME),
      sortBy: z.enum(TournamentSortBy).default(TournamentSortBy.DATE),
      minSize: z.coerce.number().int().optional().default(0),
    })
    .parse(await props.searchParams);

  const promo = tournamentPagePromo();

  const vc = await ViewerContext.forRequest();
  const tournaments = await Tournament.tournaments(
    vc,
    100,
    undefined,
    {timePeriod, minSize},
    sortBy,
  );

  return (
    <>
      <title>cEDH Tournaments</title>
      <meta
        name="description"
        content="Discover top and recent cEDH tournaments!"
      />

      <Navigation
        searchResults={searchResults([SearchResultType.TOURNAMENT])}
      />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="font-title flex-1 text-4xl font-extrabold text-white md:text-5xl">
            cEDH Tournaments
          </h1>

          <TournamentsPageFilterMenu filters={{timePeriod, sortBy, minSize}} />
        </div>

        <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
          {promo && (
            <FirstPartyPromo
              promo={promo}
              hasMargin={false}
              showImage={false}
              fullWidth={true}
            />
          )}

          {tournaments.edges.map((edge) => (
            <TournamentCard key={edge.node.id} tournament={edge.node} />
          ))}
        </div>

        {/* TODO(ryan): Add load more button here. */}

        <Footer />
      </div>
    </>
  );
}
