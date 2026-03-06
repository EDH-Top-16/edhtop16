import {formatOrdinals} from '#src/lib/client/format';
import cn from 'classnames';
import {graphql, useFragment} from 'react-relay/hooks';
import {Card} from './card';
import {Link} from '#genfiles/router/router';
import {tournamentEntryCard_Entry$key} from '#genfiles/queries/tournamentEntryCard_Entry.graphql.js';

export function TournamentEntryCard({
  highlightFirst = true,
  ...props
}: {
  highlightFirst?: boolean;
  entry: tournamentEntryCard_Entry$key;
}) {
  const entry = useFragment(
    graphql`
      fragment tournamentEntryCard_Entry on Entry @throwOnFieldError {
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

        commander {
          name
          breakdownUrl
          cards {
            imageUrls
          }
        }
      }
    `,
    props.entry,
  );

  let entryName = `${entry.player?.name ?? 'Unknown Player'}`;
  if (entry.standing === 1) {
    entryName = `🥇 ${entryName}`;
  } else if (entry.standing === 2) {
    entryName = `🥈 ${entryName}`;
  } else if (entry.standing === 3) {
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
      <span className="flex-1">{formatOrdinals(entry.standing)} place</span>
      <span>
        Wins: {entry.wins} / Losses: {entry.losses} / Draws: {entry.draws}
      </span>
    </div>
  );

  return (
    <Card
      className={cn(
        'group',
        highlightFirst &&
          'md:first:col-span-2 lg:max-w-3xl lg:first:col-span-3 lg:first:w-full lg:first:justify-self-center',
      )}
      bottomText={bottomText}
      images={entry.commander.cards
        .flatMap((c) => c.imageUrls)
        .map((img) => ({
          src: img,
          alt: `${entry.commander.name} art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2 lg:group-first:h-40">
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
              playerLabel && 'mr-24 sm:mr-36',
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
              playerLabel && 'mr-24 sm:mr-36',
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
          href={entry.commander.breakdownUrl}
          className="underline decoration-transparent transition-colors hover:decoration-inherit"
        >
          {entry.commander.name}
        </Link>
      </div>
    </Card>
  );
}
