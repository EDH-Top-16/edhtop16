/** @route / */
import { EntryPoint } from "react-relay";
import { JSResource } from "../lib/river/js_resource";
import { Router } from "../lib/river/router";
import CommandersQueryParameters from "../queries/__generated__/pages_CommandersQuery$parameters";
import type { CommandersPage } from "./index";

export const entrypoint: EntryPoint<typeof CommandersPage, Router> = {
  root: JSResource.fromModuleId("m#index"),
  getPreloadProps(router) {
    return {
      queries: {
        commandersQueryRef: {
          parameters: CommandersQueryParameters,
          variables: {
            minEntries: 0,
            minTournamentSize: 0,
            sortBy: "POPULARITY",
            timePeriod: "ALL_TIME",
          },
        },
      },
    };
  },
};
