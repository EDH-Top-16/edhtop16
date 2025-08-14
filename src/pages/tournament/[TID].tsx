import {TID_TournamentQuery} from '#genfiles/queries/TID_TournamentQuery.graphql';
import {EntryPointComponent, usePreloadedQuery} from 'react-relay/hooks';
import {graphql} from 'relay-runtime';
import {Footer} from '../../components/footer';
import {useTournamentPage} from '../../hooks/useTournamentPage';
import {
  EntryCard,
  BreakdownGroupCard,
  TournamentPageShell,
} from '../../components/tournament_page';

/** @resource m#tournament_view */
export const TournamentViewPage: EntryPointComponent<
  {tournamentQueryRef: TID_TournamentQuery},
  {}
> = ({queries}) => {
  const {tournament} = usePreloadedQuery(
    graphql`
      query TID_TournamentQuery(
        $TID: String!
        $commander: String
        $showStandings: Boolean!
        $showBreakdown: Boolean!
        $showBreakdownCommander: Boolean!
      ) @preloadable {
        tournament(TID: $TID) {
          ...tournamentPage_TournamentPageShell
          ...useTournamentPage_baseTournament
          ...useTournamentPage_commanderData
          entries @include(if: $showStandings) {
            id
            ...tournamentPage_EntryCard
          }
          breakdown @include(if: $showBreakdown) {
            commander {
              id
            }
            ...tournamentPage_BreakdownGroupCard
          }
          breakdownEntries: entries(commander: $commander)
            @include(if: $showBreakdownCommander) {
            id
            ...tournamentPage_EntryCard
          }
        }
      }
    `,
    queries.tournamentQueryRef,
  );

  const {currentContent, shellProps, handleCommanderSelect} = useTournamentPage(
    queries.tournamentQueryRef,
  );

  const renderCurrentContent = () => {
    switch (currentContent.type) {
      case 'breakdown': {
        const breakdownData = currentContent.data as NonNullable<typeof tournament.breakdown>;
        return breakdownData.map((group) => (
          <BreakdownGroupCard
            key={group.commander.id}
            group={group}
            onClickGroup={handleCommanderSelect}
          />
        ));
      }
      case 'commander': {
        const commanderData = currentContent.data as NonNullable<typeof tournament.breakdownEntries>;
        return commanderData.map((entry) => (
          <EntryCard key={entry.id} entry={entry} highlightFirst={false} />
        ));
      }
      default: {
        const entriesData = currentContent.data as NonNullable<typeof tournament.entries>;
        return entriesData.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ));
      }
    }
  };

  return (
    <TournamentPageShell {...shellProps}>
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {renderCurrentContent()}
      </div>
      <Footer />
    </TournamentPageShell>
  );
};
