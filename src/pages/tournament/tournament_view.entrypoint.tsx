import TID_TournamentQueryParameters from '#genfiles/queries/TID_TournamentQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /tournament/:tid
 * @param {string} tid
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#tournament_view'>,
  EntryPointParams<'/tournament/:tid'>
> = {
  root: JSResource.fromModuleId('m#tournament_view'),
  getPreloadProps({params, schema}) {
    const {tid} = schema.parse(params);

    return {
      queries: {
        tournamentQueryRef: {
          parameters: TID_TournamentQueryParameters,
          variables: {
            TID: tid,
            commander: undefined,
            showStandings: true,
            showBreakdown: true,
            showBreakdownCommander: true,
          },
        },
      },
    };
  },
};
