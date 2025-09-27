import {staples_StaplesQuery} from '#genfiles/queries/staples_StaplesQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {EntryPointParams, useNavigation} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback';
import {useSeoMeta} from '@unhead/react';
import {
  EntryPointComponent,
  graphql,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {Card} from '../components/card';
import {ColorSelection} from '../components/color_selection';
import {Footer} from '../components/footer';
import {Navigation} from '../components/navigation';
import {ColorIdentity} from '../assets/icons/colors';

function StapleCard({card}: {card: any}) {
  const playRatePercentage = (card.playRateLastYear * 100).toFixed(1);

  return (
    <Card
      images={card.imageUrls.map((img: string) => ({
        src: img,
        alt: `${card.name} card art`,
      }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <a
          href={card.scryfallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-xl font-bold text-white hover:text-blue-300 underline decoration-transparent hover:decoration-inherit transition-colors"
        >
          {card.name}
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ColorIdentity identity={card.colorId} />
            {card.cmc > 0 && (
              <span className="rounded bg-gray-700 px-2 py-1 text-white font-mono text-xs">
                {card.cmc}
              </span>
            )}
          </div>
          <div className="rounded bg-green-900/50 px-2 py-1">
            <span className="text-green-300 text-xs font-medium">
              Play Rate: {playRatePercentage}%
            </span>
          </div>
        </div>
        <div className="mt-auto text-sm text-gray-300">
          {card.type}
        </div>
      </div>
    </Card>
  );
}

function StaplesPageShell({
  colorId,
  children,
}: {
  colorId: string;
  children: React.ReactNode;
}) {
  useSeoMeta({
    title: 'cEDH Staples',
    description: 'Discover the most played cards in competitive EDH!',
  });

  const {replaceRoute} = useNavigation();

  return (
    <>
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="mb-8">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            cEDH Staples
          </h1>
          <p className="mt-2 text-gray-400">
            The most popular cards in competitive EDH, based on tournament data from the last year.
          </p>
        </div>

        <div className="mb-8">
          <ColorSelection
            selected={colorId}
            onChange={(value) => {
              replaceRoute('/staples', {colorId: value ?? null});
            }}
          />
        </div>

        {children}
      </div>
    </>
  );
}

/** @resource m#staples_fallback */
export const StaplesPageFallback: EntryPointComponent<{}, {}, {colorId?: string}> = ({extraProps}) => {
  return (
    <StaplesPageShell colorId={extraProps.colorId ?? ''}>
      <LoadingIcon />
    </StaplesPageShell>
  );
};

/** @resource m#staples */
export const StaplesPage: EntryPointComponent<
  {staplesQueryRef: staples_StaplesQuery},
  {fallback: EntryPoint<ModuleType<'m#staples_fallback'>>}
> = ({queries}) => {
  const data = usePreloadedQuery(
    graphql`
      query staples_StaplesQuery($colorId: String) @preloadable {
        staples(colorId: $colorId) {
          id
          name
          type
          cmc
          colorId
          imageUrls
          scryfallUrl
          playRateLastYear
        }
      }
    `,
    queries.staplesQueryRef,
  );

  return (
    <StaplesPageShell colorId={queries.staplesQueryRef.variables.colorId ?? ''}>
      <div className="grid w-fit grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {(data.staples ?? []).map((card) => (
          <StapleCard key={card.id} card={card} />
        ))}
      </div>

      <Footer />
    </StaplesPageShell>
  );
};