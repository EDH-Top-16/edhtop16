import type { JSResourceReference } from "react-relay";

type JsResourceConf = (typeof JSResource)["CONF"];
type ModuleId = keyof JsResourceConf;
type Module = Awaited<ReturnType<JsResourceConf[ModuleId]["loader"]>>;

const resourceCache = new Map<ModuleId, JSResource>();

export class JSResource implements JSResourceReference<Module> {
  static CONF = {
    "m#tournaments": {
      src: "src/pages/tournaments.tsx",
      loader: () =>
        import("../../pages/tournaments").then((m) => m.TournamentsPage),
    },
  } as const;

  static fromModuleId(moduleId: ModuleId) {
    if (resourceCache.has(moduleId)) {
      return resourceCache.get(moduleId)!;
    }

    const resource = new JSResource(moduleId);
    resourceCache.set(moduleId, resource);
    return resource;
  }

  private moduleResultPromise: Promise<Module> | null = null;
  private moduleResult: Module | null = null;
  private constructor(private readonly moduleId: ModuleId) {}

  getModuleId(): string {
    return this.moduleId;
  }

  getModuleIfRequired(): Module | null {
    return this.moduleResult;
  }

  async load(): Promise<Module> {
    if (this.moduleResultPromise == null) {
      this.moduleResultPromise = JSResource.CONF[this.moduleId]
        .loader()
        .then((m) => {
          this.moduleResult = m;
          return this.moduleResult;
        });
    }

    return await this.moduleResultPromise;
  }
}
