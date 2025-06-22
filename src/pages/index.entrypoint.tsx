/** @route / */
import { EntryPoint } from "react-relay";
import { JSResource } from "../lib/river/js_resource";
import { QueryParamKind, Router } from "../lib/river/router";
import CommandersQueryParameters from "../queries/__generated__/pages_CommandersQuery$parameters";
import type { CommandersPage } from "./index";

export const entrypoint: EntryPoint<typeof CommandersPage, Router> = {
  root: JSResource.fromModuleId("m#index"),
  getPreloadProps(router) {
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
