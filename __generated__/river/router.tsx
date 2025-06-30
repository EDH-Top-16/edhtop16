import { entrypoint as e2 } from "#src/pages/about.entrypoint";
import { entrypoint as e4 } from "#src/pages/commander/[commander]/commander_page.entrypoint";
import { entrypoint as e1 } from "#src/pages/index.entrypoint";
import { entrypoint as e3 } from "#src/pages/tournament/tournament_view.entrypoint";
import { entrypoint as e0 } from "#src/pages/tournaments.entrypoint";
import {
  createBrowserHistory,
  createMemoryHistory,
  History,
  Listener,
} from "history";
import { createRouter } from "radix3";
import {
  AnchorHTMLAttributes,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  EntryPointContainer,
  EnvironmentProviderOptions,
  IEnvironmentProvider,
  loadEntryPoint,
  PreloadedEntryPoint,
  useEntryPointLoader,
} from "react-relay";
import { OperationDescriptor, PayloadData } from "relay-runtime";
import type { Manifest } from "vite";

export type AnyPreloadedEntryPoint = PreloadedEntryPoint<any>;
export type RiverOps = [OperationDescriptor, PayloadData][];

type RouterConf = typeof ROUTER_CONF;
const ROUTER_CONF = {
  "/tournaments": { entrypoint: e0 } as const,
  "/": { entrypoint: e1 } as const,
  "/about": { entrypoint: e2 } as const,
  "/tournament/:tid": { entrypoint: e3 } as const,
  "/commander/:commander": { entrypoint: e4 } as const,
} as const;

type NavigationDirection = string | URL | ((nextUrl: URL) => void);

export class Router {
  static routes = Object.keys(ROUTER_CONF);

  private currentRoute;
  constructor(staticInit?: string) {
    if (staticInit == null) {
      this.history = createBrowserHistory();
    } else {
      this.history = createMemoryHistory({ initialEntries: [staticInit] });
    }

    this.currentRoute = {
      ...this.history.location,
      ...this.radixRouter.lookup(this.history.location.pathname),
    };
  }

  private readonly history: History;
  private readonly radixRouter = createRouter<RouterConf[keyof RouterConf]>({
    routes: ROUTER_CONF,
  });

  private evaluationNavigationDirection(nav: NavigationDirection): URL {
    if (typeof nav === "string") {
      return new URL(nav, window.location.href);
    } else if (nav instanceof URL) {
      return nav;
    } else {
      const nextUrl = new URL(window.location.href);
      nav(nextUrl);
      return nextUrl;
    }
  }

  push = (nav: NavigationDirection) => {
    const nextUrl = this.evaluationNavigationDirection(nav);
    if (window.location.origin !== nextUrl.origin) {
      throw new Error("Cannot navigate to a different origin.");
    }

    this.history.push(nextUrl.pathname + nextUrl.search);
  };

  replace = (nav: NavigationDirection) => {
    const nextUrl = this.evaluationNavigationDirection(nav);
    if (window.location.origin !== nextUrl.origin) {
      throw new Error("Cannot navigate to a different origin.");
    }

    this.history.replace(nextUrl.pathname + nextUrl.search);
  };

  route = () => {
    return this.currentRoute;
  };

  listen = (listener: Listener) => {
    return this.history.listen((update) => {
      this.currentRoute = {
        ...this.history.location,
        ...this.radixRouter.lookup(this.history.location.pathname),
      };

      listener(update);
    });
  };

  parseQuery = <T extends AnyParamMapping>(params: T) =>
    parseQuery(this.history.location.search, params);

  private hydrateStore(
    provider: IEnvironmentProvider<EnvironmentProviderOptions>,
  ) {
    const env = provider.getEnvironment(null);
    if ("__river_ops" in window) {
      const ops = (window as any).__river_ops as RiverOps;
      for (const [op, payload] of ops) {
        env.commitPayload(op, payload);
      }
    }
  }

  protected async loadEntryPoint(
    env: IEnvironmentProvider<EnvironmentProviderOptions>,
  ) {
    const initialRoute = this.route();
    await initialRoute.entrypoint?.root.load();

    return loadEntryPoint(env, initialRoute?.entrypoint, {
      params: initialRoute.params,
      router: this,
    });
  }

  static Context = createContext(new Router("/"));

  protected createRiverAppFromEntryPoint(
    env: IEnvironmentProvider<EnvironmentProviderOptions>,
    initialEntryPoint: PreloadedEntryPoint<any>,
  ) {
    const router = this;
    function RiverApp() {
      const route = useSyncExternalStore(
        router.listen,
        router.route,
        router.route,
      );
      const [entryPointRef, loadEntryPointRef, _dispose] = useEntryPointLoader(
        env,
        route?.entrypoint,
      );

      useEffect(() => {
        loadEntryPointRef({ params: route.params, router });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [route]);

      const entryPoint = entryPointRef ?? initialEntryPoint;
      return entryPoint == null ? (
        <div>Not found...</div>
      ) : (
        <Router.Context value={router}>
          <EntryPointContainer entryPointReference={entryPoint} props={{}} />
        </Router.Context>
      );
    }

    RiverApp.bootstrap = (manifest?: Manifest): string | null => null;
    return RiverApp;
  }

  async createApp(env: IEnvironmentProvider<EnvironmentProviderOptions>) {
    this.hydrateStore(env);
    const ep = await this.loadEntryPoint(env);
    return this.createRiverAppFromEntryPoint(env, ep);
  }
}

export function useRouter() {
  return useContext(Router.Context);
}

export interface EntryPointParams {
  router: Router;
  params?: Record<string, any>;
}

export function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { push } = useRouter();
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      props.onClick?.(e);
      if (e.defaultPrevented || !props.href) return;

      // See https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/dom/dom.ts#L34
      const shouldHandle =
        e.button === 0 &&
        (!props.target || props.target === "_self") &&
        !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

      if (!shouldHandle) return;

      const destination = new URL(props.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      e.preventDefault();
      push(destination);
    },
    [push],
  );

  return <a {...props} onClick={handleClick} />;
}

/** Configuration for how a value will be encoded and decoded into the URL. */
export enum QueryParamKind {
  /** Immediately flushed single string value. */
  STRING = 1,
  /** Value is set multiple times in the URL, decoded as a list. */
  STRING_LIST,
  /** Value is set multiple times in the URL, decoded as a set. */
  STRING_SET,
  /** Value is undefined when not present, a list when it is. */
  STRING_LIST_DEFAULT_UNDEFINED,
  /** String value that will throw an error if not found. */
  STRING_REQUIRED,
  /** Parsed and serialized as a number. */
  NUMBER,
}

type DecodedQueryParamKind<Kind extends QueryParamKind> =
  Kind extends QueryParamKind.STRING
    ? string | undefined
    : Kind extends QueryParamKind.NUMBER
    ? number | undefined
    : Kind extends QueryParamKind.STRING_LIST
    ? string[]
    : Kind extends QueryParamKind.STRING_LIST_DEFAULT_UNDEFINED
    ? string[] | undefined
    : Kind extends QueryParamKind.STRING_REQUIRED
    ? string
    : Set<string>;

interface AnyParamMapping {
  [param: string]: QueryParamKind;
}

export type DecodedParamMapping<ParamMapping extends AnyParamMapping> = {
  [Param in keyof ParamMapping]: DecodedQueryParamKind<ParamMapping[Param]>;
};

export type DecodedParamUpdate<ParamMapping extends AnyParamMapping> = {
  [Param in keyof ParamMapping]?:
    | DecodedQueryParamKind<ParamMapping[Param]>
    | null
    | undefined;
};

function defaultNaNToUndefined(n: number): number | undefined {
  return Number.isNaN(n) ? undefined : n;
}

export function parseQuery<ParamMapping extends AnyParamMapping>(
  searchString: string,
  params: ParamMapping,
): DecodedParamMapping<ParamMapping> {
  const search = new URLSearchParams(searchString);
  const valueMapping = {} as DecodedParamMapping<ParamMapping>;

  for (const [name, kind] of Object.entries(params)) {
    const queryParamValue = search.getAll(name);
    switch (kind) {
      case QueryParamKind.STRING:
      case QueryParamKind.STRING_REQUIRED:
        valueMapping[name as keyof ParamMapping] = (
          Array.isArray(queryParamValue) ? queryParamValue[0] : queryParamValue
        ) as DecodedQueryParamKind<ParamMapping[keyof ParamMapping]>;
        break;
      case QueryParamKind.NUMBER:
        valueMapping[name as keyof ParamMapping] = (
          Array.isArray(queryParamValue)
            ? defaultNaNToUndefined(Number(queryParamValue[0]))
            : defaultNaNToUndefined(Number(queryParamValue))
        ) as DecodedQueryParamKind<ParamMapping[keyof ParamMapping]>;
        break;
      case QueryParamKind.STRING_LIST:
        valueMapping[name as keyof ParamMapping] = (
          queryParamValue == null
            ? []
            : Array.isArray(queryParamValue)
            ? queryParamValue
            : [queryParamValue]
        ) as DecodedQueryParamKind<ParamMapping[keyof ParamMapping]>;
        break;
      case QueryParamKind.STRING_SET:
        valueMapping[name as keyof ParamMapping] = (
          queryParamValue == null
            ? new Set()
            : Array.isArray(queryParamValue)
            ? new Set(queryParamValue)
            : new Set([queryParamValue])
        ) as DecodedQueryParamKind<ParamMapping[keyof ParamMapping]>;
        break;
      case QueryParamKind.STRING_LIST_DEFAULT_UNDEFINED:
        valueMapping[name as keyof ParamMapping] = (
          queryParamValue == null
            ? undefined
            : Array.isArray(queryParamValue)
            ? queryParamValue
            : [queryParamValue]
        ) as DecodedQueryParamKind<ParamMapping[keyof ParamMapping]>;
        break;
      default:
        break;
    }

    if (
      kind === QueryParamKind.STRING_REQUIRED &&
      typeof valueMapping[name] !== "string"
    ) {
      throw new Error(`Expected to find required string: ${name}`);
    }
  }

  return valueMapping;
}
