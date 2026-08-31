import { beforeAll, describe, expect, it } from 'vitest';
import * as trendek from '../../src/features/trendek.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, flush, makePayload, realPayload, renderPanel, seriesOf, tableRows, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());
const seg = (el, key, val) => {
	el.querySelector(`[data-seg="${key}"] [data-val="${val}"]`).click();
	return flush();
};

beforeAll(warmCharts);

describe('response times on the live payload', () => {
	it('should show three selectors and four KPI cards', async () => {
		const el = await renderPanel(trendek, real());
		expect([...el.querySelectorAll('[data-seg]')].map((n) => n.dataset.seg)).toEqual([
			'holamento-trendek-area',
			'holamento-trendek-metric',
			'holamento-trendek-prio',
		]);
		expect(el.querySelectorAll('.stat')).toHaveLength(4);
	});

	it('should show all four priorities over 19 months (the main chart)', async () => {
		await renderPanel(trendek, real());
		const s = seriesOf('ch-tre-fo');
		expect(s.map((x) => x.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(s[0].data).toHaveLength(19);
		expect(s[0].data.at(-1)).toBe(15.35);
	});

	it('should show a single priority (the three metric chart)', async () => {
		await renderPanel(trendek, real());
		const s = seriesOf('ch-tre-spread');
		expect(s.map((x) => x.name)).toEqual(['Medián', 'P75', 'P90']);
		expect(s.map((x) => x.data.at(-1))).toEqual([15.35, 20.3, 26.43]);
	});

	it('should show two series (the area comparison)', async () => {
		await renderPanel(trendek, real());
		const s = seriesOf('ch-tre-area');
		expect(s.map((x) => x.name)).toEqual(['Országos', 'Budapest']);
		expect(s[0].data.at(-1)).toBe(15.35);
		expect(s[1].data.at(-1)).toBe(15.63);
		expect(s[0].data).toHaveLength(19);
	});

	it('should carry the 15 minute line on all three time charts', async () => {
		await renderPanel(trendek, real());
		for (const id of ['ch-tre-fo', 'ch-tre-spread', 'ch-tre-area']) {
			expect(chartFor(id).annotations.yaxis[0].y).toBe(15);
		}
	});

	it('should contrast two years (the year over year chart)', async () => {
		await renderPanel(trendek, real());
		const s = seriesOf('ch-tre-yoy');
		expect(s.map((x) => x.name)).toEqual(['2025', '2026']);
		expect(s[0].data).toHaveLength(4);
	});

	it('should also print the change in the year over year table', async () => {
		const el = await renderPanel(trendek, real());
		const rows = tableRows(el, 0);
		expect(rows).toHaveLength(4);
		expect(rows[0][0]).toBe('P1');
		expect(rows[0][1]).toContain('15,4 perc');
		expect(rows[0][3]).toMatch(/[+-]/);
		expect(rows[0][3]).toContain('%');
	});

	it('should also give a band classification in the monthly table', async () => {
		const el = await renderPanel(trendek, real());
		const rows = tableRows(el, 1);
		expect(rows).toHaveLength(10);
		expect(rows[0][0]).toContain('2026');
		expect(rows[0].at(-1)).toBe('kevesebb mint 50%');
	});
});

describe('response time selectors', () => {
	it('should recompute the chart when the area changes', async () => {
		const el = await renderPanel(trendek, real());
		expect(seriesOf('ch-tre-fo')[0].data.at(-1)).toBe(15.35);
		await seg(el, 'holamento-trendek-area', 'Budapest');
		expect(seriesOf('ch-tre-fo')[0].data.at(-1)).toBe(15.63);
		expect(localStorage.getItem('holamento-trendek-area')).toBe('Budapest');
	});

	it('should swap the series when the metric changes', async () => {
		const el = await renderPanel(trendek, real());
		await seg(el, 'holamento-trendek-metric', 'p90');
		expect(seriesOf('ch-tre-fo')[0].data.at(-1)).toBe(26.43);
		expect(texts(el, '.stat')[0]).toContain('P90');
	});

	it('should affect only the metric and area charts when the priority changes', async () => {
		const el = await renderPanel(trendek, real());
		await seg(el, 'holamento-trendek-prio', 'P4');
		expect(seriesOf('ch-tre-spread').map((x) => x.data.at(-1))).toEqual([34.3, 56.98, 91.57]);
		expect(seriesOf('ch-tre-area')[0].data.at(-1)).toBe(34.3);
		expect(seriesOf('ch-tre-fo').map((x) => x.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
	});

	it('should start from the stored selection', async () => {
		localStorage.setItem('holamento-trendek-metric', 'p75');
		const el = await renderPanel(trendek, real());
		expect(texts(el, '.stat')[0]).toContain('P75');
		expect(seriesOf('ch-tre-fo')[0].data.at(-1)).toBe(20.3);
	});
});

describe('response times on incomplete data', () => {
	it('should turn every card into an empty state without a series', async () => {
		const el = await renderPanel(trendek, buildModel(makePayload({ monthsFrom2025: [] })));
		const cards = el.querySelectorAll('.grid12 > .card');
		expect(cards.length).toBeGreaterThan(0);
		expect(el.querySelectorAll('.grid12 > .card .empty-state')).toHaveLength(cards.length);
		expect(el.querySelectorAll('.stat')).toHaveLength(0);
		expect(chartFor('ch-tre-fo')).toBeNull();
		expect(chartFor('ch-tre-spread')).toBeNull();
	});

	it('should have no year over year comparison for a single year', async () => {
		const f = filterModel(real(), '2026-01', '2026-07');
		const el = await renderPanel(trendek, f);
		expect(chartFor('ch-tre-yoy')).toBeNull();
		expect(texts(el, '.empty-state').some((t) => t.includes('Éves'))).toBe(true);
	});

	it('should show an empty state for an all null series', async () => {
		const p = makePayload();
		for (const met of ['median', 'p75', 'p90']) {
			for (const prio of ['P1', 'P2', 'P3', 'P4']) {
				p.topic2.byArea['Országos'][met][prio] = new Array(19).fill(null);
			}
		}
		const el = await renderPanel(trendek, buildModel(p));
		expect(chartFor('ch-tre-spread')).toBeNull();
		expect(texts(el, '.empty-state').length).toBeGreaterThan(0);
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(trendek, buildModel({}));
		expect(el.querySelector('.error-text')).toBeNull();
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThan(0);
	});
});
