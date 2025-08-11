import CommanderPageQuery from '#genfiles/queries/useCommanderPage_CommanderQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /commander/:commander
 * @param {string} commander
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#commander_page'>,
  EntryPointParams<'/commander/:commander'>
> = {
  root: JSResource.fromModuleId('m#commander_page'),
  getPreloadProps({params, schema}) {
    const {commander} = schema.parse(params);

    return {
      queries: {
        commanderQueryRef: {
          parameters: CommanderPageQuery,
          variables: {
            commander,
            sortBy: 'TOP',
            timePeriod: 'ONE_YEAR',
            maxStanding: undefined,
            minEventSize: undefined,
          },
        },
      },
    };
  },
};
