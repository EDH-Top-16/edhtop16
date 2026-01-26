import {ManaCost} from '#src/assets/icons/colors.js';
import {Footer} from '#components/footer.js';
import {content_StaplesCard$key} from '#genfiles/queries/content_StaplesCard.graphql.js';
import {content_TypesSection$key} from '#genfiles/queries/content_TypesSection.graphql.js';
import content_StaplesQuery from '#genfiles/queries/content_StaplesQuery.graphql.js';
import {PageProps} from '#genfiles/router/types.js';
import {useMemo, useState} from 'react';
import {graphql, useFragment, usePreloadedQuery} from 'react-relay/hooks';

export const queries = {
  staplesQueryRef: content_StaplesQuery,
};

const TYPE_ORDER = [
  'Creature',
  'Instant',
  'Sorcery',
  'Artifact',
  'Enchantment',
  'Planeswalker',
  'Battle',
  'Land',
] as const;

type CardType = (typeof TYPE_ORDER)[number];

function getCardType(typeLine: string): CardType {
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

function StapleCardRow(props: {card: content_StaplesCard$key}) {
  const card = useFragment(
    graphql`
      fragment content_StaplesCard on Card @throwOnFieldError {
        id
        name
        type
        manaCost
        imageUrls
        scryfallUrl
        playRateLastYear
      }
    `,
    props.card,
  );

  const playRatePercentage = (card.playRateLastYear * 100).toFixed(1);

  return (
    <a
      href={card.scryfallUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between border-b border-white/30 p-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-white hover:underline">{card.name}</span>
      </div>
      <div className="flex gap-2">
        <ManaCost cost={card.manaCost} size={14} className="space-x-0.5" />
        <span className="text-sm text-white/60">{playRatePercentage}%</span>
      </div>
    </a>
  );
}

type CardData = {
  id: string;
  name: string;
  type: string;
  playRateLastYear: number;
  ' $fragmentSpreads': content_StaplesCard$key[' $fragmentSpreads'];
};

// Play rate thresholds by card type (cards below threshold are hidden by default)
const PLAY_RATE_THRESHOLDS: Record<CardType, number> = {
  Creature: 0.05,
  Instant: 0.05,
  Sorcery: 0.05,
  Artifact: 0.07,
  Enchantment: 0.06,
  Planeswalker: 0.04,
  Battle: 0.05,
  Land: 0.09,
};

function TypeSection({
  type,
  ...props
}: {
  type: CardType;
  cards: content_TypesSection$key;
}) {
  const cards = useFragment(
    graphql`
      fragment content_TypesSection on Card
      @relay(plural: true)
      @throwOnFieldError {
        id
        name
        type
        playRateLastYear
        ...content_StaplesCard
      }
    `,
    props.cards,
  );

  const [showAll, setShowAll] = useState(false);
  const threshold = PLAY_RATE_THRESHOLDS[type];

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => b.playRateLastYear - a.playRateLastYear),
    [cards],
  );

  const {aboveThreshold, belowThreshold} = useMemo(() => {
    const above: CardData[] = [];
    const below: CardData[] = [];
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
      <div className="flex items-center justify-between border-b bg-black/30 px-2 py-1">
        <span className="font-medium">{type}</span>
        <span className="text-sm font-medium">Play rate</span>
      </div>
      <div className="flex flex-col">
        {visibleCards.map((card) => (
          <StapleCardRow key={card.id} card={card} />
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

export default function StaplesContent({
  queries,
}: PageProps<'/staples#content'>) {
  const data = usePreloadedQuery(
    graphql`
      query content_StaplesQuery($colorId: String, $type: String) @preloadable {
        staples(colorId: $colorId, type: $type) {
          id
          name
          type
          playRateLastYear
          ...content_TypesSection
        }
      }
    `,
    queries.staplesQueryRef,
  );

  const groupedCards = useMemo(() => {
    const groups: Record<CardType, (typeof data)['staples']> = {
      Creature: [],
      Instant: [],
      Sorcery: [],
      Artifact: [],
      Enchantment: [],
      Planeswalker: [],
      Battle: [],
      Land: [],
    };

    for (const card of data.staples ?? []) {
      if (!card.type || !card.name) continue;
      const cardType = getCardType(card.type);
      groups[cardType] = [...(groups[cardType] ?? []), card];
    }

    return groups;
  }, [data.staples]);

  // Column layout for md+:
  // Column 1: Planeswalker, Creature
  // Column 2: Sorcery, Instant
  // Column 3: Artifact, Enchantment, Battle, Land
  const column1Types: CardType[] = ['Planeswalker', 'Creature'];
  const column2Types: CardType[] = ['Sorcery', 'Instant'];
  const column3Types: CardType[] = [
    'Artifact',
    'Enchantment',
    'Battle',
    'Land',
  ];

  return (
    <>
      <div className="mx-auto w-full max-w-(--breakpoint-xl)">
        {/* Mobile: single column with all types */}
        <div className="md:hidden">
          {TYPE_ORDER.map((type) => (
            <TypeSection
              key={type}
              type={type}
              cards={groupedCards[type] ?? []}
            />
          ))}
        </div>

        {/* md+: 3 column layout */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6">
          <div>
            {column1Types.map((type) => (
              <TypeSection
                key={type}
                type={type}
                cards={groupedCards[type] ?? []}
              />
            ))}
          </div>
          <div>
            {column2Types.map((type) => (
              <TypeSection
                key={type}
                type={type}
                cards={groupedCards[type] ?? []}
              />
            ))}
          </div>
          <div>
            {column3Types.map((type) => (
              <TypeSection
                key={type}
                type={type}
                cards={groupedCards[type] ?? []}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
