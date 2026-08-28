import { APP_VERSION, RANGE_BAR_KEY, RANGE_KEY, SOURCE_URL, STALE_WARN_DAYS } from "./config.js";
import { currentMode, initAppearance, setMode } from "./app/appearance.js";
import { LANGS, currentLang, currentLocale, initLang, setLang, t, tPlural } from "./app/i18n.js";
import { destroyAllCharts } from "./ui/charts.js";
import { clearCache, fetchData, loadCache, parsePayload, saveCache } from "./data/fetchData.js";
import { fmtDate, fmtYm, fmtYmFull } from "./utils/fmt.js";
import { buildModel } from "./data/model.js";
import { filterModel, modelBounds } from "./data/range.js";
import {
	breathe,
	failOverlay,
	fetchProgress,
	hideOverlay,
	showOverlay,
	stage,
} from "./app/progress.js";
import {
	activate,
	buildNav,
	centerActiveTabWhenSettled,
	initialTab,
	refreshNavLabels,
	registerPanel,
	watchTabBar,
} from "./app/router.js";
import { state } from "./app/state.js";
import { initTooltips, refreshTip } from "./ui/tooltip.js";
import { esc } from "./ui/ui.js";
import { icon, injectIcons } from "./ui/icons.js";
import "./styles/index.css";

import * as adatok from "./features/adatok.js";
import * as attekintes from "./features/attekintes.js";
import * as trendek from "./features/trendek.js";
import * as fazisok from "./features/fazisok.js";
import * as regiok from "./features/regiok.js";
import * as esetszamok from "./features/esetszamok.js";
import * as szoras from "./features/szoras.js";

const PANELS = [attekintes, adatok, trendek, fazisok, regiok, esetszamok, szoras];

let appliedPayload = null;

async function applyData(data, { fromCache }) {
	appliedPayload = JSON.stringify(data);
	stage("parse");
	await breathe();
	const model = buildModel(data);
	stage("compute");
	await breathe();
	state.fullModel = model;
	syncRangeBounds();
	state.model = currentFilteredModel();
	state.fromCache = fromCache;
	destroyAllCharts();
	state.renderedTabs.clear();
	document.querySelectorAll("[data-tab-panel]").forEach((s) => {
		s.innerHTML = "";
	});
	stage("render");
	await breathe();
	activate(state.activeTab);
	renderWarnings(model);
	renderDataAge(model);
}

function headerSettled() {
	centerActiveTabWhenSettled();
}

function renderDataAge(model) {
	const el = document.getElementById("data-age");
	if (!el) return;
	const { generatedAt, updatedDate, latestMonth, latestIsPreliminary } = model.meta;
	if (!updatedDate && !generatedAt) {
		el.hidden = true;
		return;
	}
	el.hidden = false;
	const stampIso = updatedDate ?? generatedAt.toISOString().slice(0, 10);
	const days = generatedAt
		? Math.floor((Date.now() - generatedAt.getTime()) / 86_400_000)
		: null;
	const stale = days != null && days > STALE_WARN_DAYS;
	el.innerHTML = `${icon("i-clock")}<span>${esc(t("header.dataAge", { date: fmtDate(stampIso) }))}</span>`;
	if (stale) {
		el.dataset.stale = "1";
		el.dataset.tone = "warn";
	} else {
		delete el.dataset.stale;
		delete el.dataset.tone;
	}
	el.dataset.tip =
		t("header.dataAgeTip", {
			date: fmtDate(stampIso),
			month: fmtYmFull(latestMonth),
			prelim: latestIsPreliminary ? t("header.dataAgePrelim") : "",
		}) + (stale ? t("header.dataAgeStale") : "");
}

async function hardLoad() {
	showOverlay();
	stage("fetch");
	try {
		const data = await fetchData(fetchProgress);
		saveCache(data);
		await applyData(data, { fromCache: false });
		hideOverlay();
		headerSettled();
		setRefreshTooltip(t("header.refreshLast", { time: nowHm() }), { kind: "ok", time: nowHm() });
	} catch (err) {
		failOverlay(t("common.loadError", { msg: err.message }), hardLoad);
		offerFileFallback();
	}
}

function offerFileFallback() {
	const errEl = document.getElementById("boot-error");
	if (!errEl || errEl.querySelector("input[type=file]")) return;
	const inp = document.createElement("input");
	inp.type = "file";
	inp.accept = ".json,application/json";
	inp.hidden = true;
	const btn = document.createElement("button");
	btn.className = "btn";
	btn.textContent = t("common.loadFromFile");
	btn.onclick = () => inp.click();
	inp.onchange = async () => {
		const f = inp.files?.[0];
		if (!f) return;
		try {
			const data = parsePayload(await f.text());
			saveCache(data);
			await applyData(data, { fromCache: false });
			hideOverlay();
		} catch (e) {
			failOverlay(t("common.fileError", { msg: e.message }), hardLoad);
			offerFileFallback();
		}
	};
	(errEl.querySelector(".overlay-actions") ?? errEl).append(btn, inp);
}

let refreshState = null;

function setRefreshTooltip(text, state) {
	refreshState = state ?? null;
	document.getElementById("refresh-btn").dataset.tip = text;
}

function refreshTooltipText() {
	if (refreshState?.kind === "ok") return t("header.refreshLast", { time: refreshState.time });
	if (refreshState?.kind === "failed") return t("header.refreshFailed");
	return t("header.refresh");
}

function nowHm() {
	return new Date().toLocaleTimeString(currentLocale(), {
		hour: "2-digit",
		minute: "2-digit",
	});
}

async function refreshInBackground() {
	const bar = document.getElementById("refresh-bar");
	const pill = document.getElementById("status-pill");
	bar.hidden = false;
	pill.hidden = false;
	pill.textContent = t("header.refreshing");
	try {
		const data = await fetchData((info) => {
			const pct = info.pct >= 1 ? 100 : Math.min(99, Math.round((info.pct ?? 0) * 100));
			pill.textContent = t("header.refreshingPct", {
				pct: `${info.estimated ? "~" : ""}${pct}`,
			});
		});
		const next = JSON.stringify(data);
		if (next !== appliedPayload) {
			saveCache(data);
			await applyData(data, { fromCache: false });
		}
		pill.hidden = true;
		setRefreshTooltip(t("header.refreshLast", { time: nowHm() }), { kind: "ok", time: nowHm() });
	} catch (err) {
		console.error("Refresh failed:", err);
		pill.textContent = t("header.refreshFailedPill");
		setRefreshTooltip(t("header.refreshFailed"), { kind: "failed" });
		setTimeout(() => {
			pill.hidden = true;
		}, 6000);
	} finally {
		bar.hidden = true;
		headerSettled();
	}
}

function renderWarnings(model) {
	const chip = document.getElementById("warn-chip");
	const panel = document.getElementById("warn-panel");
	const warnings = model.meta.warnings;
	chip.hidden = false;
	if (!warnings.length) {
		chip.dataset.ok = "1";
		chip.innerHTML = icon("i-check");
		chip.dataset.tip = t("warn.chipOk");
		chip.setAttribute("aria-label", t("warn.chipOk"));
		panel.hidden = true;
		panel.innerHTML = `<div class="row" style="gap:8px;">
      <span class="icon-chip" style="--c:var(--pos);">${icon("i-check")}</span>
      <div>${esc(t("warn.panelOk"))}</div>
    </div>`;
		return;
	}
	delete chip.dataset.ok;
	chip.innerHTML = `${icon("i-warn")} ${warnings.length}`;
	chip.dataset.tip = tPlural("warn.chipCount", warnings.length);
	chip.setAttribute("aria-label", tPlural("warn.chipCount", warnings.length));
	panel.innerHTML =
		`<div class="row-between" style="margin-bottom:6px">
      <strong>${esc(t("warn.panelTitle"))}</strong>
      <button class="icon-btn" id="warn-close">${icon("i-x")}</button>
    </div>` +
		warnings
			.map((w) => {
				const params = w.params?.month
					? { ...w.params, month: fmtYmFull(w.params.month) }
					: w.params;
				return `
    <div class="warn-item" data-severity="${esc(w.severity)}">
      ${icon(w.severity === "info" ? "i-info" : "i-warn")}
      <div><div>${esc(t(w.key, params))}</div><div class="warn-tab">${esc(t(`tab.${w.tab}`))}</div></div>
    </div>`;
			})
			.join("");
	panel.querySelector("#warn-close").onclick = () => {
		panel.hidden = true;
		chip.setAttribute("aria-expanded", "false");
	};
}

function currentFilteredModel() {
	const b = state.rangeBounds;
	if (!b || !state.range) return state.fullModel;
	if (state.range.from <= b.min && state.range.to >= b.max) return state.fullModel;
	const filtered = filterModel(state.fullModel, state.range.from, state.range.to);
	if (filtered === state.fullModel) {
		state.range = null;
		saveRange();
	}
	return filtered;
}

function saveRange() {
	try {
		if (state.range) localStorage.setItem(RANGE_KEY, JSON.stringify(state.range));
		else localStorage.removeItem(RANGE_KEY);
	} catch {}
}

function loadStoredRange() {
	try {
		const raw = localStorage.getItem(RANGE_KEY);
		if (!raw) return null;
		const v = JSON.parse(raw);
		const ok = (d) => typeof d === "string" && /^\d{4}-\d{2}$/.test(d);
		return ok(v?.from) && ok(v?.to) && v.from <= v.to ? { from: v.from, to: v.to } : null;
	} catch {
		return null;
	}
}

function syncRangeBounds() {
	const bar = document.getElementById("range-bar");
	const fromEl = document.getElementById("range-from");
	const toEl = document.getElementById("range-to");
	const b = modelBounds(state.fullModel);
	state.rangeBounds = b;

	document.getElementById("range-toggle").hidden = !b;
	if (!b) {
		bar.hidden = true;
		state.range = null;
		return;
	}
	bar.hidden = false;
	fromEl.min = b.min;
	fromEl.max = b.max;
	toEl.min = b.min;
	toEl.max = b.max;

	if (!state.rangeRestored) {
		state.rangeRestored = true;
		state.range = loadStoredRange();
	}
	if (state.range) {
		const from = state.range.from < b.min ? b.min : state.range.from;
		const to = state.range.to > b.max ? b.max : state.range.to;
		state.range = from <= to && !(from <= b.min && to >= b.max) ? { from, to } : null;
		saveRange();
	}
	fromEl.value = state.range?.from ?? b.min;
	toEl.value = state.range?.to ?? b.max;
	renderRangeQuicks();
	updateRangeIndicator();
}

function addMonths(ym, delta) {
	const [y, m] = ym.split("-").map(Number);
	const d = new Date(y, m - 1 + delta, 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthDiff(from, to) {
	const [fy, fm] = from.split("-").map(Number);
	const [ty, tm] = to.split("-").map(Number);
	return (ty - fy) * 12 + (tm - fm) + 1;
}

function quickPresets(b) {
	const max = b.max;
	const year = max.slice(0, 4);
	const span = (n) => ({ from: addMonths(max, -(n - 1)), to: max });
	return [
		{
			key: "last3",
			label: t("range.last3"),
			short: t("range.last3Short"),
			...span(3),
			sub: `${fmtYm(addMonths(max, -2))} - ${fmtYm(max)}`,
		},
		{
			key: "last6",
			label: t("range.last6"),
			short: t("range.last6Short"),
			...span(6),
			sub: `${fmtYm(addMonths(max, -5))} - ${fmtYm(max)}`,
		},
		{
			key: "last12",
			label: t("range.last12"),
			short: t("range.last12Short"),
			...span(12),
			sub: `${fmtYm(addMonths(max, -11))} - ${fmtYm(max)}`,
		},
		{
			key: "thisYear",
			label: t("range.thisYear"),
			short: t("range.thisYearShort"),
			from: `${year}-01`,
			to: max,
			sub: year,
		},
		{
			key: "all",
			label: t("range.all"),
			short: t("range.allShort"),
			from: b.min,
			to: b.max,
			sub: `${fmtYm(b.min)} - ${fmtYm(b.max)}`,
		},
	];
}

function renderRangeQuicks() {
	const host = document.getElementById("range-quicks");
	const b = state.rangeBounds;
	if (!host || !b) return;
	const presets = quickPresets(b);

	const clamped = presets.map((p) => {
		const from = p.from < b.min ? b.min : p.from;
		const to = p.to > b.max ? b.max : p.to;
		return { from, to, has: from <= to && p.from <= b.max && p.to >= b.min };
	});
	const activeIdx = state.range
		? clamped.findIndex(
				(c, i) => c.has && c.from === state.range.from && c.to === state.range.to,
			)
		: presets.length - 1;

	host.innerHTML = presets
		.map((p, i) => {
			const { from, to, has } = clamped[i];
			const active = i === activeIdx;
			const tip = has
				? t("range.quickTip", { label: p.label, sub: p.sub, from: fmtYm(from), to: fmtYm(to) })
				: t("range.quickTipEmpty", { label: p.label, sub: p.sub });
			return `<button class="range-quick" data-from="${esc(p.from)}" data-to="${esc(p.to)}"
				${has ? "" : "disabled"} aria-pressed="${has && active}" data-tip="${esc(tip)}">
				<span class="rq-full">${esc(p.label)}</span><span class="rq-short">${esc(p.short)}</span><small>${esc(p.sub)}</small></button>`;
		})
		.join("");
	for (const btn of host.querySelectorAll(".range-quick")) {
		btn.onclick = () => applyRange(btn.dataset.from, btn.dataset.to);
	}
}

function applyRange(reqFrom, reqTo) {
	const b = state.rangeBounds;
	if (!b) return;
	const from = reqFrom < b.min ? b.min : reqFrom;
	const to = reqTo > b.max ? b.max : reqTo;
	if (from > to) return;
	state.range = from <= b.min && to >= b.max ? null : { from, to };
	saveRange();
	document.getElementById("range-from").value = from;
	document.getElementById("range-to").value = to;
	rerenderForRange();
}

function rerenderForRange() {
	if (!state.fullModel) return;
	state.model = currentFilteredModel();
	destroyAllCharts();
	state.renderedTabs.clear();
	document.querySelectorAll("[data-tab-panel]").forEach((s) => {
		s.innerHTML = "";
	});
	activate(state.activeTab);
	renderRangeQuicks();
	updateRangeIndicator();
}

function updateRangeIndicator() {
	const note = document.getElementById("range-note");
	const topNote = document.getElementById("range-note-top");
	const filtered = Boolean(state.range);
	note.hidden = !filtered;
	topNote.hidden = !filtered || rangeBarOpen();
	if (!filtered) return;
	const { from, to } = state.range;
	const label = `${icon("i-info")}<span>${esc(tPlural("range.note", monthDiff(from, to)))}</span>`;
	const tip = t("range.noteTip", { from: fmtYm(from), to: fmtYm(to) });
	for (const el of [note, topNote]) {
		el.innerHTML = label;
		el.dataset.tip = tip;
	}
}

function rangeBarOpen() {
	return document.documentElement.dataset.rangeBar !== "closed";
}

function setRangeBar(open) {
	if (open) delete document.documentElement.dataset.rangeBar;
	else document.documentElement.dataset.rangeBar = "closed";
	try {
		if (open) localStorage.removeItem(RANGE_BAR_KEY);
		else localStorage.setItem(RANGE_BAR_KEY, "closed");
	} catch {}
	updateRangeToggle();
	updateRangeIndicator();
}

function updateRangeToggle() {
	const btn = document.getElementById("range-toggle");
	const open = rangeBarOpen();
	btn.innerHTML = icon(open ? "i-row-open" : "i-row-closed");
	btn.setAttribute("aria-expanded", String(open));
	btn.dataset.tip = open ? t("range.hide") : t("range.show");
	btn.setAttribute("aria-label", btn.dataset.tip);
	document.getElementById("range-bar").inert = !open;
	refreshTip(btn);
}

function wireRangeBar() {
	const fromEl = document.getElementById("range-from");
	const toEl = document.getElementById("range-to");
	const onChange = (changed) => {
		const b = state.rangeBounds;
		if (!b) return;
		let from = fromEl.value || b.min;
		let to = toEl.value || b.max;
		if (from < b.min) from = b.min;
		if (to > b.max) to = b.max;
		if (from > to) {
			if (changed === fromEl) to = from;
			else from = to;
		}
		fromEl.value = from;
		toEl.value = to;
		state.range = from <= b.min && to >= b.max ? null : { from, to };
		saveRange();
		rerenderForRange();
	};
	fromEl.addEventListener("change", () => onChange(fromEl));
	toEl.addEventListener("change", () => onChange(toEl));
}

const THEME_MODES = [
	{ id: "auto", icon: "i-theme-auto", key: "header.themeAuto" },
	{ id: "light", icon: "i-sun", key: "header.themeLight" },
	{ id: "dark", icon: "i-moon", key: "header.themeDark" },
];

const currentThemeMode = () =>
	THEME_MODES.find((m) => m.id === currentMode()) ?? THEME_MODES[0];

function updateThemeBtn() {
	const btn = document.getElementById("theme-btn");
	const mode = currentThemeMode();
	btn.innerHTML = icon(mode.icon);
	btn.dataset.tip = t("header.theme", { mode: t(mode.key) });
	btn.setAttribute("aria-label", btn.dataset.tip);
	refreshTip(btn);
}

function updateLangBtn() {
	const btn = document.getElementById("lang-btn");
	const lang = LANGS.find((l) => l.id === currentLang()) ?? LANGS[0];
	btn.innerHTML = icon(`i-flag-${lang.id}`, "icon flag");
	btn.dataset.tip = t("header.langCurrent", { name: lang.name });
	btn.setAttribute("aria-label", btn.dataset.tip);
	refreshTip(btn);
}

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function popoverControls(btn, panel, render) {
	let timer = 0;
	const shown = () => !panel.hidden && panel.classList.contains("is-open");
	const flushLayout = () => panel.offsetHeight;
	const setExpanded = (v) => btn?.setAttribute("aria-expanded", v);
	const close = () => {
		if (!shown()) return;
		panel.classList.remove("is-open");
		setExpanded("false");
		clearTimeout(timer);
		timer = setTimeout(() => {
			panel.hidden = true;
		}, reducedMotion.matches ? 0 : 170);
	};
	const open = () => {
		clearTimeout(timer);
		render();
		panel.hidden = false;
		flushLayout();
		panel.classList.add("is-open");
		setExpanded("true");
	};
	return { open, close, toggle: () => (shown() ? close() : open()) };
}

let themeMenu = null;

function wireThemeMenu() {
	const btn = document.getElementById("theme-btn");
	const panel = document.getElementById("theme-panel");
	const label = (key) => {
		const s = t(key);
		return s.charAt(0).toLocaleUpperCase(currentLocale()) + s.slice(1);
	};
	const render = () => {
		panel.innerHTML = THEME_MODES.map(
			(m) =>
				`<button class="popover-item" data-mode="${m.id}" aria-current="${m.id === currentMode()}">
					${icon(m.icon)}<span>${esc(label(m.key))}</span>${icon("i-check", "icon popover-check")}
				</button>`,
		).join("");
	};
	themeMenu = popoverControls(btn, panel, render);
	btn.onclick = themeMenu.toggle;
	panel.addEventListener("click", (e) => {
		const item = e.target.closest("[data-mode]");
		if (!item) return;
		e.stopPropagation();
		themeMenu.close();
		setMode(item.dataset.mode);
		updateThemeBtn();
	});
	document.addEventListener("click", (e) => {
		if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) themeMenu.close();
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") themeMenu.close();
	});
	window.addEventListener("resize", () => themeMenu.close());
}

function wireLangMenu() {
	const btn = document.getElementById("lang-btn");
	const panel = document.getElementById("lang-panel");
	const { close, toggle } = popoverControls(btn, panel, () => render());
	const render = () => {
		panel.innerHTML = LANGS.map(
			(l) =>
				`<button class="popover-item" data-lang="${l.id}" aria-current="${l.id === currentLang()}">
					${icon(`i-flag-${l.id}`, "icon flag")}<span>${esc(l.name)}</span>${icon("i-check", "icon popover-check")}
				</button>`,
		).join("");
	};
	btn.onclick = toggle;
	panel.addEventListener("click", (e) => {
		const item = e.target.closest("[data-lang]");
		if (!item) return;
		close();
		setLang(item.dataset.lang);
	});
	document.addEventListener("click", (e) => {
		if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close();
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") close();
	});
	window.addEventListener("resize", close);
}

function applyStaticTexts() {
	document.title = t("app.title");
	document.querySelector('meta[name="description"]')?.setAttribute("content", t("app.description"));
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		el.textContent = t(el.dataset.i18n);
	});
	document.getElementById("range-label").textContent = t("range.label");
	document.getElementById("range-from").setAttribute("aria-label", t("range.from"));
	document.getElementById("range-to").setAttribute("aria-label", t("range.to"));
	const refresh = document.getElementById("refresh-btn");
	refresh.dataset.tip = refreshTooltipText();
	refresh.setAttribute("aria-label", t("header.refresh"));
	const site = document.getElementById("site-link");
	site.dataset.tip = t("header.source");
	site.setAttribute("aria-label", t("header.source"));
	const menu = document.getElementById("menu-btn");
	menu.setAttribute("aria-label", t("header.menu"));
	document.getElementById("tab-nav").setAttribute("aria-label", t("app.brand"));
	const brand = document.querySelector(".brand");
	if (brand) brand.dataset.tip = t("app.version", { v: APP_VERSION });
}

function onLangChange() {
	applyStaticTexts();
	updateThemeBtn();
	updateLangBtn();
	updateRangeToggle();
	refreshNavLabels();
	if (state.fullModel) {
		renderRangeQuicks();
		updateRangeIndicator();
		renderWarnings(state.fullModel);
		renderDataAge(state.fullModel);
		destroyAllCharts();
		state.renderedTabs.clear();
		document.querySelectorAll("[data-tab-panel]").forEach((s) => {
			s.innerHTML = "";
		});
		activate(state.activeTab);
	}
}

function wireMenu() {
	const btn = document.getElementById("menu-btn");
	const panel = document.getElementById("menu-panel");
	const { close, toggle } = popoverControls(btn, panel, () => render());
	const render = () => {
		const note = document.getElementById("range-note-top");
		panel.innerHTML =
			(state.range
				? `<div class="menu-item menu-info" data-tip="${esc(note.dataset.tip ?? "")}">${icon("i-info")}<span>${esc(note.querySelector("span")?.textContent ?? "")}</span></div>`
				: "") +
			`<button class="menu-item" data-menu="lang" aria-haspopup="true">${icon(`i-flag-${currentLang()}`, "icon flag")}<span>${esc(document.getElementById("lang-btn").dataset.tip ?? "")}</span></button>
				<button class="menu-item" data-menu="theme" aria-haspopup="true">${icon(currentThemeMode().icon)}<span>${esc(document.getElementById("theme-btn").dataset.tip ?? "")}</span></button>
				<a class="menu-item" href="${SOURCE_URL}" rel="noopener" target="_blank">${icon("i-home")}<span>${esc(t("header.sourceMenu"))}</span></a>`;
	};
	btn.onclick = toggle;
	panel.addEventListener("click", (e) => {
		const item = e.target.closest("[data-menu]");
		if (!item) return;
		e.stopPropagation();
		close();
		if (item.dataset.menu === "theme") themeMenu.open();
		else if (item.dataset.menu === "lang") document.getElementById("lang-btn").click();
	});
	document.addEventListener("click", (e) => {
		if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close();
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") close();
	});
	window.addEventListener("resize", close);
}

function toggleWarnPanel() {
	const panel = document.getElementById("warn-panel");
	const chip = document.getElementById("warn-chip");
	panel.hidden = !panel.hidden;
	chip.setAttribute("aria-expanded", String(!panel.hidden));
}

function wirePanelDismiss() {
	const panel = document.getElementById("warn-panel");
	const chip = document.getElementById("warn-chip");
	const close = () => {
		if (panel.hidden) return;
		panel.hidden = true;
		chip.setAttribute("aria-expanded", "false");
	};
	document.addEventListener("click", (e) => {
		if (!panel.hidden && !panel.contains(e.target) && !chip.contains(e.target)) close();
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") close();
	});
}

let headerRowObserver = null;

function watchHeaderHeight() {
	const row = document.querySelector(".header-inner");
	if (!row) return;
	const publish = () => {
		document.documentElement.style.setProperty(
			"--header-h",
			`${Math.round(row.getBoundingClientRect().height)}px`,
		);
	};
	publish();
	if (typeof ResizeObserver === "function") {
		headerRowObserver = new ResizeObserver(publish);
		headerRowObserver.observe(row);
	} else {
		window.addEventListener("resize", publish);
	}
	document.addEventListener("holamento:themechange", publish);
}

(async function boot() {
	injectIcons();
	initLang();
	initAppearance();
	watchHeaderHeight();
	initTooltips();
	applyStaticTexts();
	updateThemeBtn();
	updateLangBtn();
	updateRangeToggle();

	for (const p of PANELS) registerPanel(p.id, `tab.${p.id}`, p.iconId, p.render);
	buildNav();
	state.activeTab = initialTab();
	activate(state.activeTab);

	watchTabBar();
	window.addEventListener("hashchange", () => activate(initialTab()));

	document.getElementById("warn-chip").onclick = toggleWarnPanel;
	wirePanelDismiss();
	wireMenu();
	wireLangMenu();
	wireThemeMenu();
	wireRangeBar();
	document.getElementById("range-toggle").onclick = () => setRangeBar(!rangeBarOpen());

	document.addEventListener("holamento:langchange", onLangChange);
	document.getElementById("refresh-btn").onclick = () => {
		clearCache();
		hardLoad();
	};
	document.addEventListener("holamento:refresh", () => {
		clearCache();
		hardLoad();
	});
	document.addEventListener("holamento:showwarnings", () => {
		document.getElementById("warn-panel").hidden = false;
		document.getElementById("warn-chip").setAttribute("aria-expanded", "true");
	});

	const cached = loadCache();
	if (cached) {
		try {
			await applyData(cached, { fromCache: true });
			refreshInBackground();
			return;
		} catch (e) {
			console.error("Cache error, full load:", e);
			clearCache();
		}
	}
	await hardLoad();
})();
