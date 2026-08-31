import { describe, expect, it } from 'vitest';
import { buildModel } from '../../src/data/model.js';
import * as derive from '../../src/data/derive.js';
import { makePayload, realPayload, MONTHS } from '../helpers.js';

const real = () => buildModel(realPayload());
const fake = (patch) => buildModel(makePayload(patch));
const round = (v, d = 2) => (v == null ? v : Number(v.toFixed(d)));

describe('METRIC_IDS', () => {
	it('should list the three published metrics', () => {
		expect(derive.METRIC_IDS).toEqual(['median', 'p75', 'p90']);
	});
});

describe('latestKpis', () => {
	it('should compute the month over month change', () => {
		const rows = derive.latestKpis(real());
		expect(rows).toHaveLength(2);
		expect(round(rows[0].delta)).toBe(0.46);
		expect(rows[0].esetszam).toBe(12123);
	});

	it('should memoise and return the same instance', () => {
		const m = real();
		expect(derive.latestKpis(m)).toBe(derive.latestKpis(m));
	});

	it('should return an empty array without a KPI block', () => {
		expect(derive.latestKpis(buildModel({}))).toEqual([]);
	});

	it('should leave the change null when a value is missing', () => {
		const m = fake({ topic1: { month: '2026-07', items: [{ area: 'Országos', p90: 10, p90Prev: null }] } });
		expect(derive.latestKpis(m)[0].delta).toBeNull();
	});
});

describe('longSeries', () => {
	it('should return the full 19 month series', () => {
		const s = derive.longSeries(real(), 'Országos');
		expect(s.months).toHaveLength(19);
		expect(s.median.P1[0]).toBe(16.2);
	});

	it('should return only months for an unknown area', () => {
		const s = derive.longSeries(real(), 'Nincs');
		expect(s.months).toHaveLength(19);
		expect(s.median).toBeUndefined();
	});
});

describe('year over year calculations', () => {
	it('should find two consecutive years (yoyYears)', () => {
		expect(derive.yoyYears(real(), 'Országos')).toEqual({ curr: '2026', prev: '2025' });
	});

	it('should return null for a single year', () => {
		const m = fake({ monthsFrom2025: ['2026-01', '2026-02'] });
		expect(derive.yoyYears(m, 'Országos')).toBeNull();
	});

	it('should return null for non consecutive years', () => {
		const m = fake({ monthsFrom2025: ['2024-01', '2026-01'] });
		expect(derive.yoyYears(m, 'Országos')).toBeNull();
	});

	it('should pair only the overlapping months (yoyPairs)', () => {
		const pairs = derive.yoyPairs(real(), 'Országos', 'median', 'P1');
		expect(pairs).toHaveLength(7);
		expect(pairs[0]).toEqual({ month: 1, curr: 16.45, prev: 16.2 });
	});

	it('should be empty without a year pair (yoyPairs)', () => {
		const m = fake({ monthsFrom2025: ['2026-01'] });
		expect(derive.yoyPairs(m, 'Országos', 'median', 'P1')).toEqual([]);
	});

	it('should yield nulls for an unknown metric (yoyPairs)', () => {
		const pairs = derive.yoyPairs(real(), 'Országos', 'nincs', 'P1');
		expect(pairs[0]).toEqual({ month: 1, curr: null, prev: null });
	});

	it('should return a row per priority and metric (yoySummary)', () => {
		const rows = derive.yoySummary(real(), 'Országos');
		expect(rows).toHaveLength(8);
		const p1 = rows.find((r) => r.prio === 'P1' && r.metric === 'median');
		expect(p1.pairCount).toBe(7);
		expect(round(p1.prev)).toBe(15.45);
		expect(round(p1.curr)).toBe(15.49);
	});

	it('should skip empty pairs (yoySummary)', () => {
		const m = fake({ monthsFrom2025: ['2026-01'] });
		expect(derive.yoySummary(m, 'Országos')).toEqual([]);
	});

	it('should yield a null percentage on a zero baseline (yoySummary)', () => {
		const p = makePayload();
		for (const met of ['median', 'p75', 'p90']) p.topic2.byArea['Országos'][met].P1 = new Array(19).fill(0);
		const rows = derive.yoySummary(buildModel(p), 'Országos').filter((r) => r.prio === 'P1');
		expect(rows.every((r) => r.pct === null)).toBe(true);
	});
});

describe('momTable', () => {
	it('should return the change against the previous month', () => {
		const rows = derive.momTable(real(), 'Országos');
		expect(rows).toHaveLength(4);
		expect(rows[0].prio).toBe('P1');
		expect(round(rows[0].medianDelta)).toBe(0.12);
		expect(rows[0].esetszam).toBe(12123);
	});

	it('should be empty for a single month', () => {
		const m = fake({ monthsFrom2025: ['2026-07'] });
		expect(derive.momTable(m, 'Országos')).toEqual([]);
	});

	it('should yield a null delta for a missing value', () => {
		const p = makePayload();
		p.topic2.byArea['Országos'].median.P1 = new Array(19).fill(null);
		const rows = derive.momTable(buildModel(p), 'Országos');
		expect(rows[0].medianDelta).toBeNull();
	});
});

describe('case number series', () => {
	it('should compute totals, daily averages and shares (caseSeries)', () => {
		const c = derive.caseSeries(real(), 'Országos');
		expect(c.total.at(-1)).toBe(94930);
		expect(round(c.perDay.at(-1))).toBe(3062.26);
		expect(round(c.mixPct.P1.at(-1), 3)).toBe(0.128);
	});

	it('should leave the total null when a priority is missing', () => {
		const p = makePayload();
		p.topic2.byArea['Országos'].esetszam.P2 = new Array(19).fill(null);
		const c = derive.caseSeries(buildModel(p), 'Országos');
		expect(c.total.every((v) => v === null)).toBe(true);
		expect(c.perDay.every((v) => v === null)).toBe(true);
		expect(c.mixPct.P1.every((v) => v === null)).toBe(true);
	});

	it('should leave the total null without any priority', () => {
		const m = buildModel({ meta: { priorities: ['P9'], months: [], monthsFrom2025: ['2026-07'] } });
		const c = derive.caseSeries(m, 'Országos');
		expect(c.total).toEqual([null]);
	});

	it('should subtract Budapest from the national total (videkCaseSeries)', () => {
		const v = derive.videkCaseSeries(real());
		expect(v.total.at(-1)).toBe(94930 - 17088);
		expect(v.byPrio.P1.at(-1)).toBe(12123 - 2408);
	});

	it('should yield null for a missing value (videkCaseSeries)', () => {
		const p = makePayload();
		p.topic2.byArea.Budapest.esetszam.P1 = new Array(19).fill(null);
		const v = derive.videkCaseSeries(buildModel(p));
		expect(v.byPrio.P1.every((x) => x === null)).toBe(true);
		expect(v.total.every((x) => x === null)).toBe(true);
	});

	it('should return a share (budapestShare)', () => {
		const s = derive.budapestShare(real());
		expect(round(s.at(-1), 3)).toBe(0.18);
	});

	it('should yield null on a zero total (budapestShare)', () => {
		const p = makePayload();
		for (const prio of ['P1', 'P2', 'P3', 'P4']) p.topic2.byArea['Országos'].esetszam[prio] = new Array(19).fill(0);
		const s = derive.budapestShare(buildModel(p));
		expect(s.every((v) => v === null)).toBe(true);
	});
});

describe('phaseStats', () => {
	it('should sum the averages and compute shares', () => {
		const ph = derive.phaseStats(real());
		expect(round(ph.sumAtlag)).toBe(17.3);
		expect(round(ph.dispatchAtlag)).toBe(4.9);
		expect(ph.travelAtlag).toBe(12.4);
		expect(round(ph.shares[3].share, 3)).toBe(0.717);
	});

	it('should return null without phase data', () => {
		expect(derive.phaseStats(buildModel({}))).toBeNull();
	});

	it('should leave the sum null when an average is missing', () => {
		const m = fake({
			phases: {
				month: '2026-07',
				items: [
					{ key: 'esr_cad', atlag: null },
					{ key: 'bej_erk', atlag: 12 },
				],
			},
		});
		const ph = derive.phaseStats(m);
		expect(ph.sumAtlag).toBeNull();
		expect(ph.dispatchAtlag).toBeNull();
		expect(ph.shares[0].share).toBeNull();
	});

	it('should leave travelAtlag null without a travel phase', () => {
		const m = fake({ phases: { month: '2026-07', items: [{ key: 'esr_cad', atlag: 1 }] } });
		expect(derive.phaseStats(m).travelAtlag).toBeNull();
	});
});

describe('regional selectors', () => {
	it('should sort ascending (regionSnapshotRows)', () => {
		const rows = derive.regionSnapshotRows(real(), 'P1', 'median');
		expect(rows).toHaveLength(7);
		expect(rows[0].code).toBe('DAR');
		expect(rows.at(-1).code).toBe('KMR');
	});

	it('should be empty without a snapshot (regionSnapshotRows)', () => {
		expect(derive.regionSnapshotRows(buildModel({}), 'P1', 'median')).toEqual([]);
	});

	it('should put a missing value last (regionSnapshotRows)', () => {
		const m = fake({
			topic5: {
				month: '2026-07',
				rows: [
					{ code: 'AAA', name: 'Alfa', byPriority: { P1: { median: null, p75: 1, p90: 2 } } },
					{ code: 'BBB', name: 'Beta', byPriority: { P1: { median: 5, p75: 6, p90: 7 } } },
				],
			},
		});
		const rows = derive.regionSnapshotRows(m, 'P1', 'median');
		expect(rows.map((r) => r.code)).toEqual(['BBB', 'AAA']);
	});

	it('should return a series per region (regionTrendSeries)', () => {
		const s = derive.regionTrendSeries(real(), 'P1', 'median');
		expect(s).toHaveLength(7);
		expect(s[0].values).toHaveLength(7);
	});

	it('should return an empty array for an unknown metric (regionTrendSeries)', () => {
		expect(derive.regionTrendSeries(real(), 'P1', 'nincs')[0].values).toEqual([]);
	});

	it('should compute the gap between regions (regionSpread)', () => {
		const s = derive.regionSpread(real(), 'P1', 'median');
		expect(s).toHaveLength(7);
		expect(round(s.at(-1).range)).toBe(3.26);
		expect(s.at(-1).best.code).toBe('DAR');
		expect(s.at(-1).worst.code).toBe('KMR');
	});

	it('should yield a null range for all null values (regionSpread)', () => {
		const p = makePayload();
		for (const code of ['AAA', 'BBB']) p.regioTrend.byRegion[code].median.P1 = new Array(7).fill(null);
		const s = derive.regionSpread(buildModel(p), 'P1', 'median');
		expect(s.every((x) => x.range === null && x.best === null)).toBe(true);
	});

	it('should put the largest improvement first (regionChange)', () => {
		const rows = derive.regionChange(real(), 'P1', 'median');
		expect(rows).toHaveLength(7);
		expect(rows[0].code).toBe('KMR');
		expect(round(rows[0].delta)).toBe(-1.55);
		expect(round(rows[0].pct, 3)).toBe(-0.084);
		expect(rows[0].firstYm).toBe('2026-01');
		expect(rows[0].lastYm).toBe('2026-07');
		expect(rows.at(-1).code).toBe('DAR');
	});

	it('should skip regions with fewer than two values (regionChange)', () => {
		const p = makePayload();
		p.regioTrend.byRegion.AAA.median.P1 = [1, null, null, null, null, null, null];
		const rows = derive.regionChange(buildModel(p), 'P1', 'median');
		expect(rows.map((r) => r.code)).toEqual(['BBB']);
	});

	it('should yield a null percentage on a zero baseline (regionChange)', () => {
		const p = makePayload();
		p.regioTrend.byRegion.AAA.median.P1 = [0, 0, 0, 0, 0, 0, 5];
		const row = derive.regionChange(buildModel(p), 'P1', 'median').find((r) => r.code === 'AAA');
		expect(row.pct).toBeNull();
		expect(row.delta).toBe(5);
	});
});

describe('comparing the two areas', () => {
	it('should return both areas (areaCompare)', () => {
		const a = derive.areaCompare(real(), 'P1', 'median');
		expect(a.months).toHaveLength(19);
		expect(a.orszagos.at(-1)).toBe(15.35);
		expect(a.budapest.at(-1)).toBe(15.63);
	});

	it('should return empty series for an unknown metric (areaCompare)', () => {
		expect(derive.areaCompare(real(), 'P1', 'nincs').orszagos).toEqual([]);
	});

	it('should be positive when Budapest is slower (areaGap)', () => {
		const g = derive.areaGap(real(), 'median');
		expect(round(g.byPrio.P1.at(-1))).toBe(0.28);
		expect(g.byPrio.P1.every((v) => v > 0)).toBe(true);
		expect(round(derive.areaGap(real(), 'p90').byPrio.P1.at(-1))).toBe(-1.81);
	});

	it('should yield null for a missing value (areaGap)', () => {
		const p = makePayload();
		p.topic2.byArea.Budapest.median.P1 = new Array(19).fill(null);
		const g = derive.areaGap(buildModel(p), 'median');
		expect(g.byPrio.P1.every((v) => v === null)).toBe(true);
	});
});

describe('load against response time', () => {
	it('should return one point per month (loadPoints)', () => {
		const pts = derive.loadPoints(real(), 'Országos', 'P4', 'median');
		expect(pts).toHaveLength(19);
		expect(pts[0]).toEqual({ ym: '2025-01', cases: 88408, value: 33.06 });
	});

	it('should drop incomplete months (loadPoints)', () => {
		const p = makePayload();
		p.topic2.byArea['Országos'].median.P1[0] = null;
		p.topic2.byArea['Országos'].esetszam.P2[1] = null;
		const pts = derive.loadPoints(buildModel(p), 'Országos', 'P1', 'median');
		expect(pts).toHaveLength(17);
	});

	it('should compute a Pearson coefficient (loadCorrelation)', () => {
		const rows = derive.loadCorrelation(real(), 'Országos');
		expect(rows).toHaveLength(4);
		expect(round(rows[0].median, 3)).toBe(0.158);
		expect(round(rows[3].median, 3)).toBe(0.67);
		expect(rows[0].n).toBe(19);
	});

	it('should report the smallest pair count as n (loadCorrelation)', () => {
		const p = makePayload();
		p.topic2.byArea['Országos'].p90.P1 = [...p.topic2.byArea['Országos'].p90.P1];
		p.topic2.byArea['Országos'].p90.P1[0] = null;
		p.topic2.byArea['Országos'].p90.P1[1] = null;
		const rows = derive.loadCorrelation(buildModel(p), 'Országos');
		expect(rows[0].n).toBe(17);
	});

	it('should yield a null coefficient for fewer than three pairs', () => {
		const m = fake({ monthsFrom2025: ['2026-06', '2026-07'] });
		const rows = derive.loadCorrelation(m, 'Országos');
		expect(rows[0].median).toBeNull();
		expect(rows[0].n).toBe(2);
	});

	it('should yield a null coefficient for a constant series', () => {
		const p = makePayload();
		for (const prio of ['P1', 'P2', 'P3', 'P4']) p.topic2.byArea['Országos'].esetszam[prio] = new Array(19).fill(1000);
		const rows = derive.loadCorrelation(buildModel(p), 'Országos');
		expect(rows[0].median).toBeNull();
	});
});

describe('difference between the two measurement bases', () => {
	it('should return the call handling time (dispatchSplit)', () => {
		const { month, rows } = derive.dispatchSplit(real(), 'P1', 'median');
		expect(month).toBe('2026-06');
		expect(rows).toHaveLength(7);
		const dar = rows.find((r) => r.code === 'DAR');
		expect(dar.total).toBe(13.58);
		expect(dar.fromAlarm).toBe(9.82);
		expect(round(dar.beforeAlarm)).toBe(3.76);
		expect(round(dar.share, 3)).toBe(0.277);
	});

	it('should be empty without the second measurement basis', () => {
		const m = fake({ topic4: undefined });
		expect(derive.dispatchSplit(m, 'P1', 'median')).toEqual({ month: null, rows: [] });
	});

	it('should return no rows for a month outside the period', () => {
		const p = makePayload();
		p.topic4.month = '2020-01';
		const out = derive.dispatchSplit(buildModel(p), 'P1', 'median');
		expect(out).toEqual({ month: '2020-01', rows: [] });
	});

	it('should drop rows where the two bases are inverted', () => {
		const p = makePayload();
		p.topic4.rows[0].byPriority.P1.median = 999;
		const { rows } = derive.dispatchSplit(buildModel(p), 'P1', 'median');
		expect(rows.map((r) => r.code)).toEqual(['BBB']);
	});

	it('should yield a null share on a zero total', () => {
		const p = makePayload();
		p.regioTrend.byRegion.AAA.median.P1 = new Array(7).fill(0);
		p.topic4.rows[0].byPriority.P1.median = 0;
		const { rows } = derive.dispatchSplit(buildModel(p), 'P1', 'median');
		expect(rows.find((r) => r.code === 'AAA').share).toBeNull();
	});

	it('should concatenate every priority (dispatchSplitAll)', () => {
		const rows = derive.dispatchSplitAll(real(), 'median');
		expect(rows).toHaveLength(28);
		expect(new Set(rows.map((r) => r.prio)).size).toBe(4);
	});

	it('should aggregate the rows (dispatchSummary)', () => {
		const s = derive.dispatchSummary(real(), 'P1', 'median');
		expect(s.month).toBe('2026-06');
		expect(s.fastest.code).toBe('ÉAR');
		expect(s.slowest.code).toBe('KMR');
		expect(round(s.gap)).toBe(1);
		expect(round(s.avgBeforeAlarm)).toBe(3.99);
		expect(round(s.avgShare, 3)).toBe(0.274);
	});

	it('should return null for empty rows (dispatchSummary)', () => {
		expect(derive.dispatchSummary(fake({ topic4: undefined }), 'P1', 'median')).toBeNull();
	});

	it('should cope with null shares (dispatchSummary)', () => {
		const p = makePayload();
		for (const code of ['AAA', 'BBB']) p.regioTrend.byRegion[code].median.P1 = new Array(7).fill(0);
		for (const row of p.topic4.rows) row.byPriority.P1.median = 0;
		const s = derive.dispatchSummary(buildModel(p), 'P1', 'median');
		expect(s.avgShare).toBeNull();
		expect(s.gap).toBe(0);
	});
});

describe('dispersion metrics', () => {
	it('should return the P90 over median ratio (tailRatios)', () => {
		const r = derive.tailRatios(real(), 'Országos');
		expect(round(r.byPrio.P1.at(-1))).toBe(1.72);
	});

	it('should yield null on a zero median (tailRatios)', () => {
		const p = makePayload();
		p.topic2.byArea['Országos'].median.P1 = new Array(19).fill(0);
		expect(derive.tailRatios(buildModel(p), 'Országos').byPrio.P1.every((v) => v === null)).toBe(true);
	});

	it('should return the difference (tailGaps)', () => {
		const g = derive.tailGaps(real(), 'Országos');
		expect(round(g.byPrio.P1.at(-1))).toBe(11.08);
	});

	it('should yield null for a missing value (tailGaps)', () => {
		const p = makePayload();
		p.topic2.byArea['Országos'].p90.P1 = new Array(19).fill(null);
		expect(derive.tailGaps(buildModel(p), 'Országos').byPrio.P1.every((v) => v === null)).toBe(true);
	});

	it('should sort by P90 descending (worstCells)', () => {
		const cells = derive.worstCells(real());
		expect(cells).toHaveLength(28);
		expect(cells[0].prio).toBe('P4');
		expect(cells[0].code).toBe('DAR');
		expect(cells[0].p90).toBeGreaterThan(cells[1].p90);
	});

	it('should be empty without a snapshot (worstCells)', () => {
		expect(derive.worstCells(buildModel({}))).toEqual([]);
	});

	it('should skip cells without a P90 (worstCells)', () => {
		const m = fake({
			topic5: {
				month: '2026-07',
				rows: [{ code: 'AAA', name: 'Alfa', byPriority: { P1: { median: 1, p75: 2, p90: null }, P2: { median: 3, p75: 4, p90: 9 } } }],
			},
		});
		const cells = derive.worstCells(m);
		expect(cells).toHaveLength(1);
		expect(cells[0].prio).toBe('P2');
	});
});

describe('the 15 minute band', () => {
	it.each([
		[10, 12, 14, 'over90'],
		[10, 12, 20, 'b7590'],
		[10, 20, 30, 'b5075'],
		[16, 20, 30, 'under50'],
	])('median %s, P75 %s, P90 %s -> %s', (median, p75, p90, band) => {
		expect(derive.band15(median, p75, p90)).toBe(band);
	});

	it('should yield null for a missing value', () => {
		expect(derive.band15(null, 1, 2)).toBeNull();
		expect(derive.band15(1, null, 2)).toBeNull();
		expect(derive.band15(1, 2, null)).toBeNull();
	});

	it('should classify every month (band15Series)', () => {
		const s = derive.band15Series(real(), 'Országos', 'P1');
		expect(s).toHaveLength(19);
		expect(s.at(-1)).toEqual({ ym: '2026-07', band: 'under50' });
	});
});

describe('memoisation', () => {
	it('should use a separate key per parameter set', () => {
		const m = real();
		expect(derive.dispatchSplit(m, 'P1', 'median')).toBe(derive.dispatchSplit(m, 'P1', 'median'));
		expect(derive.dispatchSplit(m, 'P2', 'median')).not.toBe(derive.dispatchSplit(m, 'P1', 'median'));
		expect(derive.caseSeries(m, 'Országos')).not.toBe(derive.caseSeries(m, 'Budapest'));
	});

	it('should keep a separate cache per model', () => {
		expect(derive.caseSeries(real(), 'Országos')).not.toBe(derive.caseSeries(real(), 'Országos'));
	});
});

describe('MONTHS fixture', () => {
	it('should be the tail of the long one (the short list)', () => {
		expect(MONTHS.short).toEqual(MONTHS.long.slice(12));
	});
});
