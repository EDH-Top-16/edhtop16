import {createRouter} from 'radix3';
import {
  AnchorHTMLAttributes,
  createContext,
  PropsWithChildren,
  Suspense,
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
export type RouterOps = [OperationDescriptor, PayloadData][];

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
      path = 'router:' + path;
    }

    try {
      const nextUrl = new URL(path);
      return new RouterLocation(nextUrl.pathname, nextUrl.searchParams, method);
    } catch (_e) {
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

export function router__hydrateStore(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
) {
  const env = provider.getEnvironment(null);
  if ('__router_ops' in window) {
    const ops = (window as any).__router_ops as RouterOps;
    for (const [op, payload] of ops) {
      env.commitPayload(op, payload);
    }
  }
}

export async function router__loadEntryPoint(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
  initialPath?: string,
) {
  if (!initialPath) initialPath = window.location.href;
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

const RouterContext = createContext<RouterContextValue>({
  location: RouterLocation.parse('/'),
  setLocation: () => {},
});

export function router__createAppFromEntryPoint(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
  initialEntryPoint: AnyPreloadedEntryPoint | null,
  initialPath?: string,
) {
  function RouterApp() {
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
    if (entryPoint == null) return null;

    return (
      <RouterContext value={routerContextValue}>
        {'fallback' in entryPoint.entryPoints ? (
          <Suspense
            fallback={
              <EntryPointContainer
                entryPointReference={entryPoint.entryPoints.fallback}
                props={{}}
              />
            }
          >
            <EntryPointContainer entryPointReference={entryPoint} props={{}} />
          </Suspense>
        ) : (
          <EntryPointContainer entryPointReference={entryPoint} props={{}} />
        )}
      </RouterContext>
    );
  }

  RouterApp.bootstrap = (manifest?: Manifest): string | null => null;
  return RouterApp;
}

export async function createRouterApp(
  provider: IEnvironmentProvider<EnvironmentProviderOptions>,
) {
  router__hydrateStore(provider);
  const ep = await router__loadEntryPoint(provider);
  return router__createAppFromEntryPoint(provider, ep);
}

export function usePath() {
  const {location} = useContext(RouterContext);
  return location.pathname;
}

export function useRouteParams<R extends RouteId>(
  routeId: R,
): z.infer<RouterConf[R]['schema']> {
  const schema = ROUTER_CONF[routeId].schema;
  const {location} = useContext(RouterContext);

  return schema.parse(location.params()) as z.infer<RouterConf[R]['schema']>;
}

function router__createPathForRoute(
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

function router__evaluateNavigationDirection(nav: NavigationDirection) {
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
  const {setLocation} = useContext(RouterContext);

  return useMemo(() => {
    function push(nav: NavigationDirection) {
      setLocation(
        RouterLocation.parse(router__evaluateNavigationDirection(nav), 'push'),
      );
    }

    function replace(nav: NavigationDirection) {
      setLocation(
        RouterLocation.parse(
          router__evaluateNavigationDirection(nav),
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
          router__createPathForRoute(routeId, params),
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
          router__createPathForRoute(routeId, {...prevLoc.params(), ...params}),
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
    () => router__createPathForRoute(route, params).toString(),
    [params, route],
  );

  return <Link {...props} href={href} />;
}

export function listRoutes() {
  return Object.keys(ROUTER_CONF);
}
