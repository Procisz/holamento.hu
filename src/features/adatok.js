import { t } from "../app/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, prioBadge } from "../ui/ui.js";
import { fmtDate, fmtYmFull } from "../utils/fmt.js";

export const id = "adatok";
export const iconId = "i-info";

const KNOWN_PRIOS = ["P1", "P2", "P3", "P4"];

export function render(model, mount) {
	const meta = (model?.full ?? model)?.meta ?? {};
	const priorities = (Array.isArray(meta.priorities) && meta.priorities.length
		? meta.priorities
		: KNOWN_PRIOS
	).filter((p) => KNOWN_PRIOS.includes(p));

	const statLink = link("https://stat.mentok.hu/", "stat.mentok.hu");
	const codeLink = link("https://github.com/Procisz/holamento.hu", "GitHub");
	const mailLink = `<a href="mailto:holamento.hu@gmail.com">holamento.hu@gmail.com</a>`;
	const notWord = `<strong>${esc(t("adatok.about.notWord"))}</strong>`;

	const prioItems =
		priorities
			.map((p) => `<li>${prioBadge(p)}<span>${esc(t(`prio.${p}`))}</span></li>`)
			.join("") || fact("i-info", esc(t("common.noData")));

	const terms = [
		term(
			"i-clock",
			t("adatok.terms.responseName"),
			t("adatok.terms.responseDesc"),
			t("adatok.terms.responseNote"),
		),
		term("i-scale", t("metric.median"), t("adatok.terms.medianDesc"), t("adatok.terms.medianNote")),
		term("i-gauge", t("metric.p75"), t("adatok.terms.p75Desc")),
		term("i-hourglass", t("metric.p90"), t("adatok.terms.p90Desc")),
		term("i-target", t("adatok.terms.lineName"), t("adatok.terms.lineDesc"), t("adatok.terms.lineNote")),
	].join("");

	const limits = [
		fact("i-x", esc(t("adatok.limits.cases"))),
		fact("i-x", esc(t("adatok.limits.region"))),
		fact("i-x", esc(t("adatok.limits.geo"))),
		fact("i-x", esc(t("adatok.limits.unit"))),
		fact("i-x", esc(t("adatok.limits.quality"))),
	].join("");

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
          <p class="muted small">${t("adatok.about.code", { link: codeLink })}</p>`,
			})}
      ${card({
				span: 6,
				cat: "ido",
				iconId: "i-search",
				title: t("adatok.terms.title"),
				body: `<ul class="fact-list">${terms}</ul>`,
			})}
      ${card({
				span: 6,
				cat: "eset",
				iconId: "i-siren",
				title: t("adatok.prio.title"),
				body: `
          <p>${esc(t("adatok.prio.intro"))}</p>
          <ul class="fact-list">${prioItems}</ul>
          <p class="muted small">${esc(t("adatok.prio.p5"))}</p>`,
			})}
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

function term(iconId, name, desc, note = "") {
	const tail = note ? ` ${esc(note)}` : "";
	return fact(iconId, `<strong>${esc(name)}</strong>: ${esc(desc)}.${tail}`);
}

function link(href, text) {
	return `<a target="_blank" href="${esc(href)}" rel="noopener">${esc(text)}</a>`;
}
