import { t } from "../app/i18n.js";
import * as derive from "../data/derive.js";
import { prioColor } from "../ui/categories.js";
import { makeChart, minAxis, minTooltip, roundOrNull } from "../ui/charts.js";
import { icon } from "../ui/icons.js";
import { loadSeg, segHtml, wireSeg } from "../ui/segmented.js";
import { cell, dataTable } from "../ui/table.js";
import {
	chartCard,
	emptyState,
	esc,
	prioBadge,
	statCard,
	tipDot,
} from "../ui/ui.js";
import { fmtMin, fmtMinShort, fmtNum1, fmtYm, fmtYmFull } from "../utils/fmt.js";

export const id = "szoras";
export const iconId = "i-gauge";

const AREA_KEY = "holamento-szoras-area";
const AREA_IDS = ["Országos", "Budapest"];

export function render(model, mount) {
	const areaOpts = AREA_IDS.map((a) => ({ id: a, label: t(`area.${a}`) }));
	const area = loadSeg(AREA_KEY, areaOpts, AREA_IDS[0]);
	const areaLabel = t(`area.${area}`);
	const long = derive.longSeries(model, area);
	const ratios = derive.tailRatios(model, area);
	const gaps = derive.tailGaps(model, area);
	const cells = derive.worstCells(model);
	const top = cells.slice(0, 5);
	const latest = model.meta.latestMonth;
	const range = model.meta.range ?? { from: latest, to: latest };
	const snapMonth = model.regionSnapshot?.month ?? latest;
	const prelim =
		model.meta.latestIsPreliminary && snapMonth === model.meta.latestMonth
			? t("common.preliminarySuffix")
			: "";
	const calc = t("common.tipCalc");
	const regionHint = t("szoras.regionHint");
	const gapLabel = t("szoras.gapLabel");

	const ratioSeries = model.meta.priorities.map((p) => ({
		prio: p,
		values: (ratios.byPrio[p] ?? []).map(roundOrNull),
	}));
	const hasRatios =
		ratios.months.length > 0 &&
		ratioSeries.some((s) => s.values.some((v) => v != null));
	const gapRows = model.meta.priorities
		.map((p) => ({ prio: p, gap: gaps.byPrio[p]?.at(-1) ?? null }))
		.filter((r) => r.gap != null);

	mount.innerHTML = `
    ${segHtml(AREA_KEY, areaOpts, area, { label: t("szoras.areaSeg") })}
    <div class="kpi-row">
      ${model.meta.priorities
				.map((p) => {
					const ratio = ratios.byPrio[p]?.at(-1) ?? null;
					const med = long.median?.[p]?.at(-1) ?? null;
					const p90 = long.p90?.[p]?.at(-1) ?? null;
					return statCard({
						cat: "szoras",
						iconId: "i-gauge",
						label: t("szoras.kpiLabel", { p: esc(p) }),
						value:
							ratio != null
								? t("szoras.ratioValue", { v: fmtNum1(ratio) })
								: "-",
						foot: t("szoras.kpiFoot", {
							p90Label: t("metric.p90"),
							p90: esc(fmtMin(p90)),
							medLabel: t("metric.median"),
							med: esc(fmtMin(med)),
						}),
						tip: t("szoras.kpiTip", {
							p,
							desc: t(`prio.${p}`),
							month: fmtYm(latest),
							calc,
						}),
					});
				})
				.join("")}
    </div>
    <div class="grid12">
      ${
				hasRatios
					? chartCard({
							span: 12,
							cat: "szoras",
							iconId: "i-gauge",
							title: t("szoras.ratioTitle", { area: esc(areaLabel) }),
							sub: t("szoras.ratioSub", {
								from: fmtYm(range.from),
								to: fmtYm(range.to),
							}),
							id: "ch-szo-arany",
							tip: t("szoras.ratioTip", { calc }),
						})
					: emptyState({
							span: 12,
							iconId: "i-gauge",
							title: t("szoras.ratioEmpty"),
						})
			}
      ${
				gapRows.length
					? chartCard({
							span: 6,
							cat: "szoras",
							iconId: "i-clock",
							title: t("szoras.gapTitle", { month: fmtYm(latest) }),
							sub: t("szoras.gapSub", { area: esc(areaLabel) }),
							id: "ch-szo-perc",
							tip: t("szoras.gapTip", { month: fmtYm(latest), calc }),
						})
					: emptyState({
							span: 6,
							iconId: "i-clock",
							title: t("szoras.gapEmpty"),
						})
			}
      ${
				top.length
					? `<div class="card" data-span="6" data-cat="szoras">
        <div class="card-head">
          <span class="icon-chip">${icon("i-warn")}</span>
          <div>
            <h2 class="card-title">${t("szoras.worstTitle")}${tipDot(t("szoras.worstTip", { calc }))}</h2>
            <div class="card-sub">${t("szoras.worstSub", { month: fmtYm(snapMonth) })}</div>
          </div>
        </div>
        <div class="card-body">
          <ul class="fact-list">
            ${top
							.map(
								(c) =>
									`<li>${icon("i-warn")}<span>${t("szoras.worstItem", {
										region: esc(c.name),
										prio: prioBadge(c.prio),
										time: esc(fmtMin(c.p90)),
									})}</span></li>`,
							)
							.join("")}
          </ul>
        </div>
      </div>`
					: emptyState({
							span: 6,
							iconId: "i-warn",
							title: t("szoras.worstTitle"),
							hint: regionHint,
						})
			}
      ${
				cells.length
					? dataTable({
							span: 12,
							cat: "szoras",
							iconId: "i-map",
							title: t("szoras.tableTitle", {
								month: fmtYmFull(snapMonth),
								prelim,
							}),
							sub: t("szoras.tableSub", { month: fmtYm(snapMonth) }),
							tip: t("szoras.tableTip", { calc, gap: gapLabel }),
							columns: [
								{ key: "name", label: t("szoras.colRegion") },
								{ key: "prio", label: t("szoras.colPrio") },
								{ key: "median", label: t("metric.median"), num: true },
								{ key: "p75", label: t("metric.p75"), num: true },
								{ key: "p90", label: t("metric.p90"), num: true },
								{ key: "gap", label: gapLabel, num: true },
							],
							rows: cells.map((c) => {
								const gap =
									c.p90 != null && c.median != null ? c.p90 - c.median : null;
								return {
									name: cell(c.name, esc(c.name)),
									prio: cell(c.prio, prioBadge(c.prio)),
									median: cell(c.median, esc(fmtMin(c.median))),
									p75: cell(c.p75, esc(fmtMin(c.p75))),
									p90: cell(c.p90, esc(fmtMin(c.p90))),
									gap: cell(gap, esc(fmtMin(gap))),
								};
							}),
							defaultSort: { key: "p90", dir: "desc" },
							pageSize: 10,
						})
					: emptyState({
							span: 12,
							iconId: "i-map",
							title: t("szoras.tableEmpty"),
							hint: regionHint,
						})
			}
    </div>`;

	if (hasRatios) {
		makeChart(mount.querySelector("#ch-szo-arany"), {
			chart: { type: "line", height: 320 },
			series: ratioSeries.map((s) => ({ name: s.prio, data: s.values })),
			colors: ratioSeries.map((s) => prioColor(s.prio)),
			stroke: { width: 2.5, curve: "smooth" },
			labels: ratios.months.map(fmtYm),
			xaxis: { tickAmount: 10 },
			yaxis: { labels: { formatter: (v) => ratioText(v) } },
			tooltip: { y: { formatter: (v) => ratioText(v) } },
			legend: { position: "top" },
		});
	}

	if (gapRows.length) {
		makeChart(mount.querySelector("#ch-szo-perc"), {
			chart: { type: "bar", height: 300 },
			series: [{ name: gapLabel, data: gapRows.map((r) => roundOrNull(r.gap)) }],
			colors: gapRows.map((r) => prioColor(r.prio)),
			plotOptions: {
				bar: { distributed: true, columnWidth: "55%", borderRadius: 4 },
			},
			xaxis: { categories: gapRows.map((r) => r.prio) },
			yaxis: minAxis,
			dataLabels: { enabled: true, formatter: (v) => fmtMinShort(v) },
			tooltip: minTooltip,
			legend: { show: false },
		});
	}

	wireSeg(mount, AREA_KEY, () => render(model, mount));
}

function ratioText(v) {
	return v == null || !Number.isFinite(v)
		? "-"
		: t("szoras.ratioValue", { v: fmtNum1(v) });
}

