import { describe, expect, it } from 'vitest';
import { PHASE_ORDER, buildModel } from '../../src/data/model.js';
import { makePayload, realPayload, MONTHS } from '../helpers.js';

const warnKeys = (model) => model.meta.warnings.map((w) => w.key);

describe('buildModel on the live payload', () => {
	const model = buildModel(realPayload());

	it('should copy the meta fields across', () => {
		expect(model.meta.updatedDate).toBe('2026-08-25');
		expect(model.meta.latestMonth).toBe('2026-07');
		expect(model.meta.prevMonth).toBe('2026-06');
		expect(model.meta.latestIsPreliminary).toBe(true);
		expect(model.meta.monthsLong).toHaveLength(19);
		expect(model.meta.months).toHaveLength(7);
		expect(model.meta.priorities).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(model.meta.areas).toEqual(['Országos', 'Budapest']);
		expect(model.meta.regions).toHaveLength(7);
		expect(model.meta.range).toEqual({ from: '2025-01', to: '2026-07' });
	});

	it('should turn generatedAt into a Date', () => {
		expect(model.meta.generatedAt).toBeInstanceOf(Date);
		expect(model.meta.generatedAt.toISOString()).toBe('2026-08-25T11:52:39.424Z');
	});

	it('should warn about preliminary data and nothing else', () => {
		expect(warnKeys(model)).toEqual(['warn.preliminary']);
		expect(model.meta.warnings[0]).toMatchObject({ severity: 'info', tab: 'attekintes' });
	});

	it('should build the long series from topic2, not from the truncated topic3', () => {
		const p1 = model.series.byArea['Országos'].median.P1;
		expect(p1).toHaveLength(19);
		expect(p1[0]).toBe(16.2);
		expect(p1[18]).toBe(15.35);
	});

	it('should load case numbers per area as well', () => {
		expect(model.series.byArea.Budapest.esetszam.P1).toHaveLength(19);
		expect(model.series.byArea['Országos'].esetszam.P1.at(-1)).toBe(12123);
	});

	it('should fill the regional series with its own month list', () => {
		expect(model.regionTrend.months).toHaveLength(7);
		expect(model.regionTrend.byRegion.DAR.median.P1).toHaveLength(7);
	});

	it('should order the phases and keep all four metrics', () => {
		expect(model.phases.items.map((i) => i.key)).toEqual(PHASE_ORDER);
		expect(model.phases.items[0]).toEqual({ key: 'esr_cad', atlag: 1.4, median: 1.07, p75: 1.45, p90: 2.17 });
		expect(model.phases.total).toBe(17.22);
		expect(model.phases.esetszam).toBe(12123);
	});

	it('should read both regional snapshots', () => {
		expect(model.regionSnapshot.month).toBe('2026-07');
		expect(model.regionSnapshotAlt.month).toBe('2026-06');
		expect(model.regionSnapshot.rows).toHaveLength(7);
		expect(model.regionSnapshotAlt.rows).toHaveLength(7);
	});

	it('should copy the KPI block across', () => {
		expect(model.kpi.priorityLabel).toBe('P1');
		expect(model.kpi.items[0]).toEqual({ area: 'Országos', p90: 26.43, p90Prev: 25.97, esetszam: 12123 });
	});

	it('should index regions by code as well', () => {
		expect(model.regionsByCode.get('KMR').name).toBe('Közép-magyarországi');
	});
});

describe('buildModel on incomplete input', () => {
	it('should build a valid model from an empty object', () => {
		const model = buildModel({});
		expect(model.meta.months).toEqual([]);
		expect(model.meta.monthsLong).toEqual([]);
		expect(model.meta.priorities).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(model.meta.areas).toEqual(['Országos', 'Budapest']);
		expect(model.meta.regions).toEqual([]);
		expect(model.meta.latestMonth).toBeNull();
		expect(model.meta.prevMonth).toBeNull();
		expect(model.meta.range).toBeNull();
		expect(model.meta.generatedAt).toBeNull();
		expect(model.kpi).toBeNull();
		expect(model.phases).toBeNull();
		expect(model.regionSnapshot).toBeNull();
		expect(model.regionSnapshotAlt).toBeNull();
	});

	it('should warn when topic2 is missing', () => {
		const model = buildModel(makePayload({ topic2: {} }));
		expect(warnKeys(model)).toContain('warn.seriesMissing');
	});

	it('should warn about a missing regional series when regions exist', () => {
		const model = buildModel(makePayload({ regioTrend: { months: [] } }));
		expect(warnKeys(model)).toContain('warn.regionMissing');
	});

	it('should not warn about the regional series without regions', () => {
		const model = buildModel(makePayload({ meta: { regions: [] }, regioTrend: {} }));
		expect(warnKeys(model)).not.toContain('warn.regionMissing');
	});

	it.each([
		['missing block', undefined],
		['empty items', { month: '2026-07', items: [] }],
		['items is not an array', { month: '2026-07', items: 'x' }],
	])('phases: warns and yields null when %s', (_name, phases) => {
		const model = buildModel(makePayload({ phases }));
		expect(model.phases).toBeNull();
		expect(warnKeys(model)).toContain('warn.phasesMissing');
	});

	it('should drop unknown phase keys', () => {
		const model = buildModel(makePayload({
			phases: {
				month: '2026-07',
				items: [
					{ key: 'unknown', atlag: 1 },
					{ key: 'bej_erk', atlag: 12 },
				],
			},
		}));
		expect(model.phases.items.map((i) => i.key)).toEqual(['bej_erk']);
	});

	it('should fall back to sum when total is missing', () => {
		const model = buildModel(makePayload({
			phases: { ...makePayload().phases, total: undefined, sum: 17.3 },
		}));
		expect(model.phases.total).toBe(17.3);
	});

	it('should not warn about final data', () => {
		const model = buildModel(makePayload({ meta: { latestIsPreliminary: false } }));
		expect(warnKeys(model)).not.toContain('warn.preliminary');
	});

	it('should emit no warning for a preliminary flag without latestMonth', () => {
		const model = buildModel({
			meta: { latestIsPreliminary: true, months: [], monthsFrom2025: [] },
			topic2: { byArea: {} },
			regioTrend: { byRegion: {} },
		});
		expect(warnKeys(model)).not.toContain('warn.preliminary');
	});
});

describe('buildModel input sanitising', () => {
	it('should drop an invalid month format', () => {
		const model = buildModel(makePayload({ meta: { months: ['2026-1', 'bad'] } }));
		expect(model.meta.months).toEqual([]);
	});

	it('should drop a month list that is not an array', () => {
		const model = buildModel(makePayload({ meta: { months: 'x', monthsFrom2025: 'y' } }));
		expect(model.meta.months).toEqual([]);
		expect(model.meta.monthsLong).toEqual([]);
	});

	it('should fall back to months when monthsFrom2025 is missing', () => {
		const model = buildModel(makePayload({ meta: { monthsFrom2025: undefined } }));
		expect(model.meta.monthsLong).toEqual(MONTHS.short);
	});

	it('should drop invalid priorities and fall back to the default set', () => {
		expect(buildModel(makePayload({ meta: { priorities: ['P9', 'xx'] } })).meta.priorities)
			.toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(buildModel(makePayload({ meta: { priorities: ['P1', 'P5'] } })).meta.priorities)
			.toEqual(['P1', 'P5']);
	});

	it('should use the default areas for an empty area list', () => {
		expect(buildModel(makePayload({ meta: { areas: [] } })).meta.areas).toEqual(['Országos', 'Budapest']);
	});

	it('should strip markup characters from region names and truncate them', () => {
		const model = buildModel(makePayload({
			meta: {
				regions: [
					{ code: '<a>X', name: 'A' + '"'.repeat(3) + 'B'.repeat(80) },
					{ code: '', name: 'no code' },
					{ code: 'Y', name: '' },
					null,
				],
			},
		}));
		expect(model.meta.regions).toHaveLength(1);
		expect(model.meta.regions[0].code).toBe('aX');
		expect(model.meta.regions[0].name).toHaveLength(60);
	});

	it('should turn non numeric values into null', () => {
		const model = buildModel(makePayload({
			topic1: { month: '2026-07', items: [{ area: 'Országos', p90: 'sok', p90Prev: null, esetszam: Number.NaN }] },
		}));
		expect(model.kpi.items[0]).toEqual({ area: 'Országos', p90: null, p90Prev: null, esetszam: null });
	});

	it('should leave the KPI null when topic1 items are missing', () => {
		expect(buildModel(makePayload({ topic1: { month: '2026-07' } })).kpi).toBeNull();
	});

	it('should leave generatedAt null when it is invalid', () => {
		expect(buildModel(makePayload({ meta: { generatedAt: 'nem datum' } })).meta.generatedAt).toBeNull();
	});

	it('should fill a missing area series with nulls', () => {
		const model = buildModel(makePayload({
			topic2: { months: MONTHS.long, byArea: { 'Országos': { median: { P1: [1] } } } },
		}));
		expect(model.series.byArea.Budapest.median.P1).toHaveLength(19);
		expect(model.series.byArea.Budapest.median.P1.every((v) => v === null)).toBe(true);
		expect(model.series.byArea['Országos'].median.P1[0]).toBe(1);
		expect(model.series.byArea['Országos'].median.P1[1]).toBeNull();
	});

	it('should return null for empty snapshot rows', () => {
		expect(buildModel(makePayload({ topic5: { month: '2026-07', rows: [] } })).regionSnapshot).toBeNull();
		expect(buildModel(makePayload({ topic4: { rows: 'x' } })).regionSnapshotAlt).toBeNull();
	});

	it('should return an empty object when byPriority is missing', () => {
		const model = buildModel(makePayload({
			topic5: { month: '2026-07', rows: [{ code: 'AAA', name: 'Alfa' }] },
		}));
		expect(model.regionSnapshot.rows[0].byPriority).toEqual({});
	});

	it('should leave the snapshot month null when absent', () => {
		const model = buildModel(makePayload({
			topic5: { rows: [{ code: 'AAA', name: 'Alfa', byPriority: { P1: { median: 1, p75: 2, p90: 3 } } }] },
		}));
		expect(model.regionSnapshot.month).toBeNull();
	});
});
