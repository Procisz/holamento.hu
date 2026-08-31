import { describe, expect, it, vi } from 'vitest';
import { PAGE_SIZES, cell, dataTable } from '../../src/ui/table.js';
import { flush, headers, mount, tableRows } from '../helpers.js';

const COLS = [
	{ key: 'name', label: 'Name' },
	{ key: 'value', label: 'Value', num: true },
];

const rowsOf = (names, values) =>
	names.map((n, i) => ({ name: cell(n, n), value: cell(values[i], String(values[i])) }));

async function render(config) {
	const el = mount();
	el.innerHTML = dataTable({ columns: COLS, rows: [], ...config });
	await flush();
	return el;
}

const pager = (el) => el.querySelector('.dt-pager span:nth-of-type(2)').textContent.trim();
const navButtons = (el) => [...el.querySelectorAll('.dt-nav button')];

describe('cell', () => {
	it('should store the raw value and the markup', () => {
		expect(cell(3, '<b>3</b>')).toEqual({ v: 3, html: '<b>3</b>' });
	});

	it('should use the value when no markup is given', () => {
		expect(cell(3).html).toBe('3');
		expect(cell(null).html).toBe('-');
		expect(cell(undefined).html).toBe('-');
	});
});

describe('dataTable rendering', () => {
	it('should render the header and the rows', async () => {
		const el = await render({ rows: rowsOf(['a', 'b'], [1, 2]) });
		expect(headers(el)).toEqual(['Name', 'Value']);
		expect(tableRows(el)).toEqual([['a', '1'], ['b', '2']]);
		expect(pager(el)).toBe('1-2 / 2');
	});

	it('should show a message for empty data', async () => {
		const el = await render({ rows: [] });
		expect(tableRows(el)).toEqual([['Nincs adat']]);
		expect(pager(el)).toBe('0 / 0');
	});

	it('should render a dash for a missing cell', async () => {
		const el = await render({ rows: [{ name: cell('a', 'a') }] });
		expect(tableRows(el)).toEqual([['a', '-']]);
	});

	it('should right align numeric columns', async () => {
		const el = await render({ rows: rowsOf(['a'], [1]) });
		expect(el.querySelectorAll('td')[1].className).toBe('num');
		expect(el.querySelectorAll('th')[1].className).toContain('num');
	});

	it('should show title, subtitle, icon, hint and actions', async () => {
		const el = await render({
			rows: rowsOf(['a'], [1]),
			title: 'Title',
			sub: 'Subtitle',
			iconId: 'i-map',
			tip: 'Hint',
			actions: '<button id="action"></button>',
			cat: 'regio',
			span: 12,
		});
		expect(el.querySelector('.card-title').textContent).toContain('Title');
		expect(el.querySelector('.card-sub').textContent).toBe('Subtitle');
		expect(el.querySelector('.icon-chip')).not.toBeNull();
		expect(el.querySelector('.info-dot')).not.toBeNull();
		expect(el.querySelector('#action')).not.toBeNull();
		expect(el.querySelector('.card').dataset.cat).toBe('regio');
	});

	it('should take the page sizes from the shared list', async () => {
		const el = await render({ rows: rowsOf(['a'], [1]) });
		expect([...el.querySelectorAll('.dt-size option')].map((o) => Number(o.value))).toEqual(PAGE_SIZES);
	});

	it('should not hydrate when the holder never enters the document', async () => {
		const markup = dataTable({ columns: COLS, rows: rowsOf(['a'], [1]) });
		await flush();
		const el = document.createElement('div');
		el.innerHTML = markup;
		expect(el.querySelector('table')).toBeNull();
	});

	it('should wait for a delayed insertion', async () => {
		const markup = dataTable({ columns: COLS, rows: rowsOf(['a'], [1]) });
		const el = mount();
		queueMicrotask(() => { el.innerHTML = markup; });
		await flush();
		expect(tableRows(el)).toEqual([['a', '1']]);
	});
});

describe('sorting', () => {
	it('should apply the default sort and show an arrow', async () => {
		const el = await render({ rows: rowsOf(['a', 'b', 'c'], [3, 1, 2]), defaultSort: { key: 'value', dir: 'asc' } });
		expect(tableRows(el).map((r) => r[0])).toEqual(['b', 'c', 'a']);
		expect(el.querySelector('.th-arrow').textContent).toBe('▲');
	});

	it('should sort descending', async () => {
		const el = await render({ rows: rowsOf(['a', 'b', 'c'], [3, 1, 2]), defaultSort: { key: 'value', dir: 'desc' } });
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'c', 'b']);
		expect(el.querySelector('.th-arrow').textContent).toBe('▼');
	});

	it('should cycle ascending, descending and unsorted on header clicks', async () => {
		const el = await render({ rows: rowsOf(['a', 'b', 'c'], [3, 1, 2]) });
		const th = () => el.querySelectorAll('th')[1];
		th().click();
		expect(tableRows(el).map((r) => r[0])).toEqual(['b', 'c', 'a']);
		th().click();
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'c', 'b']);
		th().click();
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'b', 'c']);
		expect(el.querySelector('.th-arrow')).toBeNull();
	});

	it('should start ascending when switching column', async () => {
		const el = await render({ rows: rowsOf(['c', 'a', 'b'], [1, 2, 3]), defaultSort: { key: 'value', dir: 'desc' } });
		el.querySelectorAll('th')[0].click();
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'b', 'c']);
	});

	it('should sort from the keyboard', async () => {
		const el = await render({ rows: rowsOf(['a', 'b'], [2, 1]) });
		const th = el.querySelectorAll('th')[1];
		th.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect(tableRows(el).map((r) => r[0])).toEqual(['b', 'a']);
		el.querySelectorAll('th')[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'b']);
	});

	it('should not sort on other keys', async () => {
		const el = await render({ rows: rowsOf(['a', 'b'], [2, 1]) });
		el.querySelectorAll('th')[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'b']);
	});

	it('should attach no click handler to a non sortable column', async () => {
		const el = await render({
			columns: [{ key: 'name', label: 'Name', sortable: false }],
			rows: [{ name: cell('a', 'a') }],
		});
		expect(el.querySelector('th').className).not.toContain('th-sort');
		expect(el.querySelector('th').hasAttribute('role')).toBe(false);
	});

	it('should place missing values first when sorting ascending', async () => {
		const el = await render({
			rows: [
				{ name: cell('a', 'a'), value: cell(null, '-') },
				{ name: cell('b', 'b'), value: cell(2, '2') },
				{ name: cell('c', 'c'), value: cell('', '') },
			],
			defaultSort: { key: 'value', dir: 'asc' },
		});
		expect(tableRows(el).map((r) => r[0])).toEqual(['a', 'c', 'b']);
	});

	it('should place missing values last when sorting descending', async () => {
		const el = await render({
			rows: [
				{ name: cell('a', 'a'), value: cell(null, '-') },
				{ name: cell('b', 'b'), value: cell(2, '2') },
				{ name: cell('c', 'c'), value: cell(9, '9') },
			],
			defaultSort: { key: 'value', dir: 'desc' },
		});
		expect(tableRows(el).map((r) => r[0])).toEqual(['c', 'b', 'a']);
	});

	it('should sort text with Hungarian collation', async () => {
		const el = await render({
			rows: [
				{ name: cell('Zala', 'Zala'), value: cell(1, '1') },
				{ name: cell('Árpád', 'Árpád'), value: cell(2, '2') },
				{ name: cell('Bors', 'Bors'), value: cell(3, '3') },
			],
			defaultSort: { key: 'name', dir: 'asc' },
		});
		expect(tableRows(el).map((r) => r[0])).toEqual(['Árpád', 'Bors', 'Zala']);
	});

	it('should sort mixed value types', async () => {
		const el = await render({
			rows: [
				{ name: cell('a', 'a'), value: cell(2, '2') },
				{ name: cell('b', 'b'), value: cell('text', 'text') },
			],
			defaultSort: { key: 'value', dir: 'asc' },
		});
		expect(tableRows(el)).toHaveLength(2);
	});
});

describe('paging', () => {
	const many = rowsOf(
		Array.from({ length: 12 }, (_, i) => `s${String(i).padStart(2, '0')}`),
		Array.from({ length: 12 }, (_, i) => i),
	);

	it('should slice by page size', async () => {
		const el = await render({ rows: many, pageSize: 5 });
		expect(tableRows(el)).toHaveLength(5);
		expect(pager(el)).toBe('1-5 / 12');
	});

	it('should move with the pager buttons', async () => {
		const el = await render({ rows: many, pageSize: 5 });
		navButtons(el)[2].click();
		expect(pager(el)).toBe('6-10 / 12');
		navButtons(el)[3].click();
		expect(pager(el)).toBe('11-12 / 12');
		navButtons(el)[1].click();
		expect(pager(el)).toBe('6-10 / 12');
		navButtons(el)[0].click();
		expect(pager(el)).toBe('1-5 / 12');
	});

	it('should disable the edge buttons at the bounds', async () => {
		const el = await render({ rows: many, pageSize: 5 });
		expect(navButtons(el).map((b) => b.disabled)).toEqual([true, true, false, false]);
		navButtons(el)[3].click();
		expect(navButtons(el).map((b) => b.disabled)).toEqual([false, false, true, true]);
	});

	it('should keep the first visible row when the page size changes', async () => {
		const el = await render({ rows: many, pageSize: 5 });
		navButtons(el)[2].click();
		const select = el.querySelector('.dt-size');
		select.value = '10';
		select.dispatchEvent(new Event('change'));
		expect(pager(el)).toBe('1-10 / 12');
	});

	it('should clamp to a valid page when the page size grows', async () => {
		const el = await render({ rows: many, pageSize: 5 });
		navButtons(el)[3].click();
		expect(pager(el)).toBe('11-12 / 12');
		const select = el.querySelector('.dt-size');
		select.value = '25';
		select.dispatchEvent(new Event('change'));
		expect(pager(el)).toBe('1-12 / 12');
	});
});

describe('expandable rows', () => {
	const expandRows = rowsOf(['a', 'b'], [1, 2]);
	const expandCfg = {
		key: (r) => r.name.v,
		render: (row, host) => {
			host.innerHTML = `<span class="detail">${row.name.v} details</span>`;
		},
	};

	it('should add a chevron column and start collapsed', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		expect(el.querySelector('.th-chevron')).not.toBeNull();
		expect(el.querySelectorAll('tr.dt-row')).toHaveLength(2);
		expect(el.querySelector('.dt-panel-content')).toBeNull();
		expect(el.querySelector('tr.dt-row').getAttribute('aria-expanded')).toBe('false');
	});

	it('should start with a row already open', async () => {
		const el = await render({ rows: expandRows, expand: { ...expandCfg, defaultOpen: ['a'] } });
		expect(el.querySelector('.detail').textContent).toBe('a details');
	});

	it('should expand on click', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		el.querySelector('tr.dt-row').click();
		await flush();
		expect(el.querySelector('.detail').textContent).toBe('a details');
		expect(el.querySelector('tr.dt-row').getAttribute('aria-expanded')).toBe('true');
		expect(el.querySelector('.expand-wrap').className).toContain('expand-open');
	});

	it('should expand from the keyboard', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		el.querySelector('tr.dt-row').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await flush();
		expect(el.querySelector('.detail')).not.toBeNull();
	});

	it('should not expand on other keys', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		el.querySelector('tr.dt-row').dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
		await flush();
		expect(el.querySelector('.detail')).toBeNull();
	});

	it('should collapse when the transition ends', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		el.querySelector('tr.dt-row').click();
		await flush();
		const wrap = el.querySelector('.expand-wrap');
		el.querySelector('tr.dt-row').click();
		expect(wrap.className).not.toContain('expand-open');
		expect(el.querySelector('tr.dt-row').getAttribute('aria-expanded')).toBe('false');
		wrap.dispatchEvent(new Event('transitionend'));
		await flush();
		expect(el.querySelector('.dt-panel-content')).not.toBeNull();
		wrap.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'grid-template-rows' }));
		await flush();
		expect(el.querySelector('.dt-panel-content')).toBeNull();
	});

	it('should collapse the row on a timer when no transition fires', async () => {
		vi.useFakeTimers();
		const el = mount();
		el.innerHTML = dataTable({ columns: COLS, rows: expandRows, expand: expandCfg });
		await vi.advanceTimersByTimeAsync(20);
		el.querySelector('tr.dt-row').click();
		await vi.advanceTimersByTimeAsync(20);
		expect(el.querySelector('.dt-panel-content')).not.toBeNull();
		el.querySelector('tr.dt-row').click();
		await vi.advanceTimersByTimeAsync(400);
		expect(el.querySelector('.dt-panel-content')).toBeNull();
		vi.useRealTimers();
	});

	it('should reopen the row when clicked again during the collapse', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		el.querySelector('tr.dt-row').click();
		await flush();
		el.querySelector('tr.dt-row').click();
		el.querySelector('tr.dt-row').click();
		await flush();
		expect(el.querySelector('.detail')).not.toBeNull();
	});

	it('should expand two rows independently', async () => {
		const el = await render({ rows: expandRows, expand: expandCfg });
		const rows = [...el.querySelectorAll('tr.dt-row')];
		rows[0].click();
		await flush();
		[...el.querySelectorAll('tr.dt-row')][1].click();
		await flush();
		expect(el.querySelectorAll('.detail')).toHaveLength(2);
	});
});
