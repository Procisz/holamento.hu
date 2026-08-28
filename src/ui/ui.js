import { icon } from './icons.js';
import { t } from '../app/i18n.js';
import { fmtSignedMin } from '../utils/fmt.js';

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


export function signedMin(v, { goodWhenDown = true } = {}) {
  if (v == null || !Number.isFinite(v)) return '-';
  const good = goodWhenDown ? v <= 0 : v >= 0;
  return `<span class="${good ? 'pos' : 'neg'}">${fmtSignedMin(v)}</span>`;
}

export function tipDot(tip) {
  if (!tip) return '';
  return `<button type="button" class="info-dot" data-tip="${esc(tip)}" aria-label="${esc(tip)}">${icon('i-info')}</button>`;
}

export function statCard({ cat = '', iconId = '', label, value, foot = '', spark = '', tip = '' }) {
  return `<div class="stat" ${cat ? `data-cat="${cat}"` : ''}>
    <div class="row-between">
      <span class="stat-label">${label}${tipDot(tip)}</span>
      ${iconId ? `<span class="icon-chip">${icon(iconId)}</span>` : ''}
    </div>
    <span class="stat-value">${value}</span>
    ${foot ? `<span class="stat-foot">${foot}</span>` : ''}
    ${spark}
  </div>`;
}

export function chartCard({ span = 6, cat = '', iconId = '', title, sub = '', id, tip = '' }) {
  return `<div class="card" data-span="${span}" ${cat ? `data-cat="${cat}"` : ''}>
    <div class="card-head">
      ${iconId ? `<span class="icon-chip">${icon(iconId)}</span>` : ''}
      <div>
        <h2 class="card-title">${title}${tipDot(tip)}</h2>
        ${sub ? `<div class="card-sub">${sub}</div>` : ''}
      </div>
    </div>
    <div class="card-body tight" id="${id}"></div>
  </div>`;
}


export function emptyState({ span = 12, iconId = 'i-info', title, message, hint = '' } = {}) {
  const msg = message ?? t('common.noData');
  return `<div class="card" data-span="${span}">
    <div class="card-body empty-state">
      <span class="icon-chip">${icon(iconId)}</span>
      <div>
        ${title ? `<strong>${esc(title)}</strong><br>` : ''}
        <span class="muted">${esc(msg)}</span>
        ${hint ? `<div class="muted" style="margin-top:4px;font-size:12px;">${esc(hint)}</div>` : ''}
      </div>
    </div>
  </div>`;
}


export function prioBadge(p) {
  return `<span class="prio-badge" data-prio="${esc(String(p).toLowerCase())}">${esc(p)}</span>`;
}
