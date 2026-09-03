import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ANALYTICS_ENDPOINT, ANALYTICS_HOST, CF_BEACON_TOKEN } from '../../src/config.js';
import { initAnalytics, scheduleAnalytics } from '../../src/app/analytics.js';

const injected = () => [...document.head.querySelectorAll('script[src]')];
const onHost = () => vi.spyOn(window, 'location', 'get').mockReturnValue({ hostname: ANALYTICS_HOST });

beforeEach(() => {
	for (const s of injected()) s.remove();
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('initAnalytics', () => {
	it('should stay silent on a host that is not the analytics host', () => {
		vi.spyOn(window, 'location', 'get').mockReturnValue({ hostname: 'example.invalid' });
		initAnalytics();
		expect(injected()).toHaveLength(0);
	});

	it('should inject both beacons on the analytics host', () => {
		onHost();
		initAnalytics();
		const srcs = injected().map((s) => s.src);
		expect(srcs.some((s) => s.startsWith(ANALYTICS_ENDPOINT))).toBe(true);
		expect(srcs.some((s) => s.includes('cloudflareinsights'))).toBe(true);
	});

	it('should pass the beacon token to Cloudflare', () => {
		onHost();
		initAnalytics();
		const cf = injected().find((s) => s.src.includes('cloudflareinsights'));
		expect(JSON.parse(cf.dataset.cfBeacon).token).toBe(CF_BEACON_TOKEN);
	});
});

describe('scheduleAnalytics', () => {
	it('should not load anything before the load event', () => {
		onHost();
		vi.stubGlobal('requestIdleCallback', vi.fn());
		scheduleAnalytics();
		expect(injected()).toHaveLength(0);
	});

	it('should schedule the beacons once the page has loaded', () => {
		onHost();
		const idle = vi.fn();
		vi.stubGlobal('requestIdleCallback', idle);
		scheduleAnalytics();
		dispatchEvent(new Event('load'));
		expect(idle).toHaveBeenCalledTimes(1);
	});

	it('should give requestIdleCallback an options object, not a delay', () => {
		onHost();
		const idle = vi.fn();
		vi.stubGlobal('requestIdleCallback', idle);
		scheduleAnalytics();
		dispatchEvent(new Event('load'));
		const [, options] = idle.mock.calls[0];
		expect(options).toBeTypeOf('object');
		expect(options.timeout).toBeGreaterThan(0);
	});

	it('should still load the beacons when the browser never goes idle', () => {
		onHost();
		vi.stubGlobal('requestIdleCallback', undefined);
		scheduleAnalytics();
		dispatchEvent(new Event('load'));
		vi.runAllTimers();
		expect(injected().length).toBeGreaterThan(0);
	});

	it('should run immediately when the document has already finished loading', () => {
		onHost();
		vi.stubGlobal('requestIdleCallback', undefined);
		vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
		scheduleAnalytics();
		vi.runAllTimers();
		expect(injected().length).toBeGreaterThan(0);
	});
});
