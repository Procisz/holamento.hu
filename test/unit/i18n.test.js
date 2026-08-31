import { afterEach, describe, expect, it, vi } from 'vitest';
import { LANGS, currentLang, currentLocale, initLang, setLang, t, tList, tPlural } from '../../src/app/i18n.js';

afterEach(() => {
	setLang('hu');
	vi.resetModules();
});

describe('language selection', () => {
	it('should know three languages and default to Hungarian', () => {
		expect(LANGS.map((l) => l.id)).toEqual(['hu', 'en', 'de']);
		expect(currentLang()).toBe('hu');
		expect(currentLocale()).toBe('hu-HU');
	});

	it('should switch, persist and dispatch an event (setLang)', () => {
		const seen = [];
		document.addEventListener('holamento:langchange', () => seen.push(currentLang()));
		setLang('de');
		expect(currentLang()).toBe('de');
		expect(currentLocale()).toBe('de-DE');
		expect(localStorage.getItem('holamento-lang')).toBe('de');
		expect(document.documentElement.lang).toBe('de');
		expect(seen).toEqual(['de']);
	});

	it('should ignore unknown languages and no op switches', () => {
		const seen = [];
		document.addEventListener('holamento:langchange', () => seen.push(1));
		setLang('fr');
		expect(currentLang()).toBe('hu');
		setLang('hu');
		expect(seen).toHaveLength(0);
	});

	it('should apply the language to the document (initLang)', () => {
		document.documentElement.lang = 'xx';
		initLang();
		expect(document.documentElement.lang).toBe(currentLang());
	});

	it('should start from the stored language when it is valid', async () => {
		localStorage.setItem('holamento-lang', 'en');
		vi.resetModules();
		const mod = await import('../../src/app/i18n.js');
		expect(mod.currentLang()).toBe('en');
	});

	it('should fall back to Hungarian for an invalid stored language', async () => {
		localStorage.setItem('holamento-lang', 'kl');
		vi.resetModules();
		const mod = await import('../../src/app/i18n.js');
		expect(mod.currentLang()).toBe('hu');
	});

	it('should survive an unavailable storage', async () => {
		const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		vi.resetModules();
		const mod = await import('../../src/app/i18n.js');
		expect(mod.currentLang()).toBe('hu');
		expect(() => mod.setLang('en')).not.toThrow();
		expect(mod.currentLang()).toBe('en');
		getItem.mockRestore();
		setItem.mockRestore();
	});
});

describe('t', () => {
	it('should resolve a key', () => {
		expect(t('common.minutes')).toBe('perc');
	});

	it('should substitute placeholders', () => {
		expect(t('common.casesUnit', { n: '12' })).toBe('12 eset');
	});

	it('should leave unknown placeholders untouched', () => {
		expect(t('common.casesUnit', { other: '1' })).toBe('{n} eset');
	});

	it('should leave placeholders with a null value untouched', () => {
		expect(t('common.casesUnit', { n: null })).toBe('{n} eset');
	});

	it('should collapse a period doubled by the substituted value', () => {
		expect(t('common.casesUnit', { n: '2026. aug. 25.' })).toBe('2026. aug. 25. eset');
		expect(t('adatok.fresh.latest', { month: '2026. júl.' })).not.toContain('..');
		expect(t('adatok.fresh.latest', { month: '2026. júl.' })).toContain('2026. júl.');
	});

	it('should leave a long month name with its own sentence period', () => {
		const out = t('adatok.fresh.latest', { month: '2026. július' });
		expect(out).toContain('2026. július.');
	});

	it('should keep an ellipsis intact', () => {
		expect(t('common.casesUnit', { n: 'a...' })).toBe('a... eset');
	});

	it('should not touch a string rendered without variables', () => {
		expect(t('common.search')).toBe('Keresés…');
	});

	it('should return the key itself when it is unknown', () => {
		expect(t('no.such.key')).toBe('no.such.key');
	});

	it('should return the key when the value is not a string', () => {
		expect(t('quips')).toBe('quips');
	});

	it('should fall back to Hungarian for a missing translation', () => {
		setLang('en');
		expect(t('common.minutes')).not.toBe('perc');
		expect(t('no.such.key')).toBe('no.such.key');
	});
});

describe('tPlural', () => {
	it('should pick the singular form when one exists', () => {
		expect(tPlural('common.casesUnit', 1)).toBe('1 eset');
	});

	it('should pick the plural form', () => {
		expect(tPlural('common.casesUnit', 5)).toBe('5 eset');
	});

	it('should treat minus one as singular', () => {
		expect(tPlural('common.casesUnit', -1)).toBe('-1 eset');
	});

	it('should pass further variables through', () => {
		expect(tPlural('range.note', 3)).toContain('3');
	});
});

describe('tList', () => {
	it('should return an array', () => {
		const list = tList('quips');
		expect(Array.isArray(list)).toBe(true);
		expect(list.length).toBeGreaterThan(0);
	});

	it('should return an empty array for a non array key', () => {
		expect(tList('common.minutes')).toEqual([]);
		expect(tList('no.such.key')).toEqual([]);
	});
});
