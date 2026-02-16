import claimPage_ClaimProfileQueryParameters from '#genfiles/queries/claimPage_ClaimProfileQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /claim
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#claim_page'>,
  EntryPointParams<'/claim'>
> = {
  root: JSResource.fromModuleId('m#claim_page'),
  getPreloadProps() {
    return {
      queries: {
        claimQuery: {
          parameters: claimPage_ClaimProfileQueryParameters,
          variables: {},
        },
      },
    };
  },
};
