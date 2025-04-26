import FireIcon from "@heroicons/react/24/solid/FireIcon";
import { format } from "date-fns";
// import { NextSeo } from "next-seo";
import Link from "next/link";
import { PropsWithChildren, useCallback, useMemo } from "react";
import {
  EntryPointComponent,
  graphql,
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { Card } from "../components/card";
import { Footer } from "../components/footer";
import { LoadMoreButton } from "../components/load_more";
import { Navigation } from "../components/navigation";
import { Select } from "../components/select";
import { AllTournamentsQuery } from "../queries/__generated__/AllTournamentsQuery.graphql";
import { tournaments_TournamentCard$key } from "../queries/__generated__/tournaments_TournamentCard.graphql";
import { tournaments_Tournaments$key } from "../queries/__generated__/tournaments_Tournaments.graphql";
import {
  TimePeriod,
  tournaments_TournamentsQuery,
  TournamentSortBy,
} from "../queries/__generated__/tournaments_TournamentsQuery.graphql";

function TournamentCard(props: { commander: tournaments_TournamentCard$key }) {
  const tournament = useFragment(
    graphql`
      fragment tournaments_TournamentCard on Tournament {
        TID
        name
        size
        tournamentDate
        entries(maxStanding: 1) {
          player {
            name
          }

          commander {
            cards {
              imageUrls
            }
          }
        }
      }
    `,
    props.commander,
  );

  const tournamentStats = useMemo(() => {
    return (
      <div className="flex justify-between">
        <span>Players: {tournament.size}</span>
        {tournament.entries[0] != null && (
          <span>Winner: {tournament.entries[0].player?.name}</span>
        )}
      </div>
    );
  }, [tournament]);

  return (
    <Card
      bottomText={tournamentStats}
      images={tournament.entries[0]?.commander.cards
        .flatMap((c) => c.imageUrls)
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

        <span>{format(tournament.tournamentDate, "MMMM do yyyy")}</span>
      </div>
    </Card>
  );
}

function TournamentsPageShell({
  sortBy,
  timePeriod,
  minSize,
  onUpdateQueryParam,
  children,
}: PropsWithChildren<{
  sortBy: TournamentSortBy;
  timePeriod: TimePeriod;
  minSize: string;
  onUpdateQueryParam?: (key: string, value: string) => void;
}>) {
  return (
    <>
      <Navigation searchType="tournament" />
      {/* <NextSeo
        title="cEDH Tournaments"
        description="Discover top and recent cEDH tournaments!"
      /> */}

      <div className="mx-auto mt-8 w-full max-w-screen-xl px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="flex-1 font-title text-4xl font-extrabold text-white md:text-5xl">
            cEDH Tournaments
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Select
              id="tournaments-sort-by"
              label="Sort By"
              value={sortBy}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("sortBy", value);
              }}
            >
              <option value="PLAYERS">Tournament Size</option>
              <option value="DATE">Date</option>
            </Select>

            <Select
              id="tournaments-players"
              label="Players"
              value={minSize}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("minSize", value);
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="32">32+ Players</option>
              <option value="60">60+ Players</option>
              <option value="100">100+ Players</option>
            </Select>

            <Select
              id="tournaments-time-period"
              label="Time Period"
              value={timePeriod}
              disabled={onUpdateQueryParam == null}
              onChange={(value) => {
                onUpdateQueryParam?.("timePeriod", value);
              }}
            >
              <option value="ONE_MONTH">1 Month</option>
              <option value="THREE_MONTHS">3 Months</option>
              <option value="SIX_MONTHS">6 Months</option>
              <option value="POST_BAN">Post Ban</option>
              <option value="ONE_YEAR">1 Year</option>
              <option value="ALL_TIME">All Time</option>
            </Select>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

const TournamentsQuery = graphql`
  query tournaments_TournamentsQuery(
    $timePeriod: TimePeriod!
    $sortBy: TournamentSortBy!
    $minSize: Int!
  ) @preloadable {
    ...tournaments_Tournaments
  }
`;

export const TournamentsPage: EntryPointComponent<
  { tournamentQueryRef: tournaments_TournamentsQuery },
  {}
> = ({ queries }) => {
  const query = usePreloadedQuery(TournamentsQuery, queries.tournamentQueryRef);

  const setQueryVariable = useCallback((key: string, value: string) => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set(key, value);
    window.location.href = nextUrl.toString();
  }, []);

  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment<
    AllTournamentsQuery,
    tournaments_Tournaments$key
  >(
    graphql`
      fragment tournaments_Tournaments on Query
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 100 }
      )
      @refetchable(queryName: "AllTournamentsQuery") {
        tournaments(
          first: $count
          after: $cursor
          filters: { timePeriod: $timePeriod, minSize: $minSize }
          sortBy: $sortBy
        ) @connection(key: "tournaments__tournaments") {
          edges {
            node {
              id
              ...tournaments_TournamentCard
            }
          }
        }
      }
    `,
    query,
  );

  return (
    <TournamentsPageShell
      sortBy={queries.tournamentQueryRef.variables.sortBy}
      timePeriod={queries.tournamentQueryRef.variables.timePeriod}
      minSize={`${queries.tournamentQueryRef.variables.minSize}`}
      onUpdateQueryParam={setQueryVariable}
    >
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {data.tournaments.edges.map((edge) => (
          <TournamentCard key={edge.node.id} commander={edge.node} />
        ))}
      </div>

      <LoadMoreButton
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        loadNext={loadNext}
      />

      <Footer />
    </TournamentsPageShell>
  );
};

// function TournamentsPagePlaceholder() {
//   const router = useRouter();

//   return (
//     <TournamentsPageShell
//       sortBy={(router.query.sortBy as TournamentSortBy | undefined) ?? "DATE"}
//       timePeriod={
//         (router.query.timePeriod as TimePeriod | undefined) ?? "SIX_MONTHS"
//       }
//       minSize={(router.query.minSize as string | undefined) ?? "60"}
//     >
//       <div className="flex w-full justify-center pt-24 text-white">
//         <FireIcon className="h-12 w-12 animate-pulse" />
//       </div>
//     </TournamentsPageShell>
//   );
// }

// export default TournamentsPage;

// export default withRelay(TournamentsPage, TournamentsQuery, {
//   fallback: <TournamentsPagePlaceholder />,
//   createClientEnvironment: () => getClientEnvironment()!,
//   createServerEnvironment: async () => {
//     const { createServerEnvironment } = await import(
//       "../lib/server/relay_server_environment"
//     );

//     return createServerEnvironment();
//   },
//   variablesFromContext: (ctx) => {
//     return {
//       timePeriod: (ctx.query.timePeriod as TimePeriod) ?? "SIX_MONTHS",
//       sortBy: (ctx.query.sortBy as TournamentSortBy) ?? "DATE",
//       minSize: Number((ctx.query.minSize as string) ?? 60),
//     };
//   },
// });
