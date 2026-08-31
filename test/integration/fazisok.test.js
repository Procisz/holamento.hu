import { beforeAll, describe, expect, it } from 'vitest';
import * as fazisok from '../../src/features/fazisok.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { chartFor, makePayload, realPayload, renderPanel, seriesOf, texts, warmCharts } from '../helpers.js';

const real = () => buildModel(realPayload());

beforeAll(warmCharts);

describe('phases on the live payload', () => {
	it('should render one card per phase plus the total', async () => {
		const el = await renderPanel(fazisok, real());
		const cards = texts(el, '.stat');
		expect(cards).toHaveLength(5);
		expect(cards[0]).toContain('1,4 perc');
		expect(cards[3]).toContain('12,4 perc');
		expect(cards[4]).toContain('17,3 perc');
	});

	it('should show the share of each phase on its card', async () => {
		const el = await renderPanel(fazisok, real());
		const cards = texts(el, '.stat');
		expect(cards[0]).toContain('8,1%');
		expect(cards[3]).toContain('71,7%');
	});

	it('should plot all four metrics (the detail chart)', async () => {
		await renderPanel(fazisok, real());
		const s = seriesOf('ch-faz-osszes');
		expect(s.map((x) => x.name)).toEqual(['Átlag', 'Medián', 'P75', 'P90']);
		expect(s[0].data).toEqual([1.4, 1.38, 2.12, 12.4]);
		expect(s[3].data).toEqual([2.17, 0.72, 3.88, 20.8]);
	});

	it('should use the averages (the share donut)', async () => {
		await renderPanel(fazisok, real());
		const opts = chartFor('ch-faz-arany');
		expect(opts.series).toEqual([1.4, 1.38, 2.12, 12.4]);
		expect(opts.labels).toHaveLength(4);
	});

	it('should list the four phases in the explainer', async () => {
		const el = await renderPanel(fazisok, real());
		const facts = texts(el, '.fact-list li');
		expect(facts.some((f) => f.includes('112'))).toBe(true);
		expect(facts.some((f) => f.includes('Riasztás'))).toBe(true);
	});

	it('should report the published total next to the summed one', async () => {
		const el = await renderPanel(fazisok, real());
		const gap = texts(el, '.fact-list li').find((f) => f.includes('17,30'));
		expect(gap).toBeDefined();
		expect(gap).toContain('17,22 perc');
		expect(gap).toContain('+0,08 perc');
	});
});

describe('phases total residual', () => {
	it('should stay silent when the gap is within the rounding bound', async () => {
		const p = makePayload({
			phases: { ...makePayload().phases, sum: 17.3, total: 17.29 },
		});
		const el = await renderPanel(fazisok, buildModel(p));
		expect(texts(el, '.fact-list li').some((f) => f.includes('kerekítés'))).toBe(false);
	});

	it('should speak up when the gap exceeds the rounding bound', async () => {
		const p = makePayload({
			phases: { ...makePayload().phases, total: 17 },
		});
		const el = await renderPanel(fazisok, buildModel(p));
		expect(texts(el, '.fact-list li').some((f) => f.includes('kerekítés'))).toBe(true);
	});

	it('should stay silent when the published total is missing', async () => {
		const p = makePayload();
		delete p.phases.total;
		delete p.phases.sum;
		const el = await renderPanel(fazisok, buildModel(p));
		expect(texts(el, '.fact-list li').some((f) => f.includes('kerekítés'))).toBe(false);
	});
});

describe('phases without data', () => {
	it('should show a dedicated message when the phase block is missing', async () => {
		const el = await renderPanel(fazisok, buildModel(makePayload({ phases: undefined })));
		expect(el.textContent).toContain('hiányoznak');
		expect(chartFor('ch-faz-osszes')).toBeNull();
	});

	it('should explain when the phase month falls outside the period', async () => {
		const f = filterModel(real(), '2026-01', '2026-03');
		const el = await renderPanel(fazisok, f);
		expect(el.textContent).toContain('nem esik a kiválasztott időszakba');
		expect(chartFor('ch-faz-osszes')).toBeNull();
	});

	it('should render no donut when every average is missing', async () => {
		const p = makePayload({
			phases: {
				month: '2026-07',
				items: [
					{ key: 'esr_cad', atlag: null, median: 1 },
					{ key: 'bej_erk', atlag: null, median: 2 },
				],
			},
		});
		const el = await renderPanel(fazisok, buildModel(p));
		expect(chartFor('ch-faz-arany')).toBeNull();
		expect(el.querySelector('.error-text')).toBeNull();
	});

	it('should survive an empty model', async () => {
		const el = await renderPanel(fazisok, buildModel({}));
		expect(el.querySelector('.error-text')).toBeNull();
	});
});
