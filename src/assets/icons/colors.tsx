import type {ImgHTMLAttributes} from 'react';

import blackIconUrl from './black.svg';
import blueIconUrl from './blue.svg';
import colorlessIconUrl from './colorless.svg';
import greenIconUrl from './green.svg';
import redIconUrl from './red.svg';
import whiteIconUrl from './white.svg';

type ColorSymbol = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

const COLOR_ICON_URLS: Record<ColorSymbol, string> = {
  W: whiteIconUrl,
  U: blueIconUrl,
  B: blackIconUrl,
  R: redIconUrl,
  G: greenIconUrl,
  C: colorlessIconUrl,
};

const COLOR_ICON_ALTS: Record<ColorSymbol, string> = {
  W: 'White mana symbol',
  U: 'Blue mana symbol',
  B: 'Black mana symbol',
  R: 'Red mana symbol',
  G: 'Green mana symbol',
  C: 'Colorless mana symbol',
};

type ColorIconProps = {color: string} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'color'
>;

export function ColorIcon({color, alt, width = 20, height = 20, ...imgProps}: ColorIconProps) {
  const normalizedColor = color as ColorSymbol;
  const src = COLOR_ICON_URLS[normalizedColor];

  if (!src) {
    return null;
  }

  const resolvedAlt = alt ?? COLOR_ICON_ALTS[normalizedColor];

  return <img src={src} alt={resolvedAlt} width={width} height={height} {...imgProps} />;
}

export function ColorIdentity({identity}: {identity: string}) {
  return (
    <span className="flex space-x-1">
      {identity.split('').map((char, index) => (
        <ColorIcon key={`${char}-${index}`} color={char} />
      ))}
    </span>
  );
}
