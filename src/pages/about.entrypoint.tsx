import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/** @route /about */
export const entrypoint: EntryPoint<
  ModuleType<'m#about'>,
  EntryPointParams<'/about'>
> = {
  root: JSResource.fromModuleId('m#about'),
  getPreloadProps({}) {
    return {
      queries: {},
    };
  },
};
