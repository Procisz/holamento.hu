import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DICT } from '../src/i18n/index.js';

const LANGS = ['hu', 'en', 'de'];
let problems = 0;
const fail = (msg) => { problems++; console.log(`  ${msg}`); };

console.log('\nnyelvi szotarak\n' + '='.repeat(60));

const keys = Object.fromEntries(LANGS.map((l) => [l, new Set(Object.keys(DICT[l] ?? {}))]));
for (const l of LANGS) {
  if (!keys[l].size) fail(`${l}: a szotar ures vagy hianyzik`);
}
console.log(`\n  kulcsok: ${LANGS.map((l) => `${l}=${keys[l].size}`).join(', ')}`);

for (const l of LANGS.slice(1)) {
  const missing = [...keys.hu].filter((k) => !keys[l].has(k));
  const extra = [...keys[l]].filter((k) => !keys.hu.has(k));
  if (missing.length) fail(`${l}: hianyzo kulcs (${missing.length}): ${missing.slice(0, 8).join(', ')}`);
  if (extra.length) fail(`${l}: felesleges kulcs (${extra.length}): ${extra.slice(0, 8).join(', ')}`);
}

for (const l of LANGS) {
  for (const [k, v] of Object.entries(DICT[l] ?? {})) {
    const texts = Array.isArray(v) ? v : [v];
    for (const text of texts) {
      if (typeof text !== 'string') continue;
      if (/[–—]/.test(text)) fail(`${l}/${k}: gondolatjelet tartalmaz`);
    }
  }
}

const huPlaceholders = (k) => [...String(DICT.hu[k] ?? '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
for (const l of LANGS.slice(1)) {
  for (const k of keys.hu) {
    if (typeof DICT.hu[k] !== 'string' || !keys[l].has(k)) continue;
    const other = [...String(DICT[l][k] ?? '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
    if (huPlaceholders(k) !== other) {
      fail(`${l}/${k}: elteroe helyorzok (hu: ${huPlaceholders(k) || 'nincs'}, ${l}: ${other || 'nincs'})`);
    }
  }
}

console.log('\nforraskod\n' + '='.repeat(60));

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const sources = walk('src').filter((p) => /\.(js|css)$/.test(p)).concat(['index.html']);
for (const p of sources) {
  const src = readFileSync(p, 'utf8');
  if (/[–—]/.test(src)) fail(`${p}: gondolatjelet tartalmaz`);
  if (p.endsWith('.js') && /^\s*(\/\/|\/\*)/m.test(src)) fail(`${p}: kodkommentet tartalmaz`);
}
console.log(`\n  ${sources.length} forrasfajl ellenorizve`);

console.log(problems ? `\n${problems} hiba\n` : '\nminden ellenorzes rendben\n');
process.exit(problems ? 1 : 0);
