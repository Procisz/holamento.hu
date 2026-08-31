import { beforeAll, describe, expect, it } from 'vitest';
import * as attekintes from '../../src/features/attekintes.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, makePayload, realPayload, renderPanel, seriesOf, tableRows, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());
const kpis = (el) => texts(el, '.stat');
const nbsp = (s) => s.replace(/ | /g, ' ');

beforeAll(warmCharts);

describe('overview on the live payload', () => {
	it('should render all five KPI cards', async () => {
		const el = await renderPanel(attekintes, real());
		const cards = kpis(el);
		expect(cards).toHaveLength(5);
		expect(cards[0]).toContain('26,4 perc');
		expect(cards[1]).toContain('24,6 perc');
		expect(nbsp(cards[2])).toContain('94 930');
		expect(cards[3]).toContain('4,9 perc');
		expect(cards[4]).toContain('129,4 perc');
	});

	it('should carry the change and the case number on the P1 cards', async () => {
		const el = await renderPanel(attekintes, real());
		const cards = kpis(el);
		expect(cards[0]).toContain('+0,5 perc');
		expect(nbsp(cards[0])).toContain('12 123 eset');
		expect(nbsp(cards[1])).toContain('2408 eset');
	});

	it('should draw a sparkline on both P1 cards', async () => {
		const el = await renderPanel(attekintes, real());
		const stats = [...el.querySelectorAll('.stat')];
		expect(stats[0].querySelector('svg.spark')).not.toBeNull();
		expect(stats[1].querySelector('svg.spark')).not.toBeNull();
	});

	it('should show 19 months and two series (the P1 line chart)', async () => {
		await renderPanel(attekintes, real());
		const series = seriesOf('ch-att-p1');
		expect(series.map((s) => s.name)).toEqual(['Medián', 'P90']);
		expect(series[0].data).toHaveLength(19);
		expect(series[0].data.at(-1)).toBe(15.35);
		expect(series[1].data.at(-1)).toBe(26.43);
		expect(chartFor('ch-att-p1').labels).toHaveLength(19);
	});

	it('should be present (the 15 minute reference line)', async () => {
		await renderPanel(attekintes, real());
		expect(chartFor('ch-att-p1').annotations.yaxis[0].y).toBe(15);
	});

	it('should show the mix of the latest month (the donut)', async () => {
		await renderPanel(attekintes, real());
		const opts = chartFor('ch-att-mix');
		expect(opts.labels).toEqual(['P1', 'P2', 'P3', 'P4']);
		expect(opts.series).toEqual([12123, 37510, 39230, 6067]);
	});

	it('should list every priority (the monthly summary table)', async () => {
		const el = await renderPanel(attekintes, real());
		const rows = tableRows(el);
		expect(rows).toHaveLength(4);
		expect(rows[0][0]).toBe('P1');
		expect(rows[0][1]).toContain('15,4 perc');
		expect(rows[0][1]).toContain('+0,1');
		expect(nbsp(rows[0][4])).toBe('12 123');
	});

	it('should generate the worth knowing facts', async () => {
		const el = await renderPanel(attekintes, real());
		const facts = texts(el, '.fact-list li');
		expect(facts.length).toBeGreaterThan(0);
		expect(facts.some((f) => /15 perc/.test(f))).toBe(true);
	});

	it('should mark the table title as preliminary', async () => {
		const el = await renderPanel(attekintes, real());
		expect(texts(el, '.card-title').some((t) => t.includes('előzetes'))).toBe(true);
	});
});

describe('overview on incomplete data', () => {
	it('should show empty states without a series', async () => {
		const p = makePayload({ monthsFrom2025: [] });
		const el = await renderPanel(attekintes, buildModel(p));
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThanOrEqual(2);
		expect(chartFor('ch-att-p1')).toBeNull();
	});

	it('should render no donut without case numbers', async () => {
		const p = makePayload();
		for (const prio of ['P1', 'P2', 'P3', 'P4']) {
			p.topic2.byArea['Országos'].esetszam[prio] = new Array(19).fill(0);
		}
		const el = await renderPanel(attekintes, buildModel(p));
		expect(chartFor('ch-att-mix')).toBeNull();
		expect(texts(el, '.empty-state').length).toBeGreaterThan(0);
	});

	it('should survive missing phase data (the KPI)', async () => {
		const el = await renderPanel(attekintes, buildModel(makePayload({ phases: undefined })));
		expect(kpis(el)[3]).toContain('-');
	});

	it('should be empty without a snapshot (the longest wait card)', async () => {
		const el = await renderPanel(attekintes, buildModel(makePayload({ topic5: { month: '2026-07', rows: [] } })));
		expect(kpis(el)[4]).toContain('Nincs elérhető adat');
	});

	it('should show no month over month change for a single month', async () => {
		const f = filterModel(real(), '2026-07', '2026-07');
		const el = await renderPanel(attekintes, f);
		expect(kpis(el)[0]).toContain('Nincs előző havi adat');
		expect(tableRows(el)[0][1]).not.toContain('+');
	});

	it('should narrow with the selected period (the chart)', async () => {
		const f = filterModel(real(), '2026-05', '2026-07');
		await renderPanel(attekintes, f);
		expect(seriesOf('ch-att-p1')[0].data).toHaveLength(3);
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(attekintes, buildModel({}));
		expect(el.querySelectorAll('.empty-state').length).toBeGreaterThan(0);
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
