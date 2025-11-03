import {staples_StaplesQuery} from '#genfiles/queries/staples_StaplesQuery.graphql';
import {ModuleType} from '#genfiles/router/js_resource.js';
import {useNavigation, useRouteParams} from '#genfiles/router/router';
import {LoadingIcon} from '#src/components/fallback';
import {Suspense} from 'react';
import {
  EntryPoint,
  EntryPointComponent,
  EntryPointContainer,
  graphql,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {ColorIdentity} from './assets/icons/colors';
import {Card} from './components/card';
import {ColorSelection} from './components/color_selection';
import {Footer} from './components/footer';
import {Navigation} from './components/navigation';
import {Select} from './components/select';

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
          className="line-clamp-2 text-xl font-bold text-white underline decoration-transparent transition-colors hover:text-blue-300 hover:decoration-inherit"
        >
          {card.name}
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ColorIdentity identity={card.colorId} />
            {card.cmc > 0 && (
              <span className="rounded bg-gray-700 px-2 py-1 font-mono text-xs text-white">
                {card.cmc}
              </span>
            )}
          </div>
          <div className="rounded bg-green-900/50 px-2 py-1">
            <span className="text-xs font-medium text-green-300">
              Play Rate: {playRatePercentage}%
            </span>
          </div>
        </div>
        <div className="mt-auto text-sm text-gray-300">{card.type}</div>
      </div>
    </Card>
  );
}

/** @route /staples */
export const StaplesPageShell: EntryPointComponent<
  {},
  {staplesRef: EntryPoint<ModuleType<'route(/staples)#staples_page'>>}
> = ({entryPoints}) => {
  const {colorId = '', type = ''} = useRouteParams('/staples');
  const {replaceRoute} = useNavigation();

  return (
    <>
      <title>cEDH Staples</title>
      <meta
        name="description"
        content="Discover the most played cards in competitive EDH!"
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="mb-8">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            cEDH Staples
          </h1>
          <p className="mt-2 text-gray-400">
            The most popular cards in competitive EDH, based on tournament data
            from the last year.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-y-0">
          <div className="flex-1">
            <ColorSelection
              selected={colorId}
              onChange={(value) => {
                replaceRoute('/staples', {
                  colorId: value || null,
                  type: type || null,
                });
              }}
            />
          </div>

          <div className="w-full md:w-auto">
            <Select
              id="staples-type-filter"
              label="Type Filter"
              value={type || 'all'}
              onChange={(value) => {
                replaceRoute('/staples', {
                  colorId: colorId || null,
                  type: value === 'all' ? null : value,
                });
              }}
            >
              <option value="all">All Types</option>
              <option value="creature">Creature</option>
              <option value="instant">Instant</option>
              <option value="sorcery">Sorcery</option>
              <option value="artifact">Artifact</option>
              <option value="enchantment">Enchantment</option>
              <option value="planeswalker">Planeswalker</option>
              <option value="land">Land</option>
            </Select>
          </div>
        </div>

        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.staplesRef}
            props={{}}
          />
        </Suspense>
      </div>
    </>
  );
};

/** @resource route(/staples)#staples_page */
export const StaplesPage: EntryPointComponent<
  {staplesQueryRef: staples_StaplesQuery},
  {}
> = ({queries}) => {
  const data = usePreloadedQuery(
    graphql`
      query staples_StaplesQuery($colorId: String, $type: String) @preloadable {
        staples(colorId: $colorId, type: $type) {
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
    <>
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
        {(data.staples ?? []).map((card) => (
          <StapleCard key={card.id} card={card} />
        ))}
      </div>

      <Footer />
    </>
  );
};
