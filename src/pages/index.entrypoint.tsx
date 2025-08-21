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
    const {
      sortBy,
      timePeriod,
      minEntries,
      minSize: minTournamentSize,
      colorId,
      display,
    } = schema.parse(params);

    // Note: Server preferences are now injected via window.__SERVER_PREFERENCES__
    // in entry-server.tsx, so we'll rely on the smart hydration refetch to handle
    // the preference/URL mismatch detection. This keeps the entrypoint simple
    // and uses the existing server-side preference injection system.

    // Use URL params with fallbacks for initial load - smart hydration will optimize this
    const finalPrefs = {
      sortBy: sortBy || 'CONVERSION',
      timePeriod: timePeriod || 'ONE_MONTH',
      minEntries: minEntries ?? 0,
      minTournamentSize: minTournamentSize ?? 0,
      colorId: colorId || '',
      display: display || 'card',
    };

    //console.log('Server entrypoint using URL preferences:', finalPrefs);

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
