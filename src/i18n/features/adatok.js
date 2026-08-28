export default {
	hu: {
		"adatok.about.title": "Mi ez az oldal?",
		"adatok.about.intro":
			"Az oldal célja, hogy átfogó statisztikai adatokat mutasson az OMSZ mentőinek kiérkezési idejéről.",
		"adatok.about.independent": "Az oldal {not} tartozik az Országos Mentőszolgálathoz, az üzemeltetést nem ők végzik.",
		"adatok.about.notWord": "nem",
		"adatok.about.source":
			"Az oldalon megjelenő statisztikák és számok ugyanabból a publikus adatforrásból származnak, amely az OMSZ hivatalos oldalán is megtalálható: {link}.",
		"adatok.about.contact": "A projekt ingyenes és nyilvános, a forráskód mindenki számára elérhető: {code}. Mint mindenhol, úgy itt is előfordulhatnak hibák. Amennyiben szerinted valami nem az elvárt módon működik, vagy kérdésed van, írj ide: {mail}.",
		"adatok.about.code": "Fejlesztő vagy? Nyiss feature- vagy hibajegyet, járulj hozzá a projekt sikeréhez: {link}.",

		"adatok.terms.title": "Mit jelentenek a számok?",
		"adatok.terms.responseName": "Kiérkezési idő",
		"adatok.terms.responseDesc":
			"akkor indul, amikor valaki felhívja a 112-t, és akkor áll meg, amikor a mentő odaér a helyszínre",
		"adatok.terms.responseNote": "A telefonos beszélgetés ideje is beleszámít.",
		"adatok.terms.medianDesc": "az az idő, ami alatt az esetek felénél kiért a mentő",
		"adatok.terms.medianNote": "A másik felénél ennél tovább tartott.",
		"adatok.terms.p75Desc": "az az idő, ami alatt száz esetből hetvenötnél kiért a mentő",
		"adatok.terms.p90Desc": "az az idő, ami alatt száz esetből kilencvennél kiért a mentő",
		"adatok.terms.lineName": "15 perces vonal",
		"adatok.terms.lineDesc": "a diagramokon látható szaggatott vonal",
		"adatok.terms.lineNote": "Nem előírás, csak könnyebb hozzá mérni a számokat.",

		"adatok.prio.title": "Mennyire sürgős az eset?",
		"adatok.prio.intro":
			"A mentőszolgálatnál már a telefonban eldöntik, mennyire sürgős a hívás. Ez azért fontos, mert a legsúlyosabb betegekhez kell leghamarabb kiérni.",
		"adatok.prio.p5":
			"Van P5 jelzés is, de erről nem adnak ki számokat.",

		"adatok.fresh.title": "Mikor frissülnek a számok?",
		"adatok.fresh.rhythm":
			"A mentőszolgálat havonta teszi közzé a friss számokat. Ez az oldal minden nap megnézi, megjelent-e új adat, és ha igen, átveszi.",
		"adatok.fresh.published": "Legutóbbi közzététel: {date}.",
		"adatok.fresh.latest": "A legfrissebb hónap: {month}.",
		"adatok.fresh.latestPrelim":
			"A legfrissebb hónap: {month}. Ez még előzetes adat, később pontosodhat.",

		"adatok.limits.title": "Mit nem lehet kiolvasni az adatokból?",
		"adatok.limits.cases":
			"Nem látszik, mi történt az egyes eseteknél, csak összesített számok vannak.",
		"adatok.limits.region":
			"Az esetek számát csak országosan és Budapestre tudni, régiónként nem.",
		"adatok.limits.geo":
			"Nem derül ki, melyik napszakban vagy melyik településen kellett tovább várni.",
		"adatok.limits.unit": "Az sem látszik, milyen mentőegység ment ki.",
		"adatok.limits.quality":
			"A kiérkezési idő nem mond semmit arról, milyen ellátást kapott a beteg.",
	},
	en: {
		"adatok.about.title": "What is this site?",
		"adatok.about.intro":
			"The purpose of this site is to show comprehensive statistics on the response times of the Hungarian National Ambulance Service.",
		"adatok.about.independent": "This site is {not} part of the National Ambulance Service, and it is not run by them.",
		"adatok.about.notWord": "not",
		"adatok.about.source":
			"The statistics and figures shown here come from the same public data source that is also used on the official site of the National Ambulance Service: {link}.",
		"adatok.about.contact": "The project is free and public, the source code is available to everyone: {code}. As anywhere else, mistakes can happen here too. If you think something does not work the way it should, or you have a question, write to us here: {mail}.",
		"adatok.about.code": "Are you a developer? Open a feature request or a bug report, and help the project along: {link}.",

		"adatok.terms.title": "What do the numbers mean?",
		"adatok.terms.responseName": "Response time",
		"adatok.terms.responseDesc":
			"it starts when someone calls 112, and it stops when the ambulance reaches the scene",
		"adatok.terms.responseNote": "The time spent on the phone counts as well.",
		"adatok.terms.medianDesc": "the time within which the ambulance arrived in half of the cases",
		"adatok.terms.medianNote": "In the other half it took longer.",
		"adatok.terms.p75Desc":
			"the time within which the ambulance arrived in seventy five cases out of a hundred",
		"adatok.terms.p90Desc":
			"the time within which the ambulance arrived in ninety cases out of a hundred",
		"adatok.terms.lineName": "15 minute line",
		"adatok.terms.lineDesc": "the dashed line on the charts",
		"adatok.terms.lineNote": "It is not a rule, it just makes the numbers easier to measure against.",

		"adatok.prio.title": "How urgent is the case?",
		"adatok.prio.intro":
			"The ambulance service decides how urgent a call is while still on the phone. This matters, because the most serious cases have to be reached first.",
		"adatok.prio.p5":
			"There is a P5 marking as well, but no numbers are published for it.",

		"adatok.fresh.title": "When are the numbers updated?",
		"adatok.fresh.rhythm":
			"The ambulance service publishes fresh numbers every month. This site looks every day to see if there is anything new, and picks it up if there is.",
		"adatok.fresh.published": "Last published: {date}.",
		"adatok.fresh.latest": "The most recent month: {month}.",
		"adatok.fresh.latestPrelim":
			"The most recent month: {month}. These numbers are not final yet, they may change later.",

		"adatok.limits.title": "What the data cannot tell you",
		"adatok.limits.cases":
			"You cannot see what happened in a single case, only the totals are here.",
		"adatok.limits.region":
			"The number of cases is only given for the whole country and for Budapest, not region by region.",
		"adatok.limits.geo":
			"You cannot tell which time of day or which town had the longer waits.",
		"adatok.limits.unit": "It also does not show what kind of ambulance was sent out.",
		"adatok.limits.quality":
			"The response time says nothing about the care the patient was given.",
	},
	de: {
		"adatok.about.title": "Was ist diese Seite?",
		"adatok.about.intro":
			"Diese Seite hat das Ziel, umfassende Statistiken zu den Ausrückzeiten des ungarischen Landesrettungsdienstes zu zeigen.",
		"adatok.about.independent":
			"Diese Seite gehört {not} zum Landesrettungsdienst, und sie wird auch nicht von ihm betrieben.",
		"adatok.about.notWord": "nicht",
		"adatok.about.source":
			"Die hier gezeigten Statistiken und Zahlen stammen aus derselben öffentlichen Datenquelle, die auch auf der offiziellen Seite des Landesrettungsdienstes zu finden ist: {link}.",
		"adatok.about.contact":
			"Das Projekt ist kostenlos und öffentlich, der Quellcode ist für alle einsehbar: {code}. Wie überall können auch hier Fehler auftreten. Wenn etwas deiner Meinung nach nicht so funktioniert, wie es sollte, oder wenn du eine Frage hast, schreib uns hier: {mail}.",
		"adatok.about.code":
			"Du entwickelst selbst? Melde einen Fehler oder schlag eine neue Funktion vor und hilf dem Projekt weiter: {link}.",

		"adatok.terms.title": "Was bedeuten die Zahlen?",
		"adatok.terms.responseName": "Ausrückzeit",
		"adatok.terms.responseDesc":
			"sie beginnt, wenn jemand die 112 anruft, und endet, wenn der Rettungswagen am Einsatzort ankommt",
		"adatok.terms.responseNote": "Das Telefongespräch zählt mit.",
		"adatok.terms.medianDesc":
			"die Zeit, in der bei der Hälfte der Fälle der Rettungswagen da war",
		"adatok.terms.medianNote": "Bei der anderen Hälfte hat es länger gedauert.",
		"adatok.terms.p75Desc":
			"die Zeit, in der bei fünfundsiebzig von hundert Fällen der Rettungswagen da war",
		"adatok.terms.p90Desc":
			"die Zeit, in der bei neunzig von hundert Fällen der Rettungswagen da war",
		"adatok.terms.lineName": "15-Minuten-Linie",
		"adatok.terms.lineDesc": "die gestrichelte Linie in den Diagrammen",
		"adatok.terms.lineNote":
			"Sie ist keine Vorschrift, die Zahlen lassen sich nur leichter daran messen.",

		"adatok.prio.title": "Wie dringend ist der Fall?",
		"adatok.prio.intro":
			"Der Rettungsdienst entscheidet schon am Telefon, wie dringend ein Anruf ist. Das ist wichtig, denn bei den schwersten Fällen muss der Rettungswagen am schnellsten da sein.",
		"adatok.prio.p5":
			"Es gibt auch die Stufe P5, dazu werden aber keine Zahlen veröffentlicht.",

		"adatok.fresh.title": "Wann werden die Zahlen aktualisiert?",
		"adatok.fresh.rhythm":
			"Der Rettungsdienst veröffentlicht die neuen Zahlen jeden Monat. Diese Seite schaut jeden Tag nach, ob es neue Zahlen gibt, und übernimmt sie dann.",
		"adatok.fresh.published": "Zuletzt veröffentlicht: {date}.",
		"adatok.fresh.latest": "Der neueste Monat: {month}.",
		"adatok.fresh.latestPrelim":
			"Der neueste Monat: {month}. Diese Zahlen sind noch vorläufig, sie können sich später ändern.",

		"adatok.limits.title": "Was verraten die Daten nicht?",
		"adatok.limits.cases":
			"Man sieht nicht, was bei den einzelnen Fällen passiert ist, es gibt nur zusammengefasste Zahlen.",
		"adatok.limits.region":
			"Wie viele Fälle es gab, weiß man nur für das ganze Land und für Budapest, nicht für die einzelnen Regionen.",
		"adatok.limits.geo":
			"Man erfährt nicht, zu welcher Tageszeit oder in welchem Ort man länger warten musste.",
		"adatok.limits.unit":
			"Man sieht auch nicht, welche Art von Rettungswagen losgefahren ist.",
		"adatok.limits.quality":
			"Die Ausrückzeit sagt nichts darüber, welche Behandlung der Patient bekommen hat.",
	},
};
