import { beforeEach, describe, expect, it, vi } from 'vitest';
import { activate, buildNav, initialTab, registerPanel, renderActive } from '../../src/app/router.js';
import { state } from '../../src/app/state.js';
import { flush } from '../helpers.js';

const PANELS = ['alpha', 'beta', 'gamma'];

function setUpNav(render = () => {}) {
	document.body.innerHTML = '<nav id="tab-nav"></nav><main id="app-main"></main>';
	for (const id of PANELS) registerPanel(id, `tab.${id}`, 'i-info', () => ({ render }));
	buildNav();
}

beforeEach(() => {
	state.activeTab = null;
	state.model = { meta: {} };
	state.renderedTabs = new Set();
	vi.stubGlobal('scrollTo', vi.fn());
	history.replaceState(null, '', '/');
});

describe('tab activation', () => {
	it('should show only the selected panel', () => {
		setUpNav();
		activate('beta');
		const visible = [...document.querySelectorAll('[data-tab-panel]')]
			.filter((s) => !s.hidden)
			.map((s) => s.dataset.tabPanel);
		expect(visible).toEqual(['beta']);
	});

	it('should mark the selected tab button', () => {
		setUpNav();
		activate('gamma');
		const selected = [...document.querySelectorAll('#tab-nav [role=tab]')]
			.filter((b) => b.getAttribute('aria-selected') === 'true')
			.map((b) => b.dataset.tab);
		expect(selected).toEqual(['gamma']);
	});

	it('should fall back to the first panel for an unknown id', () => {
		setUpNav();
		activate('nope');
		expect(state.activeTab).toBe('alpha');
	});

	it('should write the hash', () => {
		setUpNav();
		activate('beta');
		expect(location.hash).toBe('#beta');
	});
});

describe('scroll position on tab change', () => {
	it('should jump back to the top when the tab changes', () => {
		setUpNav();
		activate('alpha');
		scrollTo.mockClear();
		activate('beta');
		expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
	});

	it('should keep the position when the same tab is activated again', () => {
		setUpNav();
		activate('alpha');
		scrollTo.mockClear();
		activate('alpha');
		expect(scrollTo).not.toHaveBeenCalled();
	});

	it('should jump back to the top for an already rendered tab', async () => {
		setUpNav((model, mount) => {
			mount.innerHTML = '<div class="card"></div>';
		});
		activate('alpha');
		activate('beta');
		await flush();
		scrollTo.mockClear();
		activate('alpha');
		expect(scrollTo).toHaveBeenCalledTimes(1);
	});

	it('should survive an environment without scrollTo', () => {
		setUpNav();
		vi.stubGlobal('scrollTo', undefined);
		expect(() => activate('beta')).not.toThrow();
	});
});

describe('panel rendering', () => {
	it('should render a panel once', async () => {
		const render = vi.fn();
		setUpNav(render);
		activate('alpha');
		await flush();
		expect(render).toHaveBeenCalledTimes(1);
	});

	it('should render only once when activation and renderActive overlap', async () => {
		const render = vi.fn();
		setUpNav(render);
		activate('alpha');
		renderActive();
		await flush();
		expect(render).toHaveBeenCalledTimes(1);
	});

	it('should show an error card when a panel throws', async () => {
		setUpNav(() => {
			throw new Error('boom');
		});
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		activate('alpha');
		await flush();
		expect(document.querySelector('#panel-alpha .error-text')).not.toBeNull();
		expect(state.renderedTabs.has('alpha')).toBe(false);
		spy.mockRestore();
	});

	it('should do nothing without a model', async () => {
		const render = vi.fn();
		setUpNav(render);
		state.model = null;
		activate('alpha');
		await flush();
		expect(render).not.toHaveBeenCalled();
	});
});

describe('lazy panel loading', () => {
	function setUpLazy(loads) {
		document.body.innerHTML = '<nav id="tab-nav"></nav><main id="app-main"></main>';
		for (const id of PANELS) registerPanel(id, `tab.${id}`, 'i-info', loads[id]);
		buildNav();
	}

	it('should not load a module before its tab is activated', async () => {
		const load = vi.fn(() => ({ render: () => {} }));
		setUpLazy({ alpha: () => ({ render: () => {} }), beta: load, gamma: load });
		activate('alpha');
		await flush();
		expect(load).not.toHaveBeenCalled();
	});

	it('should load a module on first activation and reuse it afterwards', async () => {
		const render = vi.fn();
		const load = vi.fn(async () => ({ render }));
		setUpLazy({ alpha: load, beta: load, gamma: load });
		activate('alpha');
		await flush();
		activate('beta');
		await flush();
		activate('alpha');
		await flush();
		expect(load).toHaveBeenCalledTimes(2);
		expect(render).toHaveBeenCalledTimes(2);
	});

	it('should skip the render when the tab changed while the module was loading', async () => {
		const render = vi.fn();
		let release;
		const gate = new Promise((r) => {
			release = r;
		});
		setUpLazy({
			alpha: async () => {
				await gate;
				return { render };
			},
			beta: () => ({ render: () => {} }),
			gamma: () => ({ render: () => {} }),
		});
		activate('alpha');
		activate('beta');
		release();
		await flush();
		expect(render).not.toHaveBeenCalled();
		expect(state.renderedTabs.has('alpha')).toBe(false);
	});

	it('should skip the render when the model changed while the module was loading', async () => {
		const render = vi.fn();
		let release;
		const gate = new Promise((r) => {
			release = r;
		});
		setUpLazy({
			alpha: async () => {
				await gate;
				return { render };
			},
			beta: () => ({ render: () => {} }),
			gamma: () => ({ render: () => {} }),
		});
		activate('alpha');
		state.model = { meta: {} };
		release();
		await flush();
		expect(render).not.toHaveBeenCalled();
	});

	it('should report a failed module load as a render error', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		setUpLazy({
			alpha: () => Promise.reject(new Error('offline')),
			beta: () => ({ render: () => {} }),
			gamma: () => ({ render: () => {} }),
		});
		activate('alpha');
		await flush();
		expect(document.querySelector('#panel-alpha .error-text')).not.toBeNull();
		expect(state.renderedTabs.has('alpha')).toBe(false);
		spy.mockRestore();
	});

	it('should retry the load after a failure', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const render = vi.fn();
		let attempt = 0;
		const load = () => {
			attempt += 1;
			return attempt === 1 ? Promise.reject(new Error('offline')) : Promise.resolve({ render });
		};
		setUpLazy({ alpha: load, beta: () => ({ render: () => {} }), gamma: () => ({ render: () => {} }) });
		activate('alpha');
		await flush();
		activate('beta');
		await flush();
		activate('alpha');
		await flush();
		expect(render).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});
});

describe('initialTab', () => {
	it('should take a known hash', () => {
		setUpNav();
		history.replaceState(null, '', '#gamma');
		expect(initialTab()).toBe('gamma');
	});

	it('should fall back to the first panel for an unknown hash', () => {
		setUpNav();
		history.replaceState(null, '', '#nope');
		expect(initialTab()).toBe('alpha');
	});
});

describe('keyboard navigation', () => {
	const press = (key) =>
		document.getElementById('tab-nav').dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

	it('should move to the next tab with the right arrow', () => {
		setUpNav();
		activate('alpha');
		press('ArrowRight');
		expect(state.activeTab).toBe('beta');
	});

	it('should wrap around with the left arrow', () => {
		setUpNav();
		activate('alpha');
		press('ArrowLeft');
		expect(state.activeTab).toBe('gamma');
	});

	it('should jump to the first and the last tab', () => {
		setUpNav();
		activate('beta');
		press('End');
		expect(state.activeTab).toBe('gamma');
		press('Home');
		expect(state.activeTab).toBe('alpha');
	});

	it('should ignore other keys', () => {
		setUpNav();
		activate('beta');
		press('a');
		expect(state.activeTab).toBe('beta');
	});
});
