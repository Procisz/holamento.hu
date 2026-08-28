export const CORE = {
	hu: {
		"app.brand": "Hol a mentő?",
		"app.title": "Hol a mentő? · mentő kiérkezési idők",
		"app.description":
			"Független dashboard a magyarországi mentő kiérkezési időkről, az Országos Mentőszolgálat nyilvános statisztikái alapján.",
		"app.version": "App verzió: {v}",

		"social.linkedin": "LinkedIn",
		"social.coffee": "Buy Me a Coffee",

		"boot.fetch": "Adatok lekérése",
		"boot.parse": "Feldolgozás",
		"boot.compute": "Számítások",
		"boot.render": "Megjelenítés",

		quips: [
			"A percentilisek szépen sorba állnak… 📊",
			"Megkérdezzük a mediánt, hogy érzi magát… 🩺",
			"Hét régió, egy rajtvonal… 🗺️",
			"Kerekítünk, de csak egy tizedesig… 🔢",
			"A P90 megint a sor végén lófrál… ⏱️",
			"Kifényesítjük a diagramok tengelyeit… ✨",
			"A 15 perces vonalat kihúzzuk a helyére… 📏",
			"Az oszlopdiagram vigyázzba áll… 📶",
			"Az esetszámok most számolják magukat… 🧮",
			"A hónapok libasorban érkeznek… 📆",
			"Csendben töltünk, sziréna nélkül… 🔕",
			"A táblázat épp a fejlécét igazgatja… 📋",
			"Kiszámoljuk, mennyi az annyi… 🤓",
		],

		"header.refresh": "Frissítés",
		"header.refreshLast": "Frissítés · utoljára: {time}",
		"header.refreshFailed": "Frissítés · az utolsó frissítés nem sikerült",
		"header.refreshing": "Frissítés…",
		"header.refreshingPct": "Frissítés… {pct}%",
		"header.refreshFailedPill":
			"Nem sikerült frissíteni: korábbi adatok láthatók",
		"header.theme": "Téma: {mode}",
		"header.themeLight": "világos",
		"header.themeDark": "sötét",
		"header.themeAuto": "automatikus",
		"header.langCurrent": "Nyelv: {name}",
		"header.source": "Az adatok forrása: stat.mentok.hu",
		"header.sourceMenu": "Adatforrás: stat.mentok.hu",
		"header.menu": "Menü",
		"header.dataAge": "Adatállapot: {date}",
		"header.dataAgeTip":
			"A mentőszolgálat ekkor tette közzé a most látható adatokat: {date}.\nA legfrissebb hónap: {month}{prelim}.\nA forrás havonta frissül, ez az oldal naponta ellenőrzi.",
		"header.dataAgePrelim": " (előzetes adat)",
		"header.dataAgeStale":
			"\nA forrás régóta nem frissült, a számok elavultak lehetnek.",

		"warn.chipOk": "Minden rendben: nincs figyelmeztetés",
		"warn.chipCount.one": "{n} megjegyzés az adatokhoz",
		"warn.chipCount.other": "{n} megjegyzés az adatokhoz",
		"warn.panelTitle": "Megjegyzések az adatokhoz",
		"warn.panelOk":
			"Minden rendben: nincs figyelmeztetés, az adatok hiánytalanul feldolgozva.",
		"warn.preliminary":
			"A legfrissebb hónap ({month}) adata előzetes, a végleges értékek ettől eltérhetnek.",
		"warn.seriesMissing": "Az idősoros adatok hiányoznak a forrásból.",
		"warn.regionMissing": "A régiós idősorok hiányoznak a forrásból.",
		"warn.phasesMissing": "A hívás szakaszainak adatai hiányoznak a forrásból.",

		"range.label": "Időszak:",
		"range.from": "Kezdő hónap",
		"range.to": "Záró hónap",
		"range.show": "Megjeleníti az időszakválasztó sort",
		"range.hide": "Elrejti az időszakválasztó sort",
		"range.note.one": "Szűkített időszak · {n} hónap",
		"range.note.other": "Szűkített időszak · {n} hónap",
		"range.noteTip":
			"Most nem a teljes időszakot látod, hanem ezt: {from} - {to}.\nMinden szám, diagram és táblázat erre az időszakra van szűrve.",
		"range.quickTip":
			"{label} ({sub}): {from} - {to}.\nMinden fül adata erre az időszakra szűkül.",
		"range.quickTipEmpty": "{label} ({sub}): ebből az időszakból nincs adat.",
		"range.last3": "Utolsó 3 hónap",
		"range.last3Short": "3 hónap",
		"range.last6": "Utolsó 6 hónap",
		"range.last6Short": "6 hónap",
		"range.last12": "Utolsó 12 hónap",
		"range.last12Short": "12 hónap",
		"range.thisYear": "Idei év",
		"range.thisYearShort": "Idei év",
		"range.all": "Összes elérhető adat",
		"range.allShort": "Összes adat",

		"tab.attekintes": "Áttekintés",
		"tab.adatok": "Az adatokról",
		"tab.trendek": "Kiérkezési idők",
		"tab.fazisok": "A hívás útja",
		"tab.regiok": "Régiók",
		"tab.esetszamok": "Esetszámok",
		"tab.szoras": "Egyenlőtlenségek",

		"common.noData": "Nincs elérhető adat",
		"common.noDataShort": "Nincs adat",
		"common.rows": "Sorok:",
		"common.rowsPerPage": "Sorok oldalanként",
		"common.pageFirst": "Első oldal",
		"common.pagePrev": "Előző oldal",
		"common.pageNext": "Következő oldal",
		"common.pageLast": "Utolsó oldal",
		"common.search": "Keresés…",
		"common.searchClear": "Keresés törlése",
		"common.noMatch":
			"Nincs a keresésnek megfelelő sor, próbáld meg kevesebb szóval.",
		"common.close": "Bezárás",
		"common.retry": "Újra",
		"common.loadFromFile": "Betöltés fájlból…",
		"common.renderError": "Ez a nézet nem tudott megjelenni: {msg}",
		"common.loadError": "Nem sikerült betölteni az adatokat: {msg}",
		"common.fileError": "A fájl nem tölthető be: {msg}",
		"common.minutes": "perc",
		"common.minutesShort": "p",
		"common.cases": "eset",
		"common.casesUnit": "{n} eset",
		"common.casesUnit.one": "{n} eset",
		"common.casesUnit.other": "{n} eset",
		"common.preliminary": "előzetes",
		"common.preliminarySuffix": " (előzetes)",
		"common.nationwide": "országosan",
		"common.inBudapest": "Budapesten",
		"common.selectedPeriod": "a kiválasztott időszak",
		"common.lastMonthOfPeriod": "az időszak utolsó hónapja",
		"common.noPrevMonth": "Nincs előző havi adat",
		"common.vsPrevMonth": "{delta} az előző hónaphoz képest",
		"common.tipCalc": "Számítás",

		"area.Országos": "Országos",
		"area.Budapest": "Budapest",
		"area.Vidék": "Vidék",

		"metric.median": "Medián",
		"metric.p75": "P75",
		"metric.p90": "P90",
		"metricDesc.median": "az esetek felében ennyi időn belül kiért a mentő",
		"metricDesc.p75":
			"az esetek 75 százalékában ennyi időn belül kiért a mentő",
		"metricDesc.p90":
			"az esetek 90 százalékában ennyi időn belül kiért a mentő",

		"prio.P1": "azonnali életveszély",
		"prio.P2": "sürgős, súlyos állapot",
		"prio.P3": "kevésbé sürgős eset",
		"prio.P4": "nem sürgős eset",

		"band.over90": "az esetek több mint 90 százaléka",
		"band.b7590": "az esetek 75-90 százaléka",
		"band.b5075": "az esetek 50-75 százaléka",
		"band.under50": "az esetek kevesebb mint fele",
		"bandShort.over90": "több mint 90%",
		"bandShort.b7590": "75-90%",
		"bandShort.b5075": "50-75%",
		"bandShort.under50": "kevesebb mint 50%",

		"phase.esr_cad.label":
			"A 112 fogadja a hívást és átadja a mentésirányításnak",
		"phase.esr_cad.short": "112-es hívásfogadás",
		"phase.cad_cad.label":
			"A mentésirányító fogadja a hívást és megnyitja az esetlapot",
		"phase.cad_cad.short": "Esetlap megnyitása",
		"phase.cad_bej.label":
			"Protokoll szerinti kikérdezés és sürgősségi besorolás",
		"phase.cad_bej.short": "Kikérdezés, besorolás",
		"phase.bej_erk.label": "A mentőegység riasztása és vonulása a helyszínre",
		"phase.bej_erk.short": "Riasztás és vonulás",

		"err.server": "a szerveren hiba történt, próbáld újra pár perc múlva",
		"err.corrupt":
			"A letöltött adat sérült vagy hiányos, próbáld újra pár perc múlva",
		"err.shape":
			"A letöltött adat nem a várt mentőstatisztika, próbáld újra később",
	},

	en: {
		"app.brand": "Hol a mentő?",
		"app.title": "Hol a mentő? · Hungarian ambulance response times",
		"app.description":
			"Independent dashboard of Hungarian ambulance response times, based on the public statistics of the National Ambulance Service.",
		"app.version": "App version: {v}",

		"social.linkedin": "LinkedIn",
		"social.coffee": "Buy Me a Coffee",

		"boot.fetch": "Downloading data",
		"boot.parse": "Processing",
		"boot.compute": "Calculations",
		"boot.render": "Rendering",

		quips: [
			"The percentiles are lining up nicely… 📊",
			"Asking the median how it is doing… 🩺",
			"Seven regions, one starting line… 🗺️",
			"Rounding, but only to one decimal… 🔢",
			"The 90th percentile is dawdling again… ⏱️",
			"Polishing the chart axes… ✨",
			"Drawing the 15 minute line into place… 📏",
			"The bar chart stands to attention… 📶",
			"The case numbers are counting themselves… 🧮",
			"The months are arriving in single file… 📆",
			"Loading quietly, no siren needed… 🔕",
			"The table is straightening its header… 📋",
			"Working out what adds up to what… 🤓",
		],

		"header.refresh": "Refresh",
		"header.refreshLast": "Refresh · last: {time}",
		"header.refreshFailed": "Refresh · the last update failed",
		"header.refreshing": "Refreshing…",
		"header.refreshingPct": "Refreshing… {pct}%",
		"header.refreshFailedPill": "Update failed: showing earlier data",
		"header.theme": "Theme: {mode}",
		"header.themeLight": "light",
		"header.themeDark": "dark",
		"header.themeAuto": "automatic",
		"header.langCurrent": "Language: {name}",
		"header.source": "Data source: stat.mentok.hu",
		"header.sourceMenu": "Data source: stat.mentok.hu",
		"header.menu": "Menu",
		"header.dataAge": "Data as of: {date}",
		"header.dataAgeTip":
			"The ambulance service published the data shown here on: {date}.\nMost recent month: {month}{prelim}.\nThe source is updated monthly, this site checks it daily.",
		"header.dataAgePrelim": " (preliminary data)",
		"header.dataAgeStale":
			"\nThe source has not been updated for a long time, the figures may be out of date.",

		"warn.chipOk": "All good: no warnings",
		"warn.chipCount.one": "{n} note on the data",
		"warn.chipCount.other": "{n} notes on the data",
		"warn.panelTitle": "Notes on the data",
		"warn.panelOk": "All good: no warnings, the data was processed in full.",
		"warn.preliminary":
			"The data for the most recent month ({month}) is preliminary, the final figures may differ.",
		"warn.seriesMissing": "The time series data is missing from the source.",
		"warn.regionMissing":
			"The regional time series are missing from the source.",
		"warn.phasesMissing":
			"The data on the phases of the call is missing from the source.",

		"range.label": "Period:",
		"range.from": "First month",
		"range.to": "Last month",
		"range.show": "Show the period selector row",
		"range.hide": "Hide the period selector row",
		"range.note.one": "Narrowed period · {n} month",
		"range.note.other": "Narrowed period · {n} months",
		"range.noteTip":
			"You are not looking at the full period, but at this one: {from} - {to}.\nEvery figure, chart and table is filtered to this period.",
		"range.quickTip":
			"{label} ({sub}): {from} - {to}.\nEvery tab will be narrowed to this period.",
		"range.quickTipEmpty":
			"{label} ({sub}): there is no data from this period.",
		"range.last3": "Last 3 months",
		"range.last3Short": "3 months",
		"range.last6": "Last 6 months",
		"range.last6Short": "6 months",
		"range.last12": "Last 12 months",
		"range.last12Short": "12 months",
		"range.thisYear": "This year",
		"range.thisYearShort": "This year",
		"range.all": "All available data",
		"range.allShort": "All data",

		"tab.adatok": "About the data",
		"tab.attekintes": "Overview",
		"tab.trendek": "Response times",
		"tab.fazisok": "The path of a call",
		"tab.regiok": "Regions",
		"tab.esetszamok": "Case numbers",
		"tab.szoras": "Inequalities",

		"common.noData": "No data available",
		"common.noDataShort": "No data",
		"common.rows": "Rows:",
		"common.rowsPerPage": "Rows per page",
		"common.pageFirst": "First page",
		"common.pagePrev": "Previous page",
		"common.pageNext": "Next page",
		"common.pageLast": "Last page",
		"common.search": "Search…",
		"common.searchClear": "Clear search",
		"common.noMatch": "No row matches the search, try using fewer words.",
		"common.close": "Close",
		"common.retry": "Try again",
		"common.loadFromFile": "Load from file…",
		"common.renderError": "This view could not be displayed: {msg}",
		"common.loadError": "The data could not be loaded: {msg}",
		"common.fileError": "The file could not be loaded: {msg}",
		"common.minutes": "min",
		"common.minutesShort": "m",
		"common.cases": "cases",
		"common.casesUnit": "{n} cases",
		"common.casesUnit.one": "{n} case",
		"common.casesUnit.other": "{n} cases",
		"common.preliminary": "preliminary",
		"common.preliminarySuffix": " (preliminary)",
		"common.nationwide": "nationwide",
		"common.inBudapest": "in Budapest",
		"common.selectedPeriod": "the selected period",
		"common.lastMonthOfPeriod": "the last month of the period",
		"common.noPrevMonth": "No data for the previous month",
		"common.vsPrevMonth": "{delta} compared with the previous month",
		"common.tipCalc": "Calculation",

		"area.Országos": "Nationwide",
		"area.Budapest": "Budapest",
		"area.Vidék": "Outside Budapest",

		"metric.median": "Median",
		"metric.p75": "P75",
		"metric.p90": "P90",
		"metricDesc.median":
			"in half of all cases the ambulance arrived within this time",
		"metricDesc.p75":
			"in 75 percent of all cases the ambulance arrived within this time",
		"metricDesc.p90":
			"in 90 percent of all cases the ambulance arrived within this time",

		"prio.P1": "immediate danger to life",
		"prio.P2": "urgent, serious condition",
		"prio.P3": "less urgent case",
		"prio.P4": "non urgent case",

		"band.over90": "more than 90 percent of cases",
		"band.b7590": "75 to 90 percent of cases",
		"band.b5075": "50 to 75 percent of cases",
		"band.under50": "less than half of all cases",
		"bandShort.over90": "more than 90%",
		"bandShort.b7590": "75-90%",
		"bandShort.b5075": "50-75%",
		"bandShort.under50": "less than 50%",

		"phase.esr_cad.label":
			"The 112 centre takes the call and hands it over to ambulance dispatch",
		"phase.esr_cad.short": "112 call pick up",
		"phase.cad_cad.label":
			"The dispatcher takes the call and opens the case record",
		"phase.cad_cad.short": "Opening the case record",
		"phase.cad_bej.label":
			"Questioning by protocol and triage into a priority category",
		"phase.cad_bej.short": "Questioning and triage",
		"phase.bej_erk.label":
			"Alerting the ambulance unit and travelling to the scene",
		"phase.bej_erk.short": "Alerting and travel",

		"err.server": "a server error occurred, please try again in a few minutes",
		"err.corrupt":
			"The downloaded data is damaged or incomplete, try again in a few minutes",
		"err.shape":
			"The downloaded data is not the expected ambulance statistics, try again later",
	},

	de: {
		"app.brand": "Hol a mentő?",
		"app.title": "Hol a mentő? · ungarische Rettungsdienst-Ausrückzeiten",
		"app.description":
			"Unabhängiges Dashboard zu den ungarischen Rettungsdienst-Ausrückzeiten, auf Basis der öffentlichen Statistiken des Landesrettungsdienstes.",
		"app.version": "App-Version: {v}",

		"social.linkedin": "LinkedIn",
		"social.coffee": "Buy Me a Coffee",

		"boot.fetch": "Daten werden geladen",
		"boot.parse": "Verarbeitung",
		"boot.compute": "Berechnungen",
		"boot.render": "Darstellung",

		quips: [
			"Die Perzentile stellen sich brav in einer Reihe auf… 📊",
			"Wir fragen den Median, wie es ihm geht… 🩺",
			"Sieben Regionen, eine Startlinie… 🗺️",
			"Wir runden, aber nur auf eine Nachkommastelle… 🔢",
			"Das 90. Perzentil trödelt schon wieder… ⏱️",
			"Die Diagrammachsen werden poliert… ✨",
			"Die 15-Minuten-Linie wird eingezeichnet… 📏",
			"Das Balkendiagramm nimmt Haltung an… 📶",
			"Die Fallzahlen zählen sich gerade selbst… 🧮",
			"Die Monate kommen im Gänsemarsch… 📆",
			"Wir laden leise, ganz ohne Sirene… 🔕",
			"Die Tabelle rückt ihre Kopfzeile zurecht… 📋",
			"Wir rechnen aus, was zusammenpasst… 🤓",
		],

		"header.refresh": "Aktualisieren",
		"header.refreshLast": "Aktualisieren · zuletzt: {time}",
		"header.refreshFailed":
			"Aktualisieren · die letzte Aktualisierung ist fehlgeschlagen",
		"header.refreshing": "Aktualisierung…",
		"header.refreshingPct": "Aktualisierung… {pct}%",
		"header.refreshFailedPill":
			"Aktualisierung fehlgeschlagen: frühere Daten sichtbar",
		"header.theme": "Design: {mode}",
		"header.themeLight": "hell",
		"header.themeDark": "dunkel",
		"header.themeAuto": "automatisch",
		"header.langCurrent": "Sprache: {name}",
		"header.source": "Datenquelle: stat.mentok.hu",
		"header.sourceMenu": "Datenquelle: stat.mentok.hu",
		"header.menu": "Menü",
		"header.dataAge": "Datenstand: {date}",
		"header.dataAgeTip":
			"Der Rettungsdienst hat die hier gezeigten Daten an diesem Tag veröffentlicht: {date}.\nAktuellster Monat: {month}{prelim}.\nDie Quelle wird monatlich aktualisiert, diese Seite prüft sie täglich.",
		"header.dataAgePrelim": " (vorläufige Daten)",
		"header.dataAgeStale":
			"\nDie Quelle wurde lange nicht aktualisiert, die Zahlen können veraltet sein.",

		"warn.chipOk": "Alles in Ordnung: keine Hinweise",
		"warn.chipCount.one": "{n} Hinweis zu den Daten",
		"warn.chipCount.other": "{n} Hinweise zu den Daten",
		"warn.panelTitle": "Hinweise zu den Daten",
		"warn.panelOk":
			"Alles in Ordnung: keine Hinweise, die Daten wurden vollständig verarbeitet.",
		"warn.preliminary":
			"Die Daten des aktuellsten Monats ({month}) sind vorläufig, die endgültigen Werte können davon abweichen.",
		"warn.seriesMissing": "Die Zeitreihendaten fehlen in der Quelle.",
		"warn.regionMissing": "Die regionalen Zeitreihen fehlen in der Quelle.",
		"warn.phasesMissing":
			"Die Daten zu den Abschnitten des Notrufs fehlen in der Quelle.",

		"range.label": "Zeitraum:",
		"range.from": "Erster Monat",
		"range.to": "Letzter Monat",
		"range.show": "Die Zeitraumauswahl einblenden",
		"range.hide": "Die Zeitraumauswahl ausblenden",
		"range.note.one": "Eingeschränkter Zeitraum · {n} Monat",
		"range.note.other": "Eingeschränkter Zeitraum · {n} Monate",
		"range.noteTip":
			"Du siehst gerade nicht den gesamten Zeitraum, sondern diesen: {from} - {to}.\nAlle Zahlen, Diagramme und Tabellen sind auf diesen Zeitraum gefiltert.",
		"range.quickTip":
			"{label} ({sub}): {from} - {to}.\nAlle Registerkarten werden auf diesen Zeitraum eingeschränkt.",
		"range.quickTipEmpty":
			"{label} ({sub}): aus diesem Zeitraum gibt es keine Daten.",
		"range.last3": "Letzte 3 Monate",
		"range.last3Short": "3 Monate",
		"range.last6": "Letzte 6 Monate",
		"range.last6Short": "6 Monate",
		"range.last12": "Letzte 12 Monate",
		"range.last12Short": "12 Monate",
		"range.thisYear": "Laufendes Jahr",
		"range.thisYearShort": "Dieses Jahr",
		"range.all": "Alle verfügbaren Daten",
		"range.allShort": "Alle Daten",

		"tab.adatok": "Über die Daten",
		"tab.attekintes": "Überblick",
		"tab.trendek": "Ausrückzeiten",
		"tab.fazisok": "Der Weg des Notrufs",
		"tab.regiok": "Regionen",
		"tab.esetszamok": "Fallzahlen",
		"tab.szoras": "Ungleichheiten",

		"common.noData": "Keine Daten verfügbar",
		"common.noDataShort": "Keine Daten",
		"common.rows": "Zeilen:",
		"common.rowsPerPage": "Zeilen pro Seite",
		"common.pageFirst": "Erste Seite",
		"common.pagePrev": "Vorherige Seite",
		"common.pageNext": "Nächste Seite",
		"common.pageLast": "Letzte Seite",
		"common.search": "Suche…",
		"common.searchClear": "Suche löschen",
		"common.noMatch":
			"Keine Zeile passt zur Suche, versuche es mit weniger Wörtern.",
		"common.close": "Schließen",
		"common.retry": "Erneut",
		"common.loadFromFile": "Aus Datei laden…",
		"common.renderError":
			"Diese Ansicht konnte nicht dargestellt werden: {msg}",
		"common.loadError": "Die Daten konnten nicht geladen werden: {msg}",
		"common.fileError": "Die Datei konnte nicht geladen werden: {msg}",
		"common.minutes": "Min",
		"common.minutesShort": "M",
		"common.cases": "Fälle",
		"common.casesUnit": "{n} Fälle",
		"common.casesUnit.one": "{n} Fall",
		"common.casesUnit.other": "{n} Fälle",
		"common.preliminary": "vorläufig",
		"common.preliminarySuffix": " (vorläufig)",
		"common.nationwide": "landesweit",
		"common.inBudapest": "in Budapest",
		"common.selectedPeriod": "der gewählte Zeitraum",
		"common.lastMonthOfPeriod": "der letzte Monat des Zeitraums",
		"common.noPrevMonth": "Keine Daten für den Vormonat",
		"common.vsPrevMonth": "{delta} gegenüber dem Vormonat",
		"common.tipCalc": "Berechnung",

		"area.Országos": "Landesweit",
		"area.Budapest": "Budapest",
		"area.Vidék": "Außerhalb von Budapest",

		"metric.median": "Median",
		"metric.p75": "P75",
		"metric.p90": "P90",
		"metricDesc.median":
			"in der Hälfte der Fälle traf der Rettungswagen innerhalb dieser Zeit ein",
		"metricDesc.p75":
			"in 75 Prozent der Fälle traf der Rettungswagen innerhalb dieser Zeit ein",
		"metricDesc.p90":
			"in 90 Prozent der Fälle traf der Rettungswagen innerhalb dieser Zeit ein",

		"prio.P1": "unmittelbare Lebensgefahr",
		"prio.P2": "dringender, schwerer Zustand",
		"prio.P3": "weniger dringender Fall",
		"prio.P4": "nicht dringender Fall",

		"band.over90": "mehr als 90 Prozent der Fälle",
		"band.b7590": "75 bis 90 Prozent der Fälle",
		"band.b5075": "50 bis 75 Prozent der Fälle",
		"band.under50": "weniger als die Hälfte der Fälle",
		"bandShort.over90": "mehr als 90%",
		"bandShort.b7590": "75-90%",
		"bandShort.b5075": "50-75%",
		"bandShort.under50": "weniger als 50%",

		"phase.esr_cad.label":
			"Die 112 nimmt den Anruf entgegen und übergibt ihn an die Rettungsleitstelle",
		"phase.esr_cad.short": "Anrufannahme bei 112",
		"phase.cad_cad.label":
			"Der Disponent nimmt den Anruf an und öffnet den Einsatzdatensatz",
		"phase.cad_cad.short": "Einsatzdatensatz öffnen",
		"phase.cad_bej.label":
			"Abfrage nach Protokoll und Einstufung in eine Dringlichkeitsstufe",
		"phase.cad_bej.short": "Abfrage und Einstufung",
		"phase.bej_erk.label":
			"Alarmierung des Rettungsmittels und Anfahrt zum Einsatzort",
		"phase.bej_erk.short": "Alarmierung und Anfahrt",

		"err.server":
			"auf dem Server ist ein Fehler aufgetreten, versuche es in einigen Minuten erneut",
		"err.corrupt":
			"Die geladenen Daten sind beschädigt oder unvollständig, versuche es in einigen Minuten erneut",
		"err.shape":
			"Die geladenen Daten sind nicht die erwartete Rettungsdienststatistik, versuche es später erneut",
	},
};
