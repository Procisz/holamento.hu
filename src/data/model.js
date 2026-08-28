export const PHASE_ORDER = ['esr_cad', 'cad_cad', 'cad_bej', 'bej_erk'];

export function buildModel(raw) {
  const meta = raw.meta ?? {};
  const warnings = [];

  const validYm = (a) => Array.isArray(a) && a.every((m) => typeof m === 'string' && /^\d{4}-\d{2}$/.test(m));
  const months = validYm(meta.months) ? meta.months : [];
  const monthsLong = validYm(meta.monthsFrom2025) ? meta.monthsFrom2025 : months;
  const knownPrio = (Array.isArray(meta.priorities) ? meta.priorities : [])
    .filter((p) => /^P[1-5]$/.test(p));
  const priorities = knownPrio.length ? knownPrio : ['P1', 'P2', 'P3', 'P4'];
  const areas = Array.isArray(meta.areas) && meta.areas.length ? meta.areas : ['Országos', 'Budapest'];
  const regions = (Array.isArray(meta.regions) ? meta.regions : [])
    .map((r) => ({ code: cleanText(r?.code), name: cleanText(r?.name) }))
    .filter((r) => r.code && r.name);

  const latestMonth = meta.latestMonth ?? monthsLong[monthsLong.length - 1] ?? null;
  const prevMonth = monthsLong.length > 1 ? monthsLong[monthsLong.length - 2] : null;

  if (meta.latestIsPreliminary && latestMonth) {
    warnings.push({
      severity: 'info',
      key: 'warn.preliminary',
      params: { month: latestMonth },
      tab: 'attekintes',
    });
  }

  const series = normalizeSeries(raw.topic2, monthsLong, areas, priorities, warnings);
  const regionTrend = normalizeRegionTrend(raw.regioTrend, months, regions, priorities, warnings);
  const phases = normalizePhases(raw.phases, warnings);
  const kpi = normalizeKpi(raw.topic1);
  const regionSnapshot = normalizeSnapshot(raw.topic5);
  const regionSnapshotAlt = normalizeSnapshot(raw.topic4);

  let generatedAt = null;
  if (meta.generatedAt) {
    const d = new Date(meta.generatedAt);
    if (!Number.isNaN(d.getTime())) generatedAt = d;
  }

  return {
    meta: {
      generatedAt,
      updatedDate: meta.updatedDate ?? null,
      originMonth: meta.originMonth ?? null,
      latestMonth,
      prevMonth,
      latestIsPreliminary: Boolean(meta.latestIsPreliminary),
      months,
      monthsLong,
      priorities,
      areas,
      regions,
      range: monthsLong.length ? { from: monthsLong[0], to: monthsLong[monthsLong.length - 1] } : null,
      warnings,
    },
    kpi,
    phases,
    series,
    regionTrend,
    regionSnapshot,
    regionSnapshotAlt,
    regionsByCode: new Map(regions.map((r) => [r.code, r])),
  };
}

function normalizeSeries(topic2, monthsLong, areas, priorities, warnings) {
  const byArea = {};
  const src = topic2?.byArea ?? {};
  for (const area of areas) {
    const a = src[area] ?? {};
    byArea[area] = {};
    for (const metric of ['median', 'p75', 'p90', 'esetszam']) {
      byArea[area][metric] = {};
      for (const p of priorities) {
        const arr = Array.isArray(a[metric]?.[p]) ? a[metric][p] : [];
        byArea[area][metric][p] = monthsLong.map((_, i) => toNum(arr[i]));
      }
    }
  }
  if (!Object.keys(src).length) {
    warnings.push({ severity: 'warn', key: 'warn.seriesMissing', tab: 'trendek' });
  }
  return { months: monthsLong, byArea };
}

function normalizeRegionTrend(rt, months, regions, priorities, warnings) {
  const byRegion = {};
  const src = rt?.byRegion ?? {};
  for (const r of regions) {
    const a = src[r.code] ?? {};
    byRegion[r.code] = {};
    for (const metric of ['median', 'p75', 'p90']) {
      byRegion[r.code][metric] = {};
      for (const p of priorities) {
        const arr = Array.isArray(a[metric]?.[p]) ? a[metric][p] : [];
        byRegion[r.code][metric][p] = months.map((_, i) => toNum(arr[i]));
      }
    }
  }
  if (regions.length && !Object.keys(src).length) {
    warnings.push({ severity: 'warn', key: 'warn.regionMissing', tab: 'regiok' });
  }
  return { months: Array.isArray(rt?.months) ? rt.months : months, byRegion };
}

function normalizePhases(ph, warnings) {
  if (!ph || !Array.isArray(ph.items) || !ph.items.length) {
    warnings.push({ severity: 'info', key: 'warn.phasesMissing', tab: 'fazisok' });
    return null;
  }
  const items = ph.items
    .filter((it) => PHASE_ORDER.includes(it.key))
    .sort((x, y) => PHASE_ORDER.indexOf(x.key) - PHASE_ORDER.indexOf(y.key))
    .map((it) => ({
    key: it.key,
    atlag: toNum(it.atlag),
    median: toNum(it.median),
    p75: toNum(it.p75),
    p90: toNum(it.p90),
  }));
  return {
    month: ph.month ?? null,
    area: ph.area ?? null,
    priority: ph.priority ?? null,
    esetszam: toNum(ph.esetszam),
    total: toNum(ph.total ?? ph.sum),
    items,
  };
}

function normalizeKpi(t1) {
  if (!t1 || !Array.isArray(t1.items)) return null;
  return {
    month: t1.month ?? null,
    priorityLabel: t1.priorityLabel ?? 'P1',
    items: t1.items.map((it) => ({
      area: it.area,
      p90: toNum(it.p90),
      p90Prev: toNum(it.p90Prev),
      esetszam: toNum(it.esetszam),
    })),
  };
}

function normalizeSnapshot(t) {
  if (!t || !Array.isArray(t.rows) || !t.rows.length) return null;
  return {
    month: t.month ?? null,
    rows: t.rows.map((r) => ({
      code: cleanText(r.code),
      name: cleanText(r.name),
      byPriority: Object.fromEntries(
        Object.entries(r.byPriority ?? {}).map(([p, v]) => [p, {
          median: toNum(v?.median),
          p75: toNum(v?.p75),
          p90: toNum(v?.p90),
        }]),
      ),
    })),
  };
}

function toNum(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function cleanText(v) {
  return String(v ?? '').replace(/[<>&"'`]/g, '').slice(0, 60);
}
