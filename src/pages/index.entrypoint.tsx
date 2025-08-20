import CommandersQueryParameters from '#genfiles/queries/pages_CommandersQuery$parameters';
import {
  CommandersSortBy,
  TimePeriod,
} from '#genfiles/queries/pages_CommandersQuery.graphql';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /
 * @param {number?} minSize
 * @param {number?} minEntries
 * @param {string?} sortBy
 * @param {string?} timePeriod
 * @param {string?} colorId
 * @param {string?} display
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#index'>,
  EntryPointParams<'/'>
> = {
  root: JSResource.fromModuleId('m#index'),
  getPreloadProps({schema, params}) {
    // Use URL parameter fallbacks for initial load, then preferences will take over via refetch
    const {
      sortBy,
      timePeriod,
      minEntries,
      minSize: minTournamentSize,
      colorId,
    } = schema.parse(params);

    // Use defaults for initial load - the usePreferences hook will refetch with real preferences
    const finalPrefs = {
      sortBy: sortBy || 'CONVERSION',
      timePeriod: timePeriod || 'ONE_MONTH', 
      minEntries: minEntries ?? 0,
      minTournamentSize: minTournamentSize ?? 0,
      colorId: colorId || '',
    };

    return {
      queries: {
        commandersQueryRef: {
          parameters: CommandersQueryParameters,
          variables: {
            minEntries: finalPrefs.minEntries,
            minTournamentSize: finalPrefs.minTournamentSize,
            colorId: finalPrefs.colorId,
            sortBy: finalPrefs.sortBy as CommandersSortBy,
            timePeriod: finalPrefs.timePeriod as TimePeriod,
          },
        },
      },
    };
  },
};
