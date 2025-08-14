import TournamentsQueryParameters from '#genfiles/queries/tournaments_TournamentsQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /tournaments
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#tournaments'>,
  EntryPointParams<'/tournaments'>
> = {
  root: JSResource.fromModuleId('m#tournaments'),
  getPreloadProps() {
    return {
      queries: {
        tournamentQueryRef: {
          parameters: TournamentsQueryParameters,
          variables: {},
        },
      },
    };
  },
};
