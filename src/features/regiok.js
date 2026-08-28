import { t } from "../app/i18n.js";
import * as derive from "../data/derive.js";
import { catColor, paletteColor } from "../ui/categories.js";
import { cssToken, makeChart, minAxis, minTooltip, roundOrNull } from "../ui/charts.js";
import { loadSeg, segHtml, wireSeg } from "../ui/segmented.js";
import { cell, dataTable } from "../ui/table.js";
import { chartCard, emptyState, esc, signedMin, statCard } from "../ui/ui.js";
import { fmtMin, fmtMinShort, fmtNum, fmtYm, fmtYmFull } from "../utils/fmt.js";

export const id = "regiok";
export const iconId = "i-map";

const PRIO_KEY = "holamento-regiok-prio";
const METRIC_KEY = "holamento-regiok-metric";

export function render(model, mount) {
	const prioOpts = model.meta.priorities.map((p) => ({ id: p, label: p }));
	const prio = loadSeg(PRIO_KEY, prioOpts, "P1");
	const metricOpts = derive.METRIC_IDS.map((m) => ({
		id: m,
		label: t("metric." + m),
	}));
	const metric = loadSeg(METRIC_KEY, metricOpts, "median");
	const metricLabel = metricOpts.find((m) => m.id === metric)?.label ?? metric;

	const rt = model.regionTrend;
	const trendMonths = rt?.months ?? [];
	const trend = rt ? derive.regionTrendSeries(model, prio, metric) : [];
	const withData = trend.filter((r) => r.values.some((v) => v != null));
	const hasTrend = trendMonths.length > 0 && withData.length > 0;

	const snapRows = derive.regionSnapshotRows(model, prio, metric);
	const rang = snapRows.filter((r) => r.value != null);
	const fastest = rang[0] ?? null;
	const slowest = rang.length ? rang[rang.length - 1] : null;
	const diff = fastest && slowest ? slowest.value - fastest.value : null;

	const spread = rt ? derive.regionSpread(model, prio, metric) : [];
	const hasSpread = spread.some((s) => s.range != null);
	const lastSpread = [...spread].reverse().find((s) => s.range != null) ?? null;

	const nat = derive.longSeries(model, "Országos");
	const natArr = nat[metric]?.[prio] ?? [];
	const natVal = natArr.length ? natArr[natArr.length - 1] : null;
	const natPrev = natArr.length > 1 ? natArr[natArr.length - 2] : null;
	const natDelta =
		model.meta.prevMonth && natVal != null && natPrev != null
			? natVal - natPrev
			: null;
	const natFoot =
		natDelta != null
			? t("common.vsPrevMonth", { delta: signedMin(natDelta) })
			: esc(t("common.noPrevMonth"));

	const range = model.meta.range ?? { from: null, to: null };
	const rangeFrom = fmtYm(range.from);
	const rangeTo = fmtYm(range.to);
	const snapMonth = model.regionSnapshot?.month ?? null;
	const snapLabel = fmtYmFull(snapMonth);
	const prelim =
		model.meta.latestIsPreliminary &&
		snapMonth != null &&
		snapMonth === model.meta.latestMonth;

	const calc = t("common.tipCalc");
	const hint = t("regiok.regionHint");
	const cover = trendMonths.length
		? t("regiok.coverSub", {
				from: fmtYm(trendMonths[0]),
				to: fmtYm(trendMonths[trendMonths.length - 1]),
			})
		: t("regiok.coverNone", { from: rangeFrom, to: rangeTo });

	mount.innerHTML = `
    <div class="kpi-row">
      ${statCard({
				cat: "regio",
				iconId: "i-siren",
				label: esc(t("regiok.fastestLabel", { prio })),
				value: fmtMin(fastest?.value),
				foot: fastest ? esc(fastest.name) : esc(t("common.noData")),
				tip: t("regiok.fastestTip", { month: snapLabel, calc }),
			})}
      ${statCard({
				cat: "regio",
				iconId: "i-hourglass",
				label: esc(t("regiok.slowestLabel", { prio })),
				value: fmtMin(slowest?.value),
				foot: slowest ? esc(slowest.name) : esc(t("common.noData")),
				tip: t("regiok.slowestTip", { month: snapLabel, calc }),
			})}
      ${statCard({
				cat: "regio",
				iconId: "i-ambulance",
				label: esc(t("regiok.natLabel", { prio, metric: metricLabel })),
				value: fmtMin(natVal),
				foot: natFoot,
				tip: t("regiok.natTip", {
					month: fmtYmFull(model.meta.latestMonth),
					metric: metricLabel,
					desc: t("metricDesc." + metric),
					calc,
				}),
			})}
      ${statCard({
				cat: "szoras",
				iconId: "i-scale",
				label: esc(t("regiok.gapLabel")),
				value: fmtMin(diff),
				foot:
					fastest && slowest
						? t("regiok.gapFoot", {
								fastest: esc(fastest.name),
								slowest: esc(slowest.name),
							})
						: esc(t("common.noData")),
				tip: t("regiok.gapTip", { month: snapLabel, calc }),
			})}
    </div>
    <div class="grid12">
      <div class="card" data-span="12" data-cat="regio">
        <div class="card-body">
          ${segHtml(PRIO_KEY, prioOpts, prio, { label: t("regiok.segPrio") })}
          ${segHtml(METRIC_KEY, metricOpts, metric, { label: t("regiok.segMetric") })}
          <div class="card-sub">${esc(
						t("regiok.segSub", {
							prio,
							prioDesc: t("prio." + prio),
							metric: metricLabel,
							metricDesc: t("metricDesc." + metric),
						}),
					)}</div>
          <div class="card-sub">${esc(cover)}</div>
        </div>
      </div>
      ${
				hasTrend
					? chartCard({
							span: 12,
							cat: "regio",
							iconId: "i-map",
							title: esc(
								t("regiok.trendTitle", { prio, metric: metricLabel }),
							),
							sub: esc(
								t("regiok.trendSub", {
									n: fmtNum(withData.length),
									from: fmtYm(trendMonths[0]),
									to: fmtYm(trendMonths[trendMonths.length - 1]),
								}),
							),
							id: "ch-reg-trend",
							tip: t("regiok.trendTip", {
								from: rangeFrom,
								to: rangeTo,
								calc,
							}),
						})
					: emptyState({
							span: 12,
							iconId: "i-map",
							title: t("regiok.trendTitleShort"),
							hint,
						})
			}
      ${
				rang.length
					? chartCard({
							span: 6,
							cat: "regio",
							iconId: "i-map",
							title: esc(t("regiok.rankTitle", { prio, metric: metricLabel })),
							sub: esc(t("regiok.rankSub", { month: snapLabel })),
							id: "ch-reg-rang",
							tip: t("regiok.rankTip", { month: snapLabel, calc }),
						})
					: emptyState({
							span: 6,
							iconId: "i-map",
							title: t("regiok.rankTitleShort"),
							hint,
						})
			}
      ${
				hasSpread
					? chartCard({
							span: 6,
							cat: "szoras",
							iconId: "i-gauge",
							title: esc(
								t("regiok.spreadTitle", { prio, metric: metricLabel }),
							),
							sub: lastSpread
								? t("regiok.spreadSubWith", {
										month: fmtYmFull(lastSpread.ym),
										fastest: esc(lastSpread.best.name),
										slowest: esc(lastSpread.worst.name),
									})
								: esc(t("regiok.spreadSub")),
							id: "ch-reg-ollo",
							tip: t("regiok.spreadTip", { calc }),
						})
					: emptyState({
							span: 6,
							iconId: "i-gauge",
							title: t("regiok.spreadTitleShort"),
							hint,
						})
			}
      ${
				snapRows.length
					? dataTable({
							span: 12,
							cat: "regio",
							iconId: "i-map",
							title:
								esc(t("regiok.tableTitle", { prio, month: snapLabel })) +
								(prelim ? esc(t("common.preliminarySuffix")) : ""),
							sub: esc(t("regiok.tableSub")),
							tip: t("regiok.tableTip", {
								month: snapLabel,
								median: t("metric.median"),
								medianDesc: t("metricDesc.median"),
								p75: t("metric.p75"),
								p75Desc: t("metricDesc.p75"),
								p90: t("metric.p90"),
								p90Desc: t("metricDesc.p90"),
							}),
							columns: [
								{ key: "regio", label: esc(t("regiok.colRegion")) },
								{ key: "median", label: esc(t("metric.median")), num: true },
								{ key: "p75", label: esc(t("metric.p75")), num: true },
								{ key: "p90", label: esc(t("metric.p90")), num: true },
							],
							rows: snapRows.map((r) => ({
								regio: cell(
									r.name,
									`${esc(r.name)} <span class="muted">${esc(r.code)}</span>`,
								),
								median: cell(r.median, fmtMin(r.median)),
								p75: cell(r.p75, fmtMin(r.p75)),
								p90: cell(r.p90, fmtMin(r.p90)),
							})),
							defaultSort: { key: "p90", dir: "asc" },
							pageSize: 10,
						})
					: emptyState({
							span: 12,
							iconId: "i-map",
							title: t("regiok.tableTitleShort"),
							hint,
						})
			}
    </div>`;

	if (hasTrend) {
		makeChart(mount.querySelector("#ch-reg-trend"), {
			chart: { type: "line", height: 320 },
			series: trend.map((r) => ({
				name: r.name,
				data: r.values.map(roundOrNull),
			})),
			colors: trend.map((_, i) => paletteColor(i)),
			stroke: { width: 2.5, curve: "smooth" },
			labels: trendMonths.map(fmtYm),
			yaxis: { min: 0, ...minAxis },
			annotations: {
				yaxis: [
					{
						y: 15,
						borderColor: cssToken("--text-faint"),
						strokeDashArray: 5,
						label: {
							text: t("regiok.min15"),
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

	if (rang.length) {
		makeChart(mount.querySelector("#ch-reg-rang"), {
			chart: { type: "bar", height: 300 },
			series: [
				{ name: metricLabel, data: rang.map((r) => roundOrNull(r.value)) },
			],
			colors: rang.map((_, i) => paletteColor(i)),
			plotOptions: {
				bar: { horizontal: true, distributed: true, borderRadius: 4 },
			},
			dataLabels: { enabled: true, formatter: (v) => fmtMinShort(v) },
			xaxis: { categories: rang.map((r) => r.name), ...minAxis },
			legend: { show: false },
			tooltip: minTooltip,
		});
	}

	if (hasSpread) {
		makeChart(mount.querySelector("#ch-reg-ollo"), {
			chart: { type: "area", height: 300 },
			series: [
				{
					name: t("regiok.spreadSeries"),
					data: spread.map((s) => roundOrNull(s.range)),
				},
			],
			colors: [catColor("szoras")],
			stroke: { width: 2.5, curve: "smooth" },
			fill: {
				type: "gradient",
				gradient: { opacityFrom: 0.25, opacityTo: 0.05 },
			},
			labels: spread.map((s) => fmtYm(s.ym)),
			yaxis: { min: 0, ...minAxis },
			tooltip: minTooltip,
			legend: { show: false },
		});
	}

	wireSeg(mount, PRIO_KEY, () => render(model, mount));
	wireSeg(mount, METRIC_KEY, () => render(model, mount));
}

