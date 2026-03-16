import tailwindcss from '@tailwindcss/vite';
import {pastoria} from 'pastoria/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  server: {port: 3000},
  plugins: [tailwindcss(), pastoria()],
});
