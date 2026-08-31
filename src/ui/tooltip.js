let tipEl = null;
let current = null;
let pinned = false;

let lastPoint = { clientX: 0, clientY: 0 };

const HINT = '.info-dot, .info';
const PAD = 12;

function getTip() {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'float-tip';
    tipEl.style.display = 'none';
  }
  if (!tipEl.isConnected) document.body.appendChild(tipEl);
  return tipEl;
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), Math.max(min, max));
}

function position(e) {
  const t = getTip();
  const tw = t.offsetWidth || 260;
  const th = t.offsetHeight || 48;
  let x = e.clientX + PAD;
  let y = e.clientY + PAD;
  if (x + tw > innerWidth - PAD) x = e.clientX - tw - PAD;
  if (y + th > innerHeight - PAD) y = e.clientY - th - PAD;
  t.style.left = `${clamp(x, PAD, innerWidth - tw - PAD)}px`;
  t.style.top = `${clamp(y, PAD, innerHeight - th - PAD)}px`;
}

function hide() {
  current = null;
  pinned = false;
  getTip().style.display = 'none';
}

function showFor(el, point) {
  if (!el?.dataset.tip) return;
  current = el;
  const t = getTip();
  t.textContent = el.dataset.tip;
  t.style.display = 'block';
  if (point) {
    position(point);
    return;
  }
  const box = el.getBoundingClientRect();
  position({ clientX: box.left + box.width / 2, clientY: box.bottom });
}

export function initTooltips() {
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest?.('[data-tip]');
    if (el === current) return;
    if (!el || !el.dataset.tip) { hide(); return; }
    pinned = false;
    lastPoint = { clientX: e.clientX, clientY: e.clientY };
    showFor(el, lastPoint);
  });
  document.addEventListener('mousemove', (e) => {
    lastPoint = { clientX: e.clientX, clientY: e.clientY };
    if (current && !pinned) position(e);
  });
  document.addEventListener('mouseleave', hide);
  document.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);

  document.addEventListener('focusin', (e) => {
    const el = e.target.closest?.('[data-tip]');
    if (el) showFor(el);
    else hide();
  });
  document.addEventListener('focusout', hide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });

  document.addEventListener('click', (e) => {
    const el = e.target.closest?.('[data-tip]');
    if (el?.matches(HINT)) {
      if (pinned && current === el) hide();
      else {
        showFor(el);
        pinned = true;
      }
      return;
    }
    hide();
  }, true);
}

export function refreshTip(el) {
  if (!el?.dataset.tip || !el.matches(':hover')) return;
  current = el;
  const t = getTip();
  t.textContent = el.dataset.tip;
  t.style.display = 'block';
  position(lastPoint);
}
