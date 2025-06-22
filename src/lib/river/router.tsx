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
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { entrypoint as e2 } from "../../pages/about.entrypoint";
import { entrypoint as e1 } from "../../pages/index.entrypoint";
import { entrypoint as e3 } from "../../pages/tournament/tournament_view.entrypoint";
import { entrypoint as e0 } from "../../pages/tournaments.entrypoint";

type RouterConf = (typeof Router)["CONF"];

export class Router {
  static CONF = {
    "/tournaments": { entrypoint: e0 } as const,
    "/": { entrypoint: e1 } as const,
    "/about": { entrypoint: e2 } as const,
    "/tournament/:tid": { entrypoint: e3 } as const,
  } as const;

  private readonly radixRouter = createRouter<RouterConf[keyof RouterConf]>({
    routes: Router.CONF,
  });

  private readonly history: History;

  push;
  replace;

  constructor(staticInit?: string) {
    if (staticInit == null) {
      this.history = createBrowserHistory();
    } else {
      this.history = createMemoryHistory({ initialEntries: [staticInit] });
    }

    this.push = this.history.push.bind(this.history);
    this.replace = this.history.replace.bind(this.history);
  }

  route = () => {
    return {
      ...this.history.location,
      ...this.radixRouter.lookup(this.history.location.pathname),
    };
  };

  listen = (listener: Listener) => {
    return this.history.listen((update) => {
      listener(update);
    });
  };

  parseQuery = <T extends AnyParamMapping>(params: T) =>
    parseQuery(this.history.location.search, params);
}

const defaultRouter = new Router("/");
const navigationContext = createContext(defaultRouter);
const routeContext = createContext(defaultRouter.route());

export function NavigationContextProvider({
  router,
  children,
}: PropsWithChildren<{ router: Router }>) {
  return (
    <navigationContext.Provider value={router}>
      {children}
    </navigationContext.Provider>
  );
}

type NavigationDirection = string | URL | ((nextUrl: URL) => void);
function evaluationNavigationDirection(nav: NavigationDirection): URL {
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

export function useNavigation() {
  const router = useContext(navigationContext);

  const push = useCallback(
    (nav: NavigationDirection) => {
      const nextUrl = evaluationNavigationDirection(nav);

      // Don't support navigaton to a different domain.
      if (window.location.origin !== nextUrl.origin) {
        throw new Error("Cannot navigate to a different origin.");
      }

      router.push(nextUrl.pathname + nextUrl.search);
    },
    [router],
  );

  const replace = useCallback(
    (nav: NavigationDirection) => {
      const nextUrl = evaluationNavigationDirection(nav);

      // Don't support navigaton to a different domain.
      if (window.location.origin !== nextUrl.origin) {
        throw new Error("Cannot navigate to a different origin.");
      }

      router.replace(nextUrl.pathname + nextUrl.search);
    },
    [router],
  );

  return useMemo(() => ({ push, replace }), [push, replace]);
}

export interface EntryPointParams {
  router: Router;
  params?: Record<string, any>;
}

export function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { push } = useNavigation();

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

export const RouteContextProvider = routeContext.Provider;
export function useRoute() {
  return useContext(routeContext);
}

export function useCurrentRoute(router: Router) {
  const [route, setRoute] = useState(() => router.route());
  useEffect(() => {
    return router.listen(() => {
      setRoute(router.route());
    });
  }, [router]);

  return route;
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
