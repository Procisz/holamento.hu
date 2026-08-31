import { t } from "../app/i18n.js";
import { icon } from "../ui/icons.js";
import { esc } from "../ui/ui.js";
import { fmtDate, fmtYmFull } from "../utils/fmt.js";

export const id = "adatok";
export const iconId = "i-info";

const KNOWN_PRIOS = ["P1", "P2", "P3", "P4"];
const PRIO_ORDER = ["KP1", "P1", "P2", "P3", "P4", "P5"];

const COUNTIES = {
	DAR: "Bács-Kiskun, Békés, Csongrád-Csanád",
	DDR: "Baranya, Somogy, Tolna",
	ÉAR: "Hajdú-Bihar, Jász-Nagykun-Szolnok, Szabolcs-Szatmár-Bereg",
	ÉMR: "Borsod-Abaúj-Zemplén, Heves, Nógrád",
	KDR: "Fejér, Komárom-Esztergom, Veszprém",
	KMR: "Budapest, Pest",
	NYDR: "Győr-Moson-Sopron, Vas, Zala",
};

export function render(model, mount) {
	const full = model?.full ?? model;
	const meta = full?.meta ?? {};
	const priorities = (Array.isArray(meta.priorities) && meta.priorities.length
		? meta.priorities
		: KNOWN_PRIOS
	).filter((p) => KNOWN_PRIOS.includes(p));

	const statLink = link("https://stat.mentok.hu/", "stat.mentok.hu");
	const codeLink = link("https://github.com/Procisz/holamento.hu", "GitHub");
	const issuesLink = link("https://github.com/Procisz/holamento.hu/issues", "GitHub");
	const mailLink = `<a href="mailto:holamento.hu@gmail.com">holamento.hu@gmail.com</a>`;
	const notWord = `<strong>${esc(t("adatok.about.notWord"))}</strong>`;

	const terms = [
		term("i-clock", t("adatok.terms.responseName"), "response"),
		term("i-scale", t("adatok.terms.avgName"), "avg"),
		term("i-scale", t("metric.median"), "median"),
		term("i-gauge", t("adatok.terms.pctName"), "pct"),
		term("i-gauge", t("metric.p75"), "p75"),
		term("i-hourglass", t("metric.p90"), "p90"),
		term("i-target", t("adatok.terms.lineName"), "line"),
	].join("");

	const prioItems = PRIO_ORDER.filter(
		(p) => p === "KP1" || p === "P5" || priorities.includes(p),
	)
		.map((p) => prioRow(p))
		.join("");

	const regionRows = (meta.regions ?? [])
		.filter((r) => COUNTIES[r.code])
		.map(
			(r) =>
				`<li><span class="region-code">${esc(r.code)}</span><div class="def-body">
          <span class="def-term">${esc(r.name)}</span>
          <p class="def-note">${esc(COUNTIES[r.code])}</p>
        </div></li>`,
		)
		.join("");

	const limits = [
		"cases",
		"region",
		"geo",
		"unit",
		"quality",
		"split",
	]
		.map((k) => fact("i-x", esc(t(`adatok.limits.${k}`))))
		.join("");

	const fresh = [`<p>${esc(t("adatok.fresh.rhythm"))}</p>`];
	if (meta.updatedDate) {
		const date = `<strong>${esc(fmtDate(meta.updatedDate))}</strong>`;
		fresh.push(`<p>${t("adatok.fresh.published", { date })}</p>`);
	}
	if (meta.latestMonth) {
		const month = `<strong>${esc(fmtYmFull(meta.latestMonth))}</strong>`;
		const key = meta.latestIsPreliminary ? "adatok.fresh.latestPrelim" : "adatok.fresh.latest";
		fresh.push(`<p>${t(key, { month })}</p>`);
	}

	mount.innerHTML = `
    <div class="grid12">
      ${card({
				span: 12,
				cat: "adat",
				iconId: "i-info",
				title: t("adatok.about.title"),
				body: `
          <p>${esc(t("adatok.about.intro"))}</p>
          <p>${t("adatok.about.independent", { not: notWord })}</p>
          <p>${t("adatok.about.source", { link: statLink })}</p>
          <p>${t("adatok.about.contact", { code: codeLink, mail: mailLink })}</p>
          <p class="muted small">${t("adatok.about.code", { link: issuesLink })}</p>`,
			})}
      ${card({
				span: 6,
				cat: "ido",
				iconId: "i-search",
				title: t("adatok.terms.title"),
				body: `<ul class="fact-list def-list">${terms}</ul>`,
			})}
      ${card({
				span: 6,
				cat: "eset",
				iconId: "i-siren",
				title: t("adatok.prio.title"),
				body: `
          <p>${esc(t("adatok.prio.intro"))}</p>
          <ul class="fact-list def-list">${prioItems}</ul>
          <p class="muted small">${esc(t("adatok.prio.note"))}</p>`,
			})}
      ${
				regionRows
					? card({
							span: 12,
							cat: "regio",
							iconId: "i-map",
							title: t("adatok.regions.title"),
							body: `
          <p>${esc(t("adatok.regions.intro"))}</p>
          <ul class="fact-list region-list">${regionRows}</ul>
          <p class="muted small">${esc(t("adatok.regions.note"))}</p>`,
						})
					: ""
			}
      ${card({
				span: 6,
				cat: "adat",
				iconId: "i-refresh",
				title: t("adatok.fresh.title"),
				body: fresh.join("\n          "),
			})}
      ${card({
				span: 6,
				cat: "adat",
				iconId: "i-warn",
				title: t("adatok.limits.title"),
				body: `<ul class="fact-list">${limits}</ul>`,
			})}
    </div>`;
}

function card({ span, cat, iconId, title, body }) {
	return `<div class="card" data-span="${span}" data-cat="${cat}">
    <div class="card-head">
      <span class="icon-chip">${icon(iconId)}</span>
      <div>
        <h2 class="card-title">${esc(title)}</h2>
      </div>
    </div>
    <div class="card-body stack-4">${body}</div>
  </div>`;
}

function fact(iconId, html) {
	return `<li>${icon(iconId)}<span>${html}</span></li>`;
}

function term(iconId, name, key) {
	return `<li>${icon(iconId)}<div class="def-body">
    <span class="def-term">${esc(name)}</span>
    <p>${esc(t(`adatok.terms.${key}Desc`))}</p>
    <p class="def-note">${esc(t(`adatok.terms.${key}Note`))}</p>
  </div></li>`;
}

function prioRow(code) {
	const badgeCode = code === "KP1" ? "kp1" : code.toLowerCase();
	const label =
		code === "KP1" ? t("adatok.prio.kp1Label") : `${code} · ${t(`prio.${code}`)}`;
	return `<li><span class="prio-badge" data-prio="${esc(badgeCode)}">${esc(code)}</span><div class="def-body">
    <span class="def-term">${esc(label)}</span>
    <p>${esc(t(`adatok.prio.def${code}`))}</p>
    <p class="def-note">${esc(t("adatok.prio.exLabel"))}: ${esc(t(`adatok.prio.ex${code}`))}</p>
  </div></li>`;
}

function link(href, text) {
	return `<a target="_blank" href="${esc(href)}" rel="noopener">${esc(text)}</a>`;
}
