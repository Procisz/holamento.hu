import { describe, expect, it } from 'vitest';
import * as adatok from '../../src/features/adatok.js';
import { buildModel } from '../../src/data/model.js';
import { filterModel } from '../../src/data/range.js';
import { setLang } from '../../src/app/i18n.js';
import { makePayload, realPayload, renderPanel, texts } from '../helpers.js';

const real = () => buildModel(realPayload());
const terms = (el) => texts(el, '[data-cat="ido"] .def-list .def-term');

describe('info tab on the live payload', () => {
	it('should render every explanatory card', async () => {
		const el = await renderPanel(adatok, real());
		const titles = texts(el, '.card-title');
		expect(titles).toHaveLength(6);
		expect(titles[0]).toContain('Mi ez az oldal?');
	});

	it('should state that the site is independent and complements the source', async () => {
		const el = await renderPanel(adatok, real());
		expect(el.textContent).toContain('nem tartozik az Országos Mentőszolgálathoz');
		expect(el.textContent).toContain('csupán kiegészíti azt');
		expect(el.querySelector('a[href="https://stat.mentok.hu/"]')).not.toBeNull();
	});

	it('should explain all seven metric terms', async () => {
		const el = await renderPanel(adatok, real());
		expect(terms(el)).toEqual([
			'Kiérkezési idő',
			'Átlag',
			'Medián',
			'Percentilis',
			'P75',
			'P90',
			'15 perces vonal',
		]);
	});

	it('should give every term a description and a note', async () => {
		const el = await renderPanel(adatok, real());
		const bodies = [...el.querySelectorAll('[data-cat="ido"] .def-list .def-body')];
		for (const body of bodies) {
			expect(body.querySelectorAll('p')).toHaveLength(2);
			expect(body.querySelector('.def-note').textContent.length).toBeGreaterThan(10);
		}
	});

	it('should list six priority levels with an example each', async () => {
		const el = await renderPanel(adatok, real());
		const badges = texts(el, '.prio-badge');
		expect(badges).toEqual(['KP1', 'P1', 'P2', 'P3', 'P4', 'P5']);
		const examples = texts(el, '.def-note').filter((t) => t.startsWith('Példa'));
		expect(examples).toHaveLength(6);
		expect(examples[0]).toContain('újraélesztés');
	});

	it('should mark the highlighted priority with its own colour token', async () => {
		const el = await renderPanel(adatok, real());
		const codes = [...el.querySelectorAll('.prio-badge')].map((n) => n.dataset.prio);
		expect(codes).toEqual(['kp1', 'p1', 'p2', 'p3', 'p4', 'p5']);
	});

	it('should note that the published data only covers P1 to P4', async () => {
		const el = await renderPanel(adatok, real());
		expect(el.textContent).toContain('P1-től P4-ig');
	});

	it('should list every region with its counties', async () => {
		const el = await renderPanel(adatok, real());
		const codes = texts(el, '.region-code');
		expect(codes).toEqual(['DAR', 'DDR', 'ÉAR', 'ÉMR', 'KDR', 'KMR', 'NYDR']);
		expect(el.textContent).toContain('Bács-Kiskun');
		expect(el.textContent).toContain('Győr-Moson-Sopron');
		expect(el.textContent).toContain('nem teszi közzé');
	});

	it('should report the freshness of the data', async () => {
		const el = await renderPanel(adatok, real());
		expect(el.textContent).toContain('2026. aug. 25');
		expect(el.textContent).toContain('2026. július');
		expect(el.textContent).toContain('előzetes');
	});

	it('should list six limitations', async () => {
		const el = await renderPanel(adatok, real());
		const limits = [...el.querySelectorAll('.card')].at(-1);
		expect(limits.querySelectorAll('.fact-list li')).toHaveLength(6);
		expect(limits.textContent).toContain('egyetlen hónapra');
	});

	it('should start every explanatory sentence with a capital letter', async () => {
		const el = await renderPanel(adatok, real());
		const lower = [...el.querySelectorAll('p, .def-term')]
			.map((n) => n.textContent.trim())
			.filter((t) => t && t[0] === t[0].toLowerCase() && t[0] !== t[0].toUpperCase());
		expect(lower).toEqual([]);
	});

	it('should spell out that P75 and P90 are percentile abbreviations', async () => {
		const el = await renderPanel(adatok, real());
		const text = el.textContent;
		expect(text).toContain('75. percentilis rövidítése');
		expect(text).toContain('90. percentilis rövidítése');
	});

	it('should carry no hint dots by design', async () => {
		const el = await renderPanel(adatok, real());
		expect(el.querySelectorAll('.info-dot')).toHaveLength(0);
	});
});

describe('info tab and the selected period', () => {
	it('should read the meta from the unfiltered model', async () => {
		const f = filterModel(real(), '2026-01', '2026-03');
		const el = await renderPanel(adatok, f);
		expect(el.textContent).toContain('2026. július');
	});
});

describe('info tab without data', () => {
	it('should omit the region card when the source lists no regions', async () => {
		const el = await renderPanel(adatok, buildModel(makePayload({ meta: { regions: [] } })));
		expect(texts(el, '.card-title')).toHaveLength(5);
		expect(el.querySelector('.region-list')).toBeNull();
	});

	it('should skip unknown region codes', async () => {
		const p = makePayload({ meta: { regions: [{ code: 'ZZZ', name: 'Unknown' }, { code: 'DAR', name: 'Dél-alföldi' }] } });
		const el = await renderPanel(adatok, buildModel(p));
		expect(texts(el, '.region-code')).toEqual(['DAR']);
	});

	it('should fall back to the known priorities when meta lists none', async () => {
		const p = makePayload({ meta: { priorities: ['P9'] } });
		const el = await renderPanel(adatok, buildModel(p));
		expect(texts(el, '.prio-badge')).toEqual(['KP1', 'P1', 'P2', 'P3', 'P4', 'P5']);
	});

	it('should show only the highlighted and P5 rows when the source lists no usable priority', async () => {
		const model = buildModel(makePayload());
		model.meta.priorities = ['P9'];
		const el = await renderPanel(adatok, model);
		expect(texts(el, '.prio-badge')).toEqual(['KP1', 'P5']);
	});

	it('should omit the freshness lines when the meta is empty', async () => {
		const el = await renderPanel(adatok, buildModel({}));
		expect(el.textContent).not.toContain('Legutóbbi közzététel');
		expect(el.querySelector('.error-text')).toBeNull();
	});

	it('should mark the latest month as final when it is not preliminary', async () => {
		const el = await renderPanel(adatok, buildModel(makePayload({ meta: { latestIsPreliminary: false } })));
		expect(el.textContent).toContain('A legfrissebb hónap');
		expect(el.textContent).not.toContain('Ez még előzetes adat');
	});
});

describe('info tab in other languages', () => {
	it('should render in English', async () => {
		setLang('en');
		const el = await renderPanel(adatok, real());
		expect(el.textContent).toContain('What is this site?');
		expect(el.textContent).toContain('Percentile');
		expect(terms(el)).toContain('Average');
		setLang('hu');
	});

	it('should render in German', async () => {
		setLang('de');
		const el = await renderPanel(adatok, real());
		expect(el.textContent).toContain('Was ist diese Seite?');
		expect(terms(el)).toContain('Perzentil');
		setLang('hu');
	});
});
