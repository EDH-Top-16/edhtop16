import CommandersQueryParameters from '#genfiles/queries/pages_CommandersQuery$parameters';
import {
  CommandersSortBy,
  TimePeriod,
} from '#genfiles/queries/pages_CommandersQuery.graphql';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
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
      sortBy = 'POPULARITY',
      timePeriod = 'SIX_MONTHS',
      minEntries = 20,
      minSize: minTournamentSize = 60,
      colorId,
    } = schema.parse(params);

    return {
      queries: {
        commandersQueryRef: {
          parameters: CommandersQueryParameters,
          variables: {
            minEntries,
            minTournamentSize,
            colorId,
            sortBy: sortBy as CommandersSortBy,
            timePeriod: timePeriod as TimePeriod,
          },
        },
      },
      entryPoints: {
        fallback: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#index_fallback'),
            getPreloadProps() {
              return {
                queries: {},
                extraProps: {
                  minEntries,
                  minTournamentSize,
                  colorId,
                  sortBy: sortBy as CommandersSortBy,
                  timePeriod: timePeriod as TimePeriod,
                },
              };
            },
          },
        },
      },
    };
  },
};
