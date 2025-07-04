import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import type { UserConfig } from "vite";
import unheadVite from "@unhead/addons/vite";

export default {
  server: { middlewareMode: true },
  appType: "custom",
  build: {
    manifest: true,
    ssrManifest: true,
  },
  plugins: [
    unheadVite(),
    tailwindcss(),
    react({ babel: { plugins: ["relay"] } }),
    cjsInterop({
      dependencies: ["react-relay", "relay-runtime"],
    }),
  ],
} satisfies UserConfig;
