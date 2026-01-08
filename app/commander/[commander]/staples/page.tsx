import {StaplesTypeSection} from '@/components/StaplesTypeSection';
import {
  Card,
  PRIMARY_CARD_TYPE_ORDER,
  PrimaryCardType,
} from '@/lib/schema/card';
import {Commander} from '@/lib/schema/commander';
import {ViewerContext} from '@/lib/schema/ViewerContext';

export default async function CommanderStaples(
  props: PageProps<'/commander/[commander]/staples'>,
) {
  const commanderName = decodeURIComponent((await props.params).commander);

  const vc = await ViewerContext.forRequest();
  const commander = await Commander.commander(vc, commanderName);
  const staples = await commander.staples();

  const groupedCards: Record<PrimaryCardType, Card[]> = {
    Creature: [],
    Instant: [],
    Sorcery: [],
    Artifact: [],
    Enchantment: [],
    Planeswalker: [],
    Battle: [],
    Land: [],
  };

  for (const card of staples) {
    groupedCards[card.primaryType()].push(card);
  }

  // Column layout for md+:
  // Column 1: Planeswalker, Creature, Sorcery
  // Column 2: Instant
  // Column 3: Artifact, Enchantment, Battle, Land
  const column1Types: PrimaryCardType[] = [
    'Planeswalker',
    'Creature',
    'Sorcery',
  ];
  const column2Types: PrimaryCardType[] = ['Instant'];
  const column3Types: PrimaryCardType[] = [
    'Artifact',
    'Enchantment',
    'Battle',
    'Land',
  ];

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-4">
      {/* Mobile: single column with all types */}
      <div className="md:hidden">
        {PRIMARY_CARD_TYPE_ORDER.map((type) => (
          <StaplesTypeSection
            key={type}
            type={type}
            cards={groupedCards[type].map((c) => c.toClient())}
            commander={commander.toClient()}
          />
        ))}
      </div>

      {/* md+: 3 column layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        <div>
          {column1Types.map((type) => (
            <StaplesTypeSection
              key={type}
              type={type}
              cards={groupedCards[type].map((c) => c.toClient())}
              commander={commander.toClient()}
            />
          ))}
        </div>
        <div>
          {column2Types.map((type) => (
            <StaplesTypeSection
              key={type}
              type={type}
              cards={groupedCards[type].map((c) => c.toClient())}
              commander={commander.toClient()}
            />
          ))}
        </div>
        <div>
          {column3Types.map((type) => (
            <StaplesTypeSection
              key={type}
              type={type}
              cards={groupedCards[type].map((c) => c.toClient())}
              commander={commander.toClient()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
