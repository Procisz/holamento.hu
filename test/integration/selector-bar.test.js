import { beforeAll, describe, expect, it } from 'vitest';
import { buildModel } from '../../src/data/model.js';
import { realPayload, renderPanel, warmCharts } from '../helpers.js';

import * as trendek from '../../src/features/trendek.js';
import * as regiok from '../../src/features/regiok.js';
import * as bontas from '../../src/features/bontas.js';
import * as esetszamok from '../../src/features/esetszamok.js';
import * as szoras from '../../src/features/szoras.js';

const real = () => buildModel(realPayload());

const TABS = [
	['trendek', trendek, ['holamento-trendek-area', 'holamento-trendek-metric']],
	['regiok', regiok, ['holamento-regiok-prio', 'holamento-regiok-metric']],
	['bontas', bontas, ['holamento-bontas-prio', 'holamento-bontas-metric']],
	['esetszamok', esetszamok, ['holamento-esetszamok-area']],
	['szoras', szoras, ['holamento-szoras-area']],
];

const CHART_SCOPED = [
	['trendek', trendek, 'holamento-trendek-prio', 'ch-tre-spread'],
	['esetszamok', esetszamok, 'holamento-esetszamok-prio', 'ch-ese-terheles'],
	['szoras', szoras, 'holamento-szoras-metric', 'ch-szo-bp'],
];

const topSegs = (el) => [...el.children].filter((n) => n.classList.contains('seg'));

beforeAll(warmCharts);

describe('selector bar layout', () => {
	it.each(TABS)('%s should place the shared selectors above the KPI row', async (_name, feature) => {
		const el = await renderPanel(feature, real());
		const seq = [...el.children].map((n) =>
			n.classList.contains('seg') ? 'seg' : n.classList.contains('kpi-row') ? 'kpi' : 'other',
		);
		const lastSeg = seq.lastIndexOf('seg');
		expect(lastSeg).toBeGreaterThanOrEqual(0);
		expect(seq.slice(0, lastSeg).every((s) => s === 'seg')).toBe(true);
		expect(seq[lastSeg + 1]).not.toBe('seg');
	});

	it.each(TABS)('%s should expose the expected shared selectors in order', async (_name, feature, keys) => {
		const el = await renderPanel(feature, real());
		expect(topSegs(el).map((n) => n.dataset.seg)).toEqual(keys);
	});

	it.each(TABS)('%s should label every selector row', async (_name, feature) => {
		const el = await renderPanel(feature, real());
		for (const seg of el.querySelectorAll('.chip-row.seg')) {
			expect(seg.querySelector('.chip-row-label').textContent.trim().length).toBeGreaterThan(0);
		}
	});

	it.each(TABS)('%s should carry no explanatory note under the selectors', async (_name, feature) => {
		const el = await renderPanel(feature, real());
		expect(el.querySelector('.seg-note')).toBeNull();
	});
});

describe('chart scoped selectors', () => {
	it.each(CHART_SCOPED)('%s should place its selector directly above the chart it drives', async (_name, feature, key, chartId) => {
		const el = await renderPanel(feature, real());
		const seg = el.querySelector(`.seg-inline [data-seg="${key}"]`);
		expect(seg).not.toBeNull();
		const wrap = seg.closest('.seg-inline');
		const chartCard = el.querySelector(`#${chartId}`).closest('.card');
		expect(wrap.nextElementSibling).toBe(chartCard);
	});

	it.each(CHART_SCOPED)('%s should keep the scoped selector inside the card grid', async (_name, feature, key) => {
		const el = await renderPanel(feature, real());
		const wrap = el.querySelector(`.seg-inline [data-seg="${key}"]`).closest('.seg-inline');
		expect(wrap.parentElement.classList.contains('grid12')).toBe(true);
	});

	it.each(CHART_SCOPED)('%s should keep the scoped selector out of the top bar', async (_name, feature, key) => {
		const el = await renderPanel(feature, real());
		expect(topSegs(el).map((n) => n.dataset.seg)).not.toContain(key);
	});
});

describe('scoped selectors stay usable', () => {
	it('trendek should recompute the metric chart from its own selector', async () => {
		const el = await renderPanel(trendek, real());
		el.querySelector('[data-seg="holamento-trendek-prio"] [data-val="P4"]').click();
		await Promise.resolve();
		expect(localStorage.getItem('holamento-trendek-prio')).toBe('P4');
	});

	it('esetszamok should drop the scoped selector for the rural area', async () => {
		const el = await renderPanel(esetszamok, real());
		expect(el.querySelector('[data-seg="holamento-esetszamok-prio"]')).not.toBeNull();
		el.querySelector('[data-seg="holamento-esetszamok-area"] [data-val="videk"]').click();
		await Promise.resolve();
		expect(el.querySelector('[data-seg="holamento-esetszamok-prio"]')).toBeNull();
	});
});
