import CommanderQueryParameters from "#genfiles/queries/Commander_CommanderQuery$parameters";
import {
  EntriesSortBy,
  TimePeriod,
} from "#genfiles/queries/Commander_CommanderQuery.graphql";
import { JSResource, ModuleType } from "#genfiles/river/js_resource";
import { EntryPointParams, QueryParamKind } from "#genfiles/river/router";
import { EntryPoint } from "react-relay";

/**
 * @route /commander/:commander
 * @param {string} commander
 * @param {string?} sortBy
 * @param {string?} timePeriod
 * @param {number?} maxStanding
 * @param {number?} minEventSize
 */
export const entrypoint: EntryPoint<
  ModuleType<"m#commander_page">,
  EntryPointParams<"/commander/:commander">
> = {
  root: JSResource.fromModuleId("m#commander_page"),
  getPreloadProps({ params, schema }) {
    const {
      commander,
      sortBy = "TOP",
      timePeriod = "ONE_YEAR",
      maxStanding,
      minEventSize = 60,
    } = schema.parse(params);

    return {
      queries: {
        commanderQueryRef: {
          parameters: CommanderQueryParameters,
          variables: {
            commander,
            sortBy: sortBy as EntriesSortBy,
            timePeriod: timePeriod as TimePeriod,
            maxStanding,
            minEventSize,
          },
        },
      },
    };
  },
};
