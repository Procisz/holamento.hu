import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = resolve(process.cwd(), 'src/styles');
const files = readdirSync(dir).filter((f) => f.endsWith('.css'));

const HEADER_SELECTOR = /range-wrap|range-bar|app-header|header-inner|\.tabs/;

const LAYOUT_PROPS = [
	'grid-template-rows',
	'grid-template-columns',
	'height',
	'width',
	'padding',
	'margin',
	'border-top-width',
	'border-bottom-width',
	'inset',
	'top',
	'bottom',
];

function transitionRules(css) {
	const rules = [];
	for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		const selector = m[1].trim();
		const body = m[2];
		const t = body.match(/transition\s*:\s*([^;]+)/);
		if (t) rules.push({ selector, value: t[1].replace(/\s+/g, ' ').trim() });
	}
	return rules;
}

const all = files.flatMap((f) => transitionRules(readFileSync(join(dir, f), 'utf8')).map((r) => ({ ...r, file: f })));

describe('boot animations', () => {
	it('should find transition rules to check', () => {
		expect(all.length).toBeGreaterThan(0);
	});

	it('should never animate a header layout property before the app is ready', () => {
		const offenders = all
			.filter((r) => HEADER_SELECTOR.test(r.selector))
			.filter((r) => LAYOUT_PROPS.some((p) => new RegExp(`(^|[\\s,])${p}([\\s,]|$)`).test(r.value)))
			.filter((r) => !r.selector.includes('[data-ready]'))
			.map((r) => `${r.file}: ${r.selector} { transition: ${r.value} }`);
		expect(offenders).toEqual([]);
	});

	it('should gate every header grid-template-rows transition', () => {
		const gated = all.filter((r) => HEADER_SELECTOR.test(r.selector) && r.value.includes('grid-template-rows'));
		expect(gated.length).toBeGreaterThan(0);
		for (const r of gated) expect(r.selector).toContain('[data-ready]');
	});

	it('should keep the boot overlay out of the page flow so its own animations cannot move the page', () => {
		const css = readFileSync(join(dir, 'components.css'), 'utf8');
		const overlay = css.match(/\.overlay\s*\{([^}]*)\}/)[1];
		expect(overlay).toMatch(/position:\s*fixed/);
	});
});
