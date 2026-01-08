import {EntryCard} from '@/components/EntryCard';
import {Tournament} from '@/lib/schema/tournament';
import {ViewerContext} from '@/lib/schema/ViewerContext';

export default async function TournamentStandingsPage(
  props: PageProps<'/tournament/[tid]'>,
) {
  const {tid} = await props.params;

  const vc = await ViewerContext.forRequest();
  const tournament = await Tournament.tournament(vc, tid);
  const entries = await tournament.entries();

  return (
    <>
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          highlightFirst
          context="tournament"
        />
      ))}
    </>
  );
}
