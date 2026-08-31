import { describe, expect, it, beforeEach } from 'vitest';
import * as fmt from '../../src/utils/fmt.js';
import { setLang } from '../../src/app/i18n.js';

const NBSP = /[\u00A0\u202F\u2009\u2007]/g;
const norm = (s) => String(s).replace(NBSP, ' ');

describe('number formatters, Hungarian locale', () => {
	it('should render whole numbers with thousand grouping (fmtNum)', () => {
		expect(norm(fmt.fmtNum(94930))).toBe('94 930');
		expect(fmt.fmtNum(2408)).toBe('2408');
		expect(fmt.fmtNum(0)).toBe('0');
		expect(fmt.fmtNum(15.6)).toBe('16');
	});

	it('should round to one decimal without padding (fmtNum1)', () => {
		expect(fmt.fmtNum1(1.72)).toBe('1,7');
		expect(fmt.fmtNum1(2)).toBe('2');
	});

	it('should always show two decimals (fmtNum2)', () => {
		expect(fmt.fmtNum2(0.67)).toBe('0,67');
		expect(fmt.fmtNum2(-0.019)).toBe('-0,02');
		expect(fmt.fmtNum2(2)).toBe('2,00');
	});

	it('should render a percentage with at most one decimal (fmtPct)', () => {
		expect(norm(fmt.fmtPct(0.274))).toBe('27,4%');
		expect(norm(fmt.fmtPct(1))).toBe('100%');
	});

	it('should render minutes with fmtMin and fmtMinShort', () => {
		expect(fmt.fmtMin(15.35)).toBe('15,4 perc');
		expect(fmt.fmtMin(15)).toBe('15,0 perc');
		expect(fmt.fmtMinShort(15.35)).toBe('15,4');
	});

	it('should keep two decimals (fmtMin2)', () => {
		expect(fmt.fmtMin2(17.3)).toBe('17,30 perc');
		expect(fmt.fmtMin2(17.22)).toBe('17,22 perc');
	});

	it('should add an explicit plus sign (fmtSignedMin, fmtSignedMin2)', () => {
		expect(fmt.fmtSignedMin(0.5)).toBe('+0,5 perc');
		expect(fmt.fmtSignedMin(-0.5)).toBe('-0,5 perc');
		expect(fmt.fmtSignedMin(0)).toBe('0,0 perc');
		expect(fmt.fmtSignedMin2(0.08)).toBe('+0,08 perc');
		expect(fmt.fmtSignedMin2(-0.08)).toBe('-0,08 perc');
		expect(fmt.fmtSignedMin2(0)).toBe('0,00 perc');
	});

	it('should take its unit from the dictionary (fmtCases)', () => {
		expect(norm(fmt.fmtCases(12123))).toBe('12 123 eset');
	});

	it.each([
		['fmtNum', fmt.fmtNum],
		['fmtNum1', fmt.fmtNum1],
		['fmtNum2', fmt.fmtNum2],
		['fmtPct', fmt.fmtPct],
		['fmtMin', fmt.fmtMin],
		['fmtMinShort', fmt.fmtMinShort],
		['fmtMin2', fmt.fmtMin2],
		['fmtSignedMin', fmt.fmtSignedMin],
		['fmtSignedMin2', fmt.fmtSignedMin2],
	])('%s renders a dash for missing and non finite values', (_name, fn) => {
		expect(fn(null)).toBe('-');
		expect(fn(undefined)).toBe('-');
		expect(fn(Number.NaN)).toBe('-');
		expect(fn(Number.POSITIVE_INFINITY)).toBe('-');
	});

	it('should render a dash for a missing value (fmtCases)', () => {
		expect(fmt.fmtCases(null)).toBe('-');
	});
});

describe('date and month formatters', () => {
	it('should format an ISO date (fmtDate)', () => {
		expect(norm(fmt.fmtDate('2026-08-25'))).toBe('2026. aug. 25.');
	});

	it('should render a dash for empty and invalid input (fmtDate)', () => {
		expect(fmt.fmtDate(null)).toBe('-');
		expect(fmt.fmtDate('')).toBe('-');
		expect(fmt.fmtDate('not-a-date')).toBe('-');
	});

	it('should render months with fmtYm and fmtYmFull', () => {
		expect(norm(fmt.fmtYm('2026-07'))).toBe('2026. júl.');
		expect(norm(fmt.fmtYmFull('2026-07'))).toBe('2026. július');
	});

	it('should render a dash for invalid input in the month formatters', () => {
		for (const bad of [null, undefined, '', 'x', '2026-xx']) {
			expect(fmt.fmtYm(bad)).toBe('-');
			expect(fmt.fmtYmFull(bad)).toBe('-');
		}
	});

	it('should return the length of the month and handle leap years (daysInMonth)', () => {
		expect(fmt.daysInMonth('2026-01')).toBe(31);
		expect(fmt.daysInMonth('2026-02')).toBe(28);
		expect(fmt.daysInMonth('2024-02')).toBe(29);
		expect(fmt.daysInMonth('2026-04')).toBe(30);
	});

	it('should return null for invalid input (daysInMonth)', () => {
		expect(fmt.daysInMonth(null)).toBeNull();
		expect(fmt.daysInMonth('')).toBeNull();
		expect(fmt.daysInMonth('bad')).toBeNull();
	});
});

describe('locale switching', () => {
	beforeEach(() => {
		setLang('hu');
	});

	it('should follow the selected language when formatting', () => {
		expect(fmt.fmtNum2(0.67)).toBe('0,67');
		setLang('en');
		expect(fmt.fmtNum2(0.67)).toBe('0.67');
		expect(norm(fmt.fmtYm('2026-07'))).toBe('Jul 2026');
		setLang('de');
		expect(fmt.fmtNum2(0.67)).toBe('0,67');
		setLang('hu');
		expect(norm(fmt.fmtYm('2026-07'))).toBe('2026. júl.');
	});
});
