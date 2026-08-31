import { beforeAll, describe, expect, it } from 'vitest';
import { flush, mount, warmCharts } from '../helpers.js';

import * as adatok from '../../src/features/adatok.js';
import * as attekintes from '../../src/features/attekintes.js';
import * as trendek from '../../src/features/trendek.js';
import * as fazisok from '../../src/features/fazisok.js';
import * as regiok from '../../src/features/regiok.js';
import * as bontas from '../../src/features/bontas.js';
import * as esetszamok from '../../src/features/esetszamok.js';
import * as szoras from '../../src/features/szoras.js';

const FEATURES = [
	['adatok', adatok],
	['attekintes', attekintes],
	['trendek', trendek],
	['fazisok', fazisok],
	['regiok', regiok],
	['bontas', bontas],
	['esetszamok', esetszamok],
	['szoras', szoras],
];

const PRIOS = ['P1', 'P2', 'P3', 'P4'];

function bareModel() {
	return {
		meta: {
			months: [],
			monthsLong: [],
			priorities: [],
			areas: [],
			regions: [],
			warnings: [],
			range: null,
			latestMonth: null,
			prevMonth: null,
			latestIsPreliminary: false,
			generatedAt: null,
			updatedDate: null,
			originMonth: null,
		},
		series: { months: [], byArea: {} },
		regionTrend: { months: [], byRegion: {} },
		kpi: null,
		phases: null,
		regionSnapshot: null,
		regionSnapshotAlt: null,
		regionsByCode: new Map(),
	};
}

function withPrioritiesButNoAreaSeries() {
	const m = bareModel();
	m.meta.priorities = [...PRIOS];
	m.meta.areas = ['Országos', 'Budapest'];
	m.meta.monthsLong = ['2026-06', '2026-07'];
	m.meta.months = ['2026-06', '2026-07'];
	m.meta.latestMonth = '2026-07';
	m.meta.prevMonth = '2026-06';
	m.series.months = ['2026-06', '2026-07'];
	m.regionTrend.months = ['2026-06', '2026-07'];
	return m;
}

function withPhasesWithoutMonth() {
	const m = withPrioritiesButNoAreaSeries();
	m.phases = {
		month: null,
		area: null,
		priority: null,
		esetszam: null,
		total: null,
		items: [
			{ key: 'esr_cad', atlag: 1, median: null, p75: null, p90: null },
			{ key: 'bej_erk', atlag: 2, median: null, p75: null, p90: null },
		],
	};
	return m;
}

const VARIANTS = [
	['a bare model', () => bareModel()],
	['a model with priorities but no area series', withPrioritiesButNoAreaSeries],
	['a model with phases but no month', withPhasesWithoutMonth],
];

beforeAll(warmCharts);

describe('views survive a malformed model', () => {
	for (const [variantName, make] of VARIANTS) {
		it.each(FEATURES)(`%s renders ${variantName} without throwing`, async (_name, feature) => {
			const el = mount();
			expect(() => feature.render(make(), el)).not.toThrow();
			await flush();
			expect(el.querySelector('.error-text')).toBeNull();
			expect(el.innerHTML.length).toBeGreaterThan(0);
		});
	}
});

describe('overview facts fall back to a placeholder', () => {
	it('should state that there is nothing to report when no fact applies', async () => {
		const el = mount();
		attekintes.render(withPrioritiesButNoAreaSeries(), el);
		await flush();
		const facts = [...el.querySelectorAll('.fact-list li')].map((n) => n.textContent.trim());
		expect(facts).toHaveLength(1);
		expect(facts[0].length).toBeGreaterThan(0);
	});

	it('should use the latest month when the phase block carries none', async () => {
		const el = mount();
		attekintes.render(withPhasesWithoutMonth(), el);
		await flush();
		expect(el.textContent).toContain('2026');
	});
});
