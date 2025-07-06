import type {
  TimePeriod,
  TournamentSortBy,
} from "#genfiles/queries/AllTournamentsQuery.graphql";
import TournamentsQueryParameters from "#genfiles/queries/tournaments_TournamentsQuery$parameters";
import { JSResource, ModuleType } from "#genfiles/river/js_resource";
import { EntryPointParams } from "#genfiles/river/router";
import { EntryPoint } from "react-relay";

/** @route /tournaments */
export const entrypoint: EntryPoint<
  ModuleType<"m#tournaments">,
  EntryPointParams<"/tournaments">
> = {
  root: JSResource.fromModuleId("m#tournaments"),
  getPreloadProps({ params, schema }) {
    const {
      sortBy = "DATE",
      minSize = 0,
      timePeriod = "ALL_TIME",
    } = schema.parse(params);

    return {
      queries: {
        tournamentQueryRef: {
          parameters: TournamentsQueryParameters,
          variables: {
            minSize,
            sortBy: sortBy as TournamentSortBy,
            timePeriod: timePeriod as TimePeriod,
          },
        },
      },
    };
  },
};
