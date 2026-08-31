import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DICT } from '../src/i18n/index.js';

const LANGS = ['hu', 'en', 'de'];
let problems = 0;
const fail = (msg) => { problems++; console.log(`  ${msg}`); };

console.log('\ndictionaries\n' + '='.repeat(60));

const keys = Object.fromEntries(LANGS.map((l) => [l, new Set(Object.keys(DICT[l] ?? {}))]));
for (const l of LANGS) {
  if (!keys[l].size) fail(`${l}: the dictionary is empty or missing`);
}
console.log(`\n  keys: ${LANGS.map((l) => `${l}=${keys[l].size}`).join(', ')}`);

for (const l of LANGS.slice(1)) {
  const missing = [...keys.hu].filter((k) => !keys[l].has(k));
  const extra = [...keys[l]].filter((k) => !keys.hu.has(k));
  if (missing.length) fail(`${l}: missing key (${missing.length}): ${missing.slice(0, 8).join(', ')}`);
  if (extra.length) fail(`${l}: unexpected key (${extra.length}): ${extra.slice(0, 8).join(', ')}`);
}

for (const l of LANGS) {
  for (const [k, v] of Object.entries(DICT[l] ?? {})) {
    const texts = Array.isArray(v) ? v : [v];
    for (const text of texts) {
      if (typeof text !== 'string') continue;
      if (/[–—]/.test(text)) fail(`${l}/${k}: contains a dash character`);
    }
  }
}

const huPlaceholders = (k) => [...String(DICT.hu[k] ?? '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
for (const l of LANGS.slice(1)) {
  for (const k of keys.hu) {
    if (typeof DICT.hu[k] !== 'string' || !keys[l].has(k)) continue;
    const other = [...String(DICT[l][k] ?? '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
    if (huPlaceholders(k) !== other) {
      fail(`${l}/${k}: placeholders differ (hu: ${huPlaceholders(k) || 'none'}, ${l}: ${other || 'none'})`);
    }
  }
}

console.log('\nsource files\n' + '='.repeat(60));

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const sources = walk('src').filter((p) => /\.(js|css)$/.test(p)).concat(['index.html']);
for (const p of sources) {
  const src = readFileSync(p, 'utf8');
  if (/[–—]/.test(src)) fail(`${p}: contains a dash character`);
  if (p.endsWith('.js') && /^\s*(\/\/|\/\*)/m.test(src)) fail(`${p}: contains a code comment`);
}
console.log(`\n  ${sources.length} source files checked`);

console.log(problems ? `\n${problems} problem(s)\n` : '\nall checks passed\n');
process.exit(problems ? 1 : 0);
