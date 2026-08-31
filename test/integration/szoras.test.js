import { beforeAll, describe, expect, it } from 'vitest';
import * as szoras from '../../src/features/szoras.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, flush, headers, makePayload, realPayload, renderPanel, seriesOf, tableRows, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());
const seg = (el, key, val) => {
	el.querySelector(`[data-seg="${key}"] [data-val="${val}"]`).click();
	return flush();
};

beforeAll(warmCharts);

describe('dispersion on the live payload', () => {
	it('should report the P90 over median ratio per priority', async () => {
		const el = await renderPanel(szoras, real());
		const cards = texts(el, '.stat');
		expect(cards).toHaveLength(4);
		expect(cards[0]).toContain('1,7x');
		expect(cards[0]).toContain('26,4 perc');
		expect(cards[3]).toContain('2,7x');
	});

	it('should cover 19 months (the ratio chart)', async () => {
		await renderPanel(szoras, real());
		const s = seriesOf('ch-szo-arany');
		expect(s.map((x) => x.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(s[0].data).toHaveLength(19);
		expect(s[0].data.at(-1)).toBeCloseTo(1.72, 2);
	});

	it('should show the P90 minus median distance (the gap chart)', async () => {
		await renderPanel(szoras, real());
		const data = seriesOf('ch-szo-perc')[0].data;
		expect(data).toHaveLength(4);
		expect(data[0]).toBeCloseTo(11.08, 2);
	});

	it('should carry a zero reference line (the area gap chart)', async () => {
		await renderPanel(szoras, real());
		const opts = chartFor('ch-szo-bp');
		expect(opts.annotations.yaxis[0].y).toBe(0);
		const s = seriesOf('ch-szo-bp');
		expect(s.map((x) => x.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(s[0].data).toHaveLength(19);
	});

	it('should be positive for P1 on the median (the area gap)', async () => {
		await renderPanel(szoras, real());
		expect(seriesOf('ch-szo-bp')[0].data.at(-1)).toBeCloseTo(0.28, 2);
	});

	it('should list the hardest region and priority pairs', async () => {
		const el = await renderPanel(szoras, real());
		const facts = texts(el, '.fact-list li');
		expect(facts.length).toBeGreaterThan(0);
		expect(facts[0]).toContain('Dél-alföldi');
		expect(facts[0]).toContain('129,4');
	});

	it('should list every region and priority pair (the full table)', async () => {
		const el = await renderPanel(szoras, real());
		expect(el.textContent).toContain('1-10 / 28');
		const rows = tableRows(el);
		expect(rows[0][0]).toContain('Dél-alföldi');
		expect(rows[0][1]).toBe('P4');
	});

	it('should carry the ratio column (the table)', async () => {
		const el = await renderPanel(szoras, real());
		expect(headers(el)).toContain('P90/medián');
		expect(tableRows(el)[0].at(-1)).toBe('2,9x');
	});
});

describe('dispersion selectors', () => {
	it('should recompute the ratio chart when the area changes', async () => {
		const el = await renderPanel(szoras, real());
		await seg(el, 'holamento-szoras-area', 'Budapest');
		expect(seriesOf('ch-szo-arany')[0].data.at(-1)).toBeCloseTo(1.58, 2);
		expect(texts(el, '.card-title').some((t) => t.includes('Budapest'))).toBe(true);
	});

	it('should recompute the area gap chart when the metric changes', async () => {
		const el = await renderPanel(szoras, real());
		await seg(el, 'holamento-szoras-metric', 'p90');
		expect(seriesOf('ch-szo-bp')[0].data.at(-1)).toBeCloseTo(-1.81, 2);
	});

	it('should leave the ratio chart untouched when the metric changes', async () => {
		const el = await renderPanel(szoras, real());
		const before = seriesOf('ch-szo-arany')[0].data.at(-1);
		await seg(el, 'holamento-szoras-metric', 'p75');
		expect(seriesOf('ch-szo-arany')[0].data.at(-1)).toBe(before);
	});

	it('should start from the stored selection', async () => {
		localStorage.setItem('holamento-szoras-area', 'Budapest');
		const el = await renderPanel(szoras, real());
		expect(texts(el, '.card-title').some((t) => t.includes('Budapest'))).toBe(true);
	});
});

describe('dispersion without data', () => {
	it('should show empty states without a series', async () => {
		const el = await renderPanel(szoras, buildModel(makePayload({ monthsFrom2025: [] })));
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThan(0);
		expect(chartFor('ch-szo-arany')).toBeNull();
		expect(chartFor('ch-szo-bp')).toBeNull();
	});

	it('should render no table without a regional snapshot', async () => {
		const el = await renderPanel(szoras, buildModel(makePayload({ topic5: { month: '2026-07', rows: [] } })));
		expect(tableRows(el)).toEqual([]);
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThan(0);
	});

	it('should render no ratio chart when the median is zero everywhere', async () => {
		const p = makePayload();
		for (const prio of ['P1', 'P2', 'P3', 'P4']) p.topic2.byArea['Országos'].median[prio] = new Array(19).fill(0);
		await renderPanel(szoras, buildModel(p));
		expect(chartFor('ch-szo-arany')).toBeNull();
	});

	it('should narrow with the selected period', async () => {
		const f = filterModel(real(), '2026-05', '2026-07');
		await renderPanel(szoras, f);
		expect(seriesOf('ch-szo-arany')[0].data).toHaveLength(3);
		expect(seriesOf('ch-szo-bp')[0].data).toHaveLength(3);
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(szoras, buildModel({}));
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
