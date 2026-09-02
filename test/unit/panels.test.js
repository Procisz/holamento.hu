import { describe, expect, it } from 'vitest';
import { PANELS } from '../../src/app/panels.js';

const loaded = await Promise.all(PANELS.map((p) => p.load()));

describe('panel manifest', () => {
	it('should list every feature module once', () => {
		const ids = PANELS.map((p) => p.id);
		expect(ids).toEqual(['adatok', 'attekintes', 'trendek', 'fazisok', 'regiok', 'bontas', 'esetszamok', 'szoras']);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('should start with the tab that renders on load', () => {
		expect(PANELS[0].id).toBe('adatok');
	});

	it('should agree with the id every module exports', () => {
		expect(loaded.map((m) => m.id)).toEqual(PANELS.map((p) => p.id));
	});

	it('should agree with the icon every module exports', () => {
		expect(loaded.map((m) => m.iconId)).toEqual(PANELS.map((p) => p.iconId));
	});

	it('should expose a render function for every panel', () => {
		for (const mod of loaded) expect(typeof mod.render).toBe('function');
	});

	it('should keep the first panel out of the lazy chunks', () => {
		expect(PANELS[0].load()).not.toBeInstanceOf(Promise);
	});

	it('should load every other panel lazily', () => {
		for (const p of PANELS.slice(1)) expect(p.load()).toBeInstanceOf(Promise);
	});
});
