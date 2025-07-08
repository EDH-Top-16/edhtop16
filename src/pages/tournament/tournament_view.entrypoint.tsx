import TID_TournamentQueryParameters from '#genfiles/queries/TID_TournamentQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /tournament/:tid
 * @param {string} tid
 * @param {string?} commander
 * @param {string?} tab
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#tournament_view'>,
  EntryPointParams<'/tournament/:tid'>
> = {
  root: JSResource.fromModuleId('m#tournament_view'),
  getPreloadProps({params, schema}) {
    const {tid, commander, tab} = schema.parse(params);

    return {
      queries: {
        tournamentQueryRef: {
          parameters: TID_TournamentQueryParameters,
          variables: {
            TID: tid,
            commander,
            showStandings: tab !== 'breakdown' && tab !== 'commander',
            showBreakdown: tab === 'breakdown',
            showBreakdownCommander: tab === 'commander' && commander != null,
          },
        },
      },
    };
  },
};
