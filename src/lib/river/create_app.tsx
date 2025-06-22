import { useEffect } from "react";
import {
  EntryPointContainer,
  loadEntryPoint,
  RelayEnvironmentProvider,
  useEntryPointLoader,
} from "react-relay";
import { Environment } from "relay-runtime";
import {
  RouteContextProvider,
  Router,
  NavigationContextProvider,
  useCurrentRoute,
} from "./router";

function getEntrypoint(router: Router, env: Environment) {
  const initialRoute = router.route();
  try {
    return loadEntryPoint(
      { getEnvironment: () => env },
      initialRoute?.entrypoint,
      router,
    );
  } catch (e) {
    return null;
  }
}

export function createRiverApp(router: Router, env: Environment) {
  const initialEntrypoint = getEntrypoint(router, env);

  function App() {
    const route = useCurrentRoute(router);
    const [entrypointRef, loadEntrypointRef, _dispose] = useEntryPointLoader(
      { getEnvironment: () => env },
      route?.entrypoint,
    );

    useEffect(() => {
      loadEntrypointRef(router);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    const ep = entrypointRef ?? initialEntrypoint;

    return (
      <NavigationContextProvider router={router}>
        <RouteContextProvider value={route}>
          <RelayEnvironmentProvider environment={env}>
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
          </RelayEnvironmentProvider>
        </RouteContextProvider>
      </NavigationContextProvider>
    );
  }

  return { App, entrypoint: initialEntrypoint };
}

function NotFound() {
  return <div>Not found...</div>;
}
