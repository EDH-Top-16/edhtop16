declare module 'vite-plugin-cjs-interop' {
  import {PluginOption} from 'vite';
  declare function cjsInterop(opts: {dependencies: string[]}): PluginOption;
}
