import type { JSResourceReference } from "react-relay";

type JsResourceConf = (typeof JSResource)["CONF"];
type ModuleId = keyof JsResourceConf;
type ModuleType<M extends ModuleId> = Awaited<
  ReturnType<JsResourceConf[M]["loader"]>
>;

export class JSResource<M extends ModuleId>
  implements JSResourceReference<ModuleType<M>>
{
  static CONF = {
    "m#tournaments": {
      src: "src/pages/tournaments.tsx",
      loader: () =>
        import("../../pages/tournaments").then((m) => m.TournamentsPage),
    },
    "m#index": {
      src: "src/pages/index.tsx",
      loader: () => import("../../pages/index").then((m) => m.CommandersPage),
    },
  } as const;

  private static readonly resourceCache = new Map<ModuleId, JSResource<any>>();
  static fromModuleId<M extends ModuleId>(moduleId: M) {
    if (JSResource.resourceCache.has(moduleId)) {
      return JSResource.resourceCache.get(moduleId)!;
    }

    const resource = new JSResource(moduleId);
    JSResource.resourceCache.set(moduleId, resource);
    return resource;
  }

  private constructor(private readonly moduleId: M) {}
  private modulePromiseCache: Promise<ModuleType<M>> | null = null;
  private moduleCache: ModuleType<M> | null = null;

  getModuleId(): string {
    return this.moduleId;
  }

  getModuleIfRequired(): ModuleType<M> | null {
    return this.moduleCache;
  }

  async load(): Promise<ModuleType<M>> {
    if (this.modulePromiseCache == null) {
      this.modulePromiseCache = JSResource.CONF[this.moduleId]
        .loader()
        .then((m) => {
          this.moduleCache = m as ModuleType<M>;
          return this.moduleCache;
        });
    }

    return await this.modulePromiseCache;
  }
}
