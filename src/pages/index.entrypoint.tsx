import CommandersQueryParameters from '#genfiles/queries/pages_CommandersQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#index'>,
  EntryPointParams<'/'>
> = {
  root: JSResource.fromModuleId('m#index'),
  getPreloadProps() {
    return {
      queries: {
        commandersQueryRef: {
          parameters: CommandersQueryParameters,
          variables: {},
        },
      },
    };
  },
};
