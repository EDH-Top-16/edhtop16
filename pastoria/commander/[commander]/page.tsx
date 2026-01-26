import pageQuery from '#genfiles/queries/pageQuery.graphql.js';
import {useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {ColorIdentity} from '#src/assets/icons/colors.js';
import {Footer} from '#components/footer.js';
import {LoadingIcon} from '#components/fallback.js';
import {Navigation} from '#components/navigation.js';
import {FirstPartyPromo} from '#components/promo.js';
import {Tab, TabList} from '#components/tabs.js';
import cn from 'classnames';
import {Suspense} from 'react';
import {graphql, usePreloadedQuery} from 'react-relay/hooks';
import {EntryPointContainer} from 'react-relay/hooks';

export const queries = {
  shellQueryRef: pageQuery,
};

export default function CommanderPage({
  queries,
  entryPoints,
}: PageProps<'/commander/[commander]'>) {
  const {
    commander: commanderName,
    tab = 'entries',
    card,
    sortBy = 'TOP',
    timePeriod = 'ONE_YEAR',
    maxStanding,
    minEventSize = 60,
  } = useRouteParams('/commander/[commander]');

  const {commander} = usePreloadedQuery(
    graphql`
      query pageQuery($commander: String!) @preloadable @throwOnFieldError {
        commander(name: $commander) {
          name
          colorId
          breakdownUrl

          cards {
            imageUrls
          }

          promo {
            ...promo_EmbededPromo
          }
        }
      }
    `,
    queries.shellQueryRef,
  );

  const {pushRoute} = useNavigation();

  if (!commander) {
    return (
      <>
        <Navigation />
        <div className="flex h-64 items-center justify-center">
          <h1 className="text-2xl text-white">Commander not found</h1>
        </div>
        <Footer />
      </>
    );
  }

  const showEntries = tab === 'entries' || (!tab && !card);
  const showStaples = tab === 'staples';
  const showCardDetail = tab === 'card' && card != null;

  return (
    <>
      <title>{commander.name}</title>
      <meta
        name="description"
        content={`Top Performing and Recent Decklists for ${commander.name} in cEDH`}
      />
      <Navigation />

      {/* Banner */}
      <div className="h-64 w-full bg-black/60 md:h-80">
        <div className="relative mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col items-center justify-center">
          <div className="absolute top-0 left-0 flex h-full w-full brightness-40">
            {commander.cards
              .flatMap((c) => c.imageUrls)
              .map((src, _i, {length}) => (
                <img
                  className={cn(
                    'flex-1 object-cover object-top',
                    length === 2 ? 'w-1/2' : 'w-full',
                  )}
                  key={src}
                  src={src}
                  alt={`${commander.name} art`}
                />
              ))}
          </div>

          <h1 className="font-title relative m-0 mb-4 text-center text-2xl font-semibold text-white md:text-4xl lg:text-5xl">
            {commander.name}
          </h1>

          <div className="relative">
            <ColorIdentity identity={commander.colorId} />
          </div>

          {/* Stats - loaded as separate entrypoint since it depends on filter params */}
          <Suspense fallback={null}>
            {entryPoints.stats && (
              <EntryPointContainer
                entryPointReference={entryPoints.stats}
                props={{}}
              />
            )}
          </Suspense>
        </div>
      </div>

      {commander.promo && <FirstPartyPromo promo={commander.promo} />}

      <TabList
        className="mx-auto max-w-(--breakpoint-md)"
        border={showStaples || showCardDetail}
      >
        <Tab
          selected={showEntries}
          onClick={() => {
            pushRoute('/commander/[commander]', {
              commander: commander.name,
              tab: 'entries',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              // Explicitly clear card parameter
              card: undefined,
            });
          }}
        >
          Tournament Entries
        </Tab>

        <Tab
          selected={showStaples}
          onClick={() => {
            pushRoute('/commander/[commander]', {
              commander: commander.name,
              tab: 'staples',
              sortBy,
              timePeriod,
              maxStanding,
              minEventSize,
              // Explicitly clear card parameter
              card: undefined,
            });
          }}
        >
          Staples
        </Tab>

        {card && showCardDetail && (
          <Tab
            selected={showCardDetail}
            onClick={() => {
              pushRoute('/commander/[commander]', {
                commander: commander.name,
                tab: 'card',
                card: card,
                sortBy,
                timePeriod,
                maxStanding,
                minEventSize,
              });
            }}
          >
            {card}
          </Tab>
        )}
      </TabList>

      {/* Tab content */}
      <Suspense fallback={<LoadingIcon />}>
        {showEntries && entryPoints.entries && (
          <EntryPointContainer
            entryPointReference={entryPoints.entries}
            props={{}}
          />
        )}
        {showStaples && entryPoints.staples && (
          <EntryPointContainer
            entryPointReference={entryPoints.staples}
            props={{}}
          />
        )}
        {showCardDetail && entryPoints.cardDetail && (
          <EntryPointContainer
            entryPointReference={entryPoints.cardDetail}
            props={{}}
          />
        )}
      </Suspense>

      <Footer />
    </>
  );
}
