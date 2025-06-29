import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { RelayEnvironmentProvider } from "react-relay";
import { getClientEnvironment } from "./lib/client/relay_client_environment";
import { Router } from "./lib/river/router";
import { App } from "./pages/_app";

async function main() {
  const env = getClientEnvironment()!;
  const router = new Router({ getEnvironment: () => env });
  const RiverApp = await router.createApp();

  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <RelayEnvironmentProvider environment={env}>
        <App>
          <RiverApp />
        </App>
      </RelayEnvironmentProvider>
    </StrictMode>,
  );
}

main();
