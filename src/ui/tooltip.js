let tipEl = null;
let current = null;

let lastPoint = { clientX: 0, clientY: 0 };

function getTip() {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'float-tip';
    tipEl.style.display = 'none';
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function position(e) {
  const t = getTip();
  const pad = 12;
  const tw = t.offsetWidth || 260;
  const th = t.offsetHeight || 48;
  let x = e.clientX + pad;
  let y = e.clientY + pad;
  if (x + tw > innerWidth - pad) x = e.clientX - tw - pad;
  if (y + th > innerHeight - pad) y = e.clientY - th - pad;
  t.style.left = `${x}px`;
  t.style.top = `${y}px`;
}

function hide() {
  current = null;
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
    current = el;
    lastPoint = { clientX: e.clientX, clientY: e.clientY };
    const t = getTip();
    t.textContent = el.dataset.tip;
    t.style.display = 'block';
    position(e);
  });
  document.addEventListener('mousemove', (e) => {
    lastPoint = { clientX: e.clientX, clientY: e.clientY };
    if (current) position(e);
  });
  document.addEventListener('mouseleave', hide);
  document.addEventListener('scroll', hide, true);

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
    if (el?.classList.contains('info-dot')) {
      showFor(el);
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
