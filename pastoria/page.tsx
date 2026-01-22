import {ColorSelection} from '#components/color_selection.js';
import {LoadingIcon} from '#components/fallback.js';
import {Navigation} from '#components/navigation.js';
import {FirstPartyPromo} from '#components/promo.js';
import {Select} from '#components/select.js';
import page_HomePagePromoQuery from '#genfiles/queries/page_HomePagePromoQuery.graphql.js';
import {useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {useCommandersDisplay} from '#src/lib/client/commander_display_preferences.js';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';
import {Suspense} from 'react';
import {
  EntryPointContainer,
  graphql,
  usePreloadedQuery,
} from 'react-relay/hooks';

export const queries = {
  promoQueryRef: page_HomePagePromoQuery,
};

export default function CommandersPageShell({
  queries,
  entryPoints,
}: PageProps<'/'>) {
  const {homePagePromo} = usePreloadedQuery(
    graphql`
      query page_HomePagePromoQuery @preloadable {
        homePagePromo {
          ...promo_EmbededPromo
        }
      }
    `,
    queries.promoQueryRef,
  );

  const {
    sortBy = 'POPULARITY',
    timePeriod = 'SIX_MONTHS',
    minEntries = 20,
    minSize: minTournamentSize = 50,
    colorId = '',
  } = useRouteParams('/');
  const {replaceRoute} = useNavigation();
  const [display, toggleDisplay] = useCommandersDisplay();

  return (
    <>
      <title>cEDH Commanders</title>
      <meta
        name="description"
        content="Discover top performing commanders in cEDH!"
      />
      <Navigation />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white">
            cEDH Metagame Breakdown
          </h1>

          <button className="cursor-pointer" onClick={toggleDisplay}>
            {display === 'card' ? (
              <TableCellsIcon className="h-6 w-6 text-white" />
            ) : (
              <RectangleStackIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        <div className="mb-8 flex flex-col items-start space-y-4 lg:flex-row lg:items-end lg:space-y-0">
          <div className="flex-1">
            <ColorSelection
              selected={colorId}
              onChange={(value) => {
                replaceRoute('/', {colorId: value || null});
              }}
            />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-nowrap">
            <Select
              id="commanders-sort-by"
              label="Sort By"
              value={sortBy}
              onChange={(value) => {
                replaceRoute('/', {sortBy: value});
              }}
            >
              <option value="CONVERSION">Conversion Rate</option>
              <option value="POPULARITY">Popularity</option>
              <option value="TOP_CUTS">Top Cuts</option>
            </Select>

            <Select
              id="commanders-time-period"
              label="Time Period"
              value={timePeriod}
              onChange={(value) => {
                replaceRoute('/', {timePeriod: value});
              }}
            >
              <option value="ONE_MONTH">1 Month</option>
              <option value="THREE_MONTHS">3 Months</option>
              <option value="SIX_MONTHS">6 Months</option>
              <option value="ONE_YEAR">1 Year</option>
              <option value="ALL_TIME">All Time</option>
              <option value="POST_BAN">Post Ban</option>
            </Select>

            <Select
              id="commanders-min-entries"
              label="Min. Entries"
              value={`${minEntries}`}
              onChange={(value) => {
                replaceRoute('/', {minEntries: Number(value)});
              }}
            >
              <option value="0">All Commanders</option>
              <option value="20">20+ Entries</option>
              <option value="60">60+ Entries</option>
              <option value="120">120+ Entries</option>
            </Select>

            <Select
              id="commanders-min-size"
              label="Tournament Size"
              value={`${minTournamentSize}`}
              onChange={(value) => {
                replaceRoute('/', {minSize: Number(value)});
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="16">16+ Players</option>
              <option value="30">30+ Players</option>
              <option value="50">50+ Players</option>
              <option value="100">100+ Players</option>
              <option value="250">250+ Players</option>
            </Select>
          </div>
        </div>

        {homePagePromo && <FirstPartyPromo promo={homePagePromo} />}

        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.commanders}
            props={{}}
          />
        </Suspense>
      </div>
    </>
  );
}
