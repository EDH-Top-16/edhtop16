import {Footer} from '@/components/footer';
import {Navigation} from '@/components/navigation';
import {
  StaplesPageFilterMenu,
  StaplesPageFilters,
} from '@/components/StaplesPageFilterMenu';
import {StaplesTypeSection} from '@/components/StaplesTypeSection';
import {
  Card,
  PRIMARY_CARD_TYPE_ORDER,
  PrimaryCardType,
} from '@/lib/schema/card';
import {searchResults, SearchResultType} from '@/lib/schema/search';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import {PropsWithChildren} from 'react';
import z from 'zod/v4';

function StaplesPageShell({
  filters,
  children,
}: PropsWithChildren<{filters: StaplesPageFilters}>) {
  return (
    <>
      <title>cEDH Staples</title>
      <meta
        name="description"
        content="Discover the most played cards in competitive EDH!"
      />

      <Navigation searchResults={searchResults([SearchResultType.COMMANDER])} />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-6">
        <div className="mb-8">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            cEDH Staples
          </h1>
          <p className="mt-2 text-white/60">
            The most popular cards in competitive EDH, based on tournament data
            from the last year.
          </p>
        </div>

        <StaplesPageFilterMenu filters={filters} />
        {children}
      </div>
    </>
  );
}

export default async function StaplesPage(props: PageProps<'/staples'>) {
  const vc = await ViewerContext.forRequest();

  const {colorId, type} = z
    .object({colorId: z.string().optional(), type: z.string().optional()})
    .parse(await props.searchParams);

  const staples = await Card.staples(vc, colorId, type);

  const groupedCards = (() => {
    const groups: Record<PrimaryCardType, Card[]> = {
      Creature: [],
      Instant: [],
      Sorcery: [],
      Artifact: [],
      Enchantment: [],
      Planeswalker: [],
      Battle: [],
      Land: [],
    };

    for (const card of staples ?? []) {
      if (!card.type || !card.name) continue;
      const cardType = card.primaryType();
      groups[cardType] = [...(groups[cardType] ?? []), card];
    }

    return groups;
  })();

  const column1Types: PrimaryCardType[] = ['Planeswalker', 'Creature'];
  const column2Types: PrimaryCardType[] = ['Sorcery', 'Instant'];
  const column3Types: PrimaryCardType[] = [
    'Artifact',
    'Enchantment',
    'Battle',
    'Land',
  ];

  return (
    <StaplesPageShell filters={{colorId, type}}>
      <div className="mx-auto w-full max-w-(--breakpoint-xl)">
        {/* Mobile: single column with all types */}
        <div className="md:hidden">
          {PRIMARY_CARD_TYPE_ORDER.map((type) => (
            <StaplesTypeSection
              key={type}
              type={type}
              cards={groupedCards[type].map((c) => c.toClient())}
            />
          ))}
        </div>

        {/* md+: 3 column layout */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6">
          <div>
            {column1Types.map((type) => (
              <StaplesTypeSection
                key={type}
                type={type}
                cards={groupedCards[type].map((c) => c.toClient())}
              />
            ))}
          </div>
          <div>
            {column2Types.map((type) => (
              <StaplesTypeSection
                key={type}
                type={type}
                cards={groupedCards[type].map((c) => c.toClient())}
              />
            ))}
          </div>
          <div>
            {column3Types.map((type) => (
              <StaplesTypeSection
                key={type}
                type={type}
                cards={groupedCards[type].map((c) => c.toClient())}
              />
            ))}
          </div>
        </div>
      </div>

      {/* TODO(ryan): Add load more button here. */}

      <Footer />
    </StaplesPageShell>
  );
}
