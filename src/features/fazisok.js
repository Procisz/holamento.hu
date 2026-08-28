import * as derive from "../data/derive.js";
import { cssToken, makeChart, minTooltip, roundOrNull } from "../ui/charts.js";
import { catColor, paletteColor, prioColor } from "../ui/categories.js";
import { fmtCases, fmtMin, fmtMinShort, fmtNum, fmtPct, fmtYm } from "../utils/fmt.js";
import { chartCard, emptyState, esc, statCard, tipDot } from "../ui/ui.js";
import { icon } from "../ui/icons.js";
import { PHASE_ORDER } from "../data/model.js";
import { t } from "../app/i18n.js";

export const id = "fazisok";
export const iconId = "i-phone";

const PHASE_ICONS = {
	esr_cad: "i-phone",
	cad_cad: "i-person",
	cad_bej: "i-search",
	bej_erk: "i-ambulance",
};

const phaseLabel = (key) => t(`phase.${key}.label`);
const phaseShort = (key) => t(`phase.${key}.short`);
const strong = (v) => `<strong>${esc(v)}</strong>`;
const minutesAxis = () => ({
	min: 0,
	labels: { formatter: (v) => `${fmtMinShort(v)} ${t("common.minutesShort")}` },
});

export function render(model, mount) {
	const ph = derive.phaseStats(model);

	if (!ph) {
		mount.innerHTML = `
			<div class="grid12">
				${unavailableCard(model)}
				${explainerCard(null, 12)}
			</div>`;
		return;
	}

	const prelim = model.meta.latestIsPreliminary && ph.month === model.meta.latestMonth;
	const month = fmtYm(ph.month);
	const monthLabel = `${month}${prelim ? t("common.preliminarySuffix") : ""}`;
	const area = t("common.nationwide");
	const calc = t("common.tipCalc");
	const hasItems = ph.items.length > 0;
	const shareItems = ph.shares.filter((s) => s.share != null && s.atlag != null);

	mount.innerHTML = `
		<div class="kpi-row">
			${ph.shares
				.map((it) =>
					statCard({
						cat: "fazis",
						iconId: PHASE_ICONS[it.key] ?? "i-phone",
						label: esc(phaseShort(it.key)),
						value: esc(fmtMin(it.atlag)),
						foot: it.share != null ? esc(t("fazisok.shareFoot", { pct: fmtPct(it.share) })) : "",
						tip: t("fazisok.phaseTip", { label: phaseLabel(it.key), calc, area, month }),
					}),
				)
				.join("")}
			${statCard({
				cat: "ido",
				iconId: "i-clock",
				label: esc(t("fazisok.totalLabel")),
				value: esc(fmtMin(ph.sumAtlag)),
				foot: esc(
					ph.esetszam != null
						? t("fazisok.totalFoot", { cases: fmtCases(ph.esetszam), area })
						: t("fazisok.totalFootNoCases", { area }),
				),
				tip: t("fazisok.totalTip", { calc }),
			})}
		</div>
		<div class="grid12">
			${
				hasItems
					? chartCard({
							span: 12,
							cat: "fazis",
							iconId: "i-clock",
							title: esc(t("fazisok.detailTitle")),
							sub: esc(t("fazisok.detailSub", { month: monthLabel, area })),
							id: "ch-faz-osszes",
							tip: t("fazisok.detailTip", { calc }),
						})
					: emptyState({ span: 12, iconId: "i-clock", title: t("fazisok.detailTitle") })
			}
			${
				shareItems.length
					? chartCard({
							span: 5,
							cat: "fazis",
							iconId: "i-gauge",
							title: esc(t("fazisok.shareTitle")),
							sub: esc(t("fazisok.shareSub", { month: monthLabel, area })),
							id: "ch-faz-arany",
							tip: t("fazisok.shareTip", { calc }),
						})
					: emptyState({ span: 5, iconId: "i-gauge", title: t("fazisok.shareTitle") })
			}
			${explainerCard(ph, 7, monthLabel)}
		</div>`;

	if (hasItems) {
		makeChart(mount.querySelector("#ch-faz-osszes"), {
			chart: { type: "bar", height: 340 },
			series: [
				{ name: t("fazisok.avg"), data: ph.items.map((it) => roundOrNull(it.atlag)) },
				{ name: t("metric.median"), data: ph.items.map((it) => roundOrNull(it.median)) },
				{ name: t("metric.p75"), data: ph.items.map((it) => roundOrNull(it.p75)) },
				{ name: t("metric.p90"), data: ph.items.map((it) => roundOrNull(it.p90)) },
			],
			colors: [catColor("fazis"), cssToken("--text-muted"), prioColor("P3"), prioColor("P1")],
			xaxis: { categories: ph.items.map((it) => phaseShort(it.key)) },
			yaxis: minutesAxis(),
			plotOptions: { bar: { columnWidth: "65%", borderRadius: 3 } },
			tooltip: minTooltip,
			legend: { position: "top" },
		});
	}

	if (shareItems.length) {
		makeChart(mount.querySelector("#ch-faz-arany"), {
			chart: { type: "donut", height: 300 },
			series: shareItems.map((s) => roundOrNull(s.atlag)),
			labels: shareItems.map((s) => phaseShort(s.key)),
			colors: shareItems.map((_, i) => paletteColor(i)),
			dataLabels: { enabled: true, formatter: (v) => fmtPct(v / 100) },
			legend: { position: "bottom" },
			tooltip: minTooltip,
		});
	}
}

function unavailableCard(model) {
	const source = model.full ?? model;
	const sourceMonth = source.phases?.month ?? null;
	if (!sourceMonth) {
		return emptyState({
			span: 12,
			iconId: "i-phone",
			title: t("fazisok.missingTitle"),
			message: t("fazisok.missingMsg"),
			hint: t("fazisok.missingHint"),
		});
	}
	const range = model.meta.range ?? {};
	const vars = { month: fmtYm(sourceMonth), from: fmtYm(range.from), to: fmtYm(range.to) };
	return emptyState({
		span: 12,
		iconId: "i-phone",
		title: t("fazisok.outOfRangeTitle"),
		message: t("fazisok.outOfRangeMsg", vars),
		hint: t("fazisok.outOfRangeHint", vars),
	});
}

function explainerCard(ph, span, monthLabel) {
	const items = ph ? ph.items : PHASE_ORDER.map((key) => ({ key, atlag: null }));
	const steps = items
		.map((it, i) => {
			const no = esc(t("fazisok.stepNo", { n: fmtNum(i + 1) }));
			const avg =
				it.atlag != null ? ` ${esc(t("fazisok.stepAvg", { value: fmtMin(it.atlag) }))}` : "";
			return `<li>${icon(PHASE_ICONS[it.key] ?? "i-info")}<span><strong>${no} ${esc(phaseShort(it.key))}:</strong> ${esc(phaseLabel(it.key))}.${avg}</span></li>`;
		})
		.join("");
	const sub = ph
		? t("fazisok.explainSub", { month: monthLabel ?? fmtYm(ph.month) })
		: t("fazisok.explainSubPlain");
	const tip = t("fazisok.explainTip", { calc: t("common.tipCalc") });
	return `<div class="card" data-span="${span}" data-cat="fazis">
		<div class="card-head">
			<span class="icon-chip">${icon("i-phone")}</span>
			<div>
				<h2 class="card-title">${esc(t("fazisok.explainTitle"))}${tipDot(tip)}</h2>
				<div class="card-sub">${esc(sub)}</div>
			</div>
		</div>
		<div class="card-body">
			<ul class="fact-list">${steps}</ul>
			<ul class="fact-list section-gap">${explainerFacts(ph, monthLabel)}</ul>
		</div>
	</div>`;
}

function explainerFacts(ph, monthLabel) {
	const facts = [];
	if (ph?.dispatchAtlag != null && ph?.travelAtlag != null) {
		facts.push({
			icon: "i-phone",
			html: t("fazisok.factSplit", {
				dispatch: strong(fmtMin(ph.dispatchAtlag)),
				travel: strong(fmtMin(ph.travelAtlag)),
			}),
		});
	}
	const travel = ph?.items.find((it) => it.key === "bej_erk");
	const otherP90s = (ph?.items ?? [])
		.filter((it) => it.key !== "bej_erk")
		.map((it) => it.p90)
		.filter((v) => v != null);
	const maxOther = otherP90s.length ? Math.max(...otherP90s) : null;
	if (travel?.p90 != null && maxOther != null && travel.p90 > maxOther) {
		facts.push({
			icon: "i-hourglass",
			html: t("fazisok.factTail", {
				travel: strong(fmtMin(travel.p90)),
				other: strong(fmtMin(maxOther)),
			}),
		});
	}
	facts.push({
		icon: "i-info",
		html: ph
			? t("fazisok.factScope", { area: t("common.nationwide"), month: esc(monthLabel ?? fmtYm(ph.month)) })
			: t("fazisok.factScopePlain", { area: t("common.nationwide") }),
	});
	return facts.map((f) => `<li>${icon(f.icon)}<span>${f.html}</span></li>`).join("");
}

