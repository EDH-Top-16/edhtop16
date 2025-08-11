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
  
  const { 
    isAuthenticated, 
    sessionData, 
    updatePreferences: updateSessionPrefs 
  } = useSession();

  const {
    
    commander,
    data,
    entryCards,
    
    
    shellPreferences,
    localEventSize,
    localMaxStanding,
    hasNext,
    isLoadingNext,
    
    
    handleSortBySelect,
    handleTimePeriodSelect,
    handleEventSizeChange,
    handleEventSizeSelect,
    handleMaxStandingChange,
    handleMaxStandingSelect,
    handleKeyDown,
    handleLoadMore,
    
    
    updatePreference,
    preferences,
  } = useCommanderPage(queries.commanderQueryRef, {
    
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
