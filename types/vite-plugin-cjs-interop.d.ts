declare module 'vite-plugin-cjs-interop' {
  import {PluginOption} from 'vite-plus';
  declare function cjsInterop(opts: {dependencies: string[]}): PluginOption;
}
