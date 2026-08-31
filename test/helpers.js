import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chartCalls } from './setup.js';
import { loadCharts } from '../src/ui/charts.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let cached = null;

export function realPayload() {
	cached ??= readFileSync(join(ROOT, 'public/data.json'), 'utf8');
	return JSON.parse(cached);
}

export async function flush() {
	await Promise.resolve();
	await new Promise((r) => setTimeout(r, 0));
	if (typeof requestAnimationFrame === 'function') {
		await new Promise((r) => requestAnimationFrame(() => r()));
	}
	await Promise.resolve();
	await new Promise((r) => setTimeout(r, 0));
}

export async function warmCharts() {
	await loadCharts();
}

export function mount() {
	const el = document.createElement('div');
	document.body.appendChild(el);
	return el;
}

export async function renderPanel(feature, model) {
	const el = mount();
	feature.render(model, el);
	await flush();
	return el;
}

export function chartFor(id) {
	const call = [...chartCalls].reverse().find((c) => c.el?.id === id && c.el.isConnected);
	return call?.options ?? null;
}

export function chartIds() {
	return chartCalls.filter((c) => c.el?.isConnected).map((c) => c.el.id).filter(Boolean);
}

export function seriesOf(id) {
	const opts = chartFor(id);
	if (!opts) return null;
	return (opts.series ?? []).map((s) => (Array.isArray(s) ? { name: null, data: s } : { name: s.name, data: s.data }));
}

export const texts = (root, selector) =>
	[...root.querySelectorAll(selector)].map((n) => n.textContent.replace(/\s+/g, ' ').trim());

export const tableRows = (root, index = 0) => {
	const table = root.querySelectorAll('table.tbl')[index];
	if (!table) return [];
	return [...table.querySelectorAll('tbody tr')].map((tr) =>
		[...tr.cells].map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
	);
};

export const headers = (root, index = 0) => {
	const table = root.querySelectorAll('table.tbl')[index];
	if (!table) return [];
	return [...table.querySelectorAll('thead th')].map((n) =>
		n.textContent.replace(/[▲▼]/g, '').replace(/\s+/g, ' ').trim(),
	);
};

const MONTHS_19 = [
	'2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
	'2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
	'2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07',
];
const MONTHS_7 = MONTHS_19.slice(12);
const PRIOS = ['P1', 'P2', 'P3', 'P4'];
const REGIONS = [
	{ code: 'AAA', name: 'Alfa' },
	{ code: 'BBB', name: 'Beta' },
];

const ramp = (n, base, step) => Array.from({ length: n }, (_, i) => Number((base + i * step).toFixed(2)));

function byPrio(n, base, step) {
	return Object.fromEntries(PRIOS.map((p, i) => [p, ramp(n, base + i * 5, step)]));
}

export function makePayload(patch = {}) {
	const months = patch.months ?? MONTHS_7;
	const monthsLong = patch.monthsFrom2025 ?? MONTHS_19;
	const n = monthsLong.length;
	const rn = months.length;

	const base = {
		meta: {
			generatedAt: '2026-08-25T11:52:39.424Z',
			updatedDate: '2026-08-25',
			originMonth: '2026-01',
			latestMonth: monthsLong[n - 1],
			latestIsPreliminary: true,
			months,
			monthsFrom2025: monthsLong,
			priorities: PRIOS,
			areas: ['Országos', 'Budapest'],
			regions: REGIONS,
		},
		topic1: {
			month: monthsLong[n - 1],
			priorityLabel: 'P1',
			items: [
				{ area: 'Országos', p90: 26.4, p90Prev: 26, esetszam: 12000 },
				{ area: 'Budapest', p90: 24.6, p90Prev: 24.5, esetszam: 2400 },
			],
		},
		phases: {
			month: monthsLong[n - 1],
			area: 'Országos',
			priority: 'P1',
			esetszam: 12000,
			items: [
				{ key: 'esr_cad', atlag: 1.4, median: 1.07, p75: 1.45, p90: 2.17 },
				{ key: 'cad_cad', atlag: 1.38, median: 0.43, p75: 0.53, p90: 0.72 },
				{ key: 'cad_bej', atlag: 2.12, median: 1.8, p75: 2.77, p90: 3.88 },
				{ key: 'bej_erk', atlag: 12.4, median: 11.12, p75: 15.77, p90: 20.8 },
			],
			sum: 17.3,
			total: 17.22,
		},
		topic2: {
			months: monthsLong,
			byArea: {
				Országos: {
					median: byPrio(n, 15, 0.1),
					p75: byPrio(n, 20, 0.1),
					p90: byPrio(n, 26, 0.1),
					esetszam: Object.fromEntries(PRIOS.map((p, i) => [p, ramp(n, 10000 + i * 1000, 10)])),
				},
				Budapest: {
					median: byPrio(n, 16, 0.1),
					p75: byPrio(n, 19, 0.1),
					p90: byPrio(n, 24, 0.1),
					esetszam: Object.fromEntries(PRIOS.map((p, i) => [p, ramp(n, 2000 + i * 200, 5)])),
				},
			},
		},
		topic3: { months, byArea: {} },
		topic4: {
			month: months[rn - 2] ?? months[rn - 1],
			rows: REGIONS.map((r, i) => ({
				code: r.code,
				name: r.name,
				byPriority: Object.fromEntries(
					PRIOS.map((p, j) => [p, { median: 9 + i + j, p75: 13 + i + j, p90: 18 + i + j }]),
				),
			})),
		},
		topic5: {
			month: months[rn - 1],
			rows: REGIONS.map((r, i) => ({
				code: r.code,
				name: r.name,
				byPriority: Object.fromEntries(
					PRIOS.map((p, j) => [p, { median: 13 + i + j, p75: 18 + i + j, p90: 23 + i + j }]),
				),
			})),
		},
		regioTrend: {
			months,
			byRegion: Object.fromEntries(
				REGIONS.map((r, i) => [
					r.code,
					{
						median: Object.fromEntries(PRIOS.map((p, j) => [p, ramp(rn, 13 + i + j, 0.1)])),
						p75: Object.fromEntries(PRIOS.map((p, j) => [p, ramp(rn, 18 + i + j, 0.1)])),
						p90: Object.fromEntries(PRIOS.map((p, j) => [p, ramp(rn, 23 + i + j, 0.1)])),
					},
				]),
			),
		},
	};

	for (const [k, v] of Object.entries(patch)) {
		if (k === 'months' || k === 'monthsFrom2025') continue;
		if (v === undefined) delete base[k];
		else if (k === 'meta') base.meta = { ...base.meta, ...v };
		else base[k] = v;
	}
	return base;
}

export const MONTHS = { long: MONTHS_19, short: MONTHS_7 };
