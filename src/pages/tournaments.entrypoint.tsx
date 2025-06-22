/** @route /tournament/:tid */
import { EntryPoint } from "react-relay";
import { JSResource } from "../lib/river/js_resource";
import { Router } from "../lib/river/router";
import TournamentsQueryParameters from "../queries/__generated__/tournaments_TournamentsQuery$parameters";
import type { TournamentsPage } from "./tournaments";

export const entrypoint: EntryPoint<typeof TournamentsPage, Router> = {
  root: JSResource.fromModuleId("m#tournaments"),
  getPreloadProps(router) {
    return {
      queries: {
        tournamentQueryRef: {
          parameters: TournamentsQueryParameters,
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
