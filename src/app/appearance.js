import { THEME_KEY } from '../config.js';

const mq = matchMedia('(prefers-color-scheme: dark)');

function read() {
	try {
		return localStorage.getItem(THEME_KEY);
	} catch {
		return null;
	}
}

export function currentMode() {
	const s = read();
	return s === 'light' || s === 'dark' ? s : 'auto';
}


function apply() {
	const mode = currentMode();
	const dark = mode === 'auto' ? mq.matches : mode === 'dark';
	document.documentElement.dataset.theme = dark ? 'dark' : 'light';
	if (mode === 'auto') document.documentElement.dataset.themeAuto = '1';
	else delete document.documentElement.dataset.themeAuto;
	document.dispatchEvent(new CustomEvent('holamento:themechange'));
}

export function cycleTheme() {
	const next = { light: 'dark', dark: 'auto', auto: 'light' }[currentMode()];
	try {
		if (next === 'auto') localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, next);
	} catch {}
	apply();
	return next;
}

export function initAppearance() {
	apply();
	mq.addEventListener('change', () => {
		if (currentMode() === 'auto') apply();
	});
}
