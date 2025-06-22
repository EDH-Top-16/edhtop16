import { EntryPoint } from "react-relay";
import { JSResource, ModuleType } from "../lib/river/js_resource";
import { EntryPointParams } from "../lib/river/router";

/** @route /about */
export const entrypoint: EntryPoint<ModuleType<"m#about">, EntryPointParams> = {
  root: JSResource.fromModuleId("m#about"),
  getPreloadProps({}) {
    return {
      queries: {},
    };
  },
};
