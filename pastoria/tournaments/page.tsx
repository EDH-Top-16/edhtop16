import {LoadingIcon} from '#components/fallback.js';
import {Navigation} from '#components/navigation.js';
import {Select} from '#components/select.js';
import {useNavigation, useRouteParams} from '#genfiles/router/router.js';
import {PageProps} from '#genfiles/router/types.js';
import {Suspense} from 'react';
import {EntryPointContainer} from 'react-relay/hooks';

export default function TournamentsPageShell({
  entryPoints,
}: PageProps<'/tournaments'>) {
  const {
    sortBy = 'DATE',
    timePeriod = 'ALL_TIME',
    minSize = 0,
  } = useRouteParams('/tournaments');
  const {replaceRoute} = useNavigation();

  return (
    <>
      <title>cEDH Tournaments</title>
      <meta
        name="description"
        content="Discover top and recent cEDH tournaments!"
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0">
          <h1 className="font-title flex-1 text-4xl font-extrabold text-white md:text-5xl">
            cEDH Tournaments
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Select
              id="tournaments-sort-by"
              label="Sort By"
              value={sortBy}
              onChange={(value) => {
                replaceRoute('/tournaments', {sortBy: value});
              }}
            >
              <option value="PLAYERS">Tournament Size</option>
              <option value="DATE">Date</option>
            </Select>

            <Select
              id="tournaments-players"
              label="Tournament Size"
              value={`${minSize}`}
              onChange={(value) => {
                replaceRoute('/tournaments', {minSize: Number(value)});
              }}
            >
              <option value="0">All Tournaments</option>
              <option value="16">16+ Players</option>
              <option value="30">30+ Players</option>
              <option value="50">50+ Players</option>
              <option value="100">100+ Players</option>
              <option value="250">250+ Players</option>
            </Select>

            <Select
              id="tournaments-time-period"
              label="Time Period"
              value={timePeriod}
              onChange={(value) => {
                replaceRoute('/tournaments', {timePeriod: value});
              }}
            >
              <option value="ONE_MONTH">1 Month</option>
              <option value="THREE_MONTHS">3 Months</option>
              <option value="SIX_MONTHS">6 Months</option>
              <option value="POST_BAN">Post Ban</option>
              <option value="ONE_YEAR">1 Year</option>
              <option value="ALL_TIME">All Time</option>
            </Select>
          </div>
        </div>

        <Suspense fallback={<LoadingIcon />}>
          <EntryPointContainer
            entryPointReference={entryPoints.tournaments}
            props={{}}
          />
        </Suspense>
      </div>
    </>
  );
}
