import { beforeAll, describe, expect, it } from 'vitest';
import { buildModel } from '../../src/data/model.js';
import { chartCalls } from '../setup.js';
import { chartFor, realPayload, renderPanel, warmCharts } from '../helpers.js';

import * as attekintes from '../../src/features/attekintes.js';
import * as trendek from '../../src/features/trendek.js';
import * as fazisok from '../../src/features/fazisok.js';
import * as regiok from '../../src/features/regiok.js';
import * as bontas from '../../src/features/bontas.js';
import * as esetszamok from '../../src/features/esetszamok.js';
import * as szoras from '../../src/features/szoras.js';

const FEATURES = [
	['attekintes', attekintes],
	['trendek', trendek],
	['fazisok', fazisok],
	['regiok', regiok],
	['bontas', bontas],
	['esetszamok', esetszamok],
	['szoras', szoras],
];

const real = () => buildModel(realPayload());

const OPTS = { dataPointIndex: 0, seriesIndex: 0, w: { globals: { labels: ['P1'], seriesNames: ['P1'] } } };
const SAMPLES = [0, 1, 15.35, 12123, -1.5, 100, null, undefined];

function collectFunctions(node, path, out) {
	if (!node || typeof node !== 'object') return out;
	for (const [key, value] of Object.entries(node)) {
		if (typeof value === 'function') out.push({ path: `${path}.${key}`, fn: value });
		else if (typeof value === 'object') collectFunctions(value, `${path}.${key}`, out);
	}
	return out;
}

beforeAll(warmCharts);

describe('chart callbacks survive every input', () => {
	it.each(FEATURES)('should never throw in the %s formatters', async (_name, feature) => {
		await renderPanel(feature, real());
		const fns = chartCalls
			.filter((c) => c.el?.isConnected)
			.flatMap((c) => collectFunctions(c.options, c.el.id, []));
		expect(fns.length).toBeGreaterThan(0);
		for (const { path, fn } of fns) {
			for (const sample of SAMPLES) {
				expect(() => fn(sample, OPTS), path).not.toThrow();
			}
		}
	});

	it.each(FEATURES)('should return renderable strings for numbers in the %s formatters', async (_name, feature) => {
		await renderPanel(feature, real());
		const fns = chartCalls
			.filter((c) => c.el?.isConnected)
			.flatMap((c) => collectFunctions(c.options, c.el.id, []))
			.filter((f) => f.path.includes('formatter'));
		for (const { path, fn } of fns) {
			const out = fn(12.5, OPTS);
			expect(typeof out, path).toBe('string');
			expect(out.length, path).toBeGreaterThan(0);
		}
	});
});

describe('axis and tooltip formatters render the expected units', () => {
	it('should append the minute unit on the overview axis', async () => {
		await renderPanel(attekintes, real());
		expect(chartFor('ch-att-p1').yaxis.labels.formatter(15)).toBe('15 p');
	});

	it('should render a percentage (the overview donut label)', async () => {
		await renderPanel(attekintes, real());
		expect(chartFor('ch-att-mix').dataLabels.formatter(12.8)).toContain('%');
		expect(chartFor('ch-att-mix').tooltip.y.formatter(12123)).toContain('eset');
	});

	it('should render minutes on the response time axis', async () => {
		await renderPanel(trendek, real());
		expect(chartFor('ch-tre-fo').yaxis.labels.formatter(15)).toMatch(/15/);
		expect(chartFor('ch-tre-fo').tooltip.y.formatter(15.35)).toBe('15,4 perc');
	});

	it('should render minutes (the phase chart tooltip)', async () => {
		await renderPanel(fazisok, real());
		expect(chartFor('ch-faz-osszes').tooltip.y.formatter(1.4)).toBe('1,4 perc');
	});

	it('should label its bars with a short number (the region ranking)', async () => {
		await renderPanel(regiok, real());
		expect(chartFor('ch-reg-rang').dataLabels.formatter(13.69)).toBe('13,7');
	});

	it('should label negative values (the region change chart)', async () => {
		await renderPanel(regiok, real());
		expect(chartFor('ch-reg-valtozas').dataLabels.formatter(-1.55)).toBe('-1,6');
	});

	it('should render percentages (the split share chart)', async () => {
		await renderPanel(bontas, real());
		const opts = chartFor('ch-bon-share');
		expect(opts.dataLabels.formatter(27.7)).toContain('%');
		expect(opts.yaxis.labels.formatter(30)).toContain('%');
		expect(opts.tooltip.y.formatter(27.7)).toContain('%');
		expect(opts.tooltip.y.formatter(null)).toBe('-');
	});

	it('should name the region (the split share tooltip)', async () => {
		await renderPanel(bontas, real());
		expect(chartFor('ch-bon-share').tooltip.x.formatter('DAR', OPTS)).toBe('Dél-alföldi');
	});

	it('should fall back to the raw value (the split share tooltip)', async () => {
		await renderPanel(bontas, real());
		const fn = chartFor('ch-bon-share').tooltip.x.formatter;
		expect(fn('DAR', { dataPointIndex: 99 })).toBe('DAR');
		expect(fn('DAR', undefined)).toBe('DAR');
	});

	it('should name the month and the case number (the scatter tooltip)', async () => {
		await renderPanel(esetszamok, real());
		const opts = chartFor('ch-ese-terheles');
		const label = opts.tooltip.x.formatter(88408, OPTS);
		expect(label).toContain('2025');
		expect(label).toContain('eset');
		expect(opts.tooltip.y.formatter(16.2)).toBe('16,2 perc');
	});

	it('should cope with an unknown point (the scatter tooltip)', async () => {
		await renderPanel(esetszamok, real());
		const fn = chartFor('ch-ese-terheles').tooltip.x.formatter;
		expect(fn(1, { dataPointIndex: 999 })).toContain('Nincs adat');
		expect(fn(1, undefined)).toContain('Nincs adat');
	});

	it('should render whole numbers and percentages on the case charts', async () => {
		await renderPanel(esetszamok, real());
		expect(chartFor('ch-ese-havi').yaxis.labels.formatter(94930)).toMatch(/94/);
		expect(chartFor('ch-ese-mix').yaxis.labels.formatter(50)).toContain('%');
		expect(chartFor('ch-ese-mix').tooltip.y.formatter(12.8)).toContain('%');
		expect(chartFor('ch-ese-mix').tooltip.y.formatter(null)).toBe('-');
		expect(chartFor('ch-ese-bp').yaxis.labels.formatter(18)).toContain('%');
		expect(chartFor('ch-ese-bp').tooltip.y.formatter(18)).toContain('%');
		expect(chartFor('ch-ese-bp').tooltip.y.formatter(null)).toBe('-');
	});

	it('should render a multiplier (the ratio chart)', async () => {
		await renderPanel(szoras, real());
		expect(chartFor('ch-szo-arany').yaxis.labels.formatter(1.7)).toContain('x');
		expect(chartFor('ch-szo-arany').tooltip.y.formatter(1.72)).toContain('x');
	});

	it('should render a signed minute value (the area gap chart)', async () => {
		await renderPanel(szoras, real());
		expect(chartFor('ch-szo-bp').tooltip.y.formatter(0.28)).toBe('+0,3 perc');
		expect(chartFor('ch-szo-bp').tooltip.y.formatter(-1.81)).toBe('-1,8 perc');
	});
});
