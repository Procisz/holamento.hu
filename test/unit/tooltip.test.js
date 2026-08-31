import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { initTooltips, refreshTip } from '../../src/ui/tooltip.js';
import { mount } from '../helpers.js';

const tip = () => document.querySelector('.float-tip');
const shown = () => tip()?.style.display === 'block';
const box = () => {
	const t = tip();
	return {
		left: Number.parseFloat(t.style.left),
		top: Number.parseFloat(t.style.top),
	};
};

function hint({ cls = 'info-dot', text = 'a hint', width = 24, height = 24, left = 10, top = 10 } = {}) {
	const el = document.createElement('button');
	el.className = cls;
	el.dataset.tip = text;
	el.getBoundingClientRect = () => ({
		left, top, width, height, right: left + width, bottom: top + height, x: left, y: top,
	});
	mount().appendChild(el);
	return el;
}

function sizeTip(width, height) {
	const t = tip();
	Object.defineProperty(t, 'offsetWidth', { configurable: true, value: width });
	Object.defineProperty(t, 'offsetHeight', { configurable: true, value: height });
}

const tap = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const hover = (el, clientX = 0, clientY = 0) =>
	el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX, clientY }));

beforeAll(initTooltips);

beforeEach(() => {
	vi.stubGlobal('innerWidth', 440);
	vi.stubGlobal('innerHeight', 900);
	document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});

describe('tooltip positioning', () => {
	it('should keep a wide tooltip inside a narrow viewport', () => {
		const el = hint({ left: 400, top: 40 });
		hover(el, 420, 60);
		sizeTip(340, 120);
		hover(hint({ left: 400, top: 40, text: 'another hint' }), 430, 70);
		expect(box().left).toBeGreaterThanOrEqual(12);
		expect(box().left + 340).toBeLessThanOrEqual(440 - 12);
	});

	it('should never place the tooltip off the left edge', () => {
		const el = hint({ left: 0, top: 500 });
		hover(el, 5, 505);
		sizeTip(340, 120);
		hover(hint({ left: 0, top: 500, text: 'left edge' }), 5, 505);
		expect(box().left).toBeGreaterThanOrEqual(12);
	});

	it('should never place the tooltip below the bottom edge', () => {
		hover(hint({ top: 880 }), 20, 890);
		sizeTip(200, 200);
		hover(hint({ top: 880, text: 'bottom edge' }), 20, 890);
		expect(box().top).toBeGreaterThanOrEqual(12);
		expect(box().top + 200).toBeLessThanOrEqual(900 - 12);
	});

	it('should anchor to the element when there is no pointer', () => {
		const el = hint({ left: 100, top: 200, width: 20, height: 20 });
		el.focus();
		el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		expect(shown()).toBe(true);
		expect(box().left).toBeGreaterThanOrEqual(12);
	});
});

describe('tooltip on touch', () => {
	it('should show the hint on a tap without any hover', () => {
		const el = hint();
		tap(el);
		expect(shown()).toBe(true);
		expect(tip().textContent).toBe('a hint');
	});

	it('should show the hint on a tap that follows a synthetic hover', () => {
		const el = hint();
		hover(el, 10, 10);
		tap(el);
		expect(shown()).toBe(true);
	});

	it('should hide the hint on a second tap', () => {
		const el = hint();
		tap(el);
		expect(shown()).toBe(true);
		tap(el);
		expect(shown()).toBe(false);
	});

	it('should work for a header info element', () => {
		const el = hint({ cls: 'info', text: 'header note' });
		tap(el);
		expect(shown()).toBe(true);
		expect(tip().textContent).toBe('header note');
	});

	it('should switch to another hint on tap', () => {
		const first = hint({ text: 'first' });
		const second = hint({ text: 'second' });
		tap(first);
		tap(second);
		expect(shown()).toBe(true);
		expect(tip().textContent).toBe('second');
	});

	it('should not open on an action control that only carries a title', () => {
		const btn = document.createElement('button');
		btn.className = 'range-quick';
		btn.dataset.tip = 'quick range';
		mount().appendChild(btn);
		tap(btn);
		expect(shown()).toBe(false);
	});

	it('should hide when tapping elsewhere', () => {
		tap(hint());
		expect(shown()).toBe(true);
		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(shown()).toBe(false);
	});
});

describe('tooltip dismissal', () => {
	it('should hide on scroll', () => {
		tap(hint());
		document.dispatchEvent(new Event('scroll', { bubbles: true }));
		expect(shown()).toBe(false);
	});

	it('should hide on resize', () => {
		tap(hint());
		window.dispatchEvent(new Event('resize'));
		expect(shown()).toBe(false);
	});

	it('should hide on Escape', () => {
		tap(hint());
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(shown()).toBe(false);
	});

	it('should ignore other keys', () => {
		tap(hint());
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
		expect(shown()).toBe(true);
	});

	it('should hide when hovering an element without a hint', () => {
		hover(hint(), 10, 10);
		expect(shown()).toBe(true);
		hover(document.body, 200, 200);
		expect(shown()).toBe(false);
	});

	it('should hide on focusout', () => {
		tap(hint());
		document.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		expect(shown()).toBe(false);
	});
});

describe('refreshTip', () => {
	it('should do nothing without a hint', () => {
		const el = document.createElement('span');
		mount().appendChild(el);
		expect(() => refreshTip(el)).not.toThrow();
		expect(shown()).toBe(false);
		expect(() => refreshTip(null)).not.toThrow();
	});

	it('should update the text of a hovered element', () => {
		const el = hint({ text: 'first' });
		el.matches = (sel) => sel === ':hover' || Element.prototype.matches.call(el, sel);
		hover(el, 10, 10);
		el.dataset.tip = 'second';
		refreshTip(el);
		expect(tip().textContent).toBe('second');
	});

	it('should skip an element that is not hovered', () => {
		const el = hint({ text: 'first' });
		refreshTip(el);
		expect(shown()).toBe(false);
	});
});
