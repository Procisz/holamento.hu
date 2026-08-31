import { t } from "../app/i18n.js";
import * as derive from "../data/derive.js";
import { catColor } from "../ui/categories.js";
import { makeChart, minAxis, minTooltip, roundOrNull } from "../ui/charts.js";
import { icon } from "../ui/icons.js";
import { loadSeg, segHtml, wireSeg } from "../ui/segmented.js";
import { cell, dataTable } from "../ui/table.js";
import { chartCard, emptyState, esc, prioBadge, statCard, tipDot } from "../ui/ui.js";
import { fmtMin, fmtMinShort, fmtPct, fmtYmFull } from "../utils/fmt.js";

export const id = "bontas";
export const iconId = "i-hourglass";

const PRIO_KEY = "holamento-bontas-prio";
const METRIC_KEY = "holamento-bontas-metric";

export function render(model, mount) {
	const prioOpts = model.meta.priorities.map((p) => ({ id: p, label: p }));
	const prio = loadSeg(PRIO_KEY, prioOpts, "P1");
	const metricOpts = derive.METRIC_IDS.map((m) => ({
		id: m,
		label: t(`metric.${m}`),
	}));
	const metric = loadSeg(METRIC_KEY, metricOpts, "median");
	const metricLabel = t(`metric.${metric}`);
	const calc = t("common.tipCalc");

	const summary = derive.dispatchSummary(model, prio, metric);
	const allRows = derive.dispatchSplitAll(model, metric);
	const monthLabel = fmtYmFull(summary?.month ?? model.regionSnapshotAlt?.month);

	const controls = `
    <div class="card" data-span="12" data-cat="fazis">
      <div class="card-body">
        ${segHtml(PRIO_KEY, prioOpts, prio, { label: t("bontas.segPrio") })}
        ${segHtml(METRIC_KEY, metricOpts, metric, { label: t("bontas.segMetric") })}
        <div class="card-sub">${esc(
					t("bontas.segSub", {
						prio,
						prioDesc: t(`prio.${prio}`),
						metric: metricLabel,
						metricDesc: t(`metricDesc.${metric}`),
					}),
				)}</div>
        ${summary ? `<div class="card-sub">${esc(t("bontas.coverSub", { month: monthLabel }))}</div>` : ""}
      </div>
    </div>`;

	const method = `
    <div class="card" data-span="6" data-cat="adat">
      <div class="card-head">
        <span class="icon-chip">${icon("i-info")}</span>
        <div><h2 class="card-title">${esc(t("bontas.methodTitle"))}${tipDot(t("bontas.methodTip", { calc }))}</h2></div>
      </div>
      <div class="card-body">
        <ul class="fact-list">
          ${["method1", "method2", "method3", "method4"]
						.map((k) => `<li>${icon("i-info")}<span>${esc(t(`bontas.${k}`))}</span></li>`)
						.join("")}
        </ul>
      </div>
    </div>`;

	if (!summary) {
		const missing = (model.full ?? model).regionSnapshotAlt == null;
		mount.innerHTML = `${controls}
      <div class="grid12">
        ${emptyState({
					span: 6,
					iconId: "i-hourglass",
					title: t("bontas.emptyTitle"),
					message: missing ? t("bontas.emptyMissing") : t("bontas.emptyHint"),
				})}
        ${method}
      </div>`;
		wireSeg(mount, PRIO_KEY, () => render(model, mount));
		wireSeg(mount, METRIC_KEY, () => render(model, mount));
		return;
	}

	const stackRows = [...summary.rows].sort((a, b) => a.total - b.total);

	mount.innerHTML = `
    <div class="kpi-row">
      ${statCard({
				cat: "fazis",
				iconId: "i-phone",
				label: esc(t("bontas.kpiFastLabel", { prio })),
				value: fmtMin(summary.fastest.beforeAlarm),
				foot: esc(summary.fastest.name),
				tip: t("bontas.kpiFastTip", { month: monthLabel, calc }),
			})}
      ${statCard({
				cat: "fazis",
				iconId: "i-hourglass",
				label: esc(t("bontas.kpiSlowLabel", { prio })),
				value: fmtMin(summary.slowest.beforeAlarm),
				foot: esc(summary.slowest.name),
				tip: t("bontas.kpiSlowTip", { month: monthLabel, calc }),
			})}
      ${statCard({
				cat: "fazis",
				iconId: "i-gauge",
				label: esc(t("bontas.kpiShareLabel")),
				value: fmtPct(summary.avgShare),
				foot: esc(
					t("bontas.kpiShareFoot", { min: fmtMin(summary.avgBeforeAlarm) }),
				),
				tip: t("bontas.kpiShareTip", { month: monthLabel, calc }),
			})}
      ${statCard({
				cat: "szoras",
				iconId: "i-scale",
				label: esc(t("bontas.kpiGapLabel")),
				value: fmtMin(summary.gap),
				foot: esc(
					t("bontas.kpiGapFoot", {
						fastest: summary.fastest.name,
						slowest: summary.slowest.name,
					}),
				),
				tip: t("bontas.kpiGapTip", { month: monthLabel, calc }),
			})}
    </div>
    ${controls}
    <div class="grid12">
      ${chartCard({
				span: 12,
				cat: "fazis",
				iconId: "i-clock",
				title: esc(t("bontas.stackTitle", { prio, metric: metricLabel })),
				sub: esc(t("bontas.stackSub", { month: monthLabel })),
				id: "ch-bon-stack",
				tip: t("bontas.stackTip", { calc }),
			})}
      ${chartCard({
				span: 6,
				cat: "fazis",
				iconId: "i-gauge",
				title: esc(t("bontas.shareTitle", { prio, metric: metricLabel })),
				sub: esc(t("bontas.shareSub", { month: monthLabel })),
				id: "ch-bon-share",
				tip: t("bontas.shareTip", { calc }),
			})}
      ${method}
      ${dataTable({
				span: 12,
				cat: "fazis",
				iconId: "i-map",
				title: esc(t("bontas.tableTitle", { metric: metricLabel })),
				sub: esc(t("bontas.tableSub", { month: monthLabel })),
				tip: t("bontas.tableTip", { calc }),
				columns: [
					{ key: "regio", label: esc(t("bontas.colRegion")) },
					{ key: "prio", label: esc(t("bontas.colPrio")) },
					{ key: "total", label: esc(t("bontas.colTotal")), num: true },
					{ key: "alarm", label: esc(t("bontas.colFromAlarm")), num: true },
					{ key: "before", label: esc(t("bontas.colBefore")), num: true },
					{ key: "share", label: esc(t("bontas.colShare")), num: true },
				],
				rows: allRows.map((r) => ({
					regio: cell(
						r.name,
						`${esc(r.name)} <span class="muted">${esc(r.code)}</span>`,
					),
					prio: cell(r.prio, prioBadge(r.prio)),
					total: cell(r.total, fmtMin(r.total)),
					alarm: cell(r.fromAlarm, fmtMin(r.fromAlarm)),
					before: cell(r.beforeAlarm, fmtMin(r.beforeAlarm)),
					share: cell(r.share, fmtPct(r.share)),
				})),
				defaultSort: { key: "before", dir: "desc" },
				pageSize: 10,
			})}
    </div>`;

	makeChart(mount.querySelector("#ch-bon-stack"), {
		chart: { type: "bar", height: 360, stacked: true },
		series: [
			{
				name: t("bontas.seriesBefore"),
				data: stackRows.map((r) => roundOrNull(r.beforeAlarm)),
			},
			{
				name: t("bontas.seriesAfter"),
				data: stackRows.map((r) => roundOrNull(r.fromAlarm)),
			},
		],
		colors: [catColor("fazis"), catColor("ido")],
		plotOptions: { bar: { horizontal: true, borderRadius: 3 } },
		dataLabels: { enabled: true, formatter: (v) => fmtMinShort(v) },
		xaxis: { categories: stackRows.map((r) => r.name), ...minAxis },
		tooltip: minTooltip,
		legend: { position: "top" },
	});

	makeChart(mount.querySelector("#ch-bon-share"), {
		chart: { type: "bar", height: 300 },
		series: [
			{
				name: t("bontas.kpiShareLabel"),
				data: stackRows.map((r) =>
					r.share == null ? null : Math.round(r.share * 1000) / 10,
				),
			},
		],
		colors: [catColor("fazis")],
		plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
		dataLabels: {
			enabled: true,
			formatter: (v) => (v == null ? "-" : fmtPct(v / 100)),
		},
		xaxis: { categories: stackRows.map((r) => r.code) },
		yaxis: {
			min: 0,
			labels: { formatter: (v) => fmtPct(Math.round(v) / 100) },
		},
		tooltip: {
			x: {
				formatter: (v, opts) =>
					stackRows[opts?.dataPointIndex]?.name ?? v,
			},
			y: { formatter: (v) => (v == null ? "-" : fmtPct(v / 100)) },
		},
		legend: { show: false },
	});

	wireSeg(mount, PRIO_KEY, () => render(model, mount));
	wireSeg(mount, METRIC_KEY, () => render(model, mount));
}
