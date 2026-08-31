export default {
	hu: {
		"szoras.areaSeg": "Terület",
		"szoras.metricSeg": "Mutató a Budapest-eltéréshez",
		"szoras.ratioValue": "{v}x",
		"szoras.kpiLabel": "{p} · P90/medián",
		"szoras.kpiFoot": "{p90Label}: {p90}, {medLabel}: {med}",
		"szoras.kpiTip":
			"A leglassabb esetek leszakadása a {p} kategóriában ({desc}).\nAz időszak utolsó hónapja: {month}.\n{calc}: a P90 érték osztva a mediánnal.\nHa az arány 2x, a leglassabb 10 százalék legalább kétszer annyit várt, mint a tipikus eset.",

		"szoras.ratioTitle": "A P90/medián arány alakulása · {area}",
		"szoras.ratioSub":
			"A leglassabb 10 százalék leszakadása a tipikus esettől · {from} - {to}",
		"szoras.ratioTip":
			"Az egyenlőtlenség havi alakulása mind a négy sürgősségi kategóriában.\n{calc}: minden hónapban a P90 értéket elosztjuk a mediánnal.\nMinél magasabb a vonal, annál egyenlőtlenebb az ellátás azon a szinten.",
		"szoras.ratioEmpty": "P90/medián arány",

		"szoras.gapAreaTitle": "Budapest és az országos érték eltérése · {metric}",
		"szoras.gapAreaSub":
			"A nulla fölött Budapesten lassabb, alatta gyorsabb a kiérkezés · {from} - {to}",
		"szoras.gapAreaZero": "Nincs eltérés",
		"szoras.gapAreaTip":
			"A budapesti és az országos kiérkezési idő eltérése hónapról hónapra, mind a négy sürgősségi kategóriában.\n{calc}: a kiválasztott mutató ({metric}) budapesti értéke mínusz az országos értéke.\nA nulla vonal fölött Budapesten lassabb, alatta gyorsabb az ellátás.\nP1-nél a görbe a mutató szerint előjelet válthat: a tipikus eset Budapesten lassabb, a leglassabb tíz százalék viszont gyorsabb.",
		"szoras.gapAreaEmpty": "Budapest és az országos érték eltérése",

		"szoras.gapLabel": "P90 - medián",
		"szoras.gapTitle": "A P90 és a medián különbsége · {month}",
		"szoras.gapSub":
			"Hány perccel várt többet a leglassabb 10 százalék a tipikusnál · {area}",
		"szoras.gapTip":
			"A leglassabb 10 százalék többletvárakozása percben.\nAz időszak utolsó hónapja: {month}.\n{calc}: P90 mínusz medián, prioritásonként.",
		"szoras.gapEmpty": "A P90 és a medián különbsége",

		"szoras.worstTitle": "Legnehezebb helyzetek",
		"szoras.worstSub":
			"{month}: a legmagasabb P90 értékű régió-prioritás párosok, országos régiós bontásban",
		"szoras.worstTip":
			"A legmagasabb P90 értékek a régiós bontásból, az időszak utolsó hónapjában.\n{calc}: a megjelenített régió és prioritás párosok közül a legnagyobb értékek.\nEzekben a helyzetekben várt a legtöbbet a leglassabban ellátott 10 százalék.",
		"szoras.worstItem":
			"{region} régió, {prio}: az esetek 10 százaléka több mint {time}et várt",

		"szoras.tableTitle":
			"Régiók és prioritások teljes listája · {month}{prelim}",
		"szoras.tableSub":
			"{month}: régiós bontás, a segélyhívás indításától mérve",
		"szoras.tableTip":
			"Minden régió-prioritás páros kiérkezési ideje az időszak utolsó hónapjában.\n{calc}: a {gap} oszlop mutatja, hány perccel várt többet a leglassabb 10 százalék a tipikus esetnél.\nA {ratio} oszlop ugyanezt hányadosként adja meg: a P90 osztva a mediánnal.",
		"szoras.tableEmpty": "Régiók és prioritások teljes listája",
		"szoras.colRegion": "Régió",
		"szoras.colPrio": "Prioritás",
		"szoras.colRatio": "P90/medián",

		"szoras.regionHint":
			"A régiós bontás csak a forrás legutóbbi hónapjaira érhető el, a kiválasztott időszak utolsó hónapjához nincs ilyen adat.",
	},

	en: {
		"szoras.areaSeg": "Area",
		"szoras.metricSeg": "Metric for the Budapest gap",
		"szoras.ratioValue": "{v}x",
		"szoras.kpiLabel": "{p} · P90/median",
		"szoras.kpiFoot": "{p90Label}: {p90}, {medLabel}: {med}",
		"szoras.kpiTip":
			"How far the slowest cases fall behind in the {p} category ({desc}).\nLast month of the period: {month}.\n{calc}: the P90 value divided by the median.\nIf the ratio is 2x, the slowest 10 percent waited at least twice as long as the typical case.\nA lower value is better.",

		"szoras.ratioTitle": "How the P90/median ratio changed · {area}",
		"szoras.ratioSub":
			"How far the slowest 10 percent fall behind the typical case · {from} - {to}",
		"szoras.ratioTip":
			"How the inequality changed month by month across all four priority categories.\n{calc}: in every month the P90 value is divided by the median.\nThe higher the line, the more uneven the care at that level.",
		"szoras.ratioEmpty": "P90/median ratio",

		"szoras.gapAreaTitle":
			"The gap between Budapest and the national value · {metric}",
		"szoras.gapAreaSub":
			"Above zero Budapest is the slower one, below zero it is the faster one · {from} - {to}",
		"szoras.gapAreaZero": "No difference",
		"szoras.gapAreaTip":
			"The difference between the Budapest and the national response time, month by month, across all four priority categories.\n{calc}: the Budapest value of the selected metric ({metric}) minus the national value.\nAbove the zero line Budapest is slower, below it Budapest is faster.\nIn P1 the line can change sign depending on the metric: the typical case is slower in Budapest, while the slowest ten percent is faster.",
		"szoras.gapAreaEmpty": "The gap between Budapest and the national value",

		"szoras.gapLabel": "P90 - median",
		"szoras.gapTitle": "The gap between P90 and the median · {month}",
		"szoras.gapSub":
			"How many minutes longer the slowest 10 percent waited than the typical case · {area}",
		"szoras.gapTip":
			"The extra waiting time of the slowest 10 percent, in minutes.\nLast month of the period: {month}.\n{calc}: P90 minus the median, by priority.\nA lower value is better.",
		"szoras.gapEmpty": "The gap between P90 and the median",

		"szoras.worstTitle": "The hardest situations",
		"szoras.worstSub":
			"{month}: the region and priority pairs with the highest P90 values, from the nationwide regional breakdown",
		"szoras.worstTip":
			"The highest P90 values from the regional breakdown, in the last month of the period.\n{calc}: the largest values among the region and priority pairs shown.\nIn these situations the slowest served 10 percent waited the longest.",
		"szoras.worstItem":
			"{region} region, {prio}: 10 percent of cases waited more than {time}",

		"szoras.tableTitle":
			"Full list of regions and priorities · {month}{prelim}",
		"szoras.tableSub":
			"{month}: regional breakdown, measured from the start of the emergency call",
		"szoras.tableTip":
			"The response times of every region and priority pair in the last month of the period.\n{calc}: the {gap} column shows how many minutes longer the slowest 10 percent waited than the typical case.\nThe {ratio} column gives the same as a ratio: P90 divided by the median.\nClick a column header to reorder the table.",
		"szoras.tableEmpty": "Full list of regions and priorities",
		"szoras.colRegion": "Region",
		"szoras.colPrio": "Priority",
		"szoras.colRatio": "P90/median",

		"szoras.regionHint":
			"The regional breakdown is only available for the most recent months of the source, and there is no such data for the last month of the selected period.",
	},

	de: {
		"szoras.areaSeg": "Gebiet",
		"szoras.metricSeg": "Kennzahl für den Budapest-Abstand",
		"szoras.ratioValue": "{v}x",
		"szoras.kpiLabel": "{p} · P90/Median",
		"szoras.kpiFoot": "{p90Label}: {p90}, {medLabel}: {med}",
		"szoras.kpiTip":
			"Wie weit die langsamsten Fälle in der Kategorie {p} zurückbleiben ({desc}).\nLetzter Monat des Zeitraums: {month}.\n{calc}: der P90-Wert geteilt durch den Median.\nBeim Verhältnis 2x wartete das langsamste Zehntel mindestens doppelt so lange wie der typische Fall.\nEin niedrigerer Wert ist besser.",

		"szoras.ratioTitle": "Entwicklung des Verhältnisses P90 zu Median · {area}",
		"szoras.ratioSub":
			"Wie weit die langsamsten 10 Prozent hinter dem typischen Fall zurückbleiben · {from} - {to}",
		"szoras.ratioTip":
			"Die monatliche Entwicklung der Ungleichheit in allen vier Dringlichkeitsstufen.\n{calc}: in jedem Monat wird der P90-Wert durch den Median geteilt.\nJe höher die Linie, desto ungleicher die Versorgung auf dieser Stufe.",
		"szoras.ratioEmpty": "Verhältnis P90 zu Median",

		"szoras.gapAreaTitle":
			"Der Abstand zwischen Budapest und dem Landeswert · {metric}",
		"szoras.gapAreaSub":
			"Über null ist Budapest langsamer, darunter schneller · {from} - {to}",
		"szoras.gapAreaZero": "Kein Unterschied",
		"szoras.gapAreaTip":
			"Der Unterschied zwischen der Budapester und der landesweiten Ausrückzeit, Monat für Monat, in allen vier Dringlichkeitsstufen.\n{calc}: der Budapester Wert der gewählten Kennzahl ({metric}) minus der Landeswert.\nÜber der Nulllinie ist Budapest langsamer, darunter schneller.\nBei P1 kann die Linie je nach Kennzahl das Vorzeichen wechseln: der typische Fall ist in Budapest langsamer, das langsamste Zehntel dagegen schneller.",
		"szoras.gapAreaEmpty": "Der Abstand zwischen Budapest und dem Landeswert",

		"szoras.gapLabel": "P90 - Median",
		"szoras.gapTitle": "Der Abstand zwischen P90 und Median · {month}",
		"szoras.gapSub":
			"Wie viele Minuten die langsamsten 10 Prozent länger warteten als der typische Fall · {area}",
		"szoras.gapTip":
			"Die zusätzliche Wartezeit der langsamsten 10 Prozent in Minuten.\nLetzter Monat des Zeitraums: {month}.\n{calc}: P90 minus Median, je Dringlichkeitsstufe.\nEin niedrigerer Wert ist besser.",
		"szoras.gapEmpty": "Der Abstand zwischen P90 und Median",

		"szoras.worstTitle": "Die schwierigsten Situationen",
		"szoras.worstSub":
			"{month}: die Paare aus Region und Dringlichkeitsstufe mit den höchsten P90-Werten, aus der landesweiten regionalen Aufschlüsselung",
		"szoras.worstTip":
			"Die höchsten P90-Werte aus der regionalen Aufschlüsselung im letzten Monat des Zeitraums.\n{calc}: die größten Werte aus den angezeigten Kombinationen von Region und Dringlichkeitsstufe.\nIn diesen Situationen wartete das am langsamsten versorgte Zehntel am längsten.",
		"szoras.worstItem":
			"Region {region}, {prio}: 10 Prozent der Fälle warteten länger als {time}",

		"szoras.tableTitle":
			"Vollständige Liste der Regionen und Dringlichkeitsstufen · {month}{prelim}",
		"szoras.tableSub":
			"{month}: regionale Aufschlüsselung, gemessen ab dem Beginn des Notrufs",
		"szoras.tableTip":
			"Die Ausrückzeiten jedes Paares aus Region und Dringlichkeitsstufe im letzten Monat des Zeitraums.\n{calc}: die Spalte {gap} zeigt, wie viele Minuten das langsamste Zehntel länger wartete als der typische Fall.\nDie Spalte {ratio} zeigt dasselbe als Verhältnis: P90 geteilt durch den Median.\nEin Klick auf eine Spaltenüberschrift sortiert die Tabelle neu.",
		"szoras.tableEmpty":
			"Vollständige Liste der Regionen und Dringlichkeitsstufen",
		"szoras.colRegion": "Region",
		"szoras.colPrio": "Dringlichkeit",
		"szoras.colRatio": "P90/Median",

		"szoras.regionHint":
			"Die regionale Aufschlüsselung liegt nur für die jüngsten Monate der Quelle vor, für den letzten Monat des gewählten Zeitraums gibt es keine solchen Daten.",
	},
};
