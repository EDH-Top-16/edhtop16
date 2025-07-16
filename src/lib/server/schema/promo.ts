import {isWithinInterval} from 'date-fns';
import {builder} from './builder';

export interface FirstPartyPromo {
  commander?: string;
  tid?: string;
  activeFrom: Date;
  activeUntil: Date;
  title: string;
  description: string[];
  buttonText: string;
  backgroundImageUrl: string;
  imageUrl?: string;
  href: string;
}

const promos: FirstPartyPromo[] = [
  {
    commander: `Kraum, Ludevic's Opus / Tymna the Weaver`,
    activeFrom: new Date('2025-07-15'),
    activeUntil: new Date('2025-07-23'),
    title: 'Looking to up your Bling Game?',
    description: [
      'No-nonsense feed of rare non-english foils, alters, and signed cards for cEDH players! Updated weekly.',
    ],
    buttonText: 'Join Now!',
    backgroundImageUrl: '/promos/dootlootcardbackground.webp',
    imageUrl: '/promos/dootyloottransparent.webp',
    href: 'https://edhtop16tnk.doot-loot.com/',
  },
  {
    commander: `Rograkh, Son of Rohgahh / Silas Renn, Seeker Adept`,
    activeFrom: new Date('2025-07-24'),
    activeUntil: new Date('2025-07-31'),
    title: 'Looking to up your Bling Game?',
    description: [
      'No-nonsense feed of rare non-english foils, alters, and signed cards for cEDH players! Updated weekly.',
    ],
    buttonText: 'Join Now!',
    backgroundImageUrl: '/promos/dootlootcardbackground.webp',
    imageUrl: '/promos/dootyloottransparent.webp',
    href: 'https://edhtop16rogsi.doot-loot.com/',
  },
  {
    commander: 'Rograkh, Son of Rohgahh / Thrasios, Triton Hero',
    activeFrom: new Date('2025-08-01'),
    activeUntil: new Date('2025-08-07'),
    title: 'Looking to up your Bling Game?',
    description: [
      'No-nonsense feed of rare non-english foils, alters, and signed cards for cEDH players! Updated weekly.',
    ],
    buttonText: 'Join Now!',
    backgroundImageUrl: '/promos/dootlootcardbackground.webp',
    imageUrl: '/promos/dootyloottransparent.webp',
    href: 'https://edhtop16rogthras.doot-loot.com/',
  },
  {
    commander: 'Rograkh, Son of Rohgahh / Thrasios, Triton Hero',
    activeFrom: new Date('2025-05-23'),
    activeUntil: new Date('2025-06-06'),
    title: 'RogThras Manga Play Mat',
    description: [
      'Epic standoff, manga-style—preorder the RogThras playmat by Benishoga now!',
      'Stitched Edges | 3mm Thickness | High Quality Print',
    ],
    buttonText: 'Preorder Now!',
    backgroundImageUrl:
      'https://images.squarespace-cdn.com/content/v1/678c3905719a1c6cc58feab9/21d588d8-1e0d-4e90-957f-e49c0bee398c/RogThras+2k+x+1.2k.png?format=1500w',
    imageUrl: '/promos/rogthras_playmat.png',
    href: 'https://freedomwaffle.com/shop/p/rogthras-manga-playmat?utm_source=edhtop16.com',
  },
  {
    tid: '5T0m0dzqv94NiJKTj1tN',
    activeFrom: new Date('2025-05-26'),
    activeUntil: new Date('2025-06-09'),
    title: 'RogThras Manga Play Mat',
    description: [
      'Epic standoff, manga-style—preorder the RogThras playmat by Benishoga now!',
      'Stitched Edges | 3mm Thickness | High Quality Print',
    ],
    buttonText: 'Preorder Now!',
    backgroundImageUrl:
      'https://images.squarespace-cdn.com/content/v1/678c3905719a1c6cc58feab9/21d588d8-1e0d-4e90-957f-e49c0bee398c/RogThras+2k+x+1.2k.png?format=1500w',
    imageUrl: '/promos/rogthras_playmat.png',
    href: 'https://freedomwaffle.com/shop/p/rogthras-manga-playmat?utm_source=edhtop16.com',
  },
  {
    tid: '7qgKfhUAgxIhmVtyQpjQ',
    activeFrom: new Date('2025-05-26'),
    activeUntil: new Date('2025-06-09'),
    title: 'RogThras Manga Play Mat',
    description: [
      'Epic standoff, manga-style—preorder the RogThras playmat by Benishoga now!',
      'Stitched Edges | 3mm Thickness | High Quality Print',
    ],
    buttonText: 'Preorder Now!',
    backgroundImageUrl:
      'https://images.squarespace-cdn.com/content/v1/678c3905719a1c6cc58feab9/21d588d8-1e0d-4e90-957f-e49c0bee398c/RogThras+2k+x+1.2k.png?format=1500w',
    imageUrl: '/promos/rogthras_playmat.png',
    href: 'https://freedomwaffle.com/shop/p/rogthras-manga-playmat?utm_source=edhtop16.com',
  },
  {
    tid: 'salt-city-cedh-convention',
    activeFrom: new Date('2025-05-26'),
    activeUntil: new Date('2025-06-09'),
    title: 'RogThras Manga Play Mat',
    description: [
      'Epic standoff, manga-style—preorder the RogThras playmat by Benishoga now!',
      'Stitched Edges | 3mm Thickness | High Quality Print',
    ],
    buttonText: 'Preorder Now!',
    backgroundImageUrl:
      'https://images.squarespace-cdn.com/content/v1/678c3905719a1c6cc58feab9/21d588d8-1e0d-4e90-957f-e49c0bee398c/RogThras+2k+x+1.2k.png?format=1500w',
    imageUrl: '/promos/rogthras_playmat.png',
    href: 'https://freedomwaffle.com/shop/p/rogthras-manga-playmat?utm_source=edhtop16.com',
  },
];

export function getActivePromotions(opts: {commander?: string; tid?: string}) {
  const now = Date.now();
  return promos.filter(
    (p) =>
      ((opts.commander != null && p.commander === opts.commander) ||
        (opts.tid != null && p.tid === opts.tid)) &&
      isWithinInterval(now, {start: p.activeFrom, end: p.activeUntil}),
  );
}

export const FirstPartyPromoRef = builder
  .objectRef<FirstPartyPromo>('FirstPartyPromo')
  .implement({
    fields: (t) => ({
      title: t.exposeString('title'),
      description: t.exposeStringList('description'),
      buttonText: t.exposeString('buttonText'),
      backgroundImageUrl: t.exposeString('backgroundImageUrl'),
      imageUrl: t.exposeString('imageUrl', {nullable: true}),
      href: t.exposeString('href'),
    }),
  });
