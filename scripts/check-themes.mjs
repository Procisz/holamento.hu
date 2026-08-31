import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => { try { return readFileSync(join(ROOT, p), 'utf8'); } catch { return ''; } };

function oklchToLinear(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

const srgbToLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

function toLinear(value, over = null) {
  const v = String(value).trim();
  let rgb = null;
  let alpha = 1;

  let m = v.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i);
  if (m) {
    const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    rgb = oklchToLinear(L, parseFloat(m[2]), parseFloat(m[3]));
    if (m[4]) alpha = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  }

  if (!rgb && (m = v.match(/^#([0-9a-f]{3,8})$/i))) {
    let hex = m[1];
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join('');
    const n = (i) => parseInt(hex.slice(i * 2, i * 2 + 2), 16) / 255;
    rgb = [srgbToLinear(n(0)), srgbToLinear(n(1)), srgbToLinear(n(2))];
    if (hex.length === 8) alpha = n(3);
  }

  if (!rgb && (m = v.match(/^rgba?\(([^)]+)\)$/i))) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    rgb = parts.slice(0, 3).map((c) => srgbToLinear(c / 255));
    if (parts.length > 3) alpha = parts[3];
  }

  if (!rgb) return null;
  if (alpha < 1 && over) return rgb.map((c, i) => c * alpha + over[i] * (1 - alpha));
  return rgb;
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function stripAtRules(css) {
  let out = '';
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '@') {
      let depth = 0, seen = false;
      while (i < css.length) {
        if (css[i] === '{') { depth++; seen = true; }
        else if (css[i] === '}') { depth--; if (!depth) { i++; break; } }
        else if (css[i] === ';' && !seen) { i++; break; }
        i++;
      }
      i--;
      continue;
    }
    out += css[i];
  }
  return out;
}

function blocks(cssRaw) {
  const css = stripAtRules(cssRaw);
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    const decls = {};
    for (const line of m[2].split(';')) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const prop = line.slice(0, i).trim();
      if (prop.startsWith('--') || prop === 'color-scheme') decls[prop] = line.slice(i + 1).trim();
    }
    out.push({ selector, decls });
  }
  return out;
}

const PALETTE = [
  '--bg', '--surface', '--surface-2', '--surface-3', '--border', '--border-strong',
  '--text', '--text-muted', '--text-faint',
  '--accent', '--accent-soft', '--on-accent',
  '--pos', '--neg', '--warn',
  '--cat-ido', '--cat-fazis', '--cat-regio', '--cat-eset',
  '--cat-szoras', '--cat-cel', '--cat-adat',
  '--prio-p1', '--prio-p2', '--prio-p3', '--prio-p4', '--prio-p5', '--prio-kp1',
  '--chart-grid', '--overlay-bg', '--shadow-hue', '--shadow-o1', '--shadow-o2',
];

const EXTRA = process.argv.slice(2);

let problems = 0;
const fail = (msg) => { problems++; console.log(`       ${msg}`); };

function collectThemes() {
  let css = read('src/styles/tokens.css');
  for (const p of EXTRA) css += '\n' + readFileSync(p, 'utf8');
  const themes = new Map();
  const put = (mode, id, decls) => {
    const key = `${mode}/${id}`;
    themes.set(key, { ...(themes.get(key) ?? {}), ...decls });
  };

  for (const b of blocks(css)) {
    if (!Object.keys(b.decls).length) continue;
    for (const sel of b.selector.split(',').map((s) => s.trim())) {
      let m;
      if ((m = sel.match(/\[data-light="([a-z0-9-]+)"\]/))) put('light', m[1], b.decls);
      else if ((m = sel.match(/\[data-dark="([a-z0-9-]+)"\]/))) put('dark', m[1], b.decls);
      else if (sel === ':root') put('light', 'alap', b.decls);
      else if (sel === '[data-theme="dark"]' || sel === ':root[data-theme="dark"]') put('dark', 'alap', b.decls);
    }
  }

  const lightAlap = themes.get('light/alap') ?? {};
  for (const [key, decls] of themes) {
    if (key.startsWith('dark/')) themes.set(key, { ...lightAlap, ...decls });
    else if (key !== 'light/alap') themes.set(key, { ...lightAlap, ...decls });
  }
  return themes;
}

const PAIRS = [
  { fg: '--text', bg: '--bg', min: 7.0, why: 'body text on the page background' },
  { fg: '--text', bg: '--surface', min: 7.0, why: 'body text on a card' },
  { fg: '--text-muted', bg: '--surface', min: 4.5, why: 'secondary text on a card' },
  { fg: '--text-faint', bg: '--surface', min: 4.5, why: 'faint text on a card' },
  { fg: '--text-faint', bg: '--bg', min: 4.5, why: 'faint text on the page background' },
  { fg: '--on-accent', bg: '--accent', min: 4.5, why: 'text on the accent colour' },
  { fg: '--accent', bg: '--surface', min: 3.0, why: 'accent colour on a card' },
  { fg: '--pos', bg: '--surface', min: 2.5, why: 'positive indicator' },
  { fg: '--neg', bg: '--surface', min: 2.5, why: 'negative indicator' },
  { fg: '--warn', bg: '--surface', min: 2.5, why: 'warning indicator' },
  ...['ido', 'fazis', 'regio', 'eset', 'szoras', 'cel', 'adat']
    .map((c) => ({ fg: `--cat-${c}`, bg: '--surface', min: 2.5, why: `${c} topic colour` })),
  ...['p1', 'p2', 'p3', 'p4', 'p5', 'kp1']
    .map((p) => ({ fg: `--prio-${p}`, bg: '--surface', min: 2.5, why: `${p.toUpperCase()} priority colour` })),
  ...['p1', 'p2-badge', 'p3-badge', 'p4', 'p5-badge', 'kp1']
    .map((p) => ({ fg: '--on-accent', bg: `--prio-${p}`, min: 4.5, why: `${p.toUpperCase()} badge label` })),
];

const themes = collectThemes();
if (!themes.size) {
  console.log('No colour scheme found. Is the script running from the project root?');
  process.exit(1);
}

console.log(`\n${themes.size} colour schemes\n${'='.repeat(60)}`);

for (const [key, decls] of [...themes].sort()) {
  const missing = PALETTE.filter((p) => !(p in decls));
  const resolve = (name) => {
    let v = decls[name];

    const m = String(v ?? '').match(/^var\((--[a-z0-9-]+)\)$/);
    if (m) v = decls[m[1]];
    return v;
  };

  const surface = toLinear(resolve('--surface'));
  const results = [];
  for (const pair of PAIRS) {
    const bgLin = toLinear(resolve(pair.bg), surface);
    const fgLin = toLinear(resolve(pair.fg), bgLin ?? surface);
    if (!bgLin || !fgLin) { results.push({ ...pair, ratio: null }); continue; }
    results.push({ ...pair, ratio: contrast(fgLin, bgLin) });
  }

  const bad = results.filter((r) => r.ratio == null || r.ratio < r.min);
  const worst = results.filter((r) => r.ratio != null).sort((a, b) => a.ratio - b.ratio)[0];
  const mark = missing.length || bad.length ? 'FAIL' : ' ok ';
  console.log(`\n[${mark}] ${key}` + (worst ? `   weakest pair: ${worst.ratio.toFixed(2)} (${worst.why})` : ''));

  if (missing.length) fail(`${key}: missing variable: ${missing.join(', ')}`);
  for (const r of bad) {
    if (r.ratio == null) fail(`${key}: cannot resolve ${r.fg} or ${r.bg}`);
    else fail(`${key}: ${r.why} (${r.fg} / ${r.bg}) is only ${r.ratio.toFixed(2)}, needs ${r.min}`);
  }
}

console.log(problems ? '\nthere are problems' : '\nall checks passed');
process.exit(problems ? 1 : 0);
