import React from 'react';
import { EntryPointComponent } from 'react-relay/hooks';
import { useCommanderPage_CommanderQuery } from '#genfiles/queries/useCommanderPage_CommanderQuery.graphql';

import { Footer } from '../../../components/footer';
import { LoadMoreButton } from '../../../components/load_more';
import { 
  CommanderPageShell,
  CommanderEntryGrid 
} from '../../../components/commander_page';
import { useCommanderPage } from '../../../hooks/useCommanderPage';
import { useSession } from '../../../lib/client/use_session';

/** @resource m#commander_page */
export const CommanderPage: EntryPointComponent<
  { commanderQueryRef: useCommanderPage_CommanderQuery },
  {}
> = ({ queries }) => {
  // Session handling
  const { 
    isAuthenticated, 
    sessionData, 
    updatePreferences: updateSessionPrefs 
  } = useSession();

  const {
    // Data
    commander,
    data,
    entryCards,
    
    // State
    shellPreferences,
    localEventSize,
    localMaxStanding,
    hasNext,
    isLoadingNext,
    
    // Event handlers
    handleSortBySelect,
    handleTimePeriodSelect,
    handleEventSizeChange,
    handleEventSizeSelect,
    handleMaxStandingChange,
    handleMaxStandingSelect,
    handleKeyDown,
    handleLoadMore,
    
    // Functions
    updatePreference,
    preferences,
  } = useCommanderPage(queries.commanderQueryRef, {
    // Pass session context to the hook
    isAuthenticated,
    sessionData,
    updatePreferences: updateSessionPrefs,
  });

  if (!commander) {
    return (
      <div className="text-center text-white py-8">
        Commander not found
      </div>
    );
  }

  return (
    <CommanderPageShell
      commander={commander}
      {...shellPreferences}
      updatePreference={updatePreference}
      preferences={preferences}
      dynamicStatsFromData={data?.filteredStats || null}
      isAuthenticated={isAuthenticated}
      localEventSize={localEventSize}
      localMaxStanding={localMaxStanding}
      onSortBySelect={handleSortBySelect}
      onTimePeriodSelect={handleTimePeriodSelect}
      onEventSizeChange={handleEventSizeChange}
      onEventSizeSelect={handleEventSizeSelect}
      onMaxStandingChange={handleMaxStandingChange}
      onMaxStandingSelect={handleMaxStandingSelect}
      onKeyDown={handleKeyDown}
    >
      {entryCards.length > 0 ? (
        <>
          <CommanderEntryGrid entryCards={entryCards} />

          <LoadMoreButton
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            loadNext={handleLoadMore}
          />
        </>
      ) : (
        <div className="text-center text-white py-8">
          No entries found for this commander
        </div>
      )}

      <Footer />
    </CommanderPageShell>
  );
};
