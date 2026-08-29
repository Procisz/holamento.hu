let Apex = null;
let apexLoading = null;

export function loadCharts() {
  if (Apex) return Promise.resolve(Apex);
  if (!apexLoading) {
    apexLoading = import('apexcharts').then((m) => {
      Apex = m.default;
      return Apex;
    });
  }
  return apexLoading;
}
import { fmtMin, fmtMinShort } from '../utils/fmt.js';
import { t } from '../app/i18n.js';

const registry = new Set();

export const cssToken = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const token = cssToken;

export function baseOptions() {
  const dark = document.documentElement.dataset.theme === 'dark';
  return {
    chart: {
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      redrawOnWindowResize: false,
      animations: { speed: 500 },
    },
    theme: { mode: dark ? 'dark' : 'light' },
    grid: { borderColor: token('--chart-grid') },
    xaxis: {
      labels: { style: { colors: token('--text-muted') } },
      axisBorder: { color: token('--chart-grid') },
      axisTicks: { color: token('--chart-grid') },
    },
    yaxis: { labels: { style: { colors: token('--text-muted') } } },
    legend: { labels: { colors: token('--text') } },
    dataLabels: { enabled: false },
    tooltip: { theme: dark ? 'dark' : 'light' },
    stroke: { lineCap: 'round' },
  };
}

const THEME_TOKENS = ['--cat-ido', '--cat-fazis', '--cat-regio', '--cat-eset',
  '--cat-szoras', '--cat-cel', '--cat-adat',
  '--prio-p1', '--prio-p2', '--prio-p3', '--prio-p4',
  '--accent', '--pos', '--neg', '--warn', '--text-muted', '--text-faint'];

function tokenIndex() {
  const byValue = new Map();
  for (const name of THEME_TOKENS) {
    const v = token(name).trim();

    if (v && !byValue.has(v)) byValue.set(v, name);
  }
  return byValue;
}

export function tokenFor(value) {
  return tokenIndex().get(String(value ?? '').trim()) ?? null;
}


const built = new Map();

function buildChart(el, options) {
  const merged = deepMerge(baseOptions(), options);
  if (merged.chart?.type === 'heatmap') {

    merged.stroke = { ...merged.stroke, lineCap: 'butt' };

    merged.chart = { ...merged.chart, animations: { ...merged.chart.animations, enabled: false } };
  }
  const chart = new Apex(el, merged);

  if (Array.isArray(merged.colors)) {
    chart.holamentoColors = merged.colors;
    chart.holamentoTokens = merged.colors.map(tokenFor);
  }
  chart.render();
  registry.add(chart);

  for (const [dead, entry] of built) {
    if (dead.isConnected) continue;
    try { entry.chart.destroy(); } catch {}
    registry.delete(entry.chart);
    built.delete(dead);
  }
  built.set(el, { chart, options, decorate: built.get(el)?.decorate ?? null });
  return chart;
}

export function makeChart(el, options, decorate) {
  if (Apex) {
    const chart = buildChart(el, options);
    decorate?.(chart);
    return chart;
  }
  const reserved = options?.chart?.height;
  if (typeof reserved === "number") el.style.minHeight = `${reserved}px`;
  loadCharts().then(() => {
    if (!el.isConnected || el.children.length) return;
    const chart = buildChart(el, options);
    decorate?.(chart);
  });
  return null;
}

export function replayCharts(root) {
  if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const [el, entry] of [...built]) {
    if (!el.isConnected) { built.delete(el); continue; }
    if (!root.contains(el)) continue;
    const decorate = entry.decorate;
    try { entry.chart.destroy(); } catch {}
    registry.delete(entry.chart);
    try {
      makeChart(el, entry.options, decorate);
    } catch (err) {
      console.error('Diagram újrajátszás hiba:', err);
    }
  }
}

export function destroyAllCharts() {
  for (const c of registry) {
    try { c.destroy(); } catch {}
  }
  registry.clear();
  built.clear();
}


function themeRepaint(chart) {
  const dark = document.documentElement.dataset.theme === 'dark';
  const muted = token('--text-muted');
  const grid = token('--chart-grid');
  const cfg = chart.w?.config ?? {};
  const axis = (ax) => ({
    ...ax,
    labels: { ...(ax?.labels ?? {}), style: { ...(ax?.labels?.style ?? {}), colors: muted } },
  });
  const next = {
    theme: { mode: dark ? 'dark' : 'light' },
    grid: { ...(cfg.grid ?? {}), borderColor: grid },
    xaxis: {
      ...axis(cfg.xaxis),
      axisBorder: { ...(cfg.xaxis?.axisBorder ?? {}), color: grid },
      axisTicks: { ...(cfg.xaxis?.axisTicks ?? {}), color: grid },
    },

    yaxis: Array.isArray(cfg.yaxis) ? cfg.yaxis.map(axis) : axis(cfg.yaxis),
    legend: { ...(cfg.legend ?? {}), labels: { ...(cfg.legend?.labels ?? {}), colors: token('--text') } },
    tooltip: { ...(cfg.tooltip ?? {}), theme: dark ? 'dark' : 'light' },
  };

  if (chart.holamentoTokens) {
    next.colors = chart.holamentoColors.map((c, i) =>
      (chart.holamentoTokens[i] ? token(chart.holamentoTokens[i]) : c));
  }
  return next;
}

document.addEventListener('holamento:themechange', () => {
  for (const c of registry) {
    try {
      c.updateOptions(themeRepaint(c), false, true);
    } catch {}
  }
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    for (const c of registry) {
      try { c.updateOptions({}, true, false); } catch {}
    }
  }, 250);
});

const hexCache = new Map();

export function roundOrNull(v) {
  return v == null ? null : Math.round(v * 100) / 100;
}

export const minAxis = { labels: { formatter: (v) => `${fmtMinShort(v)} ${t('common.minutesShort')}` } };
export const minTooltip = { y: { formatter: (v) => fmtMin(v) } };

export function sparkline(values, { width = 120, height = 36 } = {}) {
  const nums = values.filter((v) => v != null && Number.isFinite(v));
  if (nums.length < 2) return '';
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min || 1;
  const pts = nums.map((v, i) => {
    const x = (i / (nums.length - 1)) * (width - 4) + 2;
    const y = height - 3 - ((v - min) / span) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `<svg class="spark" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${pts.join(' ')}" fill="none" stroke="var(--c, var(--accent))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function deepMerge(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b || {})) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])
      ? deepMerge(a[k], v)
      : v;
  }
  return out;
}

