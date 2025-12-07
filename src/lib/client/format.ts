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
 * Formats a Gini coefficient (pilot equity) as a human-readable string.
 * The Gini coefficient measures how concentrated top cuts are among pilots.
 *
 * Thresholds based on observed data distribution (mean ~0.78, std ~0.08):
 *   < 0.70 (mean - 1 std)  -> "Even" (success spread more evenly)
 *   0.70 - 0.86            -> "Typical" (normal distribution)
 *   > 0.86 (mean + 1 std)  -> "Concentrated" (carried by few elite pilots)
 */
export function formatPilotEquity(gini: number): string {
  if (gini < 0.7) {
    return 'More even';
  } else if (gini < 0.86) {
    return 'Mixed';
  } else {
    return 'More concentrated';
  }
}
