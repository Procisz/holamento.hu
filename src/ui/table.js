import { icon } from './icons.js';
import { t } from '../app/i18n.js';
import { tipDot } from './ui.js';

export const PAGE_SIZES = [5, 10, 25, 50, 100];

let seq = 0;
const configs = new Map();

export const cell = (v, html) => ({ v, html: html ?? (v == null ? '-' : String(v)) });

export function dataTable({ span = 6, cat = '', iconId = '', title, sub = '', columns, rows, pageSize = 5, defaultSort = null, tip = '', expand = null, actions = '' }) {
  for (const [id, st] of configs) {
    if (st.el && !st.el.isConnected) configs.delete(id);
  }
  const id = `dt-${++seq}`;
  configs.set(id, {
    columns, rows, expand,
    open: new Set((expand?.defaultOpen ?? []).map(String)),
    sort: defaultSort ? { ...defaultSort } : null,
    page: { pageSize, pageIndex: 0 },
    el: null,
  });
  scheduleHydrate(id);
  return `<div class="card" data-span="${span}" ${cat ? `data-cat="${cat}"` : ''}>
    <div class="card-head">
      ${iconId ? `<span class="icon-chip">${icon(iconId)}</span>` : ''}
      <div>
        <h2 class="card-title">${title}${tipDot(tip)}</h2>
        ${sub ? `<div class="card-sub">${sub}</div>` : ''}
      </div>
      ${actions ? `<div class="card-actions">${actions}</div>` : ''}
    </div>
    <div class="card-body tight"><div class="dtable" id="${id}"></div></div>
  </div>`;
}

function scheduleHydrate(id) {
  queueMicrotask(() => {
    const st = configs.get(id);
    if (!st) return;
    const el = document.getElementById(id);
    if (!el) {
      requestAnimationFrame(() => {
        const el2 = document.getElementById(id);
        if (el2) { st.el = el2; renderTable(st); } else configs.delete(id);
      });
      return;
    }
    st.el = el;
    renderTable(st);
  });
}

function renderTable(st) {

  if (st.closing?.size) {
    for (const id of st.closing) st.open.delete(id);
    st.closing.clear();
  }
  const { columns, sort, page, el, expand } = st;
  let rows = st.rows;
  if (sort?.key) {
    const dirMul = sort.dir === 'desc' ? -1 : 1;
    rows = [...rows].sort((a, b) => cmp(a[sort.key]?.v, b[sort.key]?.v) * dirMul);
  }
  const total = rows.length;
  const maxPage = Math.max(0, Math.ceil(total / page.pageSize) - 1);
  page.pageIndex = Math.min(page.pageIndex, maxPage);
  const start = page.pageIndex * page.pageSize;
  const visible = rows.slice(start, start + page.pageSize);
  const colCount = columns.length + (expand ? 1 : 0);
  st.visible = visible;

  el.innerHTML = `
    <div class="table-scroll"><table class="tbl">
      <thead><tr>${expand ? '<th class="th-chevron" aria-hidden="true"></th>' : ''}${columns.map((c) => {
        const sortable = c.sortable !== false;
        const active = sort?.key === c.key;
        const arrow = active ? (sort.dir === 'asc' ? '▲' : '▼') : '';
        return `<th class="${c.num ? 'num ' : ''}${sortable ? 'th-sort' : ''}" data-key="${c.key}"
          ${sortable ? 'role="button" tabindex="0"' : ''}>${c.label}${arrow ? `<span class="th-arrow">${arrow}</span>` : ''}</th>`;
      }).join('')}</tr></thead>
      <tbody>${visible.length
        ? visible.map((r, i) => rowHtml(st, r, i, colCount)).join('')
        : `<tr><td colspan="${colCount}" class="muted">${t('common.noDataShort')}</td></tr>`}</tbody>
    </table></div>
    <div class="dt-pager">
      <span>${t('common.rows')}</span>
      <select class="dt-size" aria-label="${t('common.rowsPerPage')}">
        ${PAGE_SIZES.map((n) => `<option value="${n}" ${n === page.pageSize ? 'selected' : ''}>${n}</option>`).join('')}
      </select>
      <span>${total === 0 ? '0 / 0' : `${start + 1}-${Math.min(start + page.pageSize, total)} / ${total}`}</span>
      <span class="dt-nav">
        <button data-p="0" ${page.pageIndex === 0 ? 'disabled' : ''} aria-label="${t('common.pageFirst')}">«</button>
        <button data-p="${page.pageIndex - 1}" ${page.pageIndex === 0 ? 'disabled' : ''} aria-label="${t('common.pagePrev')}">‹</button>
        <button data-p="${page.pageIndex + 1}" ${page.pageIndex >= maxPage ? 'disabled' : ''} aria-label="${t('common.pageNext')}">›</button>
        <button data-p="${maxPage}" ${page.pageIndex >= maxPage ? 'disabled' : ''} aria-label="${t('common.pageLast')}">»</button>
      </span>
    </div>`;

  if (expand) {
    for (const tr of [...el.querySelectorAll('tr.dt-row')].filter((n) => !n.closest('.dt-panel-content'))) {
      const rowId = tr.dataset.rowId;
      tr.onclick = () => toggleExpand(st, rowId);
      tr.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(st, rowId); }
      };
    }

    for (const host of el.querySelectorAll('.dt-panel-content')) {
      const rowId = host.dataset.rowId;
      const row = st.visible.find((r) => String(expand.key(r)) === rowId);
      if (row) expand.render(row, host);
      const wrap = host.parentElement;
      requestAnimationFrame(() => wrap.classList.add('expand-open'));
    }
  }

  const own = (node) => !node.closest('.dt-panel-content');

  for (const th of [...el.querySelectorAll('th.th-sort')].filter(own)) {
    const key = th.dataset.key;
    const toggle = () => {
      if (st.sort?.key !== key) st.sort = { key, dir: 'asc' };
      else if (st.sort.dir === 'asc') st.sort = { key, dir: 'desc' };
      else st.sort = null;
      renderTable(st);
    };
    th.onclick = toggle;
    th.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
  }

  const sizeEl = [...el.querySelectorAll('.dt-size')].filter(own)[0];
  if (sizeEl) {
    sizeEl.onchange = (e) => {
      const firstItem = page.pageIndex * page.pageSize;
      page.pageSize = parseInt(e.target.value, 10);
      page.pageIndex = Math.floor(firstItem / page.pageSize);
      renderTable(st);
    };
  }
  for (const btn of [...el.querySelectorAll('.dt-nav button')].filter(own)) {
    btn.onclick = () => { page.pageIndex = Number(btn.dataset.p); renderTable(st); };
  }
}

function rowHtml(st, r, i, colCount) {
  const { columns, expand } = st;
  const cells = columns.map((c) => `<td class="${c.num ? 'num' : ''}">${r[c.key]?.html ?? '-'}</td>`).join('');
  if (!expand) return `<tr>${cells}</tr>`;
  const rowId = String(expand.key(r));
  const isOpen = st.open.has(rowId);
  return `<tr class="dt-row${isOpen ? ' dt-row-open' : ''}" data-row-id="${rowId}"
      role="button" tabindex="0" aria-expanded="${isOpen}">
      <td class="dt-chevron">${isOpen ? '▾' : '▸'}</td>${cells}</tr>`
    + (isOpen
      ? `<tr class="dt-panel-row"><td colspan="${colCount}">
          <div class="expand-wrap"><div class="dt-panel-content" data-row-id="${rowId}"></div></div>
        </td></tr>`
      : '');
}

const EXPAND_MS = 250;

function toggleExpand(st, rowId) {

  if (st.closing?.has(rowId)) {
    st.closing.delete(rowId);
    renderTable(st);
    return;
  }

  if (!st.open.has(rowId)) {
    st.open.add(rowId);
    renderTable(st);
    return;
  }

  st.closing ??= new Set();
  const host = [...(st.el?.querySelectorAll('.dt-panel-content') ?? [])]
    .find((h) => h.dataset.rowId === rowId);
  const wrap = host?.parentElement;
  if (!wrap) {
    st.open.delete(rowId);
    renderTable(st);
    return;
  }

  st.closing.add(rowId);
  wrap.classList.remove('expand-open');

  const row = [...st.el.querySelectorAll('tr.dt-row')].find((tr) => tr.dataset.rowId === rowId);
  if (row) {
    row.classList.remove('dt-row-open');
    row.setAttribute('aria-expanded', 'false');
    const chev = row.querySelector('.dt-chevron');
    if (chev) chev.textContent = '▸';
  }

  let timer;
  const finish = () => {
    clearTimeout(timer);
    wrap.removeEventListener('transitionend', onEnd);
    if (!st.closing.has(rowId)) return;
    st.closing.delete(rowId);
    st.open.delete(rowId);
    renderTable(st);
  };
  const onEnd = (e) => {
    if (e.target === wrap && e.propertyName === 'grid-template-rows') finish();
  };
  wrap.addEventListener('transitionend', onEnd);

  timer = setTimeout(finish, EXPAND_MS + 80);
}

function cmp(a, b) {
  const aNull = a == null || a === '';
  const bNull = b == null || b === '';
  if (aNull && bNull) return 0;
  if (aNull) return -1;
  if (bNull) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'hu');
}

const escAttr = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
