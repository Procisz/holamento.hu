import { currentLocale, t } from '../app/i18n.js';

const cache = new Map();

function fmtOf(kind, options) {
	const key = `${currentLocale()}|${kind}`;
	let f = cache.get(key);
	if (!f) {
		f = kind.startsWith('d:')
			? new Intl.DateTimeFormat(currentLocale(), options)
			: new Intl.NumberFormat(currentLocale(), options);
		cache.set(key, f);
	}
	return f;
}

const num = () => fmtOf('n:0', { maximumFractionDigits: 0 });
const num1 = () => fmtOf('n:1', { maximumFractionDigits: 1 });
const num2 = () => fmtOf('n:2', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num1f = () => fmtOf('n:1f', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pct = () => fmtOf('n:pct', { style: 'percent', maximumFractionDigits: 1 });
const dateF = () => fmtOf('d:date', { year: 'numeric', month: 'short', day: 'numeric' });
const ymShort = () => fmtOf('d:ym', { year: 'numeric', month: 'short' });
const ymLong = () => fmtOf('d:ymLong', { year: 'numeric', month: 'long' });

export const fmtNum = (v) => (v == null || !Number.isFinite(v) ? '-' : num().format(v));
export const fmtNum1 = (v) => (v == null || !Number.isFinite(v) ? '-' : num1().format(v));
export const fmtNum2 = (v) => (v == null || !Number.isFinite(v) ? '-' : num2().format(v));
export const fmtPct = (v) => (v == null || !Number.isFinite(v) ? '-' : pct().format(v));

export const fmtMin = (v) =>
	(v == null || !Number.isFinite(v) ? '-' : `${num1f().format(v)} ${t('common.minutes')}`);
export const fmtMinShort = (v) => (v == null || !Number.isFinite(v) ? '-' : num1f().format(v));
export const fmtMin2 = (v) =>
	(v == null || !Number.isFinite(v) ? '-' : `${num2().format(v)} ${t('common.minutes')}`);
export const fmtSignedMin2 = (v) =>
	(v == null || !Number.isFinite(v)
		? '-'
		: `${v > 0 ? '+' : ''}${num2().format(v)} ${t('common.minutes')}`);
export const fmtSignedMin = (v) =>
	(v == null || !Number.isFinite(v)
		? '-'
		: `${v > 0 ? '+' : ''}${num1f().format(v)} ${t('common.minutes')}`);

export const fmtCases = (v) => (v == null ? '-' : t('common.casesUnit', { n: fmtNum(v) }));

function ymDate(ym) {
	if (!ym) return null;
	const [y, m] = String(ym).split('-').map(Number);
	if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
	return new Date(y, m - 1, 15);
}

export const fmtDate = (iso) => {
	if (!iso) return '-';
	const d = new Date(`${iso}T12:00:00`);
	return Number.isNaN(d.getTime()) ? '-' : dateF().format(d);
};

export const fmtYm = (ym) => {
	const d = ymDate(ym);
	return d ? ymShort().format(d) : '-';
};

export const fmtYmFull = (ym) => {
	const d = ymDate(ym);
	return d ? ymLong().format(d) : '-';
};

export function daysInMonth(ym) {
	if (!ym) return null;
	const [y, m] = String(ym).split('-').map(Number);
	if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
	return new Date(y, m, 0).getDate();
}
