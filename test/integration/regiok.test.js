import { beforeAll, describe, expect, it } from 'vitest';
import * as regiok from '../../src/features/regiok.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, flush, makePayload, realPayload, renderPanel, seriesOf, tableRows, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());
const seg = (el, key, val) => {
	el.querySelector(`[data-seg="${key}"] [data-val="${val}"]`).click();
	return flush();
};

beforeAll(warmCharts);

describe('regions on the live payload', () => {
	it('should name the fastest and the slowest region', async () => {
		const el = await renderPanel(regiok, real());
		const cards = texts(el, '.stat');
		expect(cards).toHaveLength(4);
		expect(cards[0]).toContain('13,7 perc');
		expect(cards[0]).toContain('Dél-alföldi');
		expect(cards[1]).toContain('17,0 perc');
		expect(cards[1]).toContain('Közép-magyarországi');
	});

	it('should report the gap between the extremes', async () => {
		const el = await renderPanel(regiok, real());
		const cards = texts(el, '.stat');
		expect(cards[3]).toContain('3,3 perc');
		expect(cards[3]).toContain('Dél-alföldi');
	});

	it('should draw every region (the trend chart)', async () => {
		await renderPanel(regiok, real());
		const s = seriesOf('ch-reg-trend');
		expect(s).toHaveLength(7);
		expect(s[0].name).toBe('Dél-alföldi');
		expect(s[0].data).toHaveLength(7);
		expect(chartFor('ch-reg-trend').annotations.yaxis[0].y).toBe(15);
	});

	it('should be sorted ascending (the ranking chart)', async () => {
		await renderPanel(regiok, real());
		const opts = chartFor('ch-reg-rang');
		expect(opts.xaxis.categories[0]).toBe('Dél-alföldi');
		expect(opts.xaxis.categories.at(-1)).toBe('Közép-magyarországi');
		expect(opts.series[0].data).toHaveLength(7);
	});

	it('should follow the monthly gap (the spread chart)', async () => {
		await renderPanel(regiok, real());
		const s = seriesOf('ch-reg-ollo');
		expect(s[0].data).toHaveLength(7);
		expect(s[0].data.at(-1)).toBeCloseTo(3.26, 2);
	});

	it('should rank the regions by movement (the change chart)', async () => {
		await renderPanel(regiok, real());
		const opts = chartFor('ch-reg-valtozas');
		expect(opts.xaxis.categories[0]).toBe('Közép-magyarországi');
		expect(opts.series[0].data[0]).toBeCloseTo(-1.55, 2);
		expect(opts.series[0].data.every((v) => v < 0)).toBe(true);
	});

	it('should report the coverage of the chart (the change subtitle)', async () => {
		const el = await renderPanel(regiok, real());
		const card = el.querySelector('#ch-reg-valtozas').closest('.card');
		const sub = card.querySelector('.card-sub').textContent;
		expect(sub).toContain('2026');
		expect(sub).toContain('jan');
		expect(sub).toContain('júl');
	});

	it('should show every region and every priority in one chart', async () => {
		await renderPanel(regiok, real());
		const opts = chartFor('ch-reg-matrix');
		expect(opts.series.map((s) => s.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(opts.xaxis.categories).toEqual(['DAR', 'DDR', 'ÉAR', 'ÉMR', 'KDR', 'KMR', 'NYDR']);
		for (const s of opts.series) expect(s.data).toHaveLength(7);
		expect(opts.series[0].data[0]).toBe(13.69);
		expect(opts.series[3].data[0]).toBe(44.57);
	});

	it('should name the region in the all priority chart tooltip', async () => {
		await renderPanel(regiok, real());
		const fn = chartFor('ch-reg-matrix').tooltip.x.formatter;
		expect(fn('DAR', { dataPointIndex: 0 })).toBe('Dél-alföldi');
		expect(fn('DAR', { dataPointIndex: 99 })).toBe('DAR');
		expect(fn('DAR', undefined)).toBe('DAR');
	});

	it('should sit between the change chart and the snapshot table', async () => {
		const el = await renderPanel(regiok, real());
		const ids = [...el.querySelectorAll('.grid12 > *')].map(
			(n) => n.querySelector('[id^="ch-"]')?.id ?? 'other',
		);
		expect(ids.indexOf('ch-reg-matrix')).toBe(ids.indexOf('ch-reg-valtozas') + 1);
		expect(ids.at(-1)).toBe('other');
	});

	it('should list every region (the snapshot table)', async () => {
		const el = await renderPanel(regiok, real());
		const rows = tableRows(el);
		expect(rows).toHaveLength(7);
		expect(rows[0][0]).toContain('Dél-alföldi');
		expect(rows[0][0]).toContain('DAR');
		expect(rows[0][1]).toBe('13,7 perc');
	});
});

describe('region selectors', () => {
	it('should recompute every chart when the priority changes', async () => {
		const el = await renderPanel(regiok, real());
		await seg(el, 'holamento-regiok-prio', 'P4');
		expect(texts(el, '.stat')[0]).toContain('P4');
		expect(seriesOf('ch-reg-trend')[0].data.at(-1)).toBe(44.57);
		expect(chartFor('ch-reg-valtozas').series[0].data).toHaveLength(7);
	});

	it('should recompute every chart when the metric changes', async () => {
		const el = await renderPanel(regiok, real());
		await seg(el, 'holamento-regiok-metric', 'p90');
		expect(seriesOf('ch-reg-trend')[0].data.at(-1)).toBe(23.32);
		expect(texts(el, '.card-title').some((t) => t.includes('P90'))).toBe(true);
		expect(chartFor('ch-reg-matrix').series[0].data[0]).toBe(23.32);
	});

	it('should leave the all priority chart untouched when the priority changes', async () => {
		const el = await renderPanel(regiok, real());
		const before = chartFor('ch-reg-matrix').series.map((s) => s.name);
		await seg(el, 'holamento-regiok-prio', 'P4');
		expect(chartFor('ch-reg-matrix').series.map((s) => s.name)).toEqual(before);
	});

	it('should start from the stored selection', async () => {
		localStorage.setItem('holamento-regiok-prio', 'P3');
		const el = await renderPanel(regiok, real());
		expect(texts(el, '.stat')[0]).toContain('P3');
	});
});

describe('regions without data', () => {
	it('should show empty states when the regional series is missing', async () => {
		const p = makePayload({ meta: { regions: [] }, regioTrend: { months: [], byRegion: {} }, topic5: { month: '2026-07', rows: [] } });
		const el = await renderPanel(regiok, buildModel(p));
		const cards = el.querySelectorAll('.grid12 > .card');
		expect(cards.length).toBeGreaterThan(0);
		expect(el.querySelectorAll('.grid12 > .card .empty-state').length).toBe(cards.length);
		expect(chartFor('ch-reg-trend')).toBeNull();
		expect(chartFor('ch-reg-valtozas')).toBeNull();
	});

	it('should hint how to widen the period when it holds no regional data', async () => {
		const f = filterModel(real(), '2025-01', '2025-06');
		const el = await renderPanel(regiok, f);
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThan(0);
		expect(el.textContent).toContain('bővítsd az időszakot');
	});

	it('should render no change chart for a single month', async () => {
		const f = filterModel(real(), '2026-07', '2026-07');
		await renderPanel(regiok, f);
		expect(chartFor('ch-reg-valtozas')).toBeNull();
	});

	it('should render no spread chart when every regional value is null', async () => {
		const p = makePayload();
		for (const code of ['AAA', 'BBB']) {
			for (const met of ['median', 'p75', 'p90']) {
				for (const prio of ['P1', 'P2', 'P3', 'P4']) {
					p.regioTrend.byRegion[code][met][prio] = new Array(7).fill(null);
				}
			}
		}
		await renderPanel(regiok, buildModel(p));
		expect(chartFor('ch-reg-ollo')).toBeNull();
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(regiok, buildModel({}));
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
