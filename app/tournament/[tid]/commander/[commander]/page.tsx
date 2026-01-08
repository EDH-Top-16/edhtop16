import {EntryCard} from '@/components/EntryCard';
import {Tournament} from '@/lib/schema/tournament';
import {ViewerContext} from '@/lib/schema/ViewerContext';

export default async function TournamentBreakdownCommanderntries(
  props: PageProps<'/tournament/[tid]/commander/[commander]'>,
) {
  const params = await props.params;
  const tid = params.tid;
  const commanderName = decodeURIComponent(params.commander);

  const vc = await ViewerContext.forRequest();
  const tournament = await Tournament.tournament(vc, tid);
  const entries = await tournament.entries(commanderName);

  return (
    <>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} context="tournament" />
      ))}
    </>
  );
}
