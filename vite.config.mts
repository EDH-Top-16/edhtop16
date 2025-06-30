import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import type { UserConfig } from "vite";

export default {
  server: { middlewareMode: true },
  appType: "custom",
  build: {
    manifest: true,
    ssrManifest: true,
  },
  plugins: [
    tailwindcss(),
    react({ babel: { plugins: ["relay"] } }),
    cjsInterop({
      dependencies: ["react-relay", "relay-runtime"],
    }),
  ],
} satisfies UserConfig;
