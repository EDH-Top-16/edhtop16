import {formatOrdinals} from '@/lib/client/format';
import {Entry} from '@/lib/schema/entry';
import {format} from 'date-fns';
import Link from 'next/link';
import {Card, CardBackgroundImage} from './card';
import {cn} from '@/lib/utils';

export async function EntryCard({
  entry,
  context,
  highlightFirst = false,
}: {
  entry: Entry;
  context?: 'tournament';
  highlightFirst?: boolean;
}) {
  const player = await entry.player();
  const tournament = await entry.tournament();
  const commander = context === 'tournament' ? await entry.commander() : null;

  let backgroundImages: CardBackgroundImage[] = [];
  if (context === 'tournament') {
    const cards = (await commander?.cards()) ?? [];
    backgroundImages = cards
      .flatMap((c) => c.imageUrls())
      .map((img) => ({
        src: img,
        alt: `${entry.commander.name} art`,
      }));
  }

  let entryName = `${player.name ?? 'Unknown Player'}`;
  if (context === 'tournament') {
    if (entry.standing === 1) {
      entryName = `🥇 ${entryName}`;
    } else if (entry.standing === 2) {
      entryName = `🥈 ${entryName}`;
    } else if (entry.standing === 3) {
      entryName = `🥉 ${entryName}`;
    }
  } else {
    if (entry.standing === 1) {
      entryName = `🥇 ${entryName}`;
    } else if (entry.standing <= 4) {
      entryName = `🥈 ${entryName}`;
    } else if (entry.standing <= 16) {
      entryName = `🥉 ${entryName}`;
    }
  }

  const entryNameNode = (
    <span className="relative flex items-baseline">
      {entryName}
      {player.isKnownCheater() && (
        <span className="absolute right-0 rounded-full bg-red-600 px-2 py-1 text-xs uppercase">
          Cheater
        </span>
      )}
    </span>
  );

  const bottomText = (
    <div className="flex">
      <span className="flex-1">
        {context === 'tournament' ? (
          <>{formatOrdinals(entry.standing)} place</>
        ) : (
          <>
            {formatOrdinals(entry.standing)}&nbsp;/&nbsp;
            {tournament.size} players
          </>
        )}
      </span>

      <span>
        Wins: {entry.wins()} / Losses: {entry.losses()} / Draws: {entry.draws}
      </span>
    </div>
  );

  return (
    <Card
      className={cn(
        'group',
        highlightFirst &&
          entry.standing === 1 &&
          'md:first:col-span-2 lg:max-w-3xl lg:first:col-span-3 lg:first:w-full lg:first:justify-self-center',
      )}
      bottomText={bottomText}
      images={backgroundImages}
    >
      <div
        className={cn(
          'flex h-32 flex-col',
          highlightFirst && 'lg:group-first:h-40',
          context === 'tournament' && 'space-y-2',
        )}
      >
        {entry.decklist ? (
          <a
            href={entry.decklist}
            target="_blank"
            className="line-clamp-1 text-xl font-bold underline decoration-transparent transition-colors hover:decoration-inherit"
          >
            {entryNameNode}
          </a>
        ) : (
          <span className="text-xl font-bold">{entryNameNode}</span>
        )}

        {context === 'tournament' ? (
          <>
            <Link
              href={commander?.breakdownUrl() ?? '#'}
              className="underline decoration-transparent transition-colors hover:decoration-inherit"
            >
              {commander?.name}
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/tournament/${tournament.TID}`}
              className="line-clamp-2 pt-2 underline decoration-transparent transition-colors hover:decoration-inherit"
            >
              {tournament.name}
            </Link>
            <span className="line-clamp-1 text-sm opacity-70">
              {format(tournament.tournamentDate, 'MMMM do yyyy')}
            </span>
          </>
        )}
      </div>
    </Card>
  );
}
