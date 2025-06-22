import { useEffect } from "react";
import {
  EntryPointContainer,
  loadEntryPoint,
  RelayEnvironmentProvider,
  useEntryPointLoader,
} from "react-relay";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { Router, RouterContextProvider, useRouter } from "./router";

function getEntrypoint(router: Router, env: RelayModernEnvironment) {
  const initialRoute = router.route();
  try {
    return loadEntryPoint(
      { getEnvironment: () => env },
      initialRoute?.entrypoint,
      initialRoute?.params as any,
    );
  } catch (e) {
    return null;
  }
}

export function createRiverApp(router: Router, env: RelayModernEnvironment) {
  const initialEntrypoint = getEntrypoint(router, env);

  function App() {
    const route = useRouter(router);
    const [entrypointRef, loadEntrypointRef, _dispose] = useEntryPointLoader(
      { getEnvironment: () => env },
      route?.entrypoint,
    );

    useEffect(() => {
      loadEntrypointRef(route?.params as any);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    const ep = initialEntrypoint ?? entrypointRef;

    return (
      <RouterContextProvider value={route}>
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
      </RouterContextProvider>
    );
  }

  return { App, entrypoint: initialEntrypoint };
}

function NotFound() {
  return <div>Not found...</div>;
}
