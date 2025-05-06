import { EntryPoint } from "react-relay";
import { JSResource } from "../lib/river/js_resource";
import CommandersQueryParameters from "../queries/__generated__/pages_CommandersQuery$parameters";
import { pages_CommandersQuery$variables } from "../queries/__generated__/pages_CommandersQuery.graphql";
import { CommandersPage } from "./index";

/** @route / */
export const entrypoint: EntryPoint<
  typeof CommandersPage,
  pages_CommandersQuery$variables
> = {
  root: JSResource.fromModuleId("m#index"),
  getPreloadProps(variables) {
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
