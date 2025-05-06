import { EntryPoint } from "react-relay";
import { JSResource } from "../lib/river/js_resource";
import TournamentsQueryParameters from "../queries/__generated__/tournaments_TournamentsQuery$parameters";
import { tournaments_TournamentsQuery$variables } from "../queries/__generated__/tournaments_TournamentsQuery.graphql";
import type { TournamentsPage } from "./tournaments";

/** @route /tournament/:tid */
export const entrypoint: EntryPoint<
  typeof TournamentsPage,
  tournaments_TournamentsQuery$variables
> = {
  root: JSResource.fromModuleId("m#tournaments"),
  getPreloadProps(variables) {
    return {
      queries: {
        tournamentQueryRef: {
          parameters: TournamentsQueryParameters,
          options: { fetchPolicy: "store-or-network" },
          variables: {
            minSize: 0,
            sortBy: "DATE",
            timePeriod: "ALL_TIME",
          },
        },
      },
    };
  },
};
