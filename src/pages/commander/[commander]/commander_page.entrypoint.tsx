import CommanderQueryParameters from "#genfiles/queries/Commander_CommanderQuery$parameters";
import {
  EntriesSortBy,
  TimePeriod,
} from "#genfiles/queries/Commander_CommanderQuery.graphql";
import { JSResource, ModuleType } from "#genfiles/river/js_resource";
import { EntryPointParams, QueryParamKind } from "#genfiles/river/router";
import { EntryPoint } from "react-relay";

/** @route /commander/:commander */
export const entrypoint: EntryPoint<
  ModuleType<"m#commander_page">,
  EntryPointParams
> = {
  root: JSResource.fromModuleId("m#commander_page"),
  getPreloadProps({ params, router }) {
    const commander = decodeURIComponent(
      (params as { commander: string })["commander"],
    );
    const {
      sortBy = "TOP",
      timePeriod = "ONE_YEAR",
      maxStanding,
      minEventSize = 60,
    } = router.parseQuery({
      sortBy: QueryParamKind.STRING,
      timePeriod: QueryParamKind.STRING,
      maxStanding: QueryParamKind.NUMBER,
      minEventSize: QueryParamKind.NUMBER,
    });

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
