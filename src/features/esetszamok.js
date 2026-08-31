import * as derive from "../data/derive.js";
import { t } from "../app/i18n.js";
import { makeChart, minAxis, roundOrNull, sparkline } from "../ui/charts.js";
import { prioColor, catColor } from "../ui/categories.js";
import { fmtMin, fmtNum, fmtNum2, fmtPct, fmtYm, fmtYmFull, fmtCases, daysInMonth } from "../utils/fmt.js";
import { cell, dataTable } from "../ui/table.js";
import { chartCard, emptyState, esc, statCard, prioBadge } from "../ui/ui.js";
import { loadSeg, segHtml, segInline, wireSeg } from "../ui/segmented.js";

export const id = "esetszamok";
export const iconId = "i-pulse";

const AREA_KEY = "holamento-esetszamok-area";
const PRIO_KEY = "holamento-esetszamok-prio";
const AREA_DEFS = [
	{ id: "orszagos", key: "area.Országos" },
	{ id: "budapest", key: "area.Budapest" },
	{ id: "videk", key: "area.Vidék" },
];

export function render(model, mount) {
	const areaOpts = AREA_DEFS.map((a) => ({ id: a.id, label: t(a.key) }));
	const area = loadSeg(AREA_KEY, areaOpts, "orszagos");
	const areaLabel = areaOpts.find((o) => o.id === area)?.label ?? t("area.Országos");

	const cases = areaCases(model, area);
	const bpShare = derive.budapestShare(model);
	const bpMonths = model.series.months ?? [];

	const prios = model.meta.priorities;
	const months = cases.months ?? [];
	const n = months.length;
	const latest = model.meta.latestMonth;
	const prevMonth = model.meta.prevMonth;
	const prelim = model.meta.latestIsPreliminary;
	const range = model.meta.range ?? { from: latest, to: latest };

	const monthLabel = latest ? fmtYm(latest) : t("common.noDataShort");
	const prelimSuffix = prelim ? t("common.preliminarySuffix") : "";
	const periodSub = range.from === range.to
		? t("esetszamok.subOneMonth", { month: fmtYm(range.to), area: areaLabel })
		: t("esetszamok.subRange", {
			from: fmtYm(range.from),
			to: fmtYm(range.to),
			area: areaLabel,
		});

	const hasCases = n > 0 && prios.some((p) => (cases.byPrio?.[p] ?? []).some((v) => v != null));
	const hasPerDay = n > 0 && (cases.perDay ?? []).some((v) => v != null);
	const hasMix = n > 0 && prios.some((p) => (cases.mixPct?.[p] ?? []).some((v) => v != null));
	const hasBp = bpShare.length > 0 && bpShare.some((v) => v != null);

	const prioOpts = prios.map((p) => ({ id: p, label: p }));
	const prio = loadSeg(PRIO_KEY, prioOpts, "P1");
	const isVidek = area === "videk";
	const areaName = area === "budapest" ? "Budapest" : "Országos";
	const medianLabel = t("metric.median");
	const loadPts = isVidek ? [] : derive.loadPoints(model, areaName, prio, "median");
	const corrRows = isVidek ? [] : derive.loadCorrelation(model, areaName);
	const hasLoad = loadPts.length > 0;
	const hasCorr = corrRows.some((r) => r.median != null || r.p75 != null || r.p90 != null);
	const corrN = corrRows.length
		? corrRows.reduce((m, r) => Math.min(m, r.n ?? 0), corrRows[0].n ?? 0)
		: 0;
	const loadHint = isVidek ? t("esetszamok.loadVidekHint") : "";

	const lastTotal = n ? cases.total[n - 1] : null;
	const prevTotal = n > 1 ? cases.total[n - 2] : null;
	const lastPerDay = n ? cases.perDay?.[n - 1] ?? null : null;
	const lastP1Share = n ? cases.mixPct?.P1?.[n - 1] ?? null : null;
	const totalDelta = lastTotal != null && prevTotal != null ? lastTotal - prevTotal : null;
	const yoy = yoyCases(cases);

	const tableRows = prios.map((p) => {
		const curr = n ? cases.byPrio?.[p]?.[n - 1] ?? null : null;
		const prev = n > 1 ? cases.byPrio?.[p]?.[n - 2] ?? null : null;
		const share = curr != null && lastTotal ? curr / lastTotal : null;
		const delta = curr != null && prev != null ? curr - prev : null;
		return {
			prio: cell(p, `${prioBadge(p)} <span class="muted small">${esc(t(`prio.${p}`))}</span>`),
			esetszam: cell(curr, fmtNum(curr)),
			mix: cell(share, fmtPct(share)),
			delta: cell(delta, fmtSignedNum(delta)),
		};
	});
	tableRows.push({
		prio: cell(t("esetszamok.total"), `<strong>${esc(t("esetszamok.total"))}</strong>`),
		esetszam: cell(lastTotal, `<strong>${fmtNum(lastTotal)}</strong>`),
		mix: cell(lastTotal != null ? 1 : null, lastTotal != null ? fmtPct(1) : "-"),
		delta: cell(totalDelta, fmtSignedNum(totalDelta)),
	});

	mount.innerHTML = `
		${segHtml(AREA_KEY, areaOpts, area, { label: t("esetszamok.areaLabel") })}
		<div class="kpi-row">
			${statCard({
				cat: "eset",
				iconId: "i-pulse",
				label: esc(t("esetszamok.kpiTotal", { area: areaLabel })),
				value: fmtNum(lastTotal),
				foot: latest ? esc(`${fmtYm(latest)}${prelimSuffix}`) : esc(t("common.noDataShort")),
				spark: sparkline(cases.total ?? []),
				tip: tipLines(
					t("esetszamok.kpiTotalTip", { month: monthLabel }),
					calc(t("esetszamok.kpiTotalCalc")),
					prevMonth
						? t("common.vsPrevMonth", { delta: fmtSignedNum(totalDelta) })
						: t("common.noPrevMonth"),
				),
			})}
			${statCard({
				cat: "eset",
				iconId: "i-calendar",
				label: esc(t("esetszamok.kpiPerDay")),
				value: lastPerDay != null ? fmtNum(Math.round(lastPerDay)) : "-",
				foot: lastPerDay != null
					? esc(t("esetszamok.kpiPerDayFoot", { month: monthLabel }))
					: esc(t("common.noData")),
				spark: sparkline(cases.perDay ?? []),
				tip: tipLines(
					t("esetszamok.kpiPerDayTip", { month: monthLabel }),
					calc(t("esetszamok.kpiPerDayCalc")),
					t("esetszamok.kpiPerDayNote"),
				),
			})}
			${statCard({
				cat: "eset",
				iconId: "i-siren",
				label: esc(t("esetszamok.kpiP1")),
				value: fmtPct(lastP1Share),
				foot: esc(t("prio.P1")),
				tip: tipLines(
					t("esetszamok.kpiP1Tip", { month: monthLabel }),
					calc(t("esetszamok.kpiP1Calc")),
				),
			})}
			${statCard({
				cat: "eset",
				iconId: "i-scale",
				label: esc(t("esetszamok.kpiYoy")),
				value: fmtSignedPct(yoy?.pct),
				foot: yoy
					? esc(t("esetszamok.kpiYoyFoot", {
						curr: fmtCases(yoy.curr),
						prev: fmtNum(yoy.prev),
					}))
					: esc(t("esetszamok.kpiYoyNone")),
				tip: tipLines(
					t("esetszamok.kpiYoyTip"),
					calc(t("esetszamok.kpiYoyCalc")),
					t("esetszamok.kpiYoyNote"),
				),
			})}
		</div>
		<div class="grid12">
			${hasCases ? chartCard({
				span: 12,
				cat: "eset",
				iconId: "i-pulse",
				title: esc(t("esetszamok.monthlyTitle")),
				sub: esc(periodSub),
				id: "ch-ese-havi",
				tip: tipLines(
					t("esetszamok.monthlyTip"),
					t("esetszamok.monthlyTipHeight"),
					`P1: ${t("prio.P1")}, P4: ${t("prio.P4")}.`,
				),
			}) : emptyState({ span: 12, iconId: "i-pulse", title: t("esetszamok.monthlyTitle") })}
			${hasPerDay ? chartCard({
				span: 6,
				cat: "eset",
				iconId: "i-calendar",
				title: esc(t("esetszamok.perDayTitle")),
				sub: esc(t("esetszamok.perDaySub", { area: areaLabel })),
				id: "ch-ese-napi",
				tip: tipLines(
					t("esetszamok.perDayTip"),
					calc(t("esetszamok.kpiPerDayCalc")),
					t("esetszamok.kpiPerDayNote"),
				),
			}) : emptyState({ span: 6, iconId: "i-calendar", title: t("esetszamok.perDayTitle") })}
			${hasMix ? chartCard({
				span: 6,
				cat: "eset",
				iconId: "i-scale",
				title: esc(t("esetszamok.mixTitle")),
				sub: esc(t("esetszamok.mixSub", { area: areaLabel })),
				id: "ch-ese-mix",
				tip: tipLines(
					t("esetszamok.mixTip"),
					calc(t("esetszamok.mixCalc")),
					t("esetszamok.mixNote"),
				),
			}) : emptyState({ span: 6, iconId: "i-scale", title: t("esetszamok.mixTitle") })}
			${hasBp ? chartCard({
				span: 6,
				cat: "regio",
				iconId: "i-map",
				title: esc(t("esetszamok.bpTitle")),
				sub: esc(t("esetszamok.bpSub")),
				id: "ch-ese-bp",
				tip: tipLines(
					t("esetszamok.bpTip"),
					calc(t("esetszamok.bpCalc")),
					t("esetszamok.bpNote"),
				),
			}) : emptyState({ span: 6, iconId: "i-map", title: t("esetszamok.bpTitle") })}
			${hasCases ? dataTable({
				span: 6,
				cat: "eset",
				iconId: "i-pulse",
				title: esc(`${t("esetszamok.tableTitle", { month: fmtYmFull(latest) })}${prelimSuffix}`),
				sub: esc(prevMonth
					? t("esetszamok.tableSub", { area: areaLabel })
					: t("esetszamok.tableSubNoPrev", { area: areaLabel })),
				tip: tipLines(
					t("esetszamok.tableTip", { month: monthLabel }),
					prevMonth ? t("esetszamok.tableTipDelta") : t("common.noPrevMonth"),
					t("esetszamok.kpiYoyNote"),
				),
				columns: [
					{ key: "prio", label: esc(t("esetszamok.colPrio")) },
					{ key: "esetszam", label: esc(t("esetszamok.colCases")), num: true },
					{ key: "mix", label: esc(t("esetszamok.colMix")), num: true },
					{ key: "delta", label: esc(t("esetszamok.colDelta")), num: true },
				],
				rows: tableRows,
				pageSize: 5,
			}) : emptyState({ span: 6, iconId: "i-pulse", title: t("esetszamok.tableTitle", { month: fmtYmFull(latest) }) })}
			${isVidek ? "" : segInline(segHtml(PRIO_KEY, prioOpts, prio, { label: t("esetszamok.segPrio") }))}
			${hasLoad ? chartCard({
				span: 6,
				cat: "eset",
				iconId: "i-scale",
				title: esc(t("esetszamok.loadTitle", { prio })),
				sub: esc(t("esetszamok.loadSub", { metric: medianLabel, area: areaLabel })),
				id: "ch-ese-terheles",
				tip: tipLines(
					t("esetszamok.loadTip", { metric: medianLabel }),
					calc(t("esetszamok.loadCalc", { prio, metric: medianLabel })),
					t("esetszamok.loadNote"),
				),
			}) : emptyState({
				span: 6,
				iconId: "i-scale",
				title: t("esetszamok.loadEmptyTitle"),
				hint: loadHint,
			})}
			${hasCorr ? dataTable({
				span: 6,
				cat: "eset",
				iconId: "i-gauge",
				title: esc(t("esetszamok.corrTitle")),
				sub: esc(t("esetszamok.corrSub", { n: fmtNum(corrN), area: areaLabel })),
				tip: tipLines(
					t("esetszamok.corrTip"),
					t("esetszamok.corrTipScale"),
					t("esetszamok.corrTipWarn", { n: fmtNum(corrN) }),
				),
				columns: [
					{ key: "prio", label: esc(t("esetszamok.colPrio")) },
					{ key: "median", label: esc(t("metric.median")), num: true },
					{ key: "p75", label: esc(t("metric.p75")), num: true },
					{ key: "p90", label: esc(t("metric.p90")), num: true },
				],
				rows: corrRows.map((r) => ({
					prio: cell(r.prio, `${prioBadge(r.prio)} <span class="muted small">${esc(t(`prio.${r.prio}`))}</span>`),
					median: cell(r.median, fmtNum2(r.median)),
					p75: cell(r.p75, fmtNum2(r.p75)),
					p90: cell(r.p90, fmtNum2(r.p90)),
				})),
				pageSize: 5,
			}) : emptyState({
				span: 6,
				iconId: "i-gauge",
				title: t("esetszamok.corrTitle"),
				hint: loadHint,
			})}
		</div>`;

	if (hasCases) {
		makeChart(mount.querySelector("#ch-ese-havi"), {
			chart: { type: "bar", height: 340, stacked: true },
			series: prios.map((p) => ({
				name: p,
				data: months.map((_, i) => cases.byPrio?.[p]?.[i] ?? null),
			})),
			colors: prios.map((p) => prioColor(p)),
			plotOptions: { bar: { columnWidth: "62%" } },
			labels: months.map(fmtYm),
			xaxis: { tickAmount: 10 },
			yaxis: { min: 0, labels: { formatter: (v) => fmtNum(v) } },
			tooltip: { y: { formatter: (v) => fmtCases(v) } },
			legend: { position: "top" },
		});
	}

	if (hasPerDay) {
		makeChart(mount.querySelector("#ch-ese-napi"), {
			chart: { type: "line", height: 300 },
			series: [{
				name: t("esetszamok.kpiPerDay"),
				data: (cases.perDay ?? []).map((v) => (v == null ? null : Math.round(v))),
			}],
			colors: [catColor("eset")],
			stroke: { width: 3, curve: "smooth" },
			labels: months.map(fmtYm),
			xaxis: { tickAmount: 6 },
			yaxis: { min: 0, labels: { formatter: (v) => fmtNum(v) } },
			tooltip: { y: { formatter: (v) => t("esetszamok.perDayTooltip", { n: fmtCases(v) }) } },
		});
	}

	if (hasMix) {
		makeChart(mount.querySelector("#ch-ese-mix"), {
			chart: { type: "bar", height: 300, stacked: true, stackType: "100%" },
			series: prios.map((p) => ({
				name: p,
				data: months.map((_, i) => {
					const v = cases.mixPct?.[p]?.[i];
					return v == null ? null : Math.round(v * 1000) / 10;
				}),
			})),
			colors: prios.map((p) => prioColor(p)),
			plotOptions: { bar: { columnWidth: "62%" } },
			labels: months.map(fmtYm),
			xaxis: { tickAmount: 6 },
			yaxis: { labels: { formatter: (v) => fmtPct(Math.round(v) / 100) } },
			tooltip: { y: { formatter: (v) => (v == null ? "-" : fmtPct(v / 100)) } },
			legend: { position: "top" },
		});
	}

	if (hasBp) {
		makeChart(mount.querySelector("#ch-ese-bp"), {
			chart: { type: "line", height: 300 },
			series: [{
				name: t("esetszamok.bpTitle"),
				data: bpShare.map((v) => (v == null ? null : Math.round(v * 1000) / 10)),
			}],
			colors: [catColor("regio")],
			stroke: { width: 3, curve: "smooth" },
			labels: bpMonths.length === bpShare.length
				? bpMonths.map(fmtYm)
				: months.map(fmtYm),
			xaxis: { tickAmount: 6 },
			yaxis: { min: 0, labels: { formatter: (v) => fmtPct(Math.round(v) / 100) } },
			tooltip: { y: { formatter: (v) => (v == null ? "-" : fmtPct(v / 100)) } },
		});
	}

	if (hasLoad) {
		makeChart(mount.querySelector("#ch-ese-terheles"), {
			chart: { type: "scatter", height: 300 },
			series: [{
				name: t("esetszamok.loadSeries", { prio }),
				data: loadPts.map((pt) => [pt.cases, roundOrNull(pt.value)]),
			}],
			colors: [catColor("eset")],
			markers: { size: 6 },
			xaxis: {
				type: "numeric",
				tickAmount: 6,
				title: { text: t("esetszamok.loadXTitle") },
				labels: { formatter: (v) => fmtNum(v) },
			},
			yaxis: minAxis,
			tooltip: {
				x: { formatter: (v, opts) => loadTooltipX(loadPts, v, opts) },
				y: { formatter: (v) => fmtMin(v) },
			},
			legend: { show: false },
		});
	}

	wireSeg(mount, AREA_KEY, () => render(model, mount));
	wireSeg(mount, PRIO_KEY, () => render(model, mount));
}

function loadTooltipX(points, value, opts) {
	const pt = points[opts?.dataPointIndex ?? -1];
	return t("esetszamok.loadTooltipX", {
		month: pt ? fmtYm(pt.ym) : t("common.noDataShort"),
		cases: fmtCases(value),
	});
}

function areaCases(model, areaId) {
	if (areaId === "videk") {
		const v = derive.videkCaseSeries(model);
		const perDay = v.months.map((ym, i) => {
			const d = daysInMonth(ym);
			return v.total[i] != null && d ? v.total[i] / d : null;
		});
		const mixPct = {};
		for (const p of model.meta.priorities) {
			mixPct[p] = v.months.map((_, i) => {
				const val = v.byPrio[p]?.[i];
				return val != null && v.total[i] ? val / v.total[i] : null;
			});
		}
		return { ...v, perDay, mixPct };
	}
	return derive.caseSeries(model, areaId === "budapest" ? "Budapest" : "Országos");
}

function yoyCases(cases) {
	const months = cases.months ?? [];
	const years = [...new Set(months.map((ym) => ym.slice(0, 4)))].sort();
	if (years.length < 2) return null;
	const yCurr = years[years.length - 1];
	const yPrev = String(Number(yCurr) - 1);
	if (!years.includes(yPrev)) return null;
	const byMonth = new Map(months.map((ym, i) => [ym, cases.total[i]]));
	let curr = 0;
	let prev = 0;
	let hasPair = false;
	for (const [ym, v] of byMonth) {
		if (!ym.startsWith(`${yCurr}-`)) continue;
		const pv = byMonth.get(`${yPrev}-${ym.slice(5)}`);
		if (v != null && pv != null) {
			curr += v;
			prev += pv;
			hasPair = true;
		}
	}
	if (!hasPair || !prev) return null;
	return { curr, prev, pct: (curr - prev) / prev };
}

function tipLines(...parts) {
	return parts.filter(Boolean).join("\n");
}

function calc(text) {
	return `${t("common.tipCalc")}: ${text}`;
}

function fmtSignedNum(v) {
	if (v == null || !Number.isFinite(v)) return "-";
	return `${v > 0 ? "+" : ""}${fmtNum(v)}`;
}

function fmtSignedPct(v) {
	if (v == null || !Number.isFinite(v)) return "-";
	return `${v > 0 ? "+" : ""}${fmtPct(v)}`;
}
