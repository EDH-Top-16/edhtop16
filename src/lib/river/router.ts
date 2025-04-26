import { createBrowserHistory, History, Listener } from "history";
import { createRouter } from "radix3";
import { createContext, useContext, useSyncExternalStore } from "react";
import { GetEntryPointParamsFromEntryPoint } from "react-relay/relay-hooks/helpers";
import { entrypoint as e0 } from "../../pages/tournaments.entrypoint";

type RouterConf = (typeof Router)["CONF"];

export class Router {
  static CONF = {
    "/tournaments": { entrypoint: e0 } as const,
  } as const;

  private readonly radixRouter = createRouter<RouterConf[keyof RouterConf]>({
    routes: Router.CONF,
  });

  private readonly history?: History;

  constructor(private readonly staticInit?: string) {
    if (staticInit == null) {
      this.history = createBrowserHistory();
    }
  }

  route = () => {
    const pathname = this.staticInit ?? this.history?.location.pathname;
    if (pathname == null) {
      return null;
    }

    return { pathname, ...this.radixRouter.lookup(pathname) };
  };

  listen = (listener: Listener) => {
    if (this.history == null) return () => {};
    return this.history.listen((update) => {
      listener(update);
    });
  };
}

const routerContext = createContext(new Router("/").route());
export const RouterContextProvier = routerContext.Provider;
export function useRoute() {
  return useContext(routerContext);
}

export function useRouter(router: Router) {
  return useSyncExternalStore(router.listen, router.route, router.route);
}

type t2 = GetEntryPointParamsFromEntryPoint<
  (typeof Router.CONF)["/tournaments"]
>;
