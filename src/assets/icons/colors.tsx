import type {ImgHTMLAttributes} from 'react';
import {cn} from '#src/lib/utils.js';

import blackIconUrl from './black.svg';
import blueIconUrl from './blue.svg';
import colorlessIconUrl from './colorless.svg';
import greenIconUrl from './green.svg';
import redIconUrl from './red.svg';
import whiteIconUrl from './white.svg';

// Import all mana symbol SVGs
import mana0 from './0.svg';
import mana1 from './1.svg';
import mana2 from './2.svg';
import mana3 from './3.svg';
import mana4 from './4.svg';
import mana5 from './5.svg';
import mana6 from './6.svg';
import mana7 from './7.svg';
import mana8 from './8.svg';
import mana9 from './9.svg';
import mana10 from './10.svg';
import mana11 from './11.svg';
import mana12 from './12.svg';
import mana13 from './13.svg';
import mana14 from './14.svg';
import mana15 from './15.svg';
import mana16 from './16.svg';
import mana17 from './17.svg';
import mana18 from './18.svg';
import mana19 from './19.svg';
import mana20 from './20.svg';
import manaX from './X.svg';
import manaS from './S.svg';
import manaW from './W.svg';
import manaU from './U.svg';
import manaB from './B.svg';
import manaR from './R.svg';
import manaG from './G.svg';
import manaC from './C.svg';
// Phyrexian mana
import manaWP from './WP.svg';
import manaUP from './UP.svg';
import manaBP from './BP.svg';
import manaRP from './RP.svg';
import manaGP from './GP.svg';
// Hybrid mana
import manaWU from './WU.svg';
import manaWB from './WB.svg';
import manaUB from './UB.svg';
import manaUR from './UR.svg';
import manaBR from './BR.svg';
import manaBG from './BG.svg';
import manaRG from './RG.svg';
import manaRW from './RW.svg';
import manaGW from './GW.svg';
import manaGU from './GU.svg';
// Hybrid Phyrexian mana
import manaWUP from './WUP.svg';
import manaWBP from './WBP.svg';
import manaUBP from './UBP.svg';
import manaURP from './URP.svg';
import manaBRP from './BRP.svg';
import manaBGP from './BGP.svg';
import manaRGP from './RGP.svg';
import manaRWP from './RWP.svg';
import manaGWP from './GWP.svg';
import manaGUP from './GUP.svg';
// Twobrid mana (2/color)
import mana2W from './2W.svg';
import mana2U from './2U.svg';
import mana2B from './2B.svg';
import mana2R from './2R.svg';
import mana2G from './2G.svg';
// Colorless hybrid
import manaCW from './CW.svg';
import manaCU from './CU.svg';
import manaCB from './CB.svg';
import manaCR from './CR.svg';
import manaCG from './CG.svg';

// Map from normalized symbol (no slashes) to SVG URL
const MANA_SYMBOL_URLS: Record<string, string> = {
  // Generic mana
  '0': mana0,
  '1': mana1,
  '2': mana2,
  '3': mana3,
  '4': mana4,
  '5': mana5,
  '6': mana6,
  '7': mana7,
  '8': mana8,
  '9': mana9,
  '10': mana10,
  '11': mana11,
  '12': mana12,
  '13': mana13,
  '14': mana14,
  '15': mana15,
  '16': mana16,
  '17': mana17,
  '18': mana18,
  '19': mana19,
  '20': mana20,
  X: manaX,
  S: manaS,
  // Basic colors
  W: manaW,
  U: manaU,
  B: manaB,
  R: manaR,
  G: manaG,
  C: manaC,
  // Phyrexian mana
  WP: manaWP,
  UP: manaUP,
  BP: manaBP,
  RP: manaRP,
  GP: manaGP,
  // Hybrid mana
  WU: manaWU,
  WB: manaWB,
  UB: manaUB,
  UR: manaUR,
  BR: manaBR,
  BG: manaBG,
  RG: manaRG,
  RW: manaRW,
  GW: manaGW,
  GU: manaGU,
  // Hybrid Phyrexian mana
  WUP: manaWUP,
  WBP: manaWBP,
  UBP: manaUBP,
  URP: manaURP,
  BRP: manaBRP,
  BGP: manaBGP,
  RGP: manaRGP,
  RWP: manaRWP,
  GWP: manaGWP,
  GUP: manaGUP,
  // Twobrid mana
  '2W': mana2W,
  '2U': mana2U,
  '2B': mana2B,
  '2R': mana2R,
  '2G': mana2G,
  // Colorless hybrid
  CW: manaCW,
  CU: manaCU,
  CB: manaCB,
  CR: manaCR,
  CG: manaCG,
};

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

export function ColorIcon({
  color,
  alt,
  width = 20,
  height = 20,
  ...imgProps
}: ColorIconProps) {
  const normalizedColor = color as ColorSymbol;
  const src = COLOR_ICON_URLS[normalizedColor];

  if (!src) {
    return null;
  }

  const resolvedAlt = alt ?? COLOR_ICON_ALTS[normalizedColor];

  return (
    <img
      src={src}
      alt={resolvedAlt}
      width={width}
      height={height}
      {...imgProps}
    />
  );
}

export function ColorIdentity({
  identity,
  width,
  height,
  className,
}: {
  identity: string;
} & Pick<ColorIconProps, 'width' | 'height' | 'className'>) {
  return (
    <span className={cn('flex space-x-1', className)}>
      {identity.split('').map((char, index) => (
        <ColorIcon
          key={`${char}-${index}`}
          color={char}
          width={width}
          height={height}
        />
      ))}
    </span>
  );
}

/**
 * Normalizes a Scryfall mana symbol to match our SVG filenames.
 * Converts "{U/P}" to "UP", "{B/G}" to "BG", "{2/B}" to "2B", etc.
 */
function normalizeSymbol(symbol: string): string {
  // Remove slashes - Scryfall uses {U/P} but our files are UP.svg
  return symbol.replace(/\//g, '');
}

/**
 * Renders a mana cost string like "{2}{W}{U}" as mana symbols.
 * Supports all Scryfall mana formats including:
 * - Generic mana: {0}, {1}, {2}, etc.
 * - Basic colors: {W}, {U}, {B}, {R}, {G}, {C}
 * - Phyrexian mana: {W/P}, {U/P}, etc.
 * - Hybrid mana: {W/U}, {B/G}, etc.
 * - Twobrid mana: {2/W}, {2/U}, etc.
 * - Special: {X}, {S} (snow)
 */
export function ManaCost({
  cost,
  size = 16,
  className,
}: {
  cost: string;
  size?: number;
  className?: string;
}) {
  // Parse mana cost string like "{2}{W}{U}" into symbols
  const symbols = cost.match(/\{[^}]+\}/g) ?? [];

  if (symbols.length === 0) {
    return null;
  }

  return (
    <span className={cn('flex items-center', className)}>
      {symbols.map((symbol, index) => {
        // Remove braces and normalize (remove slashes)
        const rawValue = symbol.slice(1, -1);
        const normalizedValue = normalizeSymbol(rawValue);

        // Look up the SVG URL
        const svgUrl = MANA_SYMBOL_URLS[normalizedValue];

        if (svgUrl) {
          return (
            <img
              key={`${normalizedValue}-${index}`}
              src={svgUrl}
              alt={`${rawValue} mana`}
              width={size}
              height={size}
            />
          );
        }

        // Fallback for unknown symbols - render as styled text
        return (
          <span
            key={`${normalizedValue}-${index}`}
            className="flex items-center justify-center rounded-full bg-white/70 font-serif text-black"
            style={{width: size, height: size, lineHeight: size}}
          >
            {rawValue}
          </span>
        );
      })}
    </span>
  );
}
