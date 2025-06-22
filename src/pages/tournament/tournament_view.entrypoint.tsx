import { EntryPoint } from "react-relay";
import { JSResource, ModuleType } from "../../lib/river/js_resource";
import { EntryPointParams, QueryParamKind } from "../../lib/river/router";
import TID_TournamentQueryParameters from "../../queries/__generated__/TID_TournamentQuery$parameters";

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
