'use client';

import type {ClientCard, PrimaryCardType} from '@/lib/schema/card';
import {ClientCommander} from '@/lib/schema/commander';
import {useMemo, useState} from 'react';
import {ManaCost} from './colors';

function StapleCardRow({
  card,
  commander,
}: {
  card: ClientCard;
  commander?: ClientCommander;
}) {
  const playRatePercentage = (card.playRateLastYear * 100).toFixed(1);
  const targetUrl = commander
    ? `/commander/${encodeURIComponent(commander.name)}/card/${encodeURIComponent(card.name)}`
    : card.scryfallUrl;

  return (
    <a
      href={targetUrl}
      target={commander == null ? '_blank' : undefined}
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

/**
 * Play rate thresholds by card type (cards below threshold are hidden by default)
 */
const PLAY_RATE_THRESHOLDS: Record<PrimaryCardType, number> = {
  Creature: 0.05,
  Instant: 0.05,
  Sorcery: 0.05,
  Artifact: 0.07,
  Enchantment: 0.06,
  Planeswalker: 0.04,
  Battle: 0.05,
  Land: 0.09,
};

export function StaplesTypeSection({
  type,
  cards,
  commander,
}: {
  type: PrimaryCardType;
  cards: ClientCard[];
  commander?: ClientCommander;
}) {
  const [showAll, setShowAll] = useState(false);
  const threshold = PLAY_RATE_THRESHOLDS[type];

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => b.playRateLastYear - a.playRateLastYear),
    [cards],
  );

  const {aboveThreshold, belowThreshold} = useMemo(() => {
    const above: ClientCard[] = [];
    const below: ClientCard[] = [];
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
          <StapleCardRow key={card.id} card={card} commander={commander} />
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
