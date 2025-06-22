import { EntryPoint } from "react-relay";
import { JSResource, ModuleType } from "../lib/river/js_resource";
import { EntryPointParams, QueryParamKind } from "../lib/river/router";
import TournamentsQueryParameters from "../queries/__generated__/tournaments_TournamentsQuery$parameters";
import type {
  TimePeriod,
  TournamentSortBy,
} from "../queries/__generated__/AllTournamentsQuery.graphql";

/** @route /tournaments */
export const entrypoint: EntryPoint<
  ModuleType<"m#tournaments">,
  EntryPointParams
> = {
  root: JSResource.fromModuleId("m#tournaments"),
  getPreloadProps({ router }) {
    const {
      sortBy = "DATE",
      minSize = 0,
      timePeriod = "ALL_TIME",
    } = router.parseQuery({
      sortBy: QueryParamKind.STRING,
      minSize: QueryParamKind.NUMBER,
      timePeriod: QueryParamKind.STRING,
    });

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
