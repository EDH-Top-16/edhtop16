import type {JSResourceReference} from 'react-relay/hooks';

type ResourceConf = typeof RESOURCE_CONF;
const RESOURCE_CONF = {
  noop: {src: '', loader: () => Promise.reject()},
} as const;

type ModuleId = keyof ResourceConf;
export type ModuleType<M extends ModuleId> = Awaited<
  ReturnType<ResourceConf[M]['loader']>
>;

export class JSResource<M extends ModuleId>
  implements JSResourceReference<ModuleType<M>>
{
  static srcOfModuleId(id: string): string | null {
    return RESOURCE_CONF[id as ModuleId].src;
  }

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
      this.modulePromiseCache = RESOURCE_CONF[this.moduleId]
        .loader()
        .then((m) => {
          this.moduleCache = m as ModuleType<M>;
          return this.moduleCache;
        });
    }

    return await this.modulePromiseCache;
  }
}
