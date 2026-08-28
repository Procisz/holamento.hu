import { DICT } from '../i18n/index.js';

export const LANGS = [
	{ id: 'hu', name: 'Magyar', locale: 'hu-HU' },
	{ id: 'en', name: 'English', locale: 'en-GB' },
	{ id: 'de', name: 'Deutsch', locale: 'de-DE' },
];

const LANG_KEY = 'holamento-lang';
const DEFAULT = 'hu';

function read() {
	try {
		const v = localStorage.getItem(LANG_KEY);
		return LANGS.some((l) => l.id === v) ? v : DEFAULT;
	} catch {
		return DEFAULT;
	}
}

let lang = read();

export function currentLang() {
	return lang;
}

export function currentLocale() {
	return (LANGS.find((l) => l.id === lang) ?? LANGS[0]).locale;
}

export function setLang(id) {
	if (!LANGS.some((l) => l.id === id) || id === lang) return;
	lang = id;
	try {
		localStorage.setItem(LANG_KEY, id);
	} catch {}
	document.documentElement.lang = id;
	document.dispatchEvent(new CustomEvent('holamento:langchange'));
}

export function initLang() {
	document.documentElement.lang = lang;
}

export function t(key, vars) {
	const raw = DICT[lang]?.[key] ?? DICT[DEFAULT]?.[key] ?? key;
	if (typeof raw !== 'string') return key;
	if (!vars) return raw;
	return raw.replace(/\{(\w+)\}/g, (m, name) =>
		(vars[name] == null ? m : String(vars[name])),
	);
}

export function tPlural(key, n, vars) {
	const one = DICT[lang]?.[`${key}.one`] ?? DICT[DEFAULT]?.[`${key}.one`];
	const suffix = one != null && Math.abs(n) === 1 ? '.one' : '.other';
	return t(`${key}${suffix}`, { ...vars, n });
}

export function tList(key) {
	const raw = DICT[lang]?.[key] ?? DICT[DEFAULT]?.[key];
	return Array.isArray(raw) ? raw : [];
}
