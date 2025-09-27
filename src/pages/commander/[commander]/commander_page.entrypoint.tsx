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
 * @param {string?} card
 * @param {string?} sortBy
 * @param {string?} timePeriod
 * @param {number?} maxStanding
 * @param {number?} minEventSize
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
      card,
      sortBy = 'TOP',
      timePeriod = 'ONE_YEAR',
      maxStanding,
      minEventSize = 60,
    } = schema.parse(params);

    return {
      queries: {
        commanderQueryRef: {
          parameters: CommanderQueryParameters,
          variables: {
            commander,
            showStaples: tab === 'staples',
            showEntries: tab !== 'staples' && !card,
            showCardDetail: !!card,
            cardName: card || null,
            sortBy: sortBy as EntriesSortBy,
            timePeriod: timePeriod as TimePeriod,
            maxStanding,
            minEventSize,
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
                  showEntries: tab !== 'staples' && !card,
                  showCardDetail: !!card,
                  cardName: card || null,
                  tab: card
                    ? 'card'
                    : tab === 'staples'
                      ? 'staples'
                      : 'entries',
                  sortBy: sortBy as EntriesSortBy,
                  timePeriod: timePeriod as TimePeriod,
                  maxStanding,
                  minEventSize,
                },
              };
            },
          },
        },
      },
    };
  },
};
