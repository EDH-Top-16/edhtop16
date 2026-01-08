import {cn} from '@/lib/utils';
import type {ImgHTMLAttributes} from 'react';
import Image from 'next/image';

const blackIconUrl = '/icons/black.svg';
const blueIconUrl = '/icons/blue.svg';
const colorlessIconUrl = '/icons/colorless.svg';
const greenIconUrl = '/icons/green.svg';
const redIconUrl = '/icons/red.svg';
const whiteIconUrl = '/icons/white.svg';

// Import all mana symbol SVGs
const mana0 = '/icons/0.svg';
const mana1 = '/icons/1.svg';
const mana10 = '/icons/10.svg';
const mana11 = '/icons/11.svg';
const mana12 = '/icons/12.svg';
const mana13 = '/icons/13.svg';
const mana14 = '/icons/14.svg';
const mana15 = '/icons/15.svg';
const mana16 = '/icons/16.svg';
const mana17 = '/icons/17.svg';
const mana18 = '/icons/18.svg';
const mana19 = '/icons/19.svg';
const mana2 = '/icons/2.svg';
const mana20 = '/icons/20.svg';
const mana3 = '/icons/3.svg';
const mana4 = '/icons/4.svg';
const mana5 = '/icons/5.svg';
const mana6 = '/icons/6.svg';
const mana7 = '/icons/7.svg';
const mana8 = '/icons/8.svg';
const mana9 = '/icons/9.svg';
const manaB = '/icons/B.svg';
const manaC = '/icons/C.svg';
const manaG = '/icons/G.svg';
const manaR = '/icons/R.svg';
const manaS = '/icons/S.svg';
const manaU = '/icons/U.svg';
const manaW = '/icons/W.svg';
const manaX = '/icons/X.svg';
// Phyrexian mana
const manaBP = '/icons/BP.svg';
const manaGP = '/icons/GP.svg';
const manaRP = '/icons/RP.svg';
const manaUP = '/icons/UP.svg';
const manaWP = '/icons/WP.svg';
// Hybrid mana
const manaBG = '/icons/BG.svg';
const manaBR = '/icons/BR.svg';
const manaGU = '/icons/GU.svg';
const manaGW = '/icons/GW.svg';
const manaRG = '/icons/RG.svg';
const manaRW = '/icons/RW.svg';
const manaUB = '/icons/UB.svg';
const manaUR = '/icons/UR.svg';
const manaWB = '/icons/WB.svg';
const manaWU = '/icons/WU.svg';
// Hybrid Phyrexian mana
const manaBGP = '/icons/BGP.svg';
const manaBRP = '/icons/BRP.svg';
const manaGUP = '/icons/GUP.svg';
const manaGWP = '/icons/GWP.svg';
const manaRGP = '/icons/RGP.svg';
const manaRWP = '/icons/RWP.svg';
const manaUBP = '/icons/UBP.svg';
const manaURP = '/icons/URP.svg';
const manaWBP = '/icons/WBP.svg';
const manaWUP = '/icons/WUP.svg';
// Twobrid mana (2/color)
const mana2B = '/icons/2B.svg';
const mana2G = '/icons/2G.svg';
const mana2R = '/icons/2R.svg';
const mana2U = '/icons/2U.svg';
const mana2W = '/icons/2W.svg';
// Colorless hybrid
const manaCB = '/icons/CB.svg';
const manaCG = '/icons/CG.svg';
const manaCR = '/icons/CR.svg';
const manaCU = '/icons/CU.svg';
const manaCW = '/icons/CW.svg';

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
            <Image
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
