import { useEffect } from "react";
import {
  EntryPointContainer,
  loadEntryPoint,
  RelayEnvironmentProvider,
  useEntryPointLoader,
} from "react-relay";
import { Environment, OperationDescriptor, PayloadData } from "relay-runtime";
import {
  RouteContextProvider,
  Router,
  NavigationContextProvider,
  useCurrentRoute,
} from "./router";

function hydrateStore(env: Environment) {
  if ("__river_ops" in window) {
    const ops = (window as any).__river_ops as [
      OperationDescriptor,
      PayloadData,
    ][];

    for (const [op, payload] of ops) {
      env.commitPayload(op, payload);
    }
  }
}

function getEntrypoint(router: Router, env: Environment) {
  const initialRoute = router.route();
  try {
    return loadEntryPoint(
      { getEnvironment: () => env },
      initialRoute?.entrypoint,
      { params: initialRoute.params, router },
    );
  } catch (e) {
    return null;
  }
}

export async function createRiverApp(router: Router, env: Environment) {
  if (typeof window !== "undefined") {
    hydrateStore(env);
  }

  await router.route()?.entrypoint?.root.load();
  const initialEntrypoint = getEntrypoint(router, env);

  function App() {
    const route = useCurrentRoute(router);
    const [entrypointRef, loadEntrypointRef, _dispose] = useEntryPointLoader(
      { getEnvironment: () => env },
      route?.entrypoint,
    );

    useEffect(() => {
      loadEntrypointRef({ params: route.params, router });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    const ep = entrypointRef ?? initialEntrypoint;

    return (
      <NavigationContextProvider router={router}>
        <RelayEnvironmentProvider environment={env}>
          <RouteContextProvider value={route}>
            <main className="relative min-h-screen bg-[#514f86]">
              {ep == null ? (
                <NotFound />
              ) : (
                <EntryPointContainer
                  entryPointReference={ep}
                  props={route?.params ?? {}}
                />
              )}
            </main>
          </RouteContextProvider>
        </RelayEnvironmentProvider>
      </NavigationContextProvider>
    );
  }

  return { App, entrypoint: initialEntrypoint };
}

function NotFound() {
  return <div>Not found...</div>;
}
