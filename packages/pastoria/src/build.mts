import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {cjsInterop} from 'vite-plugin-cjs-interop';
import {build, type BuildEnvironmentOptions, type UserConfig} from 'vite';

export const CLIENT_BUILD: BuildEnvironmentOptions = {
  outDir: 'dist/client',
  rollupOptions: {
    input: '/src/entry-client.tsx',
  },
};

export const SERVER_BUILD: BuildEnvironmentOptions = {
  outDir: 'dist/server',
  ssr: '/src/entry-server.tsx',
};

export function createBuildConfig(buildEnv: BuildEnvironmentOptions) {
  return {
    appType: 'custom' as const,
    build: {
      ...buildEnv,
      assetsInlineLimit: 0,
      manifest: true,
      ssrManifest: true,
    },
    plugins: [
      tailwindcss(),
      react({babel: {plugins: ['relay']}}),
      cjsInterop({
        dependencies: ['react-relay', 'react-relay/hooks', 'relay-runtime'],
      }),
    ],
  };
}

export async function createBuild() {
  const clientBuild = await build({
    ...createBuildConfig(CLIENT_BUILD),
    configFile: false,
  });

  const serverBuild = await build({
    ...createBuildConfig(SERVER_BUILD),
    configFile: false,
  });
}
