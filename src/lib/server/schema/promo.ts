import { isWithinInterval } from "date-fns";
import { builder } from "./builder";

export interface CommanderPromo {
  commander: string;
  activeFrom: Date;
  activeUntil: Date;
  title: string;
  description: string[];
  buttonText: string;
  backgroundImageUrl: string;
  imageUrl?: string;
  href: string;
}

const promos: CommanderPromo[] = [
  {
    commander: "Rograkh, Son of Rohgahh / Thrasios, Triton Hero",
    activeFrom: new Date("2025-05-23"),
    activeUntil: new Date("2025-06-06"),
    title: "RogThras Manga Play Mat",
    description: [
      "Epic standoff, manga-style—preorder the RogThras playmat by Benishoga now!",
      "Stitched Edges | 3mm Thickness | High Quality Print",
    ],
    buttonText: "Preorder Now!",
    backgroundImageUrl:
      "https://images.squarespace-cdn.com/content/v1/678c3905719a1c6cc58feab9/21d588d8-1e0d-4e90-957f-e49c0bee398c/RogThras+2k+x+1.2k.png?format=1500w",
    imageUrl: "/promos/rogthras_playmat.png",
    href: "https://freedomwaffle.com/shop/p/rogthras-manga-playmat?utm_source=edhtop16.com",
  },
];

export function getActivePromotions(commander: string) {
  const now = Date.now();
  return promos.filter(
    (p) =>
      p.commander === commander &&
      isWithinInterval(now, { start: p.activeFrom, end: p.activeUntil }),
  );
}

export const CommanderPromoRef = builder
  .objectRef<CommanderPromo>("CommanderPromo")
  .implement({
    fields: (t) => ({
      title: t.exposeString("title"),
      description: t.exposeStringList("description"),
      buttonText: t.exposeString("buttonText"),
      backgroundImageUrl: t.exposeString("backgroundImageUrl"),
      imageUrl: t.exposeString("imageUrl", { nullable: true }),
      href: t.exposeString("href"),
    }),
  });
