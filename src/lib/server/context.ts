import { Context } from "./schema/builder";
import { TopdeckClient } from "./topdeck";

export function createContext(): Context {
  return {
    topdeckClient: new TopdeckClient(),
  };
}
