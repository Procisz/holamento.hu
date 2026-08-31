import { describe, expect, it, vi } from 'vitest';
import { chartCard, emptyState, esc, prioBadge, signedMin, statCard, tipDot } from '../../src/ui/ui.js';
import { CATEGORIES, catColor, paletteColor, prioColor } from '../../src/ui/categories.js';
import { loadSeg, segHtml, wireSeg } from '../../src/ui/segmented.js';
import { mount } from '../helpers.js';

const html = (s) => {
	const el = document.createElement('div');
	el.innerHTML = s;
	return el;
};

describe('esc', () => {
	it('should encode every markup character', () => {
		expect(esc(`<a href="x">&'`)).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
	});

	it('should turn a missing value into an empty string', () => {
		expect(esc(null)).toBe('');
		expect(esc(undefined)).toBe('');
		expect(esc(0)).toBe('0');
	});
});

describe('signedMin', () => {
	it('should mark a decrease as positive', () => {
		expect(signedMin(-1.2)).toContain('class="pos"');
		expect(signedMin(-1.2)).toContain('-1,2 perc');
		expect(signedMin(0)).toContain('class="pos"');
	});

	it('should mark an increase as negative', () => {
		expect(signedMin(1.2)).toContain('class="neg"');
	});

	it('should invert the direction on request', () => {
		expect(signedMin(1.2, { goodWhenDown: false })).toContain('class="pos"');
		expect(signedMin(-1.2, { goodWhenDown: false })).toContain('class="neg"');
	});

	it('should render a dash for a missing value', () => {
		expect(signedMin(null)).toBe('-');
		expect(signedMin(Number.NaN)).toBe('-');
	});
});

describe('tipDot', () => {
	it('should render a button for the hint', () => {
		const el = html(tipDot('hint text'));
		const btn = el.querySelector('button.info-dot');
		expect(btn.dataset.tip).toBe('hint text');
		expect(btn.getAttribute('aria-label')).toBe('hint text');
	});

	it('should render nothing for an empty hint', () => {
		expect(tipDot('')).toBe('');
		expect(tipDot(null)).toBe('');
	});
});

describe('statCard', () => {
	it('should render label, value and footnote', () => {
		const el = html(statCard({ cat: 'ido', iconId: 'i-clock', label: 'Label', value: '10', foot: 'Foot', tip: 'Hint' }));
		expect(el.querySelector('.stat').dataset.cat).toBe('ido');
		expect(el.querySelector('.stat-label').textContent).toContain('Label');
		expect(el.querySelector('.stat-value').textContent).toBe('10');
		expect(el.querySelector('.stat-foot').textContent).toBe('Foot');
		expect(el.querySelector('.info-dot')).not.toBeNull();
		expect(el.querySelector('.icon-chip')).not.toBeNull();
	});

	it('should work without the optional parts', () => {
		const el = html(statCard({ label: 'Label', value: '1' }));
		expect(el.querySelector('.stat').hasAttribute('data-cat')).toBe(false);
		expect(el.querySelector('.stat-foot')).toBeNull();
		expect(el.querySelector('.icon-chip')).toBeNull();
		expect(el.querySelector('.info-dot')).toBeNull();
	});
});

describe('chartCard', () => {
	it('should create a holder with the given id', () => {
		const el = html(chartCard({ span: 12, cat: 'regio', iconId: 'i-map', title: 'Title', sub: 'Subtitle', id: 'ch-x-y', tip: 'Hint' }));
		const card = el.querySelector('.card');
		expect(card.dataset.span).toBe('12');
		expect(card.dataset.cat).toBe('regio');
		expect(el.querySelector('.card-title').textContent).toContain('Title');
		expect(el.querySelector('.card-sub').textContent).toBe('Subtitle');
		expect(el.querySelector('#ch-x-y')).not.toBeNull();
	});

	it('should render without subtitle, icon and hint', () => {
		const el = html(chartCard({ title: 'Title', id: 'ch-a-b' }));
		expect(el.querySelector('.card').dataset.span).toBe('6');
		expect(el.querySelector('.card-sub')).toBeNull();
		expect(el.querySelector('.icon-chip')).toBeNull();
	});
});

describe('emptyState', () => {
	it('should show title, message and hint', () => {
		const el = html(emptyState({ span: 6, iconId: 'i-map', title: 'Title', message: 'Message', hint: 'Hint' }));
		expect(el.querySelector('.card').dataset.span).toBe('6');
		expect(el.textContent).toContain('Title');
		expect(el.textContent).toContain('Message');
		expect(el.textContent).toContain('Hint');
	});

	it('should use the default message', () => {
		const el = html(emptyState({}));
		expect(el.textContent).toContain('Nincs elérhető adat');
		expect(el.querySelector('strong')).toBeNull();
		expect(el.querySelector('.card').dataset.span).toBe('12');
	});
});

describe('prioBadge', () => {
	it('should set a lowercase data-prio attribute', () => {
		const el = html(prioBadge('P1'));
		expect(el.querySelector('.prio-badge').dataset.prio).toBe('p1');
		expect(el.textContent).toBe('P1');
	});

	it('should handle the highlighted priority code', () => {
		expect(html(prioBadge('KP1')).querySelector('.prio-badge').dataset.prio).toBe('kp1');
	});
});

describe('categories', () => {
	it('should know seven topic categories', () => {
		expect(CATEGORIES.map((c) => c.id)).toEqual(['ido', 'fazis', 'regio', 'eset', 'szoras', 'cel', 'adat']);
	});

	it('should return a colour for every category', () => {
		for (const c of CATEGORIES) expect(typeof catColor(c.id)).toBe('string');
	});

	it('should fall back to the accent colour for an unknown category', () => {
		expect(catColor('unknown')).toBe(catColor('unknown'));
	});

	it('should wrap around (paletteColor)', () => {
		expect(paletteColor(0)).toBe(paletteColor(7));
		expect(paletteColor(1)).toBe(paletteColor(8));
	});

	it('should use a lowercase token (prioColor)', () => {
		expect(typeof prioColor('P1')).toBe('string');
		expect(prioColor('P1')).toBe(prioColor('p1'));
	});
});

describe('segmented control', () => {
	const OPTS = [
		{ id: 'a', label: 'A' },
		{ id: 'b', label: 'B' },
	];

	it('should read the stored value', () => {
		localStorage.setItem('k', 'b');
		expect(loadSeg('k', OPTS)).toBe('b');
	});

	it('should fall back for an unknown stored value', () => {
		localStorage.setItem('k', 'z');
		expect(loadSeg('k', OPTS, 'b')).toBe('b');
	});

	it('should return the first option without a fallback', () => {
		expect(loadSeg('k', OPTS)).toBe('a');
	});

	it('should return undefined for an empty option list', () => {
		expect(loadSeg('k', [])).toBeUndefined();
	});

	it('should return the fallback when storage is unavailable', () => {
		const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(loadSeg('k', OPTS, 'b')).toBe('b');
		spy.mockRestore();
	});

	it('should mark the active button (segHtml)', () => {
		const el = html(segHtml('k', OPTS, 'b', { label: 'Choose' }));
		const btns = [...el.querySelectorAll('button')];
		expect(btns.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
		expect(el.querySelector('.chip-row-label').textContent).toBe('Choose');
		expect(el.querySelector('[data-seg]').getAttribute('aria-label')).toBe('Choose');
	});

	it('should work without a label (segHtml)', () => {
		const el = html(segHtml('k', OPTS, 'a'));
		expect(el.querySelector('.chip-row-label')).toBeNull();
		expect(el.querySelector('[data-seg]').hasAttribute('aria-label')).toBe(false);
	});

	it('should notify and persist on click (wireSeg)', () => {
		const el = mount();
		el.innerHTML = segHtml('k', OPTS, 'a');
		const seen = [];
		wireSeg(el, 'k', (v) => seen.push(v));
		el.querySelector('[data-val="b"]').click();
		expect(seen).toEqual(['b']);
		expect(localStorage.getItem('k')).toBe('b');
	});

	it('should not notify when the active button is clicked', () => {
		const el = mount();
		el.innerHTML = segHtml('k', OPTS, 'a');
		const seen = [];
		wireSeg(el, 'k', (v) => seen.push(v));
		el.querySelector('[data-val="a"]').click();
		expect(seen).toEqual([]);
	});

	it('should ignore clicks outside a button', () => {
		const el = mount();
		el.innerHTML = segHtml('k', OPTS, 'a');
		const seen = [];
		wireSeg(el, 'k', (v) => seen.push(v));
		el.querySelector('[data-seg]').click();
		expect(seen).toEqual([]);
	});

	it('should not throw when the host is missing', () => {
		const el = mount();
		expect(() => wireSeg(el, 'missing', () => {})).not.toThrow();
	});

	it('should still notify when storage is unavailable', () => {
		const el = mount();
		el.innerHTML = segHtml('k', OPTS, 'a');
		const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		const seen = [];
		wireSeg(el, 'k', (v) => seen.push(v));
		el.querySelector('[data-val="b"]').click();
		expect(seen).toEqual(['b']);
		spy.mockRestore();
	});
});
