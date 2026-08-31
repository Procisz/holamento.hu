import { afterEach, describe, expect, it, vi } from 'vitest';
import { CACHE_KEY } from '../../src/config.js';
import { clearCache, fetchData, loadCache, parsePayload, saveCache } from '../../src/data/fetchData.js';
import { realPayload } from '../helpers.js';

const VALID = JSON.stringify(realPayload());

function textResponse(body, { status = 200, headers = {} } = {}) {
	return {
		status,
		ok: status >= 200 && status < 300,
		headers: { get: (k) => headers[k] ?? null },
		body: null,
		text: () => Promise.resolve(body),
	};
}

function streamResponse(body, { status = 200, headers = {}, chunks = 2 } = {}) {
	const bytes = new TextEncoder().encode(body);
	const size = Math.ceil(bytes.length / chunks);
	const parts = [];
	for (let i = 0; i < bytes.length; i += size) parts.push(bytes.slice(i, i + size));
	let idx = 0;
	return {
		status,
		ok: status >= 200 && status < 300,
		headers: { get: (k) => headers[k] ?? null },
		body: {
			getReader: () => ({
				read: () =>
					Promise.resolve(idx < parts.length ? { done: false, value: parts[idx++] } : { done: true, value: undefined }),
			}),
		},
		text: () => Promise.resolve(body),
	};
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('parsePayload', () => {
	it('should accept valid JSON', () => {
		expect(parsePayload(VALID).meta.latestMonth).toBe('2026-07');
	});

	it('should throw a readable error for malformed JSON', () => {
		expect(() => parsePayload('{')).toThrowError(/sérült vagy hiányos/);
	});

	it.each([
		['not an object', '"text"'],
		['null', 'null'],
		['missing latestMonth', '{"meta":{},"topic2":{},"regioTrend":{}}'],
		['missing topic2', '{"meta":{"latestMonth":"2026-07"},"regioTrend":{}}'],
		['missing regioTrend', '{"meta":{"latestMonth":"2026-07"},"topic2":{}}'],
	])('throws for a bad shape: %s', (_name, body) => {
		expect(() => parsePayload(body)).toThrowError(/nem a várt mentőstatisztika/);
	});
});

describe('cache', () => {
	it('should save, load and clear', () => {
		expect(loadCache()).toBeNull();
		saveCache({ a: 1 });
		expect(JSON.parse(localStorage.getItem(CACHE_KEY))).toEqual({ a: 1 });
		expect(loadCache()).toEqual({ a: 1 });
		clearCache();
		expect(loadCache()).toBeNull();
	});

	it('should return null for corrupt content', () => {
		localStorage.setItem(CACHE_KEY, '{not json');
		expect(loadCache()).toBeNull();
	});

	it('should not throw when storage is unavailable', () => {
		const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('quota exceeded');
		});
		const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		const rem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(() => saveCache({ a: 1 })).not.toThrow();
		expect(loadCache()).toBeNull();
		expect(() => clearCache()).not.toThrow();
		set.mockRestore();
		get.mockRestore();
		rem.mockRestore();
	});
});

describe('fetchData', () => {
	it('should download as a stream and report progress', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(streamResponse(VALID, { headers: { 'Content-Length': String(VALID.length) } }))));
		const seen = [];
		const data = await fetchData((p) => seen.push(p));
		expect(data.meta.latestMonth).toBe('2026-07');
		expect(seen.at(-1).pct).toBe(1);
		expect(seen.at(-1).received).toBeGreaterThan(0);
		expect(seen.some((p) => p.expected > 0)).toBe(true);
		expect(localStorage.getItem('holamento-payload-bytes')).toBe(String(seen.at(-1).received));
		expect(Number(localStorage.getItem('holamento-load-ms'))).toBeGreaterThanOrEqual(0);
	});

	it('should work without a progress callback', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(streamResponse(VALID))));
		await expect(fetchData()).resolves.toBeTruthy();
	});

	it('should complete without a Content-Length header', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(streamResponse(VALID))));
		const seen = [];
		await fetchData((p) => seen.push(p));
		expect(seen.some((p) => p.expected === null)).toBe(true);
		expect(seen.at(-1).pct).toBe(1);
	});

	it('should use the stored payload size when present', async () => {
		localStorage.setItem('holamento-payload-bytes', String(VALID.length));
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(streamResponse(VALID))));
		const seen = [];
		await fetchData((p) => seen.push(p));
		expect(seen.some((p) => p.expected === VALID.length)).toBe(true);
	});

	it('should fall back to reading text without a stream', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(textResponse(VALID))));
		const seen = [];
		const data = await fetchData((p) => seen.push(p));
		expect(data.meta.latestMonth).toBe('2026-07');
		expect(seen.at(-1)).toEqual({ pct: 1, received: VALID.length, expected: VALID.length });
	});

	it('should report a server error for a 5xx response', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(textResponse('', { status: 503 }))));
		await expect(fetchData()).rejects.toThrowError(/szerveren hiba/);
	});

	it('should report the status code for other failures', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(textResponse('', { status: 404 }))));
		await expect(fetchData()).rejects.toThrowError('HTTP 404');
	});

	it('should propagate a network error', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network down'))));
		await expect(fetchData()).rejects.toThrowError('network down');
	});

	it('should throw a parse error for malformed content', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(textResponse('{'))));
		await expect(fetchData()).rejects.toThrowError(/sérült vagy hiányos/);
	});

	it('should still return the payload when storage is unavailable', async () => {
		const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('quota exceeded');
		});
		const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(textResponse(VALID))));
		await expect(fetchData()).resolves.toBeTruthy();
		set.mockRestore();
		get.mockRestore();
	});

	it('should emit estimated progress on a slow response and then clear the ticker', async () => {
		vi.useFakeTimers();
		let release;
		vi.stubGlobal('fetch', vi.fn(() => new Promise((res) => { release = () => res(textResponse(VALID)); })));
		const seen = [];
		const pending = fetchData((p) => seen.push(p));
		await vi.advanceTimersByTimeAsync(350);
		expect(seen.some((p) => p.estimated === true)).toBe(true);
		const ticks = seen.length;
		release();
		await pending;
		await vi.advanceTimersByTimeAsync(500);
		expect(seen.filter((p) => p.estimated === true).length).toBe(ticks);
		expect(seen.at(-1).pct).toBe(1);
		vi.useRealTimers();
	});

	it('should never report decreasing progress', async () => {
		vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(streamResponse(VALID, { chunks: 5, headers: { 'Content-Length': String(VALID.length * 4) } }))));
		const seen = [];
		await fetchData((p) => seen.push(p));
		const pcts = seen.map((p) => p.pct);
		expect(pcts).toEqual([...pcts].sort((a, b) => a - b));
		expect(pcts.at(-1)).toBe(1);
	});
});
