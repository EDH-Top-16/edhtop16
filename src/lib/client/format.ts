const enOrdinalRules = new Intl.PluralRules('en-US', {type: 'ordinal'});
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

export function formatOrdinals(n: number) {
  const rule = enOrdinalRules.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
}

export function formatPercent(n: number) {
  return `${Math.floor(n * 10000) / 100}%`;
}

/**
 * Formats a top cut factor (actual/expected ratio) as a human-readable string.
 * Shows the raw factor for direct comparison across commanders.
 * Examples:
 *   1.0  -> "1.00x" (average - top cuts exactly as expected)
 *   1.5  -> "1.50x" (50% more top cuts than expected)
 *   0.8  -> "0.80x" (20% fewer top cuts than expected)
 */
export function formatTopCutFactor(factor: number): string {
  return `${factor.toFixed(2)}x`;
}

/**
 * Accessibility rating for a commander based on CV (Coefficient of Variation).
 * Indicates how easy/hard a deck is to pick up based on pilot performance variance.
 */
export interface AccessibilityRating {
  icon: string; // Unicode character: ●, ■, or ◆
  label: string; // Easy, Medium, Difficult
  colorClass: string; // Tailwind color class
}

// CV thresholds for accessibility ratings (based on observed distribution, median ~1.4)
const CV_EASY_THRESHOLD = 1.25; // Below this = Easy (results spread evenly)
const CV_DIFFICULT_THRESHOLD = 1.75; // Above this = Difficult (specialist-dominated)

/**
 * Formats a CV (Coefficient of Variation) as an accessibility rating.
 * CV measures variance in per-pilot conversion factors.
 *
 * Returns null if CV is null (insufficient data: < 3 pilots with 2+ entries).
 */
export function formatAccessibility(
  cv: number | null,
): AccessibilityRating | null {
  if (cv === null) {
    return null;
  } else if (cv < CV_EASY_THRESHOLD) {
    return {icon: '●', label: 'Easy', colorClass: 'text-green-500'};
  } else if (cv <= CV_DIFFICULT_THRESHOLD) {
    return {icon: '■', label: 'Medium', colorClass: 'text-blue-500'};
  } else {
    return {icon: '◆', label: 'Difficult', colorClass: 'text-gray-300'};
  }
}
