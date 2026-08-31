import { beforeAll, describe, expect, it, vi } from 'vitest';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import * as derive from '../../src/data/derive.js';
import { cell, dataTable } from '../../src/ui/table.js';
import * as bontas from '../../src/features/bontas.js';
import * as esetszamok from '../../src/features/esetszamok.js';
import { chartFor, flush, makePayload, mount, realPayload, renderPanel, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());

beforeAll(warmCharts);

describe('year over year pairing with gaps', () => {
	it('should skip a current year month that has no counterpart', () => {
		const months = ['2025-01', '2025-02', '2026-01', '2026-02', '2026-03'];
		const model = buildModel(makePayload({ monthsFrom2025: months }));
		const pairs = derive.yoyPairs(model, 'Országos', 'median', 'P1');
		expect(pairs.map((p) => p.month)).toEqual([1, 2]);
	});

	it('should drop the case comparison when the previous year is absent', async () => {
		const months = ['2024-06', '2026-06', '2026-07'];
		const model = buildModel(makePayload({ monthsFrom2025: months }));
		const el = await renderPanel(esetszamok, model);
		expect(texts(el, '.stat')[3]).not.toMatch(/%\s*$/);
	});

	it('should drop the case comparison when no month overlaps', async () => {
		const months = ['2025-01', '2025-02', '2026-06', '2026-07'];
		const model = buildModel(makePayload({ monthsFrom2025: months }));
		const el = await renderPanel(esetszamok, model);
		expect(texts(el, '.stat')[3]).toBeDefined();
	});

	it('should drop the case comparison when the previous year total is zero', async () => {
		const p = makePayload();
		for (const prio of ['P1', 'P2', 'P3', 'P4']) {
			p.topic2.byArea['Országos'].esetszam[prio] = p.meta.monthsFrom2025.map((ym) => (ym.startsWith('2025') ? 0 : 100));
		}
		const el = await renderPanel(esetszamok, buildModel(p));
		expect(texts(el, '.stat')[3]).toBeDefined();
	});
});

describe('case totals without priorities', () => {
	it('should yield null totals when the model lists no priority', () => {
		const model = buildModel(makePayload());
		model.meta.priorities = [];
		const c = derive.caseSeries(model, 'Országos');
		expect(c.total.every((v) => v === null)).toBe(true);
	});
});

describe('filtered snapshot with a missing region', () => {
	it('should skip a region that has no series', () => {
		const model = real();
		model.meta.regions = [...model.meta.regions, { code: 'ZZZ', name: 'Unknown' }];
		const f = filterModel(model, '2026-01', '2026-05');
		expect(f.regionSnapshot.rows.map((r) => r.code)).not.toContain('ZZZ');
		expect(f.regionSnapshot.rows).toHaveLength(7);
	});
});

describe('split share chart with a missing share', () => {
	it('should plot a null bar when the share cannot be computed', async () => {
		const p = makePayload();
		p.regioTrend.byRegion.AAA.median.P1 = new Array(7).fill(0);
		for (const row of p.topic4.rows) {
			if (row.code === 'AAA') row.byPriority.P1.median = 0;
		}
		await renderPanel(bontas, buildModel(p));
		const data = chartFor('ch-bon-share').series[0].data;
		expect(data).toContain(null);
	});
});

describe('table hydration and collapse edge cases', () => {
	const COLS = [{ key: 'name', label: 'Name' }];
	const ROWS = [{ name: cell('a', 'a') }, { name: cell('b', 'b') }];
	const EXPAND = {
		key: (r) => r.name.v,
		render: (row, host) => {
			host.textContent = `${row.name.v} details`;
		},
	};

	it('should give up when the holder never reaches the document', async () => {
		const markup = dataTable({ columns: COLS, rows: ROWS });
		await flush();
		await flush();
		const el = document.createElement('div');
		el.innerHTML = markup;
		expect(el.querySelector('table')).toBeNull();
	});

	it('should collapse at once when the panel element is gone', async () => {
		const el = mount();
		el.innerHTML = dataTable({ columns: COLS, rows: ROWS, expand: { ...EXPAND, defaultOpen: ['a'] } });
		await flush();
		expect(el.querySelector('.dt-panel-content')).not.toBeNull();
		for (const node of el.querySelectorAll('.dt-panel-content')) node.remove();
		el.querySelector('tr.dt-row').click();
		await flush();
		expect(el.querySelector('.dt-panel-content')).toBeNull();
	});

	it('should ignore a stale transition after the row was reopened', async () => {
		vi.useFakeTimers();
		const el = mount();
		el.innerHTML = dataTable({ columns: COLS, rows: ROWS, expand: EXPAND });
		await vi.advanceTimersByTimeAsync(20);
		el.querySelector('tr.dt-row').click();
		await vi.advanceTimersByTimeAsync(20);
		const wrap = el.querySelector('.expand-wrap');
		el.querySelector('tr.dt-row').click();
		el.querySelector('tr.dt-row').click();
		await vi.advanceTimersByTimeAsync(20);
		wrap.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'grid-template-rows' }));
		await vi.advanceTimersByTimeAsync(400);
		expect(el.querySelector('.dt-panel-content')).not.toBeNull();
		vi.useRealTimers();
	});

	it('should drop a row that vanished from the visible page before the panel rendered', async () => {
		const el = mount();
		el.innerHTML = dataTable({
			columns: COLS,
			rows: ROWS,
			pageSize: 1,
			expand: { ...EXPAND, defaultOpen: ['b'] },
		});
		await flush();
		expect(el.querySelector('.dt-panel-content')).toBeNull();
		expect(el.querySelectorAll('tr.dt-row')).toHaveLength(1);
	});

	it('should clear a pending collapse when the table re-renders', async () => {
		vi.useFakeTimers();
		const el = mount();
		el.innerHTML = dataTable({ columns: COLS, rows: ROWS, expand: EXPAND });
		await vi.advanceTimersByTimeAsync(20);
		el.querySelector('tr.dt-row').click();
		await vi.advanceTimersByTimeAsync(20);
		expect(el.querySelector('.dt-panel-content')).not.toBeNull();
		el.querySelector('tr.dt-row').click();
		el.querySelector('th.th-sort').click();
		await vi.advanceTimersByTimeAsync(400);
		expect(el.querySelector('.dt-panel-content')).toBeNull();
		expect(el.querySelectorAll('tr.dt-row')).toHaveLength(2);
		vi.useRealTimers();
	});

	it('should escape quotes in a row identifier', async () => {
		const el = mount();
		el.innerHTML = dataTable({
			columns: COLS,
			rows: [{ name: cell('a"b', 'a"b') }],
			expand: EXPAND,
		});
		await flush();
		expect(el.querySelector('tr.dt-row').dataset.rowId).toBe('a"b');
	});

	it('should keep the chevron intact when the row markup lost it', async () => {
		const el = mount();
		el.innerHTML = dataTable({ columns: COLS, rows: ROWS, expand: EXPAND });
		await flush();
		el.querySelector('tr.dt-row').click();
		await flush();
		for (const chev of el.querySelectorAll('.dt-chevron')) chev.remove();
		el.querySelector('tr.dt-row').click();
		await flush();
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
