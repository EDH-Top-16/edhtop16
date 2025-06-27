import { EntryPoint } from "react-relay";
import { JSResource, ModuleType } from "../lib/river/js_resource";
import { EntryPointParams, QueryParamKind } from "../lib/river/router";
import CommandersQueryParameters from "../queries/__generated__/pages_CommandersQuery$parameters";
import {
  CommandersSortBy,
  TimePeriod,
} from "../queries/__generated__/pages_CommandersQuery.graphql";

/** @route / */
export const entrypoint: EntryPoint<ModuleType<"m#index">, EntryPointParams> = {
  root: JSResource.fromModuleId("m#index"),
  getPreloadProps({ router }) {
    const {
      sortBy = "POPULARITY",
      timePeriod = "SIX_MONTHS",
      minEntries = 20,
      minSize: minTournamentSize = 60,
    } = router.parseQuery({
      sortBy: QueryParamKind.STRING,
      timePeriod: QueryParamKind.STRING,
      minEntries: QueryParamKind.NUMBER,
      minSize: QueryParamKind.NUMBER,
    });

    return {
      queries: {
        commandersQueryRef: {
          parameters: CommandersQueryParameters,
          variables: {
            minEntries,
            minTournamentSize,
            sortBy: sortBy as CommandersSortBy,
            timePeriod: timePeriod as TimePeriod,
          },
        },
      },
    };
  },
};
