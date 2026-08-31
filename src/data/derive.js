import { daysInMonth } from '../utils/fmt.js';

const memo = new WeakMap();
function memoized(model, key, compute) {
  let m = memo.get(model);
  if (!m) { m = new Map(); memo.set(model, m); }
  if (!m.has(key)) m.set(key, compute());
  return m.get(key);
}

export const METRIC_IDS = ['median', 'p75', 'p90'];

export function latestKpis(model) {
  return memoized(model, 'latestKpis', () => {
    if (!model.kpi) return [];
    return model.kpi.items.map((it) => ({
      area: it.area,
      p90: it.p90,
      p90Prev: it.p90Prev,
      delta: it.p90 != null && it.p90Prev != null ? it.p90 - it.p90Prev : null,
      esetszam: it.esetszam,
    }));
  });
}

export function longSeries(model, area) {
  return memoized(model, `longSeries:${area}`, () => {
    const a = model.series.byArea[area] ?? {};
    return { months: model.series.months, ...a };
  });
}

export function yoyYears(model, area) {
  const s = longSeries(model, area);
  const years = [...new Set(s.months.map((ym) => ym.slice(0, 4)))].sort();
  if (years.length < 2) return null;
  const curr = years[years.length - 1];
  const prev = String(Number(curr) - 1);
  return years.includes(prev) ? { curr, prev } : null;
}

export function yoyPairs(model, area, metric, prio) {
  const years = yoyYears(model, area);
  if (!years) return [];
  const s = longSeries(model, area);
  const byMonth = new Map(s.months.map((ym, i) => [ym, s[metric]?.[prio]?.[i] ?? null]));
  const pairs = [];
  for (const ym of s.months) {
    const [y, m] = ym.split('-');
    if (y !== years.curr) continue;
    const prevYm = `${years.prev}-${m}`;
    if (!byMonth.has(prevYm)) continue;
    pairs.push({ month: Number(m), curr: byMonth.get(ym), prev: byMonth.get(prevYm) });
  }
  return pairs;
}

export function yoySummary(model, area) {
  return memoized(model, `yoySummary:${area}`, () => {
    const out = [];
    for (const p of model.meta.priorities) {
      for (const m of ['median', 'p90']) {
        const pairs = yoyPairs(model, area, m, p).filter((x) => x.curr != null && x.prev != null);
        if (!pairs.length) continue;
        const curr = avg(pairs.map((x) => x.curr));
        const prev = avg(pairs.map((x) => x.prev));
        out.push({ prio: p, metric: m, curr, prev, delta: curr - prev, pct: prev ? (curr - prev) / prev : null, pairCount: pairs.length });
      }
    }
    return out;
  });
}

export function momTable(model, area) {
  return memoized(model, `momTable:${area}`, () => {
    const s = longSeries(model, area);
    const n = s.months.length;
    if (n < 2) return [];
    return model.meta.priorities.map((p) => {
      const row = { prio: p, esetszam: s.esetszam?.[p]?.[n - 1] ?? null };
      for (const m of ['median', 'p75', 'p90']) {
        const curr = s[m]?.[p]?.[n - 1] ?? null;
        const prev = s[m]?.[p]?.[n - 2] ?? null;
        row[m] = curr;
        row[`${m}Delta`] = curr != null && prev != null ? curr - prev : null;
      }
      return row;
    });
  });
}

export function caseSeries(model, area) {
  return memoized(model, `caseSeries:${area}`, () => {
    const s = longSeries(model, area);
    const months = s.months;
    const byPrio = s.esetszam ?? {};
    const total = months.map((_, i) => {
      if (!model.meta.priorities.length) return null;
      let sum = 0;
      for (const p of model.meta.priorities) {
        const v = byPrio[p]?.[i];
        if (v == null) return null;
        sum += v;
      }
      return sum;
    });
    const perDay = months.map((ym, i) => {
      const d = daysInMonth(ym);
      return total[i] != null && d ? total[i] / d : null;
    });
    const mixPct = {};
    for (const p of model.meta.priorities) {
      mixPct[p] = months.map((_, i) => {
        const v = byPrio[p]?.[i];
        return v != null && total[i] ? v / total[i] : null;
      });
    }
    return { months, byPrio, total, perDay, mixPct };
  });
}

export function videkCaseSeries(model) {
  return memoized(model, 'videkCaseSeries', () => {
    const o = caseSeries(model, 'Országos');
    const b = caseSeries(model, 'Budapest');
    const months = o.months;
    const byPrio = {};
    for (const p of model.meta.priorities) {
      byPrio[p] = months.map((_, i) => {
        const ov = o.byPrio[p]?.[i];
        const bv = b.byPrio[p]?.[i];
        return ov != null && bv != null ? ov - bv : null;
      });
    }
    const total = months.map((_, i) =>
      (o.total[i] != null && b.total[i] != null ? o.total[i] - b.total[i] : null));
    return { months, byPrio, total };
  });
}

export function budapestShare(model) {
  return memoized(model, 'budapestShare', () => {
    const o = caseSeries(model, 'Országos');
    const b = caseSeries(model, 'Budapest');
    return o.months.map((_, i) =>
      (o.total[i] && b.total[i] != null ? b.total[i] / o.total[i] : null));
  });
}

export function phaseStats(model) {
  return memoized(model, 'phaseStats', () => {
    if (!model.phases) return null;
    const items = model.phases.items;
    const sumAtlag = items.every((it) => it.atlag != null)
      ? items.reduce((s, it) => s + it.atlag, 0)
      : null;
    const preArrival = items.filter((it) => it.key !== 'bej_erk');
    const dispatchAtlag = preArrival.every((it) => it.atlag != null)
      ? preArrival.reduce((s, it) => s + it.atlag, 0)
      : null;
    return {
      ...model.phases,
      sumAtlag,
      dispatchAtlag,
      travelAtlag: items.find((it) => it.key === 'bej_erk')?.atlag ?? null,
      shares: items.map((it) => ({
        ...it,
        share: it.atlag != null && sumAtlag ? it.atlag / sumAtlag : null,
      })),
    };
  });
}

export function regionSnapshotRows(model, prio, metric) {
  const snap = model.regionSnapshot;
  if (!snap) return [];
  const rows = snap.rows.map((r) => ({
    code: r.code,
    name: r.name,
    value: r.byPriority[prio]?.[metric] ?? null,
    median: r.byPriority[prio]?.median ?? null,
    p75: r.byPriority[prio]?.p75 ?? null,
    p90: r.byPriority[prio]?.p90 ?? null,
  }));
  return rows.sort((a, b) => (a.value ?? Infinity) - (b.value ?? Infinity));
}

export function dispatchSplit(model, prio, metric) {
  return memoized(model, `dispatchSplit:${prio}:${metric}`, () => {
    const alt = model.regionSnapshotAlt;
    const rt = model.regionTrend;
    if (!alt || !rt) return { month: null, rows: [] };
    const i = rt.months.indexOf(alt.month);
    if (i < 0) return { month: alt.month, rows: [] };

    const byCode = new Map(alt.rows.map((r) => [r.code, r]));
    const rows = model.meta.regions.map((r) => {
      const total = rt.byRegion[r.code]?.[metric]?.[prio]?.[i] ?? null;
      const fromAlarm = byCode.get(r.code)?.byPriority?.[prio]?.[metric] ?? null;
      const beforeAlarm =
        total != null && fromAlarm != null && total >= fromAlarm ? total - fromAlarm : null;
      return {
        code: r.code,
        name: r.name,
        total,
        fromAlarm,
        beforeAlarm,
        share: beforeAlarm != null && total ? beforeAlarm / total : null,
      };
    });
    return { month: alt.month, rows: rows.filter((r) => r.beforeAlarm != null) };
  });
}

export function dispatchSplitAll(model, metric) {
  return memoized(model, `dispatchSplitAll:${metric}`, () => {
    const out = [];
    for (const p of model.meta.priorities) {
      for (const r of dispatchSplit(model, p, metric).rows) out.push({ ...r, prio: p });
    }
    return out;
  });
}

export function dispatchSummary(model, prio, metric) {
  const { month, rows } = dispatchSplit(model, prio, metric);
  if (!rows.length) return null;
  const sorted = [...rows].sort((a, b) => a.beforeAlarm - b.beforeAlarm);
  const fastest = sorted[0];
  const slowest = sorted[sorted.length - 1];
  const shares = rows.map((r) => r.share).filter((v) => v != null);
  return {
    month,
    rows,
    fastest,
    slowest,
    gap: slowest.beforeAlarm - fastest.beforeAlarm,
    avgBeforeAlarm: avg(rows.map((r) => r.beforeAlarm)),
    avgShare: shares.length ? avg(shares) : null,
  };
}

export function regionSnapshotMatrix(model, metric) {
  return memoized(model, `regionSnapshotMatrix:${metric}`, () => {
    const snap = model.regionSnapshot;
    if (!snap) return { month: null, regions: [], series: [] };
    const byCode = new Map(snap.rows.map((r) => [r.code, r]));
    const regions = model.meta.regions.filter((r) => byCode.has(r.code));
    const series = model.meta.priorities.map((prio) => ({
      prio,
      values: regions.map((r) => byCode.get(r.code)?.byPriority?.[prio]?.[metric] ?? null),
    }));
    return {
      month: snap.month,
      regions,
      series: series.filter((s) => s.values.some((v) => v != null)),
    };
  });
}

export function regionTrendSeries(model, prio, metric) {
  const rt = model.regionTrend;
  return model.meta.regions.map((r) => ({
    code: r.code,
    name: r.name,
    values: rt.byRegion[r.code]?.[metric]?.[prio] ?? [],
  }));
}

export function regionSpread(model, prio, metric) {
  const rt = model.regionTrend;
  const months = rt.months;
  return months.map((ym, i) => {
    let min = null;
    let max = null;
    let best = null;
    let worst = null;
    for (const r of model.meta.regions) {
      const v = rt.byRegion[r.code]?.[metric]?.[prio]?.[i];
      if (v == null) continue;
      if (min == null || v < min) { min = v; best = r; }
      if (max == null || v > max) { max = v; worst = r; }
    }
    return { ym, min, max, range: min != null && max != null ? max - min : null, best, worst };
  });
}

export function areaCompare(model, prio, metric) {
  return memoized(model, `areaCompare:${prio}:${metric}`, () => {
    const o = longSeries(model, 'Országos');
    const b = longSeries(model, 'Budapest');
    return {
      months: o.months,
      orszagos: o[metric]?.[prio] ?? [],
      budapest: b[metric]?.[prio] ?? [],
    };
  });
}

export function areaGap(model, metric) {
  return memoized(model, `areaGap:${metric}`, () => {
    const o = longSeries(model, 'Országos');
    const b = longSeries(model, 'Budapest');
    const byPrio = {};
    for (const p of model.meta.priorities) {
      byPrio[p] = o.months.map((_, i) => {
        const ov = o[metric]?.[p]?.[i];
        const bv = b[metric]?.[p]?.[i];
        return ov != null && bv != null ? bv - ov : null;
      });
    }
    return { months: o.months, byPrio };
  });
}

export function loadPoints(model, area, prio, metric) {
  return memoized(model, `loadPoints:${area}:${prio}:${metric}`, () => {
    const cases = caseSeries(model, area);
    const s = longSeries(model, area);
    const arr = s[metric]?.[prio] ?? [];
    return cases.months
      .map((ym, i) => ({ ym, cases: cases.total[i] ?? null, value: arr[i] ?? null }))
      .filter((pt) => pt.cases != null && pt.value != null);
  });
}

export function loadCorrelation(model, area) {
  return memoized(model, `loadCorrelation:${area}`, () => {
    const cases = caseSeries(model, area);
    const s = longSeries(model, area);
    return model.meta.priorities.map((p) => {
      const row = { prio: p, n: null };
      for (const m of METRIC_IDS) {
        row[m] = pearson(cases.total, s[m]?.[p] ?? []);
        const pc = pairCount(cases.total, s[m]?.[p] ?? []);
        row.n = row.n == null ? pc : Math.min(row.n, pc);
      }
      row.n ??= 0;
      return row;
    });
  });
}

export function regionChange(model, prio, metric) {
  return memoized(model, `regionChange:${prio}:${metric}`, () => {
    const rt = model.regionTrend;
    return model.meta.regions
      .map((r) => {
        const arr = rt.byRegion[r.code]?.[metric]?.[prio] ?? [];
        const seen = arr
          .map((v, i) => ({ v, i }))
          .filter((x) => x.v != null && Number.isFinite(x.v));
        if (seen.length < 2) return null;
        const first = seen[0];
        const last = seen[seen.length - 1];
        return {
          code: r.code,
          name: r.name,
          first: first.v,
          last: last.v,
          firstYm: rt.months[first.i] ?? null,
          lastYm: rt.months[last.i] ?? null,
          delta: last.v - first.v,
          pct: first.v ? (last.v - first.v) / first.v : null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.delta - b.delta);
  });
}

function pairCount(xs, ys) {
  return xs.filter((x, i) => x != null && ys[i] != null).length;
}

function pearson(xs, ys) {
  const pairs = xs
    .map((x, i) => [x, ys[i]])
    .filter(([x, y]) => x != null && y != null && Number.isFinite(x) && Number.isFinite(y));
  const n = pairs.length;
  if (n < 3) return null;
  const mx = pairs.reduce((s, q) => s + q[0], 0) / n;
  const my = pairs.reduce((s, q) => s + q[1], 0) / n;
  let sxy = 0;
  let sx = 0;
  let sy = 0;
  for (const [x, y] of pairs) {
    const a = x - mx;
    const b = y - my;
    sxy += a * b;
    sx += a * a;
    sy += b * b;
  }
  return sx && sy ? sxy / Math.sqrt(sx * sy) : null;
}

export function tailRatios(model, area) {
  return memoized(model, `tailRatios:${area}`, () => {
    const s = longSeries(model, area);
    const out = {};
    for (const p of model.meta.priorities) {
      out[p] = s.months.map((_, i) => {
        const med = s.median?.[p]?.[i];
        const p90 = s.p90?.[p]?.[i];
        return med && p90 != null ? p90 / med : null;
      });
    }
    return { months: s.months, byPrio: out };
  });
}

export function tailGaps(model, area) {
  return memoized(model, `tailGaps:${area}`, () => {
    const s = longSeries(model, area);
    const out = {};
    for (const p of model.meta.priorities) {
      out[p] = s.months.map((_, i) => {
        const med = s.median?.[p]?.[i];
        const p90 = s.p90?.[p]?.[i];
        return med != null && p90 != null ? p90 - med : null;
      });
    }
    return { months: s.months, byPrio: out };
  });
}

export function worstCells(model) {
  return memoized(model, 'worstCells', () => {
    const snap = model.regionSnapshot;
    if (!snap) return [];
    const cells = [];
    for (const r of snap.rows) {
      for (const p of model.meta.priorities) {
        const v = r.byPriority[p];
        if (!v || v.p90 == null) continue;
        cells.push({ code: r.code, name: r.name, prio: p, median: v.median, p75: v.p75, p90: v.p90 });
      }
    }
    return cells.sort((a, b) => b.p90 - a.p90);
  });
}

export function band15(median, p75, p90) {
  if (median == null || p75 == null || p90 == null) return null;
  if (p90 <= 15) return 'over90';
  if (p75 <= 15) return 'b7590';
  if (median <= 15) return 'b5075';
  return 'under50';
}

export function band15Series(model, area, prio) {
  const s = longSeries(model, area);
  return s.months.map((ym, i) => ({
    ym,
    band: band15(s.median?.[prio]?.[i], s.p75?.[prio]?.[i], s.p90?.[prio]?.[i]),
  }));
}


function avg(arr) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
}
