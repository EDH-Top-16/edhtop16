import CommandersQueryParameters from "#genfiles/queries/pages_CommandersQuery$parameters";
import {
  CommandersSortBy,
  TimePeriod,
} from "#genfiles/queries/pages_CommandersQuery.graphql";
import { JSResource, ModuleType } from "#genfiles/river/js_resource";
import { EntryPointParams, QueryParamKind } from "#genfiles/river/router";
import { EntryPoint } from "react-relay";

/** @route / */
export const entrypoint: EntryPoint<ModuleType<"m#index">, EntryPointParams> = {
  root: JSResource.fromModuleId("m#index"),
  getPreloadProps({ router }) {
    const {
      sortBy = "POPULARITY",
      timePeriod = "SIX_MONTHS",
      minEntries = 20,
      minSize: minTournamentSize = 60,
      colorId,
    } = router.parseQuery({
      sortBy: QueryParamKind.STRING,
      timePeriod: QueryParamKind.STRING,
      minEntries: QueryParamKind.NUMBER,
      minSize: QueryParamKind.NUMBER,
      colorId: QueryParamKind.STRING,
    });

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
    };
  },
};
