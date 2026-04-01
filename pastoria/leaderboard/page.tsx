import {page_LeaderboardQuery} from '#genfiles/queries/page_LeaderboardQuery.graphql';
import {page_LeaderboardTopPlayer$key} from '#genfiles/queries/page_LeaderboardTopPlayer.graphql';
import {page_LeaderboardRow$key} from '#genfiles/queries/page_LeaderboardRow.graphql';
import {Link} from '#genfiles/router/router';
import {ColorIdentity} from '#src/assets/icons/colors';
import {Card} from '#src/components/card';
import {Footer} from '#src/components/footer';
import {Navigation} from '#src/components/navigation';
import {formatPercent} from '#src/lib/client/format';
import {
  graphql,
  PreloadedQuery,
  useFragment,
  usePreloadedQuery,
} from 'react-relay/hooks';

export type Queries = {
  leaderboardRef: page_LeaderboardQuery;
};

export default function LeaderboardPageShell({
  queries,
}: PastoriaPageProps<'/leaderboard'>) {
  return (
    <>
      <title>EDHTop16 Power Rankings — cEDH</title>
      <meta
        name="description"
        content="The official EDHTop16 Power Rankings — the definitive ranking of competitive EDH players."
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-6">
        <div className="mb-8 text-center">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            EDHTop16 Power Rankings
          </h1>
          <p className="mt-3 text-lg text-white/60">
            The definitive ranking of competitive EDH players.
          </p>
        </div>

        <LeaderboardContent queryRef={queries.leaderboardRef} />
      </div>
    </>
  );
}

function LeaderboardContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<page_LeaderboardQuery>;
}) {
  const {leaderboard} = usePreloadedQuery(
    graphql`
      query page_LeaderboardQuery @preloadable @throwOnFieldError {
        leaderboard {
          id
          rank
          ...page_LeaderboardTopPlayer
          ...page_LeaderboardRow
        }
      }
    `,
    queryRef,
  );

  const top16 = leaderboard.filter((e) => e.rank <= 16);
  const rest = leaderboard.filter((e) => e.rank > 16);

  return (
    <>
      {top16.length > 0 && (
        <div className="mb-10">
          <h2 className="font-title mb-4 text-2xl font-bold text-white">
            Top 16
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {top16.map((entry) => (
              <TopPlayerCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="mb-8 overflow-x-auto rounded-xl bg-black/30">
          <table className="w-full min-w-[640px] tabular-nums">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 text-left text-sm font-medium text-white/60">
                  Rank
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium text-white/60">
                  Player
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                  Draw Rate
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                  Draws
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium text-white/60">
                  Top Commander
                </th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry) => (
                <LeaderboardRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Footer />
    </>
  );
}

function TopPlayerCard({entry}: {entry: page_LeaderboardTopPlayer$key}) {
  const data = useFragment(
    graphql`
      fragment page_LeaderboardTopPlayer on LeaderboardEntry
      @throwOnFieldError {
        rank
        drawRate
        draws
        player {
          name
          topdeckProfile
        }
        topCommanders {
          name
          colorId
          cards {
            imageUrls
          }
        }
      }
    `,
    entry,
  );

  const commanderImages = data.topCommanders.flatMap((c) =>
    c.cards
      .flatMap((card) => card.imageUrls)
      .map((img) => ({src: img, alt: `${c.name} card art`})),
  );

  return (
    <Card
      images={commanderImages}
      bottomText={`${formatPercent(data.drawRate)} draw rate · ${data.draws} draws`}
    >
      <div className="flex h-32 flex-col space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
            #{data.rank}
          </span>
        </div>

        {data.player.topdeckProfile ? (
          <a
            href={`https://topdeck.gg/profile/${data.player.topdeckProfile}`}
            className="font-title text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
          >
            {data.player.name}
          </a>
        ) : (
          <span className="font-title text-xl font-bold">
            {data.player.name}
          </span>
        )}

        {data.topCommanders[0] && (
          <ColorIdentity identity={data.topCommanders[0].colorId} />
        )}
      </div>
    </Card>
  );
}

function LeaderboardRow({entry}: {entry: page_LeaderboardRow$key}) {
  const data = useFragment(
    graphql`
      fragment page_LeaderboardRow on LeaderboardEntry @throwOnFieldError {
        rank
        drawRate
        draws
        player {
          name
          topdeckProfile
        }
        topCommanders {
          name
        }
      }
    `,
    entry,
  );

  return (
    <tr className="border-b border-white/5 hover:bg-white/5">
      <td className="px-3 py-2 text-sm text-white/60">{data.rank}</td>
      <td className="px-3 py-2 text-sm text-white">
        {data.player.topdeckProfile ? (
          <a
            href={`https://topdeck.gg/profile/${data.player.topdeckProfile}`}
            className="underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            {data.player.name}
          </a>
        ) : (
          data.player.name
        )}
      </td>
      <td className="px-3 py-2 text-right text-sm font-medium text-amber-400">
        {formatPercent(data.drawRate)}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/60">
        {data.draws}
      </td>
      <td className="px-3 py-2 text-sm">
        {data.topCommanders[0] && (
          <Link
            href={`/commander/${encodeURIComponent(data.topCommanders[0].name)}`}
            className="text-white/60 hover:text-white"
          >
            {data.topCommanders[0].name}
          </Link>
        )}
      </td>
    </tr>
  );
}
