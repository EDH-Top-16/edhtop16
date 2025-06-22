import { getClientEnvironment } from "./lib/client/relay_client_environment";
import { createRiverApp } from "./lib/river/create_app";
import { Router } from "./lib/river/router";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

async function main() {
  const router = new Router();
  const env = getClientEnvironment()!;

  await router.route()?.entrypoint?.root.load();
  const { App } = createRiverApp(router, env);

  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main();
