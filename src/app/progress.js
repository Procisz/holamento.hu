import { t, tList } from './i18n.js';
import { fmtNum1 } from '../utils/fmt.js';

const STAGES = ['fetch', 'parse', 'compute', 'render'];

const overlay = () => document.getElementById('boot-overlay');

export function showOverlay() {
  const el = overlay();
  el.hidden = false;
  el.classList.remove('overlay-fade');
  document.getElementById('boot-error').hidden = true;
  for (const s of el.querySelectorAll('.stage')) s.dataset.state = 'pending';
  startQuips();
}

function startQuips() {
  const quipEl = document.getElementById('boot-quip');
  if (!quipEl) return;
  const quips = tList('quips');
  quipEl.textContent = quips.length ? quips[Math.floor(Math.random() * quips.length)] : '';
  quipEl.classList.remove('quip-fade');
}

function stopQuips() {}

export function stage(name) {
  const el = overlay();
  const idx = STAGES.indexOf(name);
  el.querySelectorAll('.stage').forEach((s, i) => {
    s.dataset.state = i < idx ? 'done' : i === idx ? 'active' : 'pending';
  });
  if (name !== 'fetch') {
    const bar = el.querySelector('.stage[data-stage="fetch"] .stage-bar');
    if (bar) { delete bar.dataset.det; bar.style.removeProperty('--p'); }
    const extra = document.getElementById('stage-fetch-extra');
    if (extra) extra.textContent = '';
  }
}

export function fetchProgress(info) {
  const el = overlay();
  const bar = el.querySelector('.stage[data-stage="fetch"] .stage-bar');
  const extra = document.getElementById('stage-fetch-extra');
  if (!bar || !extra) return;
  const pct = info.pct >= 1 ? 100 : Math.min(99, Math.round((info.pct ?? 0) * 100));
  bar.dataset.det = '1';
  bar.style.setProperty('--p', `${pct}%`);
  const kb = info.received > 0
    ? ` · ${fmtNum1(info.received / 1024)} kB`
    : '';
  extra.textContent = `${info.estimated ? '~' : ''}${pct}%${kb}`;
}

export function hideOverlay() {
  const el = overlay();
  if (el.hidden) return;
  stopQuips();
  el.querySelectorAll('.stage').forEach((s) => (s.dataset.state = 'done'));
  el.classList.add('overlay-fade');
  setTimeout(() => { el.hidden = true; }, 250);
}

export function failOverlay(message, onRetry, btnLabel) {
  const el = overlay();
  stopQuips();
  const quipEl = document.getElementById('boot-quip');
  if (quipEl) quipEl.textContent = '';
  el.hidden = false;
  el.classList.remove('overlay-fade');
  const err = document.getElementById('boot-error');
  err.hidden = false;
  err.innerHTML = '';
  const msg = document.createElement('div');
  msg.textContent = message;
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = btnLabel ?? t('common.retry');
  btn.onclick = onRetry;
  const actions = document.createElement('div');
  actions.className = 'overlay-actions';
  actions.append(btn);
  err.append(msg, actions);
}

export const breathe = () => new Promise((r) => setTimeout(r, 0));
