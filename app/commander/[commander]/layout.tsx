import {ColorIdentity} from '@/components/colors';
import {CommanderTabNavigation} from '@/components/CommanderTabNavigation';
import {LoadingIcon} from '@/components/fallback';
import {Navigation} from '@/components/navigation';
import {FirstPartyPromo} from '@/components/promo';
import {Commander} from '@/lib/schema/commander';
import {searchResults, SearchResultType} from '@/lib/schema/search';
import {ViewerContext} from '@/lib/schema/ViewerContext';
import {cn} from '@/lib/utils';
import {PropsWithChildren, Suspense} from 'react';

async function CommanderBanner({
  commander,
  children,
}: PropsWithChildren<{commander: Commander}>) {
  const commanderCards = await commander.cards();

  return (
    <div className="h-64 w-full bg-black/60 md:h-80">
      <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center">
        <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
          {commanderCards
            .flatMap((c) => c.imageUrls())
            .map((src, _i, {length}) => {
              return (
                <img
                  className={cn(
                    'flex-1 object-cover object-top',
                    length === 2 ? 'w-1/2' : 'w-full',
                  )}
                  key={src}
                  src={src}
                  alt={`${commander.name} art`}
                />
              );
            })}
        </div>

        <h1 className="font-title relative m-0 mb-4 text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
          {commander.name}
        </h1>

        <div className="relative">
          <ColorIdentity identity={commander.colorId} />
        </div>

        {children}
      </div>
    </div>
  );
}

export default async function CommanderPageLayout(
  props: LayoutProps<'/commander/[commander]'>,
) {
  const commanderName = decodeURIComponent((await props.params).commander);

  const vc = await ViewerContext.forRequest();
  const commander = await Commander.commander(vc, commanderName);
  const promo = commander.promo();

  return (
    <>
      <title>{commander.name}</title>
      <meta
        name="description"
        content={`Top Performing and Recent Decklists for ${commander.name} in cEDH`}
      />

      <Navigation searchResults={searchResults([SearchResultType.COMMANDER])} />

      <CommanderBanner commander={commander}>
        {props.bannerStats}
      </CommanderBanner>

      {promo && <FirstPartyPromo promo={promo} />}
      <CommanderTabNavigation />

      {props.children}
    </>
  );
}
