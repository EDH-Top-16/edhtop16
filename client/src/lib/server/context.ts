import { Context } from "./schema/builder";
import { createCommanderStatsLoader } from "./schema/commander";
import { createEntryLoader } from "./schema/entry";
import { TopdeckClient } from "./topdeck";

export function createContext(): Context {
  return {
    commanderStats: createCommanderStatsLoader(),
    entries: createEntryLoader(),
    topdeckClient: new TopdeckClient(),
  };
}
