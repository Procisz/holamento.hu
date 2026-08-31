import { t } from "../app/i18n.js";
import * as derive from "../data/derive.js";
import { catColor, prioColor } from "../ui/categories.js";
import { cssToken, makeChart, minAxis, minTooltip, roundOrNull, sparkline } from "../ui/charts.js";
import { loadSeg, segHtml, segInline, wireSeg } from "../ui/segmented.js";
import { cell, dataTable } from "../ui/table.js";
import {
	chartCard,
	emptyState,
	esc,
	prioBadge,
	signedMin,
	statCard,
} from "../ui/ui.js";
import { fmtMin, fmtPct, fmtYm } from "../utils/fmt.js";

export const id = "trendek";
export const iconId = "i-clock";

const AREA_KEY = "holamento-trendek-area";
const METRIC_KEY = "holamento-trendek-metric";
const PRIO_KEY = "holamento-trendek-prio";
const AREA_IDS = ["Országos", "Budapest"];
const BAND_RANK = { over90: 4, b7590: 3, b5075: 2, under50: 1 };

export function render(model, mount) {
	const areaOpts = AREA_IDS.map((a) => ({ id: a, label: t(`area.${a}`) }));
	const metricOpts = derive.METRIC_IDS.map((m) => ({
		id: m,
		label: t(`metric.${m}`),
	}));
	const area = loadSeg(AREA_KEY, areaOpts, "Országos");
	const metric = loadSeg(METRIC_KEY, metricOpts, "median");
	const prioOpts = model.meta.priorities.map((p) => ({ id: p, label: p }));
	const spreadPrio = loadSeg(PRIO_KEY, prioOpts, "P1");
	const metricLabel = t(`metric.${metric}`);
	const metricDesc = t(`metricDesc.${metric}`);
	const areaLabel = t(`area.${area}`);
	const areaWhere =
		area === "Budapest" ? t("common.inBudapest") : t("common.nationwide");
	const calc = t("common.tipCalc");

	const prios = model.meta.priorities;
	const long = derive.longSeries(model, area);
	const months = long.months ?? [];
	const byPrio = long[metric] ?? {};

	const from = fmtYm(model.meta.range?.from ?? months[0] ?? null);
	const to = fmtYm(model.meta.range?.to ?? months[months.length - 1] ?? null);
	const lastMonth = fmtYm(
		model.meta.latestMonth ?? months[months.length - 1] ?? null,
	);

	const yoyYearsInfo = months.length ? derive.yoyYears(model, area) : null;
	const yCurr = yoyYearsInfo?.curr ?? "";
	const yPrev = yoyYearsInfo?.prev ?? "";
	const yoyRows = [];
	if (yoyYearsInfo) {
		for (const p of prios) {
			const pairs = derive
				.yoyPairs(model, area, metric, p)
				.filter((x) => x.curr != null && x.prev != null);
			if (!pairs.length) continue;
			const prev = avg(pairs.map((x) => x.prev));
			const curr = avg(pairs.map((x) => x.curr));
			yoyRows.push({
				prio: p,
				prev,
				curr,
				delta: curr - prev,
				pct: prev ? (curr - prev) / prev : null,
			});
		}
	}

	const spreadSeries = derive.METRIC_IDS.map((m) => ({
		id: m,
		name: t(`metric.${m}`),
		data: (long[m]?.[spreadPrio] ?? []).map(roundOrNull),
	}));
	const hasSpread =
		months.length > 0 && spreadSeries.some((sr) => sr.data.some((v) => v != null));

	const areaCmp = derive.areaCompare(model, spreadPrio, metric);
	const areaMonths = areaCmp.months ?? [];
	const areaNat = (areaCmp.orszagos ?? []).map(roundOrNull);
	const areaBp = (areaCmp.budapest ?? []).map(roundOrNull);
	const hasArea =
		areaMonths.length > 0 &&
		(areaNat.some((v) => v != null) || areaBp.some((v) => v != null));

	const bands = months.length ? derive.band15Series(model, area, "P1") : [];
	const bandByYm = new Map(bands.map((b) => [b.ym, b.band]));

	const monthlyRows = months.map((ym, i) => {
		const row = { honap: cell(ym, esc(fmtYm(ym))) };
		for (const p of prios) {
			const v = byPrio[p]?.[i] ?? null;
			row[p.toLowerCase()] = cell(v, fmtMin(v));
		}
		const band = bandByYm.get(ym) ?? null;
		row.band = cell(
			band ? BAND_RANK[band] : null,
			band ? esc(t(`bandShort.${band}`)) : "-",
		);
		return row;
	});

	const kpiCards = months.length
		? prios
				.map((p) => {
					const arr = byPrio[p] ?? [];
					const curr = arr.length ? arr[arr.length - 1] : null;
					const prev = arr.length > 1 ? arr[arr.length - 2] : null;
					const delta = curr != null && prev != null ? curr - prev : null;
					return statCard({
						cat: "ido",
						iconId: "i-clock",
						label: esc(t("trendek.kpiLabel", { prio: p, metric: metricLabel })),
						value: fmtMin(curr),
						foot:
							delta != null
								? t("common.vsPrevMonth", { delta: signedMin(delta) })
								: t("common.noPrevMonth"),
						spark: sparkline(arr),
						tip: t("trendek.kpiTip", {
							prio: p,
							desc: t(`prio.${p}`),
							area: areaWhere,
							month: lastMonth,
							calc,
							metric: metricLabel,
							metricDesc,
						}),
					});
				})
				.join("")
		: "";

	mount.innerHTML = `
    ${segHtml(AREA_KEY, areaOpts, area, { label: t("trendek.segArea") })}
    ${segHtml(METRIC_KEY, metricOpts, metric, { label: t("trendek.segMetric") })}
    ${kpiCards ? `<div class="kpi-row">${kpiCards}</div>` : ""}
    <div class="grid12">
      ${
				months.length
					? chartCard({
							span: 12,
							cat: "ido",
							iconId: "i-clock",
							title: esc(t("trendek.mainTitle", { area: areaLabel })),
							sub: esc(
								t("trendek.mainSub", { metric: metricLabel, from, to }),
							),
							id: "ch-tre-fo",
							tip: t("trendek.mainTip", {
								p1: t("prio.P1"),
								p4: t("prio.P4"),
								calc,
								metric: metricLabel,
								metricDesc,
							}),
						})
					: emptyState({
							span: 12,
							iconId: "i-clock",
							title: t("trendek.mainEmptyTitle"),
						})
			}
      ${segInline(segHtml(PRIO_KEY, prioOpts, spreadPrio, { label: t("trendek.segPrio") }))}
      ${
				hasSpread
					? chartCard({
							span: 12,
							cat: "ido",
							iconId: "i-gauge",
							title: esc(t("trendek.spreadTitle", { prio: spreadPrio })),
							sub: esc(
								t("trendek.spreadSub", {
									prio: spreadPrio,
									from,
									to,
									area: areaLabel,
								}),
							),
							id: "ch-tre-spread",
							tip: t("trendek.spreadTip", { calc }),
						})
					: emptyState({
							span: 12,
							iconId: "i-gauge",
							title: t("trendek.spreadEmptyTitle"),
						})
			}
      ${
				hasArea
					? chartCard({
							span: 12,
							cat: "ido",
							iconId: "i-map",
							title: esc(
								t("trendek.areaTitle", {
									prio: spreadPrio,
									metric: metricLabel,
								}),
							),
							sub: esc(
								t("trendek.areaSub", {
									prio: spreadPrio,
									metric: metricLabel,
									from,
									to,
								}),
							),
							id: "ch-tre-area",
							tip: t("trendek.areaTip", { calc }),
						})
					: emptyState({
							span: 12,
							iconId: "i-map",
							title: t("trendek.areaEmptyTitle"),
						})
			}
      ${
				yoyRows.length
					? chartCard({
							span: 6,
							cat: "ido",
							iconId: "i-calendar",
							title: esc(t("trendek.yoyTitle", { prev: yPrev, curr: yCurr })),
							sub: esc(
								t("trendek.yoySub", {
									metric: metricLabel,
									area: areaLabel,
									prev: yPrev,
									curr: yCurr,
								}),
							),
							id: "ch-tre-yoy",
							tip: t("trendek.yoyTip", {
								calc,
								metric: metricLabel,
								prev: yPrev,
								curr: yCurr,
							}),
						})
					: emptyState({
							span: 6,
							iconId: "i-calendar",
							title: t("trendek.yoyEmptyTitle"),
							hint: t("trendek.yoyEmptyHint"),
						})
			}
      ${
				yoyRows.length
					? dataTable({
							span: 6,
							cat: "ido",
							iconId: "i-scale",
							title: esc(
								t("trendek.yoyTableTitle", { prev: yPrev, curr: yCurr }),
							),
							sub: esc(
								t("trendek.yoyTableSub", {
									metric: metricLabel,
									area: areaLabel,
								}),
							),
							tip: t("trendek.yoyTableTip", {
								calc,
								prev: yPrev,
								curr: yCurr,
							}),
							columns: [
								{ key: "prio", label: esc(t("trendek.colPrio")) },
								{
									key: "prev",
									label: esc(t("trendek.colYearAvg", { year: yPrev })),
									num: true,
								},
								{
									key: "curr",
									label: esc(t("trendek.colYearAvg", { year: yCurr })),
									num: true,
								},
								{
									key: "delta",
									label: esc(t("trendek.colChange")),
									num: true,
								},
							],
							rows: yoyRows.map((r) => ({
								prio: cell(r.prio, prioBadge(r.prio)),
								prev: cell(r.prev, fmtMin(r.prev)),
								curr: cell(r.curr, fmtMin(r.curr)),
								delta: cell(
									r.delta,
									`${signedMin(r.delta)}${r.pct != null ? ` <span class="small">(${esc(fmtPct(r.pct))})</span>` : ""}`,
								),
							})),
							defaultSort: { key: "prio", dir: "asc" },
							pageSize: 5,
						})
					: emptyState({
							span: 6,
							iconId: "i-scale",
							title: t("trendek.yoyTableEmptyTitle"),
							hint: t("trendek.yoyEmptyHint"),
						})
			}
      ${
				months.length
					? dataTable({
							span: 12,
							cat: "ido",
							iconId: "i-clock",
							title: esc(t("trendek.monthlyTitle", { area: areaLabel })),
							sub: esc(
								t("trendek.monthlySub", { metric: metricLabel, from, to }),
							),
							tip: t("trendek.monthlyTip", { metric: metricLabel }),
							columns: [
								{ key: "honap", label: esc(t("trendek.colMonth")) },
								...prios.map((p) => ({
									key: p.toLowerCase(),
									label: esc(p),
									num: true,
								})),
								{ key: "band", label: esc(t("trendek.colBand")) },
							],
							rows: monthlyRows,
							defaultSort: { key: "honap", dir: "desc" },
							pageSize: 10,
						})
					: emptyState({
							span: 12,
							iconId: "i-clock",
							title: t("trendek.monthlyEmptyTitle"),
						})
			}
    </div>`;

	if (months.length) {
		makeChart(mount.querySelector("#ch-tre-fo"), {
			chart: { type: "line", height: 340 },
			series: prios.map((p) => ({
				name: p,
				data: (byPrio[p] ?? []).map(roundOrNull),
			})),
			colors: prios.map((p) => prioColor(p)),
			stroke: { width: 2.5, curve: "smooth" },
			labels: months.map(fmtYm),
			xaxis: { tickAmount: 10 },
			yaxis: { ...minAxis, min: 0 },
			annotations: {
				yaxis: [
					{
						y: 15,
						borderColor: cssToken("--text-faint"),
						strokeDashArray: 5,
						label: {
							text: t("trendek.limit15"),
							position: "left",
							offsetX: 40,
							style: {
								color: cssToken("--text-muted"),
								background: "transparent",
							},
						},
					},
				],
			},
			tooltip: minTooltip,
			legend: { position: "top" },
		});
	}

	if (hasSpread) {
		makeChart(mount.querySelector("#ch-tre-spread"), {
			chart: { type: "line", height: 340 },
			series: spreadSeries.map((sr) => ({ name: sr.name, data: sr.data })),
			colors: [catColor("cel"), catColor("adat"), catColor("ido")],
			stroke: { width: 2.5, curve: "smooth", dashArray: [0, 4, 8] },
			labels: months.map(fmtYm),
			xaxis: { tickAmount: 10 },
			yaxis: { ...minAxis, min: 0 },
			annotations: {
				yaxis: [
					{
						y: 15,
						borderColor: cssToken("--text-faint"),
						strokeDashArray: 5,
						label: {
							text: t("trendek.limit15"),
							position: "left",
							offsetX: 40,
							style: {
								color: cssToken("--text-muted"),
								background: "transparent",
							},
						},
					},
				],
			},
			tooltip: minTooltip,
			legend: { position: "top" },
		});
	}

	if (hasArea) {
		makeChart(mount.querySelector("#ch-tre-area"), {
			chart: { type: "line", height: 340 },
			series: [
				{ name: t("area.Országos"), data: areaNat },
				{ name: t("area.Budapest"), data: areaBp },
			],
			colors: [catColor("ido"), catColor("regio")],
			stroke: { width: 2.5, curve: "smooth" },
			labels: areaMonths.map(fmtYm),
			xaxis: { tickAmount: 10 },
			yaxis: { ...minAxis, min: 0 },
			annotations: {
				yaxis: [
					{
						y: 15,
						borderColor: cssToken("--text-faint"),
						strokeDashArray: 5,
						label: {
							text: t("trendek.limit15"),
							position: "left",
							offsetX: 40,
							style: {
								color: cssToken("--text-muted"),
								background: "transparent",
							},
						},
					},
				],
			},
			tooltip: minTooltip,
			legend: { position: "top" },
		});
	}

	if (yoyRows.length) {
		makeChart(mount.querySelector("#ch-tre-yoy"), {
			chart: { type: "bar", height: 300 },
			series: [
				{ name: yPrev, data: yoyRows.map((r) => roundOrNull(r.prev)) },
				{ name: yCurr, data: yoyRows.map((r) => roundOrNull(r.curr)) },
			],
			colors: [cssToken("--text-faint"), catColor("ido")],
			plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
			xaxis: { categories: yoyRows.map((r) => r.prio) },
			yaxis: { ...minAxis, min: 0 },
			tooltip: minTooltip,
			legend: { position: "top" },
		});
	}

	wireSeg(mount, AREA_KEY, () => render(model, mount));
	wireSeg(mount, METRIC_KEY, () => render(model, mount));
	wireSeg(mount, PRIO_KEY, () => render(model, mount));
}


function avg(arr) {
	return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
}
