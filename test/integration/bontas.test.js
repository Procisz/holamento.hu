import { beforeAll, describe, expect, it } from 'vitest';
import * as bontas from '../../src/features/bontas.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, flush, makePayload, realPayload, renderPanel, seriesOf, tableRows, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());
const seg = (el, key, val) => {
	el.querySelector(`[data-seg="${key}"] [data-val="${val}"]`).click();
	return flush();
};

beforeAll(warmCharts);

describe('time split on the live payload', () => {
	it('should name the shortest and the longest call handling', async () => {
		const el = await renderPanel(bontas, real());
		const cards = texts(el, '.stat');
		expect(cards).toHaveLength(4);
		expect(cards[0]).toContain('3,6 perc');
		expect(cards[0]).toContain('Észak-alföldi');
		expect(cards[1]).toContain('4,6 perc');
		expect(cards[1]).toContain('Közép-magyarországi');
	});

	it('should report the average share and the regional gap', async () => {
		const el = await renderPanel(bontas, real());
		const cards = texts(el, '.stat');
		expect(cards[2]).toContain('27,4%');
		expect(cards[2]).toContain('4,0 perc');
		expect(cards[3]).toContain('1,0 perc');
	});

	it('should state that the breakdown covers a single month', async () => {
		const el = await renderPanel(bontas, real());
		expect(el.textContent).toContain('2026. június');
		expect(el.textContent).toContain('egyetlen hónapra');
	});

	it('should split the total into two parts (the stacked chart)', async () => {
		await renderPanel(bontas, real());
		const opts = chartFor('ch-bon-stack');
		expect(opts.chart.stacked).toBe(true);
		const s = seriesOf('ch-bon-stack');
		expect(s).toHaveLength(2);
		expect(s[0].data).toHaveLength(7);
		expect(opts.xaxis.categories[0]).toBe('Dél-alföldi');
	});

	it('should add up the two stacked parts to the published total', async () => {
		await renderPanel(bontas, real());
		const [before, after] = seriesOf('ch-bon-stack').map((x) => x.data);
		expect(before[0] + after[0]).toBeCloseTo(13.58, 2);
	});

	it('should use percentages (the share chart)', async () => {
		await renderPanel(bontas, real());
		const data = seriesOf('ch-bon-share')[0].data;
		expect(data).toHaveLength(7);
		for (const v of data) expect(v).toBeGreaterThan(20);
		for (const v of data) expect(v).toBeLessThan(35);
	});

	it('should label its bars with region codes (the share chart)', async () => {
		await renderPanel(bontas, real());
		expect(chartFor('ch-bon-share').xaxis.categories).toContain('DAR');
	});

	it('should list every region and priority pair (the table)', async () => {
		const el = await renderPanel(bontas, real());
		const rows = tableRows(el);
		expect(rows).toHaveLength(10);
		expect(el.textContent).toContain('1-10 / 28');
		expect(rows[0]).toHaveLength(6);
	});

	it('should be sorted by the difference descending (the table)', async () => {
		const el = await renderPanel(bontas, real());
		const rows = tableRows(el);
		expect(rows[0][0]).toContain('Észak-magyarországi');
		expect(rows[0][1]).toBe('P4');
		expect(rows[0][4]).toBe('8,1 perc');
	});

	it('should show the methodology card', async () => {
		const el = await renderPanel(bontas, real());
		const facts = texts(el, '.fact-list li');
		expect(facts).toHaveLength(4);
		expect(facts.some((f) => f.includes('percentilisek nem adódnak össze'))).toBe(true);
	});
});

describe('time split selectors', () => {
	it('should recompute the split when the priority changes', async () => {
		const el = await renderPanel(bontas, real());
		await seg(el, 'holamento-bontas-prio', 'P4');
		expect(texts(el, '.stat')[0]).toContain('P4');
		const [before, after] = seriesOf('ch-bon-stack').map((x) => x.data);
		expect(before[0] + after[0]).toBeGreaterThan(20);
	});

	it('should recompute the split when the metric changes', async () => {
		const el = await renderPanel(bontas, real());
		await seg(el, 'holamento-bontas-metric', 'p90');
		expect(texts(el, '.card-title').some((t) => t.includes('P90'))).toBe(true);
	});
});

describe('time split without the second basis', () => {
	it('should explain when the source omits the alarm based values', async () => {
		const el = await renderPanel(bontas, buildModel(makePayload({ topic4: undefined })));
		expect(el.textContent).toContain('nem adta meg');
		expect(chartFor('ch-bon-stack')).toBeNull();
		expect(el.querySelector('.fact-list')).not.toBeNull();
	});

	it('should explain when the month falls outside the period', async () => {
		const f = filterModel(real(), '2026-07', '2026-07');
		const el = await renderPanel(bontas, f);
		expect(el.textContent).toContain('Bővítsd az időszakot');
		expect(chartFor('ch-bon-share')).toBeNull();
	});

	it('should keep the selectors usable in the empty state', async () => {
		const el = await renderPanel(bontas, buildModel(makePayload({ topic4: undefined })));
		await seg(el, 'holamento-bontas-prio', 'P2');
		expect(localStorage.getItem('holamento-bontas-prio')).toBe('P2');
		await seg(el, 'holamento-bontas-metric', 'p90');
		expect(localStorage.getItem('holamento-bontas-metric')).toBe('p90');
		expect(el.textContent).toContain('nem adta meg');
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(bontas, buildModel({}));
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
