import {createRouter} from 'radix3';
import {
  AnchorHTMLAttributes,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  EntryPoint,
  EntryPointContainer,
  EnvironmentProviderOptions,
  IEnvironmentProvider,
  loadEntryPoint,
  PreloadedEntryPoint,
  useEntryPointLoader,
} from 'react-relay/hooks';
import {OperationDescriptor, PayloadData} from 'relay-runtime';
import type {Manifest} from 'vite';
import * as z from 'zod/v4-mini';

export type AnyPreloadedEntryPoint = PreloadedEntryPoint<any>;
export type RiverOps = [OperationDescriptor, PayloadData][];

type RouterConf = typeof ROUTER_CONF;
const ROUTER_CONF = {
  noop: {
    entrypoint: null! as EntryPoint<any>,
    schema: z.object({}),
  },
} as const;

export type RouteId = keyof RouterConf;
export type NavigationDirection = string | URL | ((nextUrl: URL) => void);

export interface EntryPointParams<R extends RouteId> {
  params: Record<string, any>;
  schema: RouterConf[R]['schema'];
}

const ROUTER = createRouter<RouterConf[keyof RouterConf]>({
  routes: ROUTER_CONF,
});

class RouterLocation {
  private constructor(
    readonly pathname: string,
    readonly searchParams: URLSearchParams,
    readonly method?: 'push' | 'replace' | 'popstate',
  ) {}

  href() {
    if (this.searchParams.size > 0) {
      return this.pathname + '?' + this.searchParams.toString();
    }

    return this.pathname;
  }

  route() {
    return ROUTER.lookup(this.pathname);
  }

  params() {
    const matchedRoute = this.route();
    const params = {
      ...matchedRoute?.params,
      ...Object.fromEntries(this.searchParams),
    };

    if (matchedRoute?.schema) {
      return matchedRoute.schema.parse(params);
    } else {
      return params;
    }
  }

  static parse(path: string, method?: 'push' | 'replace' | 'popstate') {
    if (path.startsWith('/')) {
      path = 'river:' + path;
    }

    try {
      // Try Node.js URL.parse() first (server-side)
      if (typeof URL.parse === 'function') {
        const nodeUrlParsed = URL.parse(path);
        if (nodeUrlParsed) {
          return new RouterLocation(
            nodeUrlParsed.pathname || path, 
            nodeUrlParsed.searchParams || new URLSearchParams(), 
            method
          );
        }
      }
      
      // Fallback to new URL() (browser or newer Node.js)
      // Use a consistent base URL for both server and client
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      const parsed = new URL(path, baseUrl);
      
      return new RouterLocation(parsed.pathname, parsed.searchParams, method);
    } catch {
      // If all URL parsing fails, treat as pathname only
      return new RouterLocation(path, new URLSearchParams(), method);
    }
  }
}

function useLocation(initialPath?: string) {
  const [location, setLocation] = useState((): RouterLocation => {
    return RouterLocation.parse(initialPath ?? window.location.href);
  });

  useEffect(() => {
    function listener(e: PopStateEvent) {
      setLocation(RouterLocation.parse(window.location.href, 'popstate'));
    }

    window.addEventListener('popstate', listener);
    return () => {
      window.removeEventListener('popstate', listener);
    };
  }, []);

  useEffect(() => {
    if (location.method === 'push') {
      window.history.pushState({}, '', location.href());
      window.scrollTo(0, 0);
    } else if (location.method === 'replace') {
      window.history.replaceState({}, '', location.href());
    }
  }, [location]);

  return [location, setLocation] as const;
}

export function river__hydrateStore(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
) {
  const env = provider.getEnvironment(null);
  if ('__river_ops' in window) {
    const ops = (window as any).__river_ops as RiverOps;
    for (const [op, payload] of ops) {
      env.commitPayload(op, payload);
    }
  }
}

export async function river__loadEntryPoint(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
  initialPath?: string,
) {
  if (!initialPath) initialPath = window.location.pathname;
  const initialLocation = RouterLocation.parse(initialPath);
  const initialRoute = initialLocation.route();
  if (!initialRoute) return null;

  await initialRoute.entrypoint?.root.load();
  return loadEntryPoint(provider, initialRoute.entrypoint, {
    params: initialLocation.params(),
    schema: initialRoute.schema,
  });
}

interface RouterContextValue {
  location: RouterLocation;
  setLocation: React.Dispatch<React.SetStateAction<RouterLocation>>;
}

const RiverRouterContext = createContext<RouterContextValue>({
  location: RouterLocation.parse('/'),
  setLocation: () => {},
});

export function river__createAppFromEntryPoint(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
  initialEntryPoint: AnyPreloadedEntryPoint | null,
  initialPath?: string,
) {
  function RiverApp() {
    const [location, setLocation] = useLocation(initialPath);
    const routerContextValue = useMemo(
      (): RouterContextValue => ({
        location,
        setLocation,
      }),
      [location, setLocation],
    );

    const [entryPointRef, loadEntryPointRef, _dispose] = useEntryPointLoader(
      provider,
      location.route()?.entrypoint,
    );

    useEffect(() => {
      const schema = location.route()?.schema;
      if (schema) {
        loadEntryPointRef({
          params: location.params(),
          schema,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const entryPoint = entryPointRef ?? initialEntryPoint;
    return entryPoint == null ? (
      <div>Not found...</div>
    ) : (
      <RiverRouterContext value={routerContextValue}>
        <EntryPointContainer entryPointReference={entryPoint} props={{}} />
      </RiverRouterContext>
    );
  }

  RiverApp.bootstrap = (manifest?: Manifest): string | null => null;
  return RiverApp;
}

export async function createRiverApp(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
) {
  river__hydrateStore(provider);
  const ep = await river__loadEntryPoint(provider);
  return river__createAppFromEntryPoint(provider, ep);
}

export function usePath() {
  const {location} = useContext(RiverRouterContext);
  return location.pathname;
}

export function useRouteParams<R extends RouteId>(
  routeId: R,
): z.infer<RouterConf[R]['schema']> {
  const schema = ROUTER_CONF[routeId].schema;
  const {location} = useContext(RiverRouterContext);

  return schema.parse(location.params()) as z.infer<RouterConf[R]['schema']>;
}

function river__createPathForRoute(
  routeId: RouteId,
  inputParams: Record<string, any>,
): string {
  const schema = ROUTER_CONF[routeId].schema;
  const params = schema.parse(inputParams);

  let pathname = routeId as string;
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      const paramPattern = `:${key}`;
      if (pathname.includes(paramPattern)) {
        pathname = pathname.replace(
          paramPattern,
          encodeURIComponent(String(value)),
        );
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  if (searchParams.size > 0) {
    return pathname + '?' + searchParams.toString();
  } else {
    return pathname;
  }
}

function river__evaluateNavigationDirection(nav: NavigationDirection) {
  let nextUrl: URL;
  if (typeof nav === 'string') {
    nextUrl = new URL(nav, window.location.origin);
  } else if (nav instanceof URL) {
    nextUrl = nav;
  } else {
    nextUrl = new URL(window.location.href);
    nav(nextUrl);
  }

  if (window.location.origin !== nextUrl.origin) {
    throw new Error('Cannot navigate to a different origin.');
  }

  if (nextUrl.searchParams.size > 0) {
    return nextUrl.pathname + '?' + nextUrl.searchParams.toString();
  } else {
    return nextUrl.pathname;
  }
}

export function useNavigation() {
  const {setLocation} = useContext(RiverRouterContext);

  return useMemo(() => {
    function push(nav: NavigationDirection) {
      setLocation(
        RouterLocation.parse(river__evaluateNavigationDirection(nav), 'push'),
      );
    }

    function replace(nav: NavigationDirection) {
      setLocation(
        RouterLocation.parse(
          river__evaluateNavigationDirection(nav),
          'replace',
        ),
      );
    }

    function pushRoute<R extends RouteId>(
      routeId: R,
      params: z.input<RouterConf[R]['schema']>,
    ) {
      setLocation(
        RouterLocation.parse(
          river__createPathForRoute(routeId, params),
          'push',
        ),
      );
    }

    function replaceRoute<R extends RouteId>(
      routeId: R,
      params: z.input<RouterConf[R]['schema']>,
    ) {
      setLocation((prevLoc) =>
        RouterLocation.parse(
          river__createPathForRoute(routeId, {...prevLoc.params(), ...params}),
          'replace',
        ),
      );
    }

    return {push, replace, pushRoute, replaceRoute} as const;
  }, [setLocation]);
}

export function Link({
  href,
  target,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const {push} = useNavigation();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onClick?.(e);
      if (e.defaultPrevented || !href) return;

      // See https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/dom/dom.ts#L34
      const shouldHandle =
        e.button === 0 &&
        (!target || target === '_self') &&
        !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

      if (!shouldHandle) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      e.preventDefault();
      push(destination);
    },
    [push, href, target, onClick],
  );

  return <a {...props} href={href} target={target} onClick={handleClick} />;
}

export interface LinkProps<R extends RouteId>
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  route: R;
  params: z.input<RouterConf[R]['schema']>;
  href?: never;
}

export function RouteLink<R extends RouteId>({
  route,
  params,
  ...props
}: PropsWithChildren<LinkProps<R>>) {
  const href = useMemo(
    () => river__createPathForRoute(route, params).toString(),
    [params, route],
  );

  return <Link {...props} href={href} />;
}

export function listRoutes() {
  return Object.keys(ROUTER_CONF);
}
