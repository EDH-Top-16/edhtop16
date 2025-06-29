import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { RelayEnvironmentProvider } from "react-relay";
import { Manifest } from "vite";
import { ServerRouter } from "./lib/river/server_router";
import { createServerEnvironment } from "./lib/server/relay_server_environment";
import { App } from "./pages/_app";

export async function render(url: string, manifest?: Manifest) {
  const env = createServerEnvironment();
  const router = new ServerRouter(url);
  const RiverApp = await router.createApp({ getEnvironment: () => env });

  const html = renderToString(
    <StrictMode>
      <RelayEnvironmentProvider environment={env}>
        <App>
          <RiverApp />
        </App>
      </RelayEnvironmentProvider>
    </StrictMode>,
  );

  return {
    html,
    bootstrap: RiverApp.bootstrap(manifest),
  };
}
