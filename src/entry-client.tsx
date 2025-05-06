import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { getClientEnvironment } from "./lib/client/relay_client_environment";
import { createRiverApp } from "./lib/river/create_app";
import { Router } from "./lib/river/router";

const router = new Router();
const env = getClientEnvironment()!;

const { App } = createRiverApp(router, env);

// hydrateRoot(
//   document.getElementById("root")!,
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );
