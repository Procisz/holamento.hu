import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

function inlineCss() {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html');
      if (!html) return;
      for (const [name, asset] of Object.entries(bundle)) {
        if (!name.endsWith('.css')) continue;
        const base = name.split('/').pop();
        const tag = new RegExp(`<link[^>]*href="[^"]*${base}"[^>]*>`);
        if (!tag.test(html.source)) continue;
        html.source = html.source.replace(tag, `<style>${asset.source}</style>`);
        delete bundle[name];
      }
    },
  };
}

export default defineConfig({
  plugins: [inlineCss()],
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
