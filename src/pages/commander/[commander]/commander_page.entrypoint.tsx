import { EntryPoint } from "react-relay";
import { JSResource, ModuleType } from "../../../lib/river/js_resource";
import { EntryPointParams, QueryParamKind } from "../../../lib/river/router";
import CommanderQueryParameters from "../../../queries/__generated__/Commander_CommanderQuery$parameters";
import {
  EntriesSortBy,
  TimePeriod,
} from "../../../queries/__generated__/Commander_CommanderQuery.graphql";

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
