import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

type ManifestEntry = {
  file: string;
  css?: string[];
  assets?: string[];
  imports?: string[];
  isEntry?: boolean;
};

class RsbuildManifestPlugin {
  constructor(private readonly options: {fileName?: string} = {}) {}

  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap(
      'RsbuildManifestPlugin',
      (compilation: any) => {
        const stage =
          compiler.webpack?.Compilation?.PROCESS_ASSETS_STAGE_SUMMARIZE ?? 5000;

        const chunkGraph = compilation.chunkGraph;
        const context = compiler.context.replace(/\\/g, '/');

        function getResource(mod: any): string | undefined {
          if (mod.resource) return String(mod.resource);
          if (typeof mod.identifier === 'function') {
            let id = mod.identifier();
            if (typeof id !== 'string') return undefined;
            const bang = id.lastIndexOf('!');
            if (bang >= 0) {
              id = id.slice(bang + 1);
            }
            const pipe = id.indexOf('|');
            if (pipe >= 0) {
              id = id.slice(0, pipe);
            }
            return id;
          }
          return undefined;
        }

        const toRelative = (abs: string) => {
          const normalized = abs.replace(/\\/g, '/');
          if (normalized.startsWith(context + '/')) {
            return normalized.slice(context.length + 1);
          }
          return normalized;
        };

        const includeModule = (relative: string) =>
          relative === 'src/entry-client.tsx' || relative.startsWith('src/pages/');

        const modulesForChunk = (chunk: any) =>
          chunkGraph?.getChunkModulesIterable
            ? chunkGraph.getChunkModulesIterable(chunk)
            : chunk.modulesIterable;

        const collectReferencedModuleNames = (chunk: any) => {
          const names = new Set<string>();
          const visitChunk = (target: any) => {
            const modules = modulesForChunk(target);
            if (!modules) return;
            for (const mod of modules) {
              const resource = getResource(mod);
              if (!resource) continue;
              const relative = toRelative(resource);
              if (!includeModule(relative)) continue;
              names.add(relative);
            }
          };

          if (chunkGraph?.getChunkEntryDependentChunksIterable) {
            for (const depChunk of chunkGraph.getChunkEntryDependentChunksIterable(
              chunk,
            ) ?? []) {
              visitChunk(depChunk);
            }
          }

          if (typeof chunk.getAllReferencedChunks === 'function') {
            for (const depChunk of chunk.getAllReferencedChunks() ?? []) {
              visitChunk(depChunk);
            }
          }

          return names;
        };

        compilation.hooks.processAssets.tap(
          {name: 'RsbuildManifestPlugin', stage},
          () => {
            const manifest = new Map<string, ManifestEntry>();
            const rawPublicPath = compilation.outputOptions.publicPath ?? '';
            const publicPath =
              !rawPublicPath || rawPublicPath === 'auto'
                ? ''
                : rawPublicPath.endsWith('/')
                  ? rawPublicPath
                  : `${rawPublicPath}/`;
            const toPublicPath = (filename: string) =>
              publicPath ? `${publicPath}${filename}` : filename;

            for (const chunk of compilation.chunks) {
              const files = Array.from(chunk.files ?? []);
              const jsFile = files.find((file: string) => /\.m?js$/.test(file));
              const cssFiles = files.filter((file: string) => file.endsWith('.css'));
              const assetFiles = files.filter(
                (file: string) => !/\.m?js$/.test(file) && !file.endsWith('.css'),
              );

              const modules = modulesForChunk(chunk);
              if (!modules) continue;

              const moduleNames: string[] = [];
              for (const mod of modules) {
                const resource = getResource(mod);
                if (!resource) continue;
                const relative = toRelative(resource);
                if (!includeModule(relative)) continue;

                moduleNames.push(relative);
                const entry = manifest.get(relative) ?? {file: ''};
                if (jsFile) {
                  entry.file = toPublicPath(jsFile);
                }
                if (cssFiles.length) {
                  entry.css = cssFiles.map(toPublicPath);
                }
                if (assetFiles.length) {
                  entry.assets = assetFiles.map(toPublicPath);
                }
                if (typeof chunk.canBeInitial === 'function') {
                  if (chunk.canBeInitial()) entry.isEntry = true;
                } else if (chunk.hasRuntime?.()) {
                  entry.isEntry = true;
                }
                manifest.set(relative, entry);
              }

              if (!moduleNames.length) continue;

              const dependencies = Array.from(collectReferencedModuleNames(chunk)).filter(
                (name) => !moduleNames.includes(name),
              );
              if (!dependencies.length) continue;

              for (const name of moduleNames) {
                const entry = manifest.get(name);
                if (!entry) continue;
                entry.imports ??= [];
                for (const dep of dependencies) {
                  if (!entry.imports.includes(dep)) {
                    entry.imports.push(dep);
                  }
                }
              }
            }

            const manifestObject: Record<string, ManifestEntry> = {};
            for (const [name, entry] of manifest) {
              if (!entry.file) continue;
              if (!entry.css?.length) delete entry.css;
              if (!entry.assets?.length) delete entry.assets;
              if (!entry.imports?.length) delete entry.imports;
              manifestObject[name] = entry;
            }

            const {RawSource} = compiler.webpack?.sources ?? {};
            if (!RawSource) {
              throw new Error('Unable to locate RawSource to emit manifest.json');
            }
            const fileName = this.options.fileName ?? 'manifest.json';
            compilation.emitAsset(
              fileName,
              new RawSource(JSON.stringify(manifestObject, null, 2)),
            );
          },
        );
      },
    );
  }
}

export default defineConfig({
  plugins: [
    pluginReact(),
  ],
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      main: './src/entry-client.tsx',
    },
  },
  resolve: {
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
    postcss(config) {
      const existing = config.postcssOptions?.plugins ?? config.plugins ?? [];
      const plugins = Array.isArray(existing) ? [...existing] : [existing];
      if (!plugins.some((plugin) => plugin === tailwindcss || plugin?.postcssPlugin === tailwindcss.postcssPlugin)) {
        plugins.push(tailwindcss());
      }
      if (config.postcssOptions) {
        config.postcssOptions.plugins = plugins;
      } else {
        config.plugins = plugins;
      }
      return config;
    },
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
      config.plugins ??= [];
      config.plugins.push(new RsbuildManifestPlugin({fileName: 'manifest.json'}));
      return config;
    },
  },
});
