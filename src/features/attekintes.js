import { t } from "../app/i18n.js";
import * as derive from "../data/derive.js";
import { prioColor } from "../ui/categories.js";
import { cssToken, makeChart, minTooltip, roundOrNull, sparkline } from "../ui/charts.js";
import { icon } from "../ui/icons.js";
import { cell, dataTable } from "../ui/table.js";
import {
	chartCard,
	emptyState,
	esc,
	prioBadge,
	signedMin,
	statCard,
	tipDot,
} from "../ui/ui.js";
import {
	fmtCases,
	fmtMin,
	fmtMinShort,
	fmtNum,
	fmtPct,
	fmtSignedMin,
	fmtYm,
	fmtYmFull,
} from "../utils/fmt.js";

export const id = "attekintes";
export const iconId = "i-overview";

const AREA = "Országos";
const MAIN = "P1";

export function render(model, mount) {
	const meta = model.meta ?? {};
	const latest = meta.latestMonth ?? null;
	const prelim = Boolean(meta.latestIsPreliminary);
	const period = periodText(meta.range ?? null);
	const areaLabel = t(`area.${AREA}`);
	const nationwide = t("common.nationwide");

	const kpis = derive.latestKpis(model);
	const nat = kpis.find((k) => k.area === AREA) ?? null;
	const bp = kpis.find((k) => k.area === "Budapest") ?? null;
	const cases = derive.caseSeries(model, AREA);
	const bpLong = derive.longSeries(model, "Budapest");
	const ph = derive.phaseStats(model);
	const worst = derive.worstCells(model)[0] ?? null;
	const long = derive.longSeries(model, AREA);

	const lastCases = cases.total.at(-1) ?? null;
	const lastPerDay = cases.perDay.at(-1) ?? null;

	const lineMedian = (long.median?.[MAIN] ?? []).map(roundOrNull);
	const lineP90 = (long.p90?.[MAIN] ?? []).map(roundOrNull);
	const hasLine =
		long.months.length > 0 && (lineMedian.some(isNum) || lineP90.some(isNum));

	const mix = (meta.priorities ?? [])
		.map((p) => [p, cases.byPrio?.[p]?.at(-1) ?? null])
		.filter(([, v]) => v != null && v > 0);
	const hasMix = mix.length > 0;

	const rows = summaryRows(model, long);
	const hasPrev = long.months.length > 1;
	const hasFacts = long.months.length > 0;

	mount.innerHTML = `
    <div class="kpi-row">
      ${statCard({
				cat: "ido",
				iconId: "i-ambulance",
				label: t("attekintes.kpiP1", { area: areaLabel }),
				value: fmtMin(nat?.p90),
				foot: kpiFoot(nat),
				spark: sparkline(long.p90?.[MAIN] ?? []),
				tip: t("attekintes.kpiP1Tip", {
					calc: t("common.tipCalc"),
					metric: t("metric.p90"),
					desc: t("metricDesc.p90"),
					prio: t(`prio.${MAIN}`),
					where: nationwide,
					month: fmtYm(latest),
				}),
			})}
      ${statCard({
				cat: "ido",
				iconId: "i-ambulance",
				label: t("attekintes.kpiP1", { area: t("area.Budapest") }),
				value: fmtMin(bp?.p90),
				foot: kpiFoot(bp),
				spark: sparkline(bpLong.p90?.[MAIN] ?? []),
				tip: t("attekintes.kpiP1Tip", {
					calc: t("common.tipCalc"),
					metric: t("metric.p90"),
					desc: t("metricDesc.p90"),
					prio: t(`prio.${MAIN}`),
					where: t("common.inBudapest"),
					month: fmtYm(latest),
				}),
			})}
      ${statCard({
				cat: "eset",
				iconId: "i-pulse",
				label: t("attekintes.kpiCases", { area: areaLabel }),
				value: fmtNum(lastCases),
				foot:
					lastPerDay != null
						? t("attekintes.kpiCasesFoot", {
								month: fmtYm(latest),
								n: fmtNum(Math.round(lastPerDay)),
							})
						: t("common.noDataShort"),
				spark: sparkline(cases.total),
				tip: t("attekintes.kpiCasesTip", {
					calc: t("common.tipCalc"),
					where: nationwide,
					month: fmtYm(latest),
				}),
			})}
      ${statCard({
				cat: "fazis",
				iconId: "i-phone",
				label: t("attekintes.kpiDispatch"),
				value: fmtMin(ph?.dispatchAtlag),
				foot:
					ph?.dispatchAtlag != null && ph?.sumAtlag
						? t("attekintes.kpiDispatchFoot", {
								pct: fmtPct(ph.dispatchAtlag / ph.sumAtlag),
							})
						: t("common.noData"),
				tip: t("attekintes.kpiDispatchTip", {
					calc: t("common.tipCalc"),
					month: fmtYm(ph?.month ?? latest),
				}),
			})}
      ${statCard({
				cat: "szoras",
				iconId: "i-warn",
				label: t("attekintes.kpiWorst"),
				value: fmtMin(worst?.p90),
				foot: worst
					? t("attekintes.kpiWorstFoot", {
							region: esc(worst.name),
							prio: esc(worst.prio),
						})
					: t("common.noData"),
				tip: t("attekintes.kpiWorstTip", {
					calc: t("common.tipCalc"),
					metric: t("metric.p90"),
					month: fmtYm(model.regionSnapshot?.month ?? latest),
				}),
			})}
    </div>
    <div class="grid12">
      ${
				hasLine
					? chartCard({
							span: 12,
							cat: "ido",
							iconId: "i-clock",
							title: t("attekintes.lineTitle", { area: areaLabel }),
							sub: t("attekintes.lineSub", { period }),
							id: "ch-att-p1",
							tip: t("attekintes.lineTip", {
								period,
								median: t("metric.median"),
								medianDesc: t("metricDesc.median"),
								p90: t("metric.p90"),
								p90Desc: t("metricDesc.p90"),
							}),
						})
					: emptyState({
							span: 12,
							iconId: "i-clock",
							title: t("attekintes.lineEmpty"),
						})
			}
      ${
				hasMix
					? chartCard({
							span: 5,
							cat: "eset",
							iconId: "i-pulse",
							title: t("attekintes.mixTitle"),
							sub: t("attekintes.mixSub", {
								month: fmtYm(latest),
								where: nationwide,
							}),
							id: "ch-att-mix",
							tip: t("attekintes.mixTip", {
								month: fmtYm(latest),
								p1: t("prio.P1"),
								p2: t("prio.P2"),
								p3: t("prio.P3"),
								p4: t("prio.P4"),
							}),
						})
					: emptyState({
							span: 5,
							iconId: "i-pulse",
							title: t("attekintes.mixTitle"),
						})
			}
      ${
				hasFacts
					? `<div class="card" data-span="7" data-cat="adat">
        <div class="card-head">
          <span class="icon-chip">${icon("i-info")}</span>
          <div>
            <h2 class="card-title">${t("attekintes.factsTitle")}${tipDot(t("attekintes.factsTip"))}</h2>
            <div class="card-sub">${t("attekintes.factsSub", { period })}</div>
          </div>
        </div>
        <div class="card-body">
          <ul class="fact-list">${facts(model, latest)}</ul>
        </div>
      </div>`
					: emptyState({
							span: 7,
							iconId: "i-info",
							title: t("attekintes.factsTitle"),
						})
			}
      ${
				rows.length
					? dataTable({
							span: 12,
							cat: "ido",
							iconId: "i-clock",
							title: `${t("attekintes.tableTitle", { month: fmtYmFull(latest) })}${prelim ? t("common.preliminarySuffix") : ""}`,
							sub: hasPrev
								? t("attekintes.tableSub", { period })
								: t("attekintes.tableSubNoPrev", { period }),
							tip: t("attekintes.tableTip", { month: fmtYmFull(latest) }),
							columns: [
								{ key: "prio", label: t("attekintes.colPrio") },
								{ key: "median", label: t("metric.median"), num: true },
								{ key: "p75", label: t("metric.p75"), num: true },
								{ key: "p90", label: t("metric.p90"), num: true },
								{ key: "esetszam", label: t("attekintes.colCases"), num: true },
							],
							rows: rows.map((r) => ({
								prio: cell(r.prio, prioBadge(r.prio)),
								median: cell(r.median, momCell(r.median, r.medianDelta)),
								p75: cell(r.p75, momCell(r.p75, r.p75Delta)),
								p90: cell(r.p90, momCell(r.p90, r.p90Delta)),
								esetszam: cell(r.esetszam, fmtNum(r.esetszam)),
							})),
							pageSize: 5,
						})
					: emptyState({
							span: 12,
							iconId: "i-clock",
							title: t("attekintes.tableEmpty"),
						})
			}
    </div>`;

	if (hasLine) {
		makeChart(mount.querySelector("#ch-att-p1"), {
			chart: { type: "line", height: 320 },
			series: [
				{ name: t("metric.median"), data: lineMedian },
				{ name: t("metric.p90"), data: lineP90 },
			],
			colors: [cssToken("--text-muted"), prioColor(MAIN)],
			stroke: { width: [2.5, 3], curve: "smooth" },
			labels: long.months.map((ym) => fmtYm(ym)),
			xaxis: { tickAmount: Math.max(1, Math.min(10, long.months.length)) },
			yaxis: {
				min: 0,
				labels: {
					formatter: (v) => t("attekintes.axisMinutes", { v: fmtNum(v) }),
				},
			},
			annotations: {
				yaxis: [
					{
						y: 15,
						borderColor: cssToken("--text-faint"),
						strokeDashArray: 5,
						label: {
							text: t("attekintes.line15"),
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

	if (hasMix) {
		makeChart(mount.querySelector("#ch-att-mix"), {
			chart: { type: "donut", height: 300 },
			series: mix.map(([, v]) => v),
			labels: mix.map(([p]) => p),
			colors: mix.map(([p]) => prioColor(p)),
			dataLabels: {
				enabled: true,
				formatter: (v) => fmtPct(Math.round(v) / 100),
			},
			legend: { position: "bottom" },
			tooltip: { y: { formatter: (v) => fmtCases(v) } },
		});
	}
}

function periodText(range) {
	if (!range?.from || !range?.to) return t("common.noDataShort");
	if (range.from === range.to) return fmtYm(range.to);
	return t("attekintes.periodRange", {
		from: fmtYm(range.from),
		to: fmtYm(range.to),
	});
}

function deltaFoot(delta) {
	return delta != null
		? t("common.vsPrevMonth", { delta: signedMin(delta) })
		: t("common.noPrevMonth");
}

function kpiFoot(kpi) {
	const parts = [deltaFoot(kpi?.delta)];
	if (kpi?.esetszam != null) parts.push(esc(fmtCases(kpi.esetszam)));
	return parts.join(" · ");
}

function summaryRows(model, long) {
	const n = long.months.length;
	if (!n) return [];
	const base = n > 1 ? derive.momTable(model, AREA) : lastMonthRows(model, long);
	return base.filter(
		(r) =>
			r.median != null ||
			r.p75 != null ||
			r.p90 != null ||
			r.esetszam != null,
	);
}

function lastMonthRows(model, long) {
	const i = long.months.length - 1;
	return (model.meta.priorities ?? []).map((p) => {
		const row = { prio: p, esetszam: long.esetszam?.[p]?.[i] ?? null };
		for (const m of derive.METRIC_IDS) {
			row[m] = long[m]?.[p]?.[i] ?? null;
			row[`${m}Delta`] = null;
		}
		return row;
	});
}

function momCell(value, delta) {
	const base = fmtMin(value);
	if (value == null || delta == null) return base;
	const sign = delta > 0 ? "+" : "";
	return `${base} <span class="${delta <= 0 ? "pos" : "neg"} small">(${sign}${fmtMinShort(delta)})</span>`;
}


function isNum(v) {
	return v != null && Number.isFinite(v);
}

function facts(model, latest) {
	const items = [];
	const yoy = derive
		.yoySummary(model, AREA)
		.filter((x) => x.metric === "p90" && x.pct != null);

	const better = [...yoy].sort((a, b) => a.pct - b.pct)[0];
	if (better && better.pct < -0.01) {
		items.push({
			icon: "i-trend-down",
			html: t("attekintes.factYoyBetter", {
				prio: esc(better.prio),
				metric: t("metric.p90"),
				delta: esc(fmtSignedMin(better.delta)),
				pct: esc(fmtPct(better.pct)),
				n: esc(fmtNum(better.pairCount)),
			}),
		});
	}

	const worse = [...yoy].sort((a, b) => b.pct - a.pct)[0];
	if (worse && worse.pct > 0.01) {
		items.push({
			icon: "i-trend-up",
			html: t("attekintes.factYoyWorse", {
				prio: esc(worse.prio),
				metric: t("metric.p90"),
				delta: esc(fmtSignedMin(worse.delta)),
				pct: esc(fmtPct(worse.pct)),
				n: esc(fmtNum(worse.pairCount)),
			}),
		});
	}

	const ph = derive.phaseStats(model);
	if (ph?.travelAtlag != null && ph?.sumAtlag) {
		items.push({
			icon: "i-ambulance",
			html: t("attekintes.factTravel", {
				month: esc(fmtYm(ph.month ?? latest)),
				travel: esc(fmtMin(ph.travelAtlag)),
				where: t("common.nationwide"),
			}),
		});
	}

	const band = derive.band15Series(model, AREA, MAIN).at(-1)?.band ?? null;
	if (band && latest) {
		items.push({
			icon: "i-target",
			html: t("attekintes.factBand", {
				month: esc(fmtYm(latest)),
				band: esc(t(`bandShort.${band}`)),
			}),
		});
	}

	const spread = derive.regionSpread(model, MAIN, "median").at(-1) ?? null;
	if (spread?.range != null && spread.best && spread.worst) {
		items.push({
			icon: "i-map",
			html: t("attekintes.factSpread", {
				month: esc(fmtYm(spread.ym)),
				gap: esc(fmtMin(spread.range)),
				best: esc(spread.best.name),
				worst: esc(spread.worst.name),
			}),
		});
	}

	if (!items.length) {
		items.push({ icon: "i-info", html: t("attekintes.factNone") });
	}

	return items
		.map((f) => `<li>${icon(f.icon)}<span>${f.html}</span></li>`)
		.join("");
}
