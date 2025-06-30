import { Router } from "#genfiles/river/router";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { RelayEnvironmentProvider } from "react-relay";
import { getClientEnvironment } from "./lib/client/relay_client_environment";
import { App } from "./pages/_app";

async function main() {
  const env = getClientEnvironment()!;
  const router = new Router();
  const RiverApp = await router.createApp({ getEnvironment: () => env });

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
