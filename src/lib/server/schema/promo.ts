import {isWithinInterval} from 'date-fns';

/** @gqlType */
export interface FirstPartyPromo {
  commander?: string;
  tid?: string;
  activeFrom: Date;
  activeUntil: Date;
  /** @gqlField */
  title: string;
  /** @gqlField */
  description: string[];
  /** @gqlField */
  buttonText: string;
  /** @gqlField */
  backgroundImageUrl: string;
  /** @gqlField */
  imageUrl?: string;
  /** @gqlField */
  href: string;
}

const promos: FirstPartyPromo[] = [];

export function getActivePromotions(opts: {commander?: string; tid?: string}) {
  const filter: (p: FirstPartyPromo) => boolean = opts.commander
    ? (p) => p.commander === opts.commander
    : opts.tid
      ? (p) => p.tid === opts.tid
      : (p) => !p.commander && !p.tid;

  const now = Date.now();
  return promos.filter(
    (p) =>
      filter(p) &&
      isWithinInterval(now, {start: p.activeFrom, end: p.activeUntil}),
  );
}

/** @gqlQueryField */
export function homePagePromo(): FirstPartyPromo | null {
  return getActivePromotions({commander: '*'}).at(0) ?? null;
}

/** @gqlQueryField */
export function tournamentPagePromo(): FirstPartyPromo | null {
  return getActivePromotions({tid: '*'}).at(0) ?? null;
}
