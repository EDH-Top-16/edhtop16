import {
  createBrowserHistory,
  History,
  Listener,
  createMemoryHistory,
} from "history";
import { createRouter } from "radix3";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { entrypoint as e1 } from "../../pages/index.entrypoint";
import { entrypoint as e0 } from "../../pages/tournaments.entrypoint";

type RouterConf = (typeof Router)["CONF"];

export class Router {
  static CONF = {
    "/tournaments": { entrypoint: e0 } as const,
    "/": { entrypoint: e1 } as const,
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
}

const routerContext = createContext(new Router("/").route());
export const RouterContextProvider = routerContext.Provider;
export function useRoute() {
  return useContext(routerContext);
}

export function useRouter(router: Router) {
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
  /** String value that uses local state updates and defers updating the URL. */
  STRING_DEFERRED,
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
  /** Number value that uses local state updates and defers updating the URL. */
  NUMBER_DEFERRED,
}

type DecodedQueryParamKind<Kind extends QueryParamKind> = Kind extends
  | QueryParamKind.STRING
  | QueryParamKind.STRING_DEFERRED
  ? string | undefined
  : Kind extends QueryParamKind.NUMBER | QueryParamKind.NUMBER_DEFERRED
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

type DeferredQueryParamUpdates = Record<
  string,
  string | string[] | Set<string> | number | null | undefined
>;

interface QueryParamsContextValue {
  deferredUpdates: DeferredQueryParamUpdates;
  setDeferredUpdates: (update: DeferredQueryParamUpdates) => void;
}

const QueryParamsContext = createContext<QueryParamsContextValue>({
  deferredUpdates: {},
  setDeferredUpdates: () => {},
});

export function QueryParamsProvider({ children }: PropsWithChildren<{}>) {
  const [deferredUpdates, setDeferredUpdates] =
    useState<DeferredQueryParamUpdates>({});

  const contextValue = useMemo(
    (): QueryParamsContextValue => ({
      deferredUpdates,
      setDeferredUpdates,
    }),
    [deferredUpdates, setDeferredUpdates],
  );

  return (
    <QueryParamsContext.Provider value={contextValue}>
      {children}
    </QueryParamsContext.Provider>
  );
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
      case QueryParamKind.STRING_DEFERRED:
      case QueryParamKind.STRING_REQUIRED:
        valueMapping[name as keyof ParamMapping] = (
          Array.isArray(queryParamValue) ? queryParamValue[0] : queryParamValue
        ) as DecodedQueryParamKind<ParamMapping[keyof ParamMapping]>;
        break;
      case QueryParamKind.NUMBER:
      case QueryParamKind.NUMBER_DEFERRED:
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

export function useQueryParams<ParamMapping extends AnyParamMapping>(
  params: ParamMapping,
): readonly [
  DecodedParamMapping<ParamMapping>,
  (nextValues: DecodedParamUpdate<ParamMapping>) => void,
  () => void,
] {
  const route = useRoute();

  const { deferredUpdates, setDeferredUpdates } =
    useContext(QueryParamsContext);

  const values = useMemo(() => {
    const valueMapping = parseQuery(route.search, params);
    Object.assign(valueMapping, deferredUpdates);

    return valueMapping;
  }, [deferredUpdates, params, route.search]);

  const updateValues = useCallback(
    (
      nextValues: {
        [Param in keyof ParamMapping]?:
          | DecodedQueryParamKind<ParamMapping[Param]>
          | null
          | undefined;
      },
      opts: { immediate: boolean } = { immediate: false },
    ) => {
      const nextDeferredValues = {} as DecodedParamUpdate<ParamMapping>;
      const url = new URL(window.location.href);

      for (const [name, nextValue] of Object.entries(nextValues)) {
        const isImmediateUpdate =
          opts.immediate ||
          (params[name] !== QueryParamKind.NUMBER_DEFERRED &&
            params[name] !== QueryParamKind.STRING_DEFERRED);

        if (nextValue === undefined) continue;
        if (nextValue === null) {
          if (isImmediateUpdate) {
            url.searchParams.delete(name);
          } else {
            nextDeferredValues[name as keyof ParamMapping] = null;
          }
          continue;
        }

        const kind = params[name];
        if (kind == null) continue;

        switch (kind) {
          case QueryParamKind.STRING:
          case QueryParamKind.STRING_DEFERRED:
          case QueryParamKind.NUMBER:
          case QueryParamKind.NUMBER_DEFERRED:
          case QueryParamKind.STRING_REQUIRED: {
            const stringValue =
              `${nextValue}` as DecodedQueryParamKind<QueryParamKind.STRING>;

            if (!stringValue) {
              if (isImmediateUpdate) {
                url.searchParams.delete(name);
              } else {
                nextDeferredValues[name as keyof ParamMapping] = null;
              }
            } else {
              if (isImmediateUpdate) {
                url.searchParams.set(name, stringValue);
              } else {
                nextDeferredValues[name as keyof ParamMapping] = nextValue;
              }
            }
            break;
          }
          case QueryParamKind.STRING_LIST: {
            const listValue =
              nextValue as DecodedQueryParamKind<QueryParamKind.STRING_LIST>;
            if (listValue.length === 0) {
              url.searchParams.delete(name);
            } else {
              url.searchParams.set(name, listValue[0]!);
              for (const nextListValue of listValue.slice(1)) {
                url.searchParams.append(name, nextListValue);
              }
            }
            break;
          }
          case QueryParamKind.STRING_LIST_DEFAULT_UNDEFINED: {
            const listValue =
              nextValue as DecodedQueryParamKind<QueryParamKind.STRING_LIST_DEFAULT_UNDEFINED>;

            if (listValue != null) {
              if (listValue.length === 0) {
                url.searchParams.delete(name);
              } else {
                url.searchParams.set(name, listValue[0]!);
                for (const nextListValue of listValue.slice(1)) {
                  url.searchParams.append(name, nextListValue);
                }
              }
            }
            break;
          }
          case QueryParamKind.STRING_SET: {
            const setValue =
              nextValue as DecodedQueryParamKind<QueryParamKind.STRING_SET>;
            if (setValue.size === 0) {
              url.searchParams.delete(name);
            } else {
              const asList = Array.from(setValue);
              url.searchParams.set(name, asList[0]!);
              for (const nextListValue of asList.slice(1)) {
                url.searchParams.append(name, nextListValue);
              }
            }
            break;
          }
          default:
            break;
        }
      }

      if (Object.keys(nextDeferredValues).length > 0) {
        setDeferredUpdates(nextDeferredValues);
      }

      if (window.location.href !== url.href) {
        void route.replace(url, undefined, {
          shallow: true,
          scroll: false,
        });
      }
    },
    [params, route, setDeferredUpdates],
  );

  const resetFields = useCallback(() => {
    const url = new URL(window.location.href);
    for (const param of Array.from(url.searchParams.keys())) {
      url.searchParams.delete(param);
    }

    setDeferredUpdates({});

    void route.replace(url, undefined, {
      shallow: true,
      scroll: false,
    });
  }, [route, setDeferredUpdates]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(deferredUpdates).length > 0) {
        updateValues(
          deferredUpdates as unknown as DecodedParamUpdate<ParamMapping>,
          { immediate: true },
        );
      }
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [deferredUpdates, updateValues]);

  return [values, updateValues, resetFields] as const;
}
