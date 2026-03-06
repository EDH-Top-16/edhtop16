import {formatOrdinals} from '#src/lib/client/format';
import cn from 'classnames';
import {graphql, useFragment} from 'react-relay/hooks';
import {Card} from './card';
import {Link} from '#genfiles/router/router';
import {format} from 'date-fns';
import {commanderEntryCard_Entry$key} from '#genfiles/queries/commanderEntryCard_Entry.graphql';

export function CommanderEntryCard(props: {
  entry: commanderEntryCard_Entry$key;
}) {
  const entry = useFragment(
    graphql`
      fragment commanderEntryCard_Entry on Entry @throwOnFieldError {
        standing
        wins
        losses
        draws
        decklist

        player {
          name
          team
          isKnownCheater
          tag
        }

        tournament {
          name
          size
          tournamentDate
          TID
        }
      }
    `,
    props.entry,
  );

  let entryName = `${entry.player?.name ?? 'Unknown Player'}`;
  if (entry.standing === 1) {
    entryName = `🥇 ${entryName}`;
  } else if (entry.standing <= 4) {
    entryName = `🥈 ${entryName}`;
  } else if (entry.standing <= 16) {
    entryName = `🥉 ${entryName}`;
  }

  const playerLabel = entry.player?.isKnownCheater ? (
    <span className="shrink-0 rounded-full bg-red-600 px-2 py-1 text-xs font-bold uppercase">
      Cheater
    </span>
  ) : entry.player?.tag ? (
    <span className="shrink-0 rounded-full bg-amber-600 px-2 py-1 text-xs font-bold uppercase">
      {entry.player.tag}
    </span>
  ) : entry.player?.team ? (
    <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-xs font-bold">
      {entry.player.team}
    </span>
  ) : null;

  const bottomText = (
    <div className="flex">
      <span className="flex-1">
        {formatOrdinals(entry.standing)}&nbsp;/&nbsp;
        {entry.tournament.size} players
      </span>

      <span>
        Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
      </span>
    </div>
  );

  return (
    <Card bottomText={bottomText}>
      <div className="flex h-32 flex-col">
        {playerLabel && (
          <div className="absolute top-5 right-4 sm:top-6 sm:right-6">
            {playerLabel}
          </div>
        )}
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            className={cn(
              'truncate font-bold underline decoration-transparent transition-colors hover:decoration-inherit',
              playerLabel && 'mr-36',
              entryName.length > 24
                ? 'text-base'
                : entryName.length > 18
                  ? 'text-lg'
                  : 'text-xl',
            )}
          >
            {entryName}
          </a>
        ) : (
          <span
            className={cn(
              'truncate font-bold',
              playerLabel && 'mr-36',
              entryName.length > 24
                ? 'text-base'
                : entryName.length > 18
                  ? 'text-lg'
                  : 'text-xl',
            )}
          >
            {entryName}
          </span>
        )}

        <Link
          href={`/tournament/${entry.tournament.TID}`}
          className="line-clamp-2 pt-2 underline decoration-transparent transition-colors hover:decoration-inherit"
        >
          {entry.tournament.name}
        </Link>
        <span className="line-clamp-1 text-sm opacity-70">
          {format(entry.tournament.tournamentDate, 'MMMM do yyyy')}
        </span>
      </div>
    </Card>
  );
}
