import {staples_CommanderStaplesQuery} from '#genfiles/queries/staples_CommanderStaplesQuery.graphql';
import {useNavigation} from '#genfiles/router/router';
import {ManaCost} from '#src/assets/icons/colors';
import {useMemo, useState} from 'react';
import {graphql, usePreloadedQuery} from 'react-relay/hooks';

// Card type constants for staples grouping
const STAPLE_TYPE_ORDER = [
  'Creature',
  'Instant',
  'Sorcery',
  'Artifact',
  'Enchantment',
  'Planeswalker',
  'Battle',
  'Land',
] as const;

type StapleCardType = (typeof STAPLE_TYPE_ORDER)[number];

function getStapleCardType(typeLine: string): StapleCardType {
  const normalized = typeLine.toLowerCase();
  if (normalized.includes('creature')) return 'Creature';
  if (normalized.includes('instant')) return 'Instant';
  if (normalized.includes('sorcery')) return 'Sorcery';
  if (normalized.includes('artifact')) return 'Artifact';
  if (normalized.includes('enchantment')) return 'Enchantment';
  if (normalized.includes('planeswalker')) return 'Planeswalker';
  if (normalized.includes('battle')) return 'Battle';
  if (normalized.includes('land')) return 'Land';
  return 'Artifact';
}

// Play rate thresholds by card type. Since this is the commander page,
// it's probably fine by showing everything and not truncating any cards.
// Can change this in the future if data gets noisy
const STAPLE_PLAY_RATE_THRESHOLDS: Record<StapleCardType, number> = {
  Creature: 0,
  Instant: 0,
  Sorcery: 0,
  Artifact: 0,
  Enchantment: 0,
  Planeswalker: 0,
  Battle: 0,
  Land: 0,
};

type StapleCardData = {
  id: string;
  name: string;
  type: string;
  manaCost: string;
  scryfallUrl: string;
  playRateLastYear: number;
};

function StapleCardRow({
  card,
  commanderName,
}: {
  card: StapleCardData;
  commanderName: string;
}) {
  const playRatePercentage = (card.playRateLastYear * 100).toFixed(1);
  const {pushRoute} = useNavigation();

  return (
    <button
      onClick={() => {
        pushRoute('/commander/[commander]', {
          commander: commanderName,
          tab: 'card',
          card: card.name,
        });
      }}
      className="group flex w-full cursor-pointer items-center justify-between border-b border-white/10 p-2 text-left"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-white hover:underline">{card.name}</span>
      </div>
      <div className="flex gap-2">
        <ManaCost cost={card.manaCost} size={14} className="space-x-0.5" />
        <span className="text-sm text-white/60">{playRatePercentage}%</span>
      </div>
    </button>
  );
}

function StapleTypeSection({
  type,
  cards,
  commanderName,
}: {
  type: StapleCardType;
  cards: readonly StapleCardData[];
  commanderName: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const threshold = STAPLE_PLAY_RATE_THRESHOLDS[type];

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => b.playRateLastYear - a.playRateLastYear),
    [cards],
  );

  const {aboveThreshold, belowThreshold} = useMemo(() => {
    const above: StapleCardData[] = [];
    const below: StapleCardData[] = [];
    for (const card of sortedCards) {
      if (card.playRateLastYear >= threshold) {
        above.push(card);
      } else {
        below.push(card);
      }
    }
    return {aboveThreshold: above, belowThreshold: below};
  }, [sortedCards, threshold]);

  const visibleCards = showAll ? sortedCards : aboveThreshold;

  if (sortedCards.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between border-b border-white/30 bg-black/30 px-2 py-1">
        <span className="font-medium">{type}</span>
        <span className="text-sm font-medium">Play rate</span>
      </div>
      <div className="flex flex-col">
        {visibleCards.map((card) => (
          <StapleCardRow
            key={card.id}
            card={card}
            commanderName={commanderName}
          />
        ))}
      </div>
      {belowThreshold.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="p-2 text-sm text-white/50 hover:text-white"
        >
          {showAll ? 'Show less' : `Show ${belowThreshold.length} more`}
        </button>
      )}
    </div>
  );
}

export type Queries = {
  staples: staples_CommanderStaplesQuery;
};

export default function CommanderStaples({
  queries,
}: PastoriaPageProps<'/commander/[commander]#staples'>) {
  const {commander} = usePreloadedQuery(
    graphql`
      query staples_CommanderStaplesQuery($commander: String!)
      @preloadable
      @throwOnFieldError {
        commander(name: $commander) @required(action: THROW) {
          name
          staples {
            id
            name
            type
            manaCost
            scryfallUrl
            playRateLastYear
          }
        }
      }
    `,
    queries.staples,
  );

  const groupedCards = useMemo(() => {
    const groups: Record<StapleCardType, StapleCardData[]> = {
      Creature: [],
      Instant: [],
      Sorcery: [],
      Artifact: [],
      Enchantment: [],
      Planeswalker: [],
      Battle: [],
      Land: [],
    };

    for (const card of commander.staples) {
      const cardType = getStapleCardType(card.type);
      groups[cardType].push(card);
    }

    return groups;
  }, [commander.staples]);

  // Column layout for md+:
  // Column 1: Planeswalker, Creature, Sorcery
  // Column 2: Instant
  // Column 3: Artifact, Enchantment, Battle, Land
  const column1Types: StapleCardType[] = [
    'Planeswalker',
    'Creature',
    'Sorcery',
  ];
  const column2Types: StapleCardType[] = ['Instant'];
  const column3Types: StapleCardType[] = [
    'Artifact',
    'Enchantment',
    'Battle',
    'Land',
  ];

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-4">
      {/* Mobile: single column with all types */}
      <div className="md:hidden">
        {STAPLE_TYPE_ORDER.map((type) => (
          <StapleTypeSection
            key={type}
            type={type}
            cards={groupedCards[type]}
            commanderName={commander.name}
          />
        ))}
      </div>

      {/* md+: 3 column layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        <div>
          {column1Types.map((type) => (
            <StapleTypeSection
              key={type}
              type={type}
              cards={groupedCards[type]}
              commanderName={commander.name}
            />
          ))}
        </div>
        <div>
          {column2Types.map((type) => (
            <StapleTypeSection
              key={type}
              type={type}
              cards={groupedCards[type]}
              commanderName={commander.name}
            />
          ))}
        </div>
        <div>
          {column3Types.map((type) => (
            <StapleTypeSection
              key={type}
              type={type}
              cards={groupedCards[type]}
              commanderName={commander.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
