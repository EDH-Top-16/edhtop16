import TID_TournamentQueryParameters from "#genfiles/queries/TID_TournamentQuery$parameters";
import { JSResource, ModuleType } from "#genfiles/river/js_resource";
import { EntryPointParams, QueryParamKind } from "#genfiles/river/router";
import { EntryPoint } from "react-relay";

/** @route /tournament/:tid */
export const entrypoint: EntryPoint<
  ModuleType<"m#tournament_view">,
  EntryPointParams
> = {
  root: JSResource.fromModuleId("m#tournament_view"),
  getPreloadProps({ params, router }) {
    const tid = (params as { tid: string })["tid"];
    const { commander, tab } = router.parseQuery({
      commander: QueryParamKind.STRING,
      tab: QueryParamKind.STRING,
    });

    return {
      queries: {
        tournamentQueryRef: {
          parameters: TID_TournamentQueryParameters,
          variables: {
            TID: tid,
            commander,
            showStandings: tab !== "breakdown" && tab !== "commander",
            showBreakdown: tab === "breakdown",
            showBreakdownCommander: tab === "commander" && commander != null,
          },
        },
      },
    };
  },
};
