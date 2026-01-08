import {Card} from '@/components/card';
import {ColorIdentity} from '@/components/colors';
import {formatPercent} from '@/lib/client/format';
import {Tournament, TournamentBreakdownGroup} from '@/lib/schema/tournament';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import Link from 'next/link';

async function TournamentBreakdownGroupCard({
  tournament,
  group,
}: {
  tournament: Tournament;
  group: TournamentBreakdownGroup;
}) {
  const commander = await group.commander();
  const cards = await commander.cards();

  return (
    <Card
      bottomText={
        <div className="flex flex-wrap justify-between gap-1">
          <span>Top Cuts: {group.topCuts}</span>
          <span>Entries: {group.entries}</span>
          <span>Conversion: {formatPercent(group.conversionRate)}</span>
        </div>
      }
      images={cards
        .flatMap((c) => c.imageUrls())
        .map((img) => ({
          src: img,
          alt: `${commander.name} art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <Link
          className="text-left text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
          href={`/tournament/${tournament.TID}/commander/${encodeURIComponent(commander.name)}`}
        >
          {commander.name}
        </Link>

        <ColorIdentity identity={commander.colorId} />
      </div>
    </Card>
  );
}

export default async function TournamentBreakdownPage(
  props: PageProps<'/tournament/[tid]/breakdown'>,
) {
  const {tid} = await props.params;

  const vc = await ViewerContext.forRequest();
  const tournament = await Tournament.tournament(vc, tid);
  const breakdownGroups = await tournament.breakdown();

  return (
    <>
      {breakdownGroups.map((group) => (
        <TournamentBreakdownGroupCard
          key={group.commanderId}
          tournament={tournament}
          group={group}
        />
      ))}
    </>
  );
}
