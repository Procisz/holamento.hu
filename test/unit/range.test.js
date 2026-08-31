import { describe, expect, it } from 'vitest';
import { buildModel } from '../../src/data/model.js';
import { filterModel, modelBounds } from '../../src/data/range.js';
import * as derive from '../../src/data/derive.js';
import { makePayload, realPayload } from '../helpers.js';

const real = () => buildModel(realPayload());

describe('modelBounds', () => {
	it('should return the bounds of the long series', () => {
		expect(modelBounds(real())).toEqual({ min: '2025-01', max: '2026-07' });
	});

	it('should return null without months', () => {
		expect(modelBounds(buildModel({}))).toBeNull();
		expect(modelBounds(null)).toBeNull();
		expect(modelBounds({})).toBeNull();
	});
});

describe('filterModel', () => {
	it('should narrow the months and recompute the meta block', () => {
		const f = filterModel(real(), '2026-05', '2026-07');
		expect(f.series.months).toEqual(['2026-05', '2026-06', '2026-07']);
		expect(f.meta.monthsLong).toEqual(['2026-05', '2026-06', '2026-07']);
		expect(f.meta.months).toEqual(['2026-05', '2026-06', '2026-07']);
		expect(f.meta.latestMonth).toBe('2026-07');
		expect(f.meta.prevMonth).toBe('2026-06');
		expect(f.meta.range).toEqual({ from: '2026-05', to: '2026-07' });
	});

	it('should trim every series to the same length', () => {
		const f = filterModel(real(), '2026-05', '2026-07');
		expect(f.series.byArea['Országos'].median.P1).toEqual([15.35, 15.23, 15.35]);
		expect(f.series.byArea['Országos'].esetszam.P1).toHaveLength(3);
		expect(f.regionTrend.months).toEqual(['2026-05', '2026-06', '2026-07']);
		expect(f.regionTrend.byRegion.DAR.median.P1).toHaveLength(3);
	});

	it('should keep the original model under full', () => {
		const base = real();
		const f = filterModel(base, '2026-05', '2026-07');
		expect(f.full).toBe(base);
		expect(f.full.series.months).toHaveLength(19);
	});

	it('should filter from the original on repeated calls', () => {
		const base = real();
		const once = filterModel(base, '2026-01', '2026-07');
		const twice = filterModel(once, '2025-01', '2026-07');
		expect(twice.series.months).toHaveLength(19);
		expect(twice.full).toBe(base);
	});

	it('should return the original model for an empty intersection', () => {
		const base = real();
		expect(filterModel(base, '2030-01', '2030-12')).toBe(base);
	});

	it('should have no previous month for a single month period', () => {
		const f = filterModel(real(), '2026-07', '2026-07');
		expect(f.meta.prevMonth).toBeNull();
		expect(f.kpi.items[0].p90Prev).toBeNull();
	});

	it('should recompute the KPI from the series', () => {
		const f = filterModel(real(), '2026-05', '2026-06');
		expect(f.kpi.month).toBe('2026-06');
		expect(f.kpi.priorityLabel).toBe('P1');
		expect(f.kpi.items.map((i) => i.area)).toEqual(['Országos', 'Budapest']);
		expect(f.kpi.items[0].p90).toBe(25.97);
		expect(f.kpi.items[0].esetszam).toBe(11749);
	});

	it('should keep the preliminary flag only for the real last month', () => {
		expect(filterModel(real(), '2026-05', '2026-07').meta.latestIsPreliminary).toBe(true);
		expect(filterModel(real(), '2026-04', '2026-06').meta.latestIsPreliminary).toBe(false);
	});

	it('should drop phases that fall outside the period', () => {
		expect(filterModel(real(), '2026-05', '2026-07').phases).not.toBeNull();
		expect(filterModel(real(), '2026-01', '2026-03').phases).toBeNull();
	});

	it('should keep the second measurement basis only inside the period', () => {
		expect(filterModel(real(), '2026-05', '2026-07').regionSnapshotAlt.month).toBe('2026-06');
		expect(filterModel(real(), '2026-07', '2026-07').regionSnapshotAlt).toBeNull();
	});

	it('should reuse the original snapshot when the month matches', () => {
		const base = real();
		const f = filterModel(base, '2026-05', '2026-07');
		expect(f.regionSnapshot).toBe(base.regionSnapshot);
	});

	it('should build a snapshot from the regional series for another end month', () => {
		const f = filterModel(real(), '2026-01', '2026-05');
		expect(f.regionSnapshot.month).toBe('2026-05');
		expect(f.regionSnapshot.rows).toHaveLength(7);
		const dar = f.regionSnapshot.rows.find((r) => r.code === 'DAR');
		expect(dar.byPriority.P1.median).toBe(13.52);
	});

	it('should have no snapshot without regions', () => {
		const p = makePayload({ meta: { regions: [] } });
		const f = filterModel(buildModel(p), '2026-01', '2026-05');
		expect(f.regionSnapshot).toBeNull();
	});

	it('should have no snapshot when every regional value is null', () => {
		const p = makePayload();
		for (const code of ['AAA', 'BBB']) {
			for (const met of ['median', 'p75', 'p90']) {
				for (const prio of ['P1', 'P2', 'P3', 'P4']) {
					p.regioTrend.byRegion[code][met][prio] = new Array(7).fill(null);
				}
			}
		}
		const f = filterModel(buildModel(p), '2026-01', '2026-05');
		expect(f.regionSnapshot).toBeNull();
	});

	it('should skip an area missing from the series', () => {
		const m = real();
		m.meta.areas = [...m.meta.areas, 'Nincs'];
		const f = filterModel(m, '2026-01', '2026-05');
		expect(f.kpi.items.map((i) => i.area)).toEqual(['Országos', 'Budapest']);
	});

	it('should have no KPI when no area is present in the series', () => {
		const m = real();
		m.meta.areas = ['Nincs'];
		expect(filterModel(m, '2026-01', '2026-05').kpi).toBeNull();
	});

	it('should have no KPI without priorities', () => {
		const m = buildModel({
			meta: { priorities: ['P9'], months: [], monthsFrom2025: ['2026-01', '2026-02'] },
			topic2: { byArea: {} },
			regioTrend: { byRegion: {} },
		});
		m.meta.priorities = [];
		expect(filterModel(m, '2026-01', '2026-02').kpi).toBeNull();
	});

	it('should use the first priority when P1 is absent', () => {
		const p = makePayload({ meta: { priorities: ['P2', 'P3'] } });
		const f = filterModel(buildModel(p), '2026-01', '2026-05');
		expect(f.kpi.priorityLabel).toBe('P2');
	});

	it('should give the filtered model a fresh memo identity', () => {
		const base = real();
		const a = derive.caseSeries(base, 'Országos');
		const f = filterModel(base, '2026-05', '2026-07');
		const b = derive.caseSeries(f, 'Országos');
		expect(b).not.toBe(a);
		expect(b.months).toHaveLength(3);
	});

	it('should keep the selectors consistent on the filtered model', () => {
		const f = filterModel(real(), '2026-05', '2026-07');
		expect(derive.longSeries(f, 'Országos').months).toHaveLength(3);
		expect(derive.momTable(f, 'Országos')).toHaveLength(4);
		expect(derive.regionTrendSeries(f, 'P1', 'median')[0].values).toHaveLength(3);
		expect(derive.yoyYears(f, 'Országos')).toBeNull();
	});
});
