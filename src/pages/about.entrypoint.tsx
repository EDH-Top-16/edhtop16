import { JSResource, ModuleType } from "#genfiles/river/js_resource";
import { EntryPointParams } from "#genfiles/river/router";
import { EntryPoint } from "react-relay/hooks";

/** @route /about */
export const entrypoint: EntryPoint<
  ModuleType<"m#about">,
  EntryPointParams<"/about">
> = {
  root: JSResource.fromModuleId("m#about"),
  getPreloadProps({}) {
    return {
      queries: {},
    };
  },
};
