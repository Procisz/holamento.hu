import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DATA_URL } from '../../src/config.js';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const head = html.slice(0, html.indexOf('</head>'));
const preload = head.match(/<link rel="preload"[^>]*>/)?.[0] ?? '';

describe('data preload', () => {
	it('should preload the data file the app actually fetches', () => {
		expect(preload).not.toBe('');
		const href = preload.match(/href="([^"]+)"/)?.[1];
		expect(new URL(href, 'https://holamento.hu/').pathname).toBe(
			new URL(DATA_URL, 'https://holamento.hu/').pathname,
		);
	});

	it('should declare the fetch destination', () => {
		expect(preload).toContain('as="fetch"');
	});

	it('should carry crossorigin so the preload is reused instead of fetched twice', () => {
		expect(preload).toContain('crossorigin');
	});

	it('should come before the module script so the preload scanner sees it first', () => {
		expect(head.indexOf('rel="preload"')).toBeLessThan(head.indexOf('<title'));
	});
});
