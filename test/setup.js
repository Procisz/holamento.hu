import { afterEach, beforeEach, vi } from 'vitest';

process.env.TZ = 'Europe/Budapest';

export const chartCalls = [];

class FakeApex {
	constructor(el, options) {
		this.el = el;
		this.options = options;
		this.destroyed = false;
		chartCalls.push({ el, options, chart: this });
	}
	render() {
		const svg = document.createElement('div');
		svg.className = 'apexcharts-svg';
		this.el.appendChild(svg);
		return Promise.resolve();
	}
	destroy() {
		this.destroyed = true;
		this.el.innerHTML = '';
	}
	updateOptions() {}
	updateSeries() {}
}

vi.mock('apexcharts', () => ({ default: FakeApex }));

if (!globalThis.requestAnimationFrame) {
	globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
	globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}

if (!globalThis.matchMedia) {
	globalThis.matchMedia = () => ({
		matches: false,
		addEventListener() {},
		removeEventListener() {},
	});
}

if (!globalThis.CSS) globalThis.CSS = {};
if (!globalThis.CSS.escape) {
	globalThis.CSS.escape = (v) => String(v).replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
}

beforeEach(() => {
	chartCalls.length = 0;
	localStorage.clear();
	document.documentElement.dataset.theme = 'light';
	document.documentElement.lang = 'hu';
	document.body.innerHTML = '';
});

afterEach(() => {
	vi.useRealTimers();
});
