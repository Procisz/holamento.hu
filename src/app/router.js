import { replayCharts } from '../ui/charts.js';
import { state } from './state.js';
import { esc } from '../ui/ui.js';
import { t } from './i18n.js';

const panels = new Map();

export function registerPanel(id, labelKey, icon, load) {
  panels.set(id, { labelKey, icon, load, mod: null });
}

export function firstPanelId() {
  return panels.keys().next().value ?? null;
}

export function refreshNavLabels() {
  for (const [id, p] of panels) {
    const span = document.querySelector(`#tab-nav [role=tab][data-tab="${id}"] span`);
    if (span) span.textContent = t(p.labelKey);
  }
}

export function buildNav() {
  const nav = document.getElementById('tab-nav');
  const main = document.getElementById('app-main');
  for (const [id, p] of panels) {
    const btn = document.createElement('button');
    btn.role = 'tab';
    btn.dataset.tab = id;
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('aria-controls', `panel-${id}`);
    btn.id = `tab-${id}`;
    btn.tabIndex = -1;
    btn.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${p.icon}"/></svg><span>${esc(t(p.labelKey))}</span>`;
    btn.onclick = () => activate(id);
    nav.append(btn);

    const section = document.createElement('section');
    section.className = 'panel';
    section.id = `panel-${id}`;
    section.dataset.tabPanel = id;
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('aria-labelledby', `tab-${id}`);
    section.tabIndex = 0;
    section.hidden = true;
    main.append(section);
  }
  nav.addEventListener('keydown', onTabKey);
}

function onTabKey(e) {
  const keys = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' };
  const move = keys[e.key];
  if (move === undefined) return;
  const tabs = [...document.querySelectorAll('#tab-nav [role=tab]')];
  if (!tabs.length) return;
  const current = tabs.findIndex((b) => b.getAttribute('aria-selected') === 'true');
  let next;
  if (move === 'first') next = 0;
  else if (move === 'last') next = tabs.length - 1;
  else next = (current + move + tabs.length) % tabs.length;
  e.preventDefault();
  activate(tabs[next].dataset.tab);
  tabs[next].focus();
}

export function activate(id) {
  if (!panels.has(id)) id = firstPanelId();
  if (!id) return;
  const changed = state.activeTab !== id;
  state.activeTab = id;
  history.replaceState(null, '', `#${id}`);
  document.querySelectorAll('#tab-nav [role=tab]').forEach((b) => {
    const selected = b.dataset.tab === id;
    b.setAttribute('aria-selected', String(selected));
    b.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll('[data-tab-panel]').forEach((s) => {
    s.hidden = s.dataset.tabPanel !== id;
  });
  if (booted) centerActiveTab();

  const wasBuilt = state.renderedTabs.has(id);
  const rendered = renderActive();
  if (wasBuilt) replayCharts(document.getElementById(`panel-${id}`));
  if (changed) scrollToTop();
  return rendered;
}

function scrollToTop() {
  if (typeof scrollTo !== 'function') return;
  scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

const CENTER_MS = 500;

let booted = false;

export function centerActiveTab({ animate = true } = {}) {
  const nav = document.getElementById('tab-nav');
  const btn = nav?.querySelector('[role=tab][aria-selected="true"]');
  if (!nav || !btn || nav.scrollWidth <= nav.clientWidth) return;
  const navBox = nav.getBoundingClientRect();
  const btnBox = btn.getBoundingClientRect();
  const delta = btnBox.left + btnBox.width / 2 - (navBox.left + navBox.width / 2);
  if (Math.abs(delta) < 1) return;

  const target = Math.max(0, Math.min(nav.scrollLeft + delta, nav.scrollWidth - nav.clientWidth));
  if (animate) glideTo(nav, target);
  else { cancelGlide(); nav.scrollLeft = target; }
}

let glideFrame = null;
let glideTimer = null;

function cancelGlide() {
  if (glideFrame != null) cancelAnimationFrame(glideFrame);
  clearTimeout(glideTimer);
  glideFrame = null;
  glideTimer = null;
}

function glideTo(el, target) {
  cancelGlide();
  const from = el.scrollLeft;
  const dist = target - from;
  if (!dist) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollLeft = target;
    return;
  }
  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
  const step = (now) => {
    const t = Math.min(1, (now - t0) / CENTER_MS);
    el.scrollLeft = from + dist * ease(t);
    glideFrame = t < 1 ? requestAnimationFrame(step) : null;
  };
  glideFrame = requestAnimationFrame(step);

  glideTimer = setTimeout(() => {
    cancelGlide();
    el.scrollLeft = target;
  }, CENTER_MS + 200);
}

export function centerActiveTabWhenSettled({ quiet = 300, timeout = 8000 } = {}) {
  const nav = document.getElementById('tab-nav');
  if (!nav) return;
  const t0 = performance.now();
  let lastWidth = -1;
  let stableSince = t0;
  const tick = () => {
    const w = nav.clientWidth;
    const now = performance.now();
    if (w !== lastWidth) {
      lastWidth = w;
      stableSince = now;
    }
    if (now - stableSince >= quiet || now - t0 >= timeout) {
      booted = true;
      centerActiveTab();
      return;
    }
    setTimeout(tick, 60);
  };
  tick();
}

export function watchTabBar() {
  const nav = document.getElementById('tab-nav');
  if (!nav || typeof ResizeObserver === 'undefined') return;
  let pending = false;
  new ResizeObserver(() => {
    if (!booted || pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      centerActiveTab({ animate: false });
    });
  }).observe(nav);
}

let centerTimer;
window.addEventListener('resize', () => {
  if (!booted) return;
  clearTimeout(centerTimer);
  centerTimer = setTimeout(() => centerActiveTab({ animate: false }), 150);
});

export async function renderActive() {
  const id = state.activeTab;
  const model = state.model;
  if (!model || state.renderedTabs.has(id)) return;
  const entry = panels.get(id);
  const mount = document.getElementById(`panel-${id}`);
  try {
    if (!entry.mod) entry.mod = await entry.load();
    if (state.activeTab !== id || state.model !== model || state.renderedTabs.has(id)) return;
    entry.mod.render(model, mount);
    state.renderedTabs.add(id);
  } catch (err) {
    console.error(`Panel render failed (${id}):`, err);
    mount.innerHTML = `<div class="card"><div class="card-body">
      <p class="error-text">${esc(t('common.renderError', { msg: err.message }))}</p></div></div>`;
  }
}

export function initialTab() {
  const hash = location.hash.replace('#', '');
  return panels.has(hash) ? hash : firstPanelId();
}
