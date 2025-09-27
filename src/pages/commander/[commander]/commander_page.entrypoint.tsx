import CommanderQueryParameters from '#genfiles/queries/Commander_CommanderQuery$parameters';
import CommanderFallbackQueryParameters from '#genfiles/queries/Commander_CommanderFallbackQuery$parameters';
import {
  EntriesSortBy,
  TimePeriod,
} from '#genfiles/queries/Commander_CommanderQuery.graphql';
import {JSResource, ModuleType} from '#genfiles/router/js_resource';
import {EntryPointParams} from '#genfiles/router/router';
import {EntryPoint} from 'react-relay/hooks';

/**
 * @route /commander/:commander
 * @param {string} commander
 * @param {string?} tab
 * @param {string?} sortBy
 * @param {string?} timePeriod
 * @param {number?} maxStanding
 * @param {number?} minEventSize
 * @param {string?} card
 */
export const entrypoint: EntryPoint<
  ModuleType<'m#commander_page'>,
  EntryPointParams<'/commander/:commander'>
> = {
  root: JSResource.fromModuleId('m#commander_page'),
  getPreloadProps({params, schema}) {
    const {
      commander,
      tab = 'entries',
      sortBy = 'TOP',
      timePeriod = 'ONE_YEAR',
      maxStanding,
      minEventSize = 60,
      card,
    } = schema.parse(params);

    return {
      queries: {
        commanderQueryRef: {
          parameters: CommanderQueryParameters,
          variables: {
            commander,
            showStaples: tab === 'staples',
            showEntries: tab !== 'staples',
            showCardOptions: tab === 'card',
            sortBy: sortBy as EntriesSortBy,
            timePeriod: timePeriod as TimePeriod,
            maxStanding,
            minEventSize,
            cardName: card ?? null,
          },
        },
      },
      entryPoints: {
        fallback: {
          entryPointParams: {},
          entryPoint: {
            root: JSResource.fromModuleId('m#commander_page_fallback'),
            getPreloadProps() {
              return {
                queries: {
                  commanderFallbackQueryRef: {
                    parameters: CommanderFallbackQueryParameters,
                    variables: {commander},
                  },
                },
                extraProps: {
                  commander,
                  showStaples: tab === 'staples',
                  showEntries: tab !== 'staples',
                  tab:
                    tab === 'staples'
                      ? 'staples'
                      : tab === 'card'
                        ? 'card'
                        : 'entries',
                  sortBy: sortBy as EntriesSortBy,
                  timePeriod: timePeriod as TimePeriod,
                  maxStanding,
                  minEventSize,
                  cardName: card ?? null,
                },
              };
            },
          },
        },
      },
    };
  },
};
