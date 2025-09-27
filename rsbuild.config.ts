import {defineConfig} from '@rsbuild/core';
import pluginReact from '@rsbuild/plugin-react';
import pluginTailwindcss from '@rsbuild/plugin-tailwindcss';
import pluginManifest from '@rsbuild/plugin-manifest';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTailwindcss(),
    pluginManifest({
      fileName: 'manifest.json',
    }),
  ],
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      main: './src/entry-client.tsx',
    },
    alias: {
      '#src': resolve(currentDir, './src'),
      '#genfiles': resolve(currentDir, './__generated__'),
    },
  },
  output: {
    distPath: {
      root: './dist/client',
    },
    cleanDistPath: true,
  },
  tools: {
    babel(config) {
      const existing = config.plugins ?? [];
      const hasRelay = existing.some((plugin) => {
        if (typeof plugin === 'string') return plugin === 'relay';
        if (Array.isArray(plugin)) return plugin[0] === 'relay';
        return false;
      });
      if (!hasRelay) {
        existing.push('relay');
      }
      config.plugins = existing;
      return config;
    },
  },
});
