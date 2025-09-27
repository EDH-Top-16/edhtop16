import {defineConfig} from '@rsbuild/core';
import pluginReact from '@rsbuild/plugin-react';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    pluginReact(),
  ],
  source: {
    entry: {
      server: './src/entry-server.tsx',
    },
    alias: {
      '#src': resolve(currentDir, './src'),
      '#genfiles': resolve(currentDir, './__generated__'),
    },
  },
  output: {
    distPath: {
      root: './dist/server',
    },
    filenameHashing: false,
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
    rspack(config) {
      config.target = 'node18';
      config.output = {
        ...config.output,
        clean: true,
        filename: 'entry-server.mjs',
        chunkFilename: '[name].mjs',
        library: {type: 'module'},
        chunkFormat: 'module',
      };
      return config;
    },
  },
});
