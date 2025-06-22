import { EntryPoint } from "react-relay";
import { JSResource, ModuleType } from "../lib/river/js_resource";
import { EntryPointParams, QueryParamKind } from "../lib/river/router";
import CommandersQueryParameters from "../queries/__generated__/pages_CommandersQuery$parameters";

/** @route / */
export const entrypoint: EntryPoint<ModuleType<"m#index">, EntryPointParams> = {
  root: JSResource.fromModuleId("m#index"),
  getPreloadProps({ router }) {
    const { minEntries = 0, minSize: minTournamentSize = 0 } =
      router.parseQuery({
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
            sortBy: "POPULARITY",
            timePeriod: "ALL_TIME",
          },
        },
      },
    };
  },
};
