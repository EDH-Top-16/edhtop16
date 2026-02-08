import commanderPage_CommanderQueryParameters from '#genfiles/queries/commanderPage_CommanderQuery$parameters';
import {
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/commanderPage_CommanderQuery.graphql';
import commanderPage_CommanderShellQueryParameters from '#genfiles/queries/commanderPage_CommanderShellQuery$parameters';
import commanderPage_CommanderStatsQueryParameters from '#genfiles/queries/commanderPage_CommanderStatsQuery$parameters';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {getSchemaForRoute} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /commander/:commander
 * @param {string} commander
 * @param {string?} tab
 * @param {string?} card
 * @param {string?} sortBy
 * @param {string?} timePeriod
 * @param {number?} maxStanding
 * @param {number?} minEventSize
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#commander_page_shell'>,
  {params: Record<string, unknown>}
> = {
  root: JSResource.fromModuleId('m#commander_page_shell'),
  getPreloadProps({params}) {
    const {
      commander,
      tab = 'entries',
      card,
      sortBy = 'TOP',
      timePeriod = 'ONE_YEAR',
      maxStanding,
      minEventSize = 50,
    } = getSchemaForRoute('/commander/:commander').parse(params);

    return {
      queries: {
        commanderRef: {
          parameters: commanderPage_CommanderShellQueryParameters,
          variables: {commander},
        },
      },
      extraProps: {
        tab: tab as 'entries' | 'staples' | 'card',
        cardName: card,
        sortBy: sortBy as EntriesSortBy,
        timePeriod: timePeriod as TimePeriod,
        maxStanding,
        minEventSize,
      },
      entryPoints: {
        commanderStats: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#commander_stats'),
            getPreloadProps() {
              return {
                queries: {
                  statsRef: {
                    parameters: commanderPage_CommanderStatsQueryParameters,
                    variables: {
                      commander,
                      minEventSize,
                      timePeriod: timePeriod as TimePeriod,
                    },
                  },
                },
              };
            },
          },
        },
        commanderContent: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#commander_page'),
            getPreloadProps() {
              return {
                queries: {
                  commanderQueryRef: {
                    parameters: commanderPage_CommanderQueryParameters,
                    variables: {
                      commander,
                      showStaples: tab === 'staples',
                      showEntries: tab !== 'staples' && !card,
                      showCardDetail: !!card,
                      cardName: card,
                      sortBy: sortBy as EntriesSortBy,
                      timePeriod: timePeriod as TimePeriod,
                      maxStanding,
                      minEventSize,
                    },
                  },
                },
              };
            },
          },
        },
      },
    };
  },
};
