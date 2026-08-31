import { esc } from './ui.js';

export function loadSeg(key, options, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v && options.some((o) => o.id === v)) return v;
  } catch {}
  return fallback ?? options[0]?.id;
}

export function segHtml(key, options, active, { label = '' } = {}) {
  return `<div class="chip-row seg" data-seg="${esc(key)}" role="group" ${label ? `aria-label="${esc(label)}"` : ''}>
    ${label ? `<span class="chip-row-label">${esc(label)}</span>` : ''}
    ${options.map((o) => `<button type="button" class="chip" data-val="${esc(o.id)}" aria-pressed="${o.id === active}">${esc(o.label)}</button>`).join('')}
  </div>`;
}

export function segInline(html) {
  return `<div class="seg-inline">${html}</div>`;
}

export function wireSeg(mount, key, onChange) {
  const host = mount.querySelector(`[data-seg="${CSS.escape(key)}"]`);
  if (!host) return;
  host.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-val]');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
    try { localStorage.setItem(key, btn.dataset.val); } catch {}
    onChange(btn.dataset.val);
  });
}
