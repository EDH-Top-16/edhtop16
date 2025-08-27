import type {
  TimePeriod,
  TournamentSortBy,
} from '#genfiles/queries/AllTournamentsQuery.graphql';
import TournamentsQueryParameters from '#genfiles/queries/tournaments_TournamentsQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/river/js_resource';
import {EntryPointParams} from '#genfiles/river/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /tournaments
 * @param {number?} minSize
 * @param {string?} sortBy
 * @param {string?} timePeriod
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#tournaments'>,
  EntryPointParams<'/tournaments'>
> = {
  root: JSResource.fromModuleId('m#tournaments'),
  getPreloadProps({params, schema}) {
    const {
      sortBy = 'DATE',
      minSize = 0,
      timePeriod = 'ALL_TIME',
    } = schema.parse(params);

    return {
      queries: {
        tournamentQueryRef: {
          parameters: TournamentsQueryParameters,
          variables: {
            minSize,
            sortBy: sortBy as TournamentSortBy,
            timePeriod: timePeriod as TimePeriod,
          },
        },
      },
      entryPoints: {
        fallback: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#tournaments_fallback'),
            getPreloadProps() {
              return {
                queries: {},
                extraProps: {
                  minSize,
                  sortBy: sortBy as TournamentSortBy,
                  timePeriod: timePeriod as TimePeriod,
                },
              };
            },
          },
        },
      },
    } as const;
  },
};
