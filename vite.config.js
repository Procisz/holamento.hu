import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    port: 5174,
  },
  build: {
    target: 'esnext',
    cssTarget: ['chrome100', 'firefox100', 'safari15'],
  },
});
