import tournamentView_TournamentPageShellQueryParameters from '#genfiles/queries/tournamentView_TournamentPageShellQuery$parameters';
import tournamentView_TournamentQueryParameters from '#genfiles/queries/tournamentView_TournamentQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /tournament/:tid
 * @param {string} tid
 * @param {string?} commander
 * @param {string?} tab
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#tournament_page_shell'>,
  EntryPointParams<'/tournament/:tid'>
> = {
  root: JSResource.fromModuleId('m#tournament_page_shell'),
  getPreloadProps({params, schema}) {
    const {tid, commander, tab} = schema.parse(params);

    return {
      queries: {
        tournamentRef: {
          parameters: tournamentView_TournamentPageShellQueryParameters,
          variables: {tid},
        },
      },
      extraProps: {tab: tab ?? 'entries', commanderName: commander},
      entryPoints: {
        tournamentContent: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#tournament_view'),
            getPreloadProps() {
              return {
                queries: {
                  tournamentQueryRef: {
                    parameters: tournamentView_TournamentQueryParameters,
                    variables: {
                      TID: tid,
                      commander,
                      showStandings: tab !== 'breakdown' && tab !== 'commander',
                      showBreakdown: tab === 'breakdown',
                      showBreakdownCommander:
                        tab === 'commander' && commander != null,
                    },
                  },
                },
              };
            },
          },
        },
      },
    };
  },
};
