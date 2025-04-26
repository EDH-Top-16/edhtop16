import { useEffect } from "react";
import {
  EntryPointContainer,
  loadEntryPoint,
  RelayEnvironmentProvider,
  useEntryPointLoader,
} from "react-relay";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { Router, RouterContextProvier, useRouter } from "./router";

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
      loadEntrypointRef(router.route()?.params as any as any);
    }, [loadEntrypointRef]);

    const ep = initialEntrypoint ?? entrypointRef;

    return (
      <RouterContextProvier value={route}>
        <RelayEnvironmentProvider environment={env}>
          {ep == null ? (
            <NotFound />
          ) : (
            <EntryPointContainer entryPointReference={ep} props={{}} />
          )}
        </RelayEnvironmentProvider>
      </RouterContextProvier>
    );
  }

  return { App, entrypoint: initialEntrypoint };
}

function NotFound() {
  return <div>Not found...</div>;
}
