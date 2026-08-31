import { beforeAll, describe, expect, it } from 'vitest';
import * as esetszamok from '../../src/features/esetszamok.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, flush, makePayload, realPayload, renderPanel, seriesOf, tableRows, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());
const seg = (el, key, val) => {
	el.querySelector(`[data-seg="${key}"] [data-val="${val}"]`).click();
	return flush();
};
const nbsp = (s) => s.replace(/[   ]/g, ' ');

beforeAll(warmCharts);

describe('case numbers on the live payload', () => {
	it('should report the monthly total and the daily average', async () => {
		const el = await renderPanel(esetszamok, real());
		const cards = texts(el, '.stat').map(nbsp);
		expect(cards).toHaveLength(4);
		expect(cards[0]).toContain('94 930');
		expect(cards[1]).toContain('3062');
	});

	it('should report the P1 share and the year over year change', async () => {
		const el = await renderPanel(esetszamok, real());
		const cards = texts(el, '.stat').map(nbsp);
		expect(cards[2]).toContain('12,8%');
		expect(cards[3]).toMatch(/[+-]\d/);
	});

	it('should stack the four priorities (the monthly chart)', async () => {
		await renderPanel(esetszamok, real());
		const opts = chartFor('ch-ese-havi');
		expect(opts.chart.stacked).toBe(true);
		const s = seriesOf('ch-ese-havi');
		expect(s.map((x) => x.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(s[0].data).toHaveLength(19);
		expect(s[0].data.at(-1)).toBe(12123);
	});

	it('should divide by the length of the month (the per day chart)', async () => {
		await renderPanel(esetszamok, real());
		const data = seriesOf('ch-ese-napi')[0].data;
		expect(data).toHaveLength(19);
		expect(data.at(-1)).toBe(3062);
	});

	it('should be a full height stack (the mix chart)', async () => {
		await renderPanel(esetszamok, real());
		expect(chartFor('ch-ese-mix').chart.stackType).toBe('100%');
		expect(seriesOf('ch-ese-mix')[0].data.at(-1)).toBeCloseTo(12.8, 1);
	});

	it('should use percentages (the Budapest share chart)', async () => {
		await renderPanel(esetszamok, real());
		expect(seriesOf('ch-ese-bp')[0].data.at(-1)).toBeCloseTo(18, 1);
	});

	it('should plot one point per month (the scatter)', async () => {
		await renderPanel(esetszamok, real());
		const opts = chartFor('ch-ese-terheles');
		expect(opts.chart.type).toBe('scatter');
		expect(opts.series[0].data).toHaveLength(19);
		expect(opts.series[0].data[0]).toEqual([88408, 16.2]);
	});

	it('should report a coefficient per priority (the correlation table)', async () => {
		const el = await renderPanel(esetszamok, real());
		const rows = tableRows(el, 1);
		expect(rows).toHaveLength(4);
		expect(rows[0][0]).toContain('P1');
		expect(rows[0][1]).toBe('0,16');
		expect(rows[3][1]).toBe('0,67');
	});

	it('should total every priority (the case table)', async () => {
		const el = await renderPanel(esetszamok, real());
		const rows = tableRows(el, 0).map((r) => r.map(nbsp));
		expect(rows).toHaveLength(5);
		expect(rows.at(-1)[1]).toBe('94 930');
		expect(rows.at(-1)[2]).toBe('100%');
	});
});

describe('case number selectors', () => {
	it('should recompute the charts when switching to Budapest', async () => {
		const el = await renderPanel(esetszamok, real());
		await seg(el, 'holamento-esetszamok-area', 'budapest');
		expect(seriesOf('ch-ese-havi')[0].data.at(-1)).toBe(2408);
		expect(texts(el, '.stat')[0]).toContain('Budapest');
	});

	it('should keep the case charts but drop the response time ones for the rural area', async () => {
		const el = await renderPanel(esetszamok, real());
		await seg(el, 'holamento-esetszamok-area', 'videk');
		expect(seriesOf('ch-ese-havi')[0].data.at(-1)).toBe(12123 - 2408);
		expect(chartFor('ch-ese-terheles')).toBeNull();
		expect(el.textContent).toContain('nem számolható ki');
	});

	it('should recompute the scatter when the priority changes', async () => {
		const el = await renderPanel(esetszamok, real());
		await seg(el, 'holamento-esetszamok-prio', 'P4');
		expect(chartFor('ch-ese-terheles').series[0].data[0]).toEqual([88408, 33.06]);
	});

	it('should start from the stored area', async () => {
		localStorage.setItem('holamento-esetszamok-area', 'budapest');
		const el = await renderPanel(esetszamok, real());
		expect(texts(el, '.stat')[0]).toContain('Budapest');
	});
});

describe('case numbers without data', () => {
	it('should show empty states without a series', async () => {
		const el = await renderPanel(esetszamok, buildModel(makePayload({ monthsFrom2025: [] })));
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThan(0);
		expect(chartFor('ch-ese-havi')).toBeNull();
	});

	it('should render no year over year card for a single year', async () => {
		const f = filterModel(real(), '2026-01', '2026-07');
		const el = await renderPanel(esetszamok, f);
		expect(texts(el, '.stat')[3]).not.toMatch(/^\+?\d+,\d%$/);
	});

	it('should render no Budapest share chart without Budapest data', async () => {
		const p = makePayload();
		for (const prio of ['P1', 'P2', 'P3', 'P4']) p.topic2.byArea.Budapest.esetszam[prio] = new Array(19).fill(null);
		await renderPanel(esetszamok, buildModel(p));
		expect(chartFor('ch-ese-bp')).toBeNull();
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(esetszamok, buildModel({}));
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
