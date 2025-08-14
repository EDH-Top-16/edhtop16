import React from 'react';
import {
  EntryPointComponent,
  graphql,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {pages_CommandersQuery} from '#genfiles/queries/pages_CommandersQuery.graphql';
import {pages_topCommanders$key} from '#genfiles/queries/pages_topCommanders.graphql';
import {TopCommandersQuery} from '#genfiles/queries/TopCommandersQuery.graphql';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import TableCellsIcon from '@heroicons/react/24/solid/TableCellsIcon';

import {Footer} from '../components/footer';
import {LoadMoreButton} from '../components/load_more';
import {
  CommandersPageShell,
  CommandersHeader,
  CommandersFilters,
  CommandersGrid,
} from '../components/commanders_page';
import {useCommandersPage} from '../hooks/useCommandersPage';
import {useSession} from '../lib/client/use_session';
import {SessionStatus} from '../components/session_status';

/** @resource m#index */
export const CommandersPage: EntryPointComponent<
  {commandersQueryRef: pages_CommandersQuery},
  {}
> = ({queries}) => {
  const {
    isAuthenticated,
    sessionData,
    updatePreferences: updateSessionPrefs,
  } = useSession();

  const query = usePreloadedQuery(
    graphql`
      query pages_CommandersQuery @preloadable {
        ...pages_topCommanders
      }
    `,
    queries.commandersQueryRef,
  );

  const fragmentRef = graphql`
    fragment pages_topCommanders on Query
    @argumentDefinitions(
      cursor: {type: "String"}
      count: {type: "Int", defaultValue: 20}
    )
    @refetchable(queryName: "TopCommandersQuery") {
      commanders(first: $count, after: $cursor)
        @connection(key: "pages__commanders") {
        edges {
          node {
            id
            ...commandersPage_TopCommandersCard
          }
        }
      }
    }
  `;

  const {
    data,
    currentPreferences,
    secondaryStatistic,
    localMinEntries,
    setLocalMinEntries,
    localEventSize,
    setLocalEventSize,
    inputHandlers,
    hasNext,
    isLoadingNext,
    handleDisplayToggle,
    handleSortByChange,
    handleTimePeriodChange,
    handleColorChange,
    handleLoadMore,
  } = useCommandersPage(query, fragmentRef, {
    isAuthenticated,
    sessionData,
    updatePreferences: updateSessionPrefs,
  });

  return (
    <CommandersPageShell>
      {/* Header with SessionStatus in top-right */}
      <div className="mb-8 flex w-full items-baseline gap-4">
        <h1 className="font-title flex-1 text-5xl font-extrabold text-white">
          cEDH Metagame Breakdown
          {isAuthenticated && (
            <span className="ml-2 text-sm font-normal text-green-400">
              (Session Active)
            </span>
          )}
        </h1>

        {/*<div className="flex items-center gap-4">
          <SessionStatus showDetails={false} />
          <button
            onClick={handleDisplayToggle}
            className="cursor-pointer"
            aria-label={`Switch to ${currentPreferences.display === 'table' ? 'card' : 'table'} view`}
          >
            {currentPreferences.display === 'card' ? (
              <TableCellsIcon className="h-6 w-6 text-white" />
            ) : (
              <RectangleStackIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>*/}
      </div>

      <CommandersFilters
        currentPreferences={currentPreferences}
        localMinEntries={localMinEntries}
        setLocalMinEntries={setLocalMinEntries}
        localEventSize={localEventSize}
        setLocalEventSize={setLocalEventSize}
        inputHandlers={inputHandlers}
        onDisplayToggle={handleDisplayToggle}
        onSortByChange={handleSortByChange}
        onTimePeriodChange={handleTimePeriodChange}
        onColorChange={handleColorChange}
      />

      {data?.commanders?.edges ? (
        <>
          <CommandersGrid
            commanders={data.commanders.edges}
            display={currentPreferences.display}
            secondaryStatistic={secondaryStatistic}
          />

          <LoadMoreButton
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            loadNext={handleLoadMore}
          />
        </>
      ) : (
        <div className="py-8 text-center text-white">Loading commanders...</div>
      )}

      <Footer />
    </CommandersPageShell>
  );
};
