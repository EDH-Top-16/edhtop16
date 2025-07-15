import {
  createBrowserHistory,
  createMemoryHistory,
  History,
  Listener,
  Location,
} from 'history';
import {createRouter, MatchedRoute} from 'radix3';
import {
  AnchorHTMLAttributes,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
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
    entrypoint: null! as EntryPoint<unknown>,
    schema: z.object({}),
  },
} as const;

export type RouteId = keyof RouterConf;
type NavigationDirection = string | URL | ((nextUrl: URL) => void);

export class Router {
  static routes = Object.keys(ROUTER_CONF);

  private currentRoute: Location & MatchedRoute<RouterConf[RouteId]>;
  constructor(staticInit?: string) {
    if (staticInit == null) {
      this.history = createBrowserHistory();
    } else {
      this.history = createMemoryHistory({initialEntries: [staticInit]});
    }

    const route = this.radixRouter.lookup(this.history.location.pathname)!;
    this.currentRoute = {
      ...this.history.location,
      ...route,
      params: {...route.params, ...this.searchParams()},
    };
  }

  private readonly history: History;
  private readonly radixRouter = createRouter<RouterConf[keyof RouterConf]>({
    routes: ROUTER_CONF,
  });

  private createNavigator(method: 'push' | 'replace') {
    return (nav: NavigationDirection) => {
      let nextUrl: URL;
      if (typeof nav === 'string') {
        nextUrl = new URL(nav, window.location.href);
      } else if (nav instanceof URL) {
        nextUrl = nav;
      } else {
        nextUrl = new URL(window.location.href);
        nav(nextUrl);
      }

      if (window.location.origin !== nextUrl.origin) {
        throw new Error('Cannot navigate to a different origin.');
      }

      if (method === 'push') {
        this.history.push(nextUrl.pathname + nextUrl.search);
        window.scrollTo(0, 0);
      } else {
        this.history.replace(nextUrl.pathname + nextUrl.search);
      }
    };
  }

  readonly push = this.createNavigator('push');
  readonly replace = this.createNavigator('replace');

  createUrlForRoute = <R extends RouteId>(
    routeName: R,
    inputParams: z.input<RouterConf[R]['schema']>,
  ) => {
    const schema = ROUTER_CONF[routeName].schema;
    const params = schema.parse({
      ...this.currentRoute.params,
      ...inputParams,
    });

    let pathname = routeName as string;
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

    return pathname + '?' + searchParams.toString();
  };

  readonly pushRoute = <R extends RouteId>(
    routeName: R,
    params: z.input<RouterConf[R]['schema']>,
  ) => {
    this.push(this.createUrlForRoute(routeName, params));
  };

  readonly replaceRoute = <R extends RouteId>(
    routeName: R,
    params: z.input<RouterConf[R]['schema']>,
  ) => {
    this.replace(this.createUrlForRoute(routeName, params));
  };

  route = () => {
    return this.currentRoute;
  };

  listen = (listener: Listener) => {
    return this.history.listen((update) => {
      const route = this.radixRouter.lookup(this.history.location.pathname)!;
      this.currentRoute = {
        ...this.history.location,
        ...route,
        params: {...route.params, ...this.searchParams()},
      };

      listener(update);
    });
  };

  private searchParams() {
    const params: Record<string, string | string[]> = {};

    const search = new URLSearchParams(this.history.location.search);
    search.forEach((value, key) => {
      if (params[key] == null) {
        params[key] = value;
      } else if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    });

    return params;
  }

  asRoute = <R extends RouteId | undefined>(
    route?: R,
  ): R extends RouteId ? z.infer<RouterConf[R]['schema']> : any => {
    const params = {...this.currentRoute.params, ...this.searchParams()};
    const schema =
      route == null ? this.currentRoute.schema : ROUTER_CONF[route].schema;

    return schema.parse(params) as R extends RouteId
      ? z.infer<RouterConf[R]['schema']>
      : any;
  };

  protected async loadEntryPoint(
    env: IEnvironmentProvider<EnvironmentProviderOptions>,
  ) {
    const initialRoute = this.route();
    await initialRoute.entrypoint?.root.load();

    return loadEntryPoint(env, initialRoute?.entrypoint, {
      params: initialRoute.params ?? {},
      schema: initialRoute.schema,
    });
  }

  static Context = createContext(new Router('/'));

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
        loadEntryPointRef({
          params: route.params ?? {},
          schema: route.schema,
        });
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

  private hydrateStore(
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

  async createApp(env: IEnvironmentProvider<EnvironmentProviderOptions>) {
    this.hydrateStore(env);
    const ep = await this.loadEntryPoint(env);
    return this.createRiverAppFromEntryPoint(env, ep);
  }
}

export function useRouter() {
  return useContext(Router.Context);
}

export interface EntryPointParams<R extends RouteId> {
  params: Record<string, any>;
  schema: RouterConf[R]['schema'];
}

export function Link({
  href,
  target,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const {push} = useRouter();

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
  const {createUrlForRoute} = useRouter();
  const href = useMemo(
    () => createUrlForRoute(route, params).toString(),
    [createUrlForRoute, params, route],
  );

  return <Link {...props} href={href} />;
}
