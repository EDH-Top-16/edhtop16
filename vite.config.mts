import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {cjsInterop} from 'vite-plugin-cjs-interop';
import type {UserConfig} from 'vite';

export default {
  server: {middlewareMode: true},
  appType: 'custom',
  build: {
    assetsInlineLimit: 0,
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: '/src/entry-client.tsx',
    },
  },
  plugins: [
    tailwindcss(),
    react({babel: {plugins: ['relay']}}),
    cjsInterop({
      dependencies: ['react-relay', 'react-relay/hooks', 'relay-runtime'],
    }),
  ],
} satisfies UserConfig;
