import { DATA_URL, CACHE_KEY } from '../config.js';
import { t } from '../app/i18n.js';

const SIZE_KEY = 'holamento-payload-bytes';
const DURATION_KEY = 'holamento-load-ms';

export async function fetchData(onProgress) {
  const t0 = performance.now();
  let shown = 0;
  const emit = (pct, extra = {}) => {
    if (!onProgress) return;
    shown = Math.max(shown, Math.min(1, pct));
    onProgress({ pct: shown, ...extra });
  };

  const lastMs = storedNumber(DURATION_KEY) ?? 1500;
  const ticker = setInterval(() => {
    emit(Math.min(0.88, ((performance.now() - t0) / lastMs) * 0.88), { estimated: true });
  }, 100);

  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });

    if (res.status >= 500) throw new Error(t('err.server'));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let text;
    let received = 0;
    if (res.body?.getReader) {
      const expected = storedNumber(SIZE_KEY)
        ?? (Number(res.headers.get('Content-Length')) > 0 ? Number(res.headers.get('Content-Length')) : null);
      const reader = res.body.getReader();
      const chunks = [];
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        clearInterval(ticker);
        chunks.push(value);
        received += value.byteLength;
        if (expected > 0) emit(received / expected, { received, expected });
        else emit(shown, { received, expected: null });
      }
      const buf = new Uint8Array(received);
      let off = 0;
      for (const c of chunks) { buf.set(c, off); off += c.byteLength; }
      text = new TextDecoder().decode(buf);
    } else {
      text = await res.text();
      received = text.length;
    }

    const data = parsePayload(text);
    try {
      localStorage.setItem(SIZE_KEY, String(received));
      localStorage.setItem(DURATION_KEY, String(Math.round(performance.now() - t0)));
    } catch {}
    emit(1, { received, expected: received });
    return data;
  } finally {
    clearInterval(ticker);
  }
}

export function parsePayload(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(t('err.corrupt'));
  }
  if (!data || typeof data !== 'object' || !data.meta?.latestMonth || !data.topic2 || !data.regioTrend) {
    throw new Error(t('err.shape'));
  }
  return data;
}

function storedNumber(key) {
  try {
    const n = Number(localStorage.getItem(key));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}
