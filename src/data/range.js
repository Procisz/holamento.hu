export function modelBounds(model) {
	const months = model?.series?.months ?? [];
	if (!months.length) return null;
	return { min: months[0], max: months[months.length - 1] };
}

export function filterModel(model, from, to) {
	const base = model.full ?? model;
	const months = base.series.months;
	const idx = months.map((ym, i) => (ym >= from && ym <= to ? i : -1)).filter((i) => i >= 0);
	if (!idx.length) return base;

	const kept = idx.map((i) => months[i]);
	const latestMonth = kept[kept.length - 1];
	const prevMonth = kept.length > 1 ? kept[kept.length - 2] : null;
	const pick = (arr) => (Array.isArray(arr) ? idx.map((i) => arr[i] ?? null) : []);

	const series = {
		months: kept,
		byArea: mapValues(base.series.byArea, (metrics) =>
			mapValues(metrics, (byPrio) => mapValues(byPrio, pick)),
		),
	};

	const rtIdx = base.regionTrend.months
		.map((ym, i) => (ym >= from && ym <= to ? i : -1))
		.filter((i) => i >= 0);
	const rtPick = (arr) => (Array.isArray(arr) ? rtIdx.map((i) => arr[i] ?? null) : []);
	const regionTrend = {
		months: rtIdx.map((i) => base.regionTrend.months[i]),
		byRegion: mapValues(base.regionTrend.byRegion, (metrics) =>
			mapValues(metrics, (byPrio) => mapValues(byPrio, rtPick)),
		),
	};

	const inRange = (ym) => Boolean(ym) && ym >= from && ym <= to;

	return {
		...base,
		full: base,
		meta: {
			...base.meta,
			months: base.meta.months.filter(inRange),
			monthsLong: kept,
			latestMonth,
			prevMonth,
			latestIsPreliminary: base.meta.latestIsPreliminary && latestMonth === base.meta.latestMonth,
			range: { from, to },
		},
		series,
		regionTrend,
		kpi: kpiFromSeries(series, base.meta.priorities, latestMonth, prevMonth, base.meta.areas),
		phases: inRange(base.phases?.month) ? base.phases : null,
		regionSnapshot: snapshotAt(base, regionTrend, latestMonth),
		regionSnapshotAlt: inRange(base.regionSnapshotAlt?.month) ? base.regionSnapshotAlt : null,
	};
}

function kpiFromSeries(series, priorities, latestMonth, prevMonth, areas) {
	const prio = priorities.includes('P1') ? 'P1' : priorities[0];
	if (!prio) return null;
	const months = series.months;
	const last = months.length - 1;
	const prev = prevMonth ? last - 1 : -1;
	const items = areas
		.map((area) => {
			const a = series.byArea[area];
			if (!a) return null;
			return {
				area,
				p90: a.p90?.[prio]?.[last] ?? null,
				p90Prev: prev >= 0 ? (a.p90?.[prio]?.[prev] ?? null) : null,
				esetszam: a.esetszam?.[prio]?.[last] ?? null,
			};
		})
		.filter(Boolean);
	return items.length ? { month: latestMonth, priorityLabel: prio, items } : null;
}

function snapshotAt(base, regionTrend, month) {
	if (base.regionSnapshot?.month === month) return base.regionSnapshot;
	const i = regionTrend.months.indexOf(month);
	if (i < 0 || !base.meta.regions.length) return null;
	const rows = base.meta.regions
		.map((r) => {
			const src = regionTrend.byRegion[r.code];
			if (!src) return null;
			const byPriority = {};
			let has = false;
			for (const p of base.meta.priorities) {
				const median = src.median?.[p]?.[i] ?? null;
				const p75 = src.p75?.[p]?.[i] ?? null;
				const p90 = src.p90?.[p]?.[i] ?? null;
				if (median != null || p75 != null || p90 != null) has = true;
				byPriority[p] = { median, p75, p90 };
			}
			return has ? { code: r.code, name: r.name, byPriority } : null;
		})
		.filter(Boolean);
	return rows.length ? { month, rows } : null;
}

function mapValues(obj, fn) {
	return Object.fromEntries(Object.entries(obj ?? {}).map(([k, v]) => [k, fn(v)]));
}
