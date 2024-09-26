import FireIcon from "@heroicons/react/24/solid/FireIcon";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { Card } from "../../components/card";
import { Navigation } from "../../components/navigation";
import { Select } from "../../components/select";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { tournaments_TournamentCard$key } from "../../queries/__generated__/tournaments_TournamentCard.graphql";
import {
  TimePeriod,
  tournaments_TournamentsQuery,
  TournamentSortBy,
} from "../../queries/__generated__/tournaments_TournamentsQuery.graphql";

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
            imageUrls
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
        <span>Winner: {tournament.entries[0].player?.name}</span>
      </div>
    );
  }, [tournament]);

  return (
    <Card
      bottomText={tournamentStats}
      images={tournament.entries[0].commander.imageUrls.map((img) => ({
        src: img,
        alt: `${tournament.name} winner card art`,
      }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <Link
          href={`/v2/tournament/${tournament.TID}`}
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
    <div className="relative min-h-screen bg-[#514f86]">
      <Navigation />
      <div className="mx-auto mt-8 w-full max-w-screen-xl px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="flex-1 text-4xl font-extrabold text-white md:text-5xl">
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
            </Select>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

const TournamentsQuery = graphql`
  query tournaments_TournamentsQuery(
    $timePeriod: TimePeriod!
    $sortBy: TournamentSortBy!
    $minSize: Int!
  ) {
    tournaments(
      filters: { timePeriod: $timePeriod, minSize: $minSize }
      sortBy: $sortBy
    ) {
      id
      ...tournaments_TournamentCard
    }
  }
`;

function TournamentsPage({
  preloadedQuery,
}: RelayProps<{}, tournaments_TournamentsQuery>) {
  const { tournaments } = usePreloadedQuery(TournamentsQuery, preloadedQuery);

  const router = useRouter();
  const setQueryVariable = useCallback(
    (key: string, value: string) => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set(key, value);
      router.replace(nextUrl, undefined, { shallow: true, scroll: false });
    },
    [router],
  );

  return (
    <TournamentsPageShell
      sortBy={preloadedQuery.variables.sortBy}
      timePeriod={preloadedQuery.variables.timePeriod}
      minSize={`${preloadedQuery.variables.minSize}`}
      onUpdateQueryParam={setQueryVariable}
    >
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {tournaments.map((c) => (
          <TournamentCard key={c.id} commander={c} />
        ))}
      </div>
    </TournamentsPageShell>
  );
}

function TournamentsPagePlaceholder() {
  const router = useRouter();

  return (
    <TournamentsPageShell
      sortBy={
        (router.query.sortBy as TournamentSortBy | undefined) ?? "PLAYERS"
      }
      timePeriod={
        (router.query.timePeriod as TimePeriod | undefined) ?? "SIX_MONTHS"
      }
      minSize={(router.query.minSize as string | undefined) ?? "60"}
    >
      <div className="flex w-full justify-center pt-24 text-white">
        <FireIcon className="h-12 w-12 animate-pulse" />
      </div>
    </TournamentsPageShell>
  );
}

export default withRelay(TournamentsPage, TournamentsQuery, {
  fallback: <TournamentsPagePlaceholder />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    return {
      timePeriod: (ctx.query.timePeriod as TimePeriod) ?? "SIX_MONTHS",
      sortBy: (ctx.query.sortBy as TournamentSortBy) ?? "PLAYERS",
      minSize: Number((ctx.query.minSize as string) ?? 60),
    };
  },
});
