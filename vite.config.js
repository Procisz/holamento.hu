import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
  plugins: [viteSingleFile()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    port: 5174,
  },
  build: {
    target: 'esnext',
  },
});
