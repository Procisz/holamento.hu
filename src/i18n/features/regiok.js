export default {
	hu: {
		"regiok.segPrio": "Prioritás",
		"regiok.segMetric": "Mutató",
		"regiok.segSub": "{prio}: {prioDesc} · {metric}: {metricDesc}",
		"regiok.coverSub":
			"A régiós bontás ezekre a hónapokra érhető el: {from} - {to}.",
		"regiok.coverNone":
			"A kiválasztott időszakból ({from} - {to}) nincs régiós bontás.",
		"regiok.regionHint":
			"A régiós bontást csak a legutóbbi hónapokra közlik, bővítsd az időszakot vagy válassz későbbi hónapot.",

		"regiok.fastestLabel": "Leggyorsabb régió · {prio}",
		"regiok.fastestTip":
			"A kiválasztott mutató szerint legjobb régió ebben a hónapban: {month}.\n{calc}: a régiós értékek közül a legkisebb.",
		"regiok.slowestLabel": "Leglassabb régió · {prio}",
		"regiok.slowestTip":
			"A kiválasztott mutató szerint leggyengébb régió ebben a hónapban: {month}.\n{calc}: a régiós értékek közül a legnagyobb.\nItt kellett a legtovább várni a mentőre.",
		"regiok.natLabel": "Országos · {prio} {metric}",
		"regiok.natTip":
			"Az országos érték ugyanerre a prioritásra és mutatóra, viszonyítási pont a régiós számokhoz.\n{calc}: az időszak utolsó hónapjának ({month}) országos értéke.\n{metric}: {desc}.",
		"regiok.gapLabel": "Régiók közti különbség",
		"regiok.gapFoot": "{fastest} és {slowest} között",
		"regiok.gapTip":
			"A leggyorsabb és a leglassabb régió közti eltérés ebben a hónapban: {month}.\n{calc}: a legnagyobb régiós értékből kivonjuk a legkisebbet.\nMinél nagyobb, annál egyenlőtlenebb az ellátás.",

		"regiok.trendTitle": "Régiós kiérkezési idők · {prio} {metric}",
		"regiok.trendTitleShort": "Régiós kiérkezési idők",
		"regiok.trendSub":
			"{n} régió havi értéke {from} és {to} között · a szaggatott vonal a 15 perces tájékozódási szint",
		"regiok.trendTip":
			"Minden régió havi értéke a kiválasztott prioritásra és mutatóra.\n{calc}: a régiós idősor, a segélyhívás indításától a helyszínre érkezésig.\nA kiválasztott időszak: {from} - {to}.\nA régiós bontás csak a legutóbbi hónapokra érhető el.",
		"regiok.min15": "15 perc",

		"regiok.rankTitle": "Régiók rangsora · {prio} {metric}",
		"regiok.rankTitleShort": "Régiók rangsora",
		"regiok.rankSub": "{month} · a rövidebb oszlop a jobb",
		"regiok.rankTip":
			"A régiók sorrendje a kiválasztott mutató szerint, ebben a hónapban: {month}.\n{calc}: a mutató értéke régiónként, növekvő sorrendben.\nA rövidebb oszlop gyorsabb kiérkezést jelent.",

		"regiok.spreadTitle": "Régiós olló · {prio} {metric}",
		"regiok.spreadTitleShort": "Régiós olló",
		"regiok.spreadSub":
			"Havi különbség a leglassabb és a leggyorsabb régió között",
		"regiok.spreadSubWith":
			"Havi különbség a leglassabb és a leggyorsabb régió között · {month}: {fastest} a leggyorsabb, {slowest} a leglassabb",
		"regiok.spreadSeries": "Különbség",
		"regiok.spreadTip":
			"A területi egyenlőtlenség mértéke hónapról hónapra.\n{calc}: havonta a leglassabb régió értékéből kivonjuk a leggyorsabbét.\nHa nő, a régiók távolodnak egymástól, ha csökken, közelednek.",

		"regiok.changeTitle": "Régiók elmozdulása · {prio} {metric}",
		"regiok.changeTitleShort": "Régiók elmozdulása",
		"regiok.changeSub":
			"{from} és {to} között · a balra nyúló oszlop javulás, a jobbra nyúló romlás",
		"regiok.changeSeries": "Változás",
		"regiok.changeTip":
			"Mennyit mozdult az egyes régiók értéke az időszak alatt.\n{calc}: régiónként az utolsó elérhető hónap értékéből kivonjuk az elsőét.\nA negatív érték, vagyis a balra nyúló oszlop, rövidülő kiérkezést jelent.\nCsak a két végpont különbsége látszik, a köztes hónapok ingadozása nem.\nRövid lefedett időszaknál ez két pont közti egyenes, nem trend.",

		"regiok.tableTitle": "Régiós összkép · {prio}, {month}",
		"regiok.tableTitleShort": "Régiós összkép",
		"regiok.tableSub":
			"A segélyhívás indításától mérve · a régiók közvetlenül nem hasonlíthatók össze, eltér a településszerkezet és az útviszonyok",
		"regiok.tableTip":
			"A régiós értékek a kiválasztott prioritásra, ebben a hónapban: {month}.\n{median}: {medianDesc}.\n{p75}: {p75Desc}.\n{p90}: {p90Desc}.\nA régiók közvetlenül nem hasonlíthatók össze: eltér a településszerkezet és az útviszonyok.",
		"regiok.colRegion": "Régió",
	},

	en: {
		"regiok.segPrio": "Priority",
		"regiok.segMetric": "Measure",
		"regiok.segSub": "{prio}: {prioDesc} · {metric}: {metricDesc}",
		"regiok.coverSub":
			"The regional breakdown is available for these months: {from} - {to}.",
		"regiok.coverNone":
			"There is no regional breakdown for the selected period ({from} - {to}).",
		"regiok.regionHint":
			"The regional breakdown is only published for the most recent months, widen the period or pick a later one.",

		"regiok.fastestLabel": "Fastest region · {prio}",
		"regiok.fastestTip":
			"The best region by the selected measure in this month: {month}.\n{calc}: the smallest of the regional values.\nA lower value means the ambulance arrived sooner.",
		"regiok.slowestLabel": "Slowest region · {prio}",
		"regiok.slowestTip":
			"The weakest region by the selected measure in this month: {month}.\n{calc}: the largest of the regional values.\nThis is where people waited longest for an ambulance.",
		"regiok.natLabel": "Nationwide · {prio} {metric}",
		"regiok.natTip":
			"The nationwide figure for the same priority and measure, a reference point for the regional numbers.\n{calc}: the nationwide value for the last month of the period ({month}).\n{metric}: {desc}.",
		"regiok.gapLabel": "Gap between the regions",
		"regiok.gapFoot": "between {fastest} and {slowest}",
		"regiok.gapTip":
			"The difference between the fastest and the slowest region in this month: {month}.\n{calc}: the smallest regional value subtracted from the largest one.\nThe larger it is, the more uneven the care.",

		"regiok.trendTitle": "Regional response times · {prio} {metric}",
		"regiok.trendTitleShort": "Regional response times",
		"regiok.trendSub":
			"Monthly values of {n} regions between {from} and {to} · the dashed line marks the 15 minute reference level",
		"regiok.trendTip":
			"The monthly value of every region for the selected priority and measure.\n{calc}: the regional time series, measured from the emergency call to arrival at the scene.\nSelected period: {from} - {to}.\nThe regional breakdown covers only the most recent months.",
		"regiok.min15": "15 minutes",

		"regiok.rankTitle": "Regions ranked · {prio} {metric}",
		"regiok.rankTitleShort": "Regions ranked",
		"regiok.rankSub": "{month} · the shorter bar is the better one",
		"regiok.rankTip":
			"The order of the regions by the selected measure in this month: {month}.\n{calc}: the value of the measure for each region, in ascending order.\nA shorter bar means the ambulance arrived sooner.",

		"regiok.spreadTitle": "Regional spread · {prio} {metric}",
		"regiok.spreadTitleShort": "Regional spread",
		"regiok.spreadSub":
			"Monthly difference between the slowest and the fastest region",
		"regiok.spreadSubWith":
			"Monthly difference between the slowest and the fastest region · in {month} {fastest} was the fastest and {slowest} the slowest",
		"regiok.spreadSeries": "Difference",
		"regiok.spreadTip":
			"How unevenly the regions perform from month to month.\n{calc}: each month the value of the fastest region is subtracted from that of the slowest.\nIf it grows, the regions are drifting apart, if it falls, they are moving closer.",

		"regiok.changeTitle": "How much the regions moved · {prio} {metric}",
		"regiok.changeTitleShort": "How much the regions moved",
		"regiok.changeSub":
			"Between {from} and {to} · a bar reaching left is an improvement, one reaching right is a decline",
		"regiok.changeSeries": "Change",
		"regiok.changeTip":
			"How much the value of each region moved over the period.\n{calc}: per region, the value of the first available month subtracted from the last one.\nA negative value, a bar reaching left, means a shorter response time.\nOnly the difference of the two end points shows, the swings in between do not.\nOver a short covered period this is a straight line between two points, not a trend.",

		"regiok.tableTitle": "Regional overview · {prio}, {month}",
		"regiok.tableTitleShort": "Regional overview",
		"regiok.tableSub":
			"Measured from the emergency call · the regions are not directly comparable, settlement patterns and road conditions differ",
		"regiok.tableTip":
			"The regional figures for the selected priority in this month: {month}.\n{median}: {medianDesc}.\n{p75}: {p75Desc}.\n{p90}: {p90Desc}.\nThe regions are not directly comparable: settlement patterns and road conditions differ.",
		"regiok.colRegion": "Region",
	},

	de: {
		"regiok.segPrio": "Dringlichkeit",
		"regiok.segMetric": "Kennzahl",
		"regiok.segSub": "{prio}: {prioDesc} · {metric}: {metricDesc}",
		"regiok.coverSub":
			"Die regionale Aufschlüsselung liegt für diese Monate vor: {from} - {to}.",
		"regiok.coverNone":
			"Für den gewählten Zeitraum ({from} - {to}) gibt es keine regionale Aufschlüsselung.",
		"regiok.regionHint":
			"Die regionale Aufschlüsselung wird nur für die letzten Monate veröffentlicht, erweitere den Zeitraum oder wähle einen späteren Monat.",

		"regiok.fastestLabel": "Schnellste Region · {prio}",
		"regiok.fastestTip":
			"Die nach der gewählten Kennzahl beste Region in diesem Monat: {month}.\n{calc}: der kleinste der regionalen Werte.\nEin kleinerer Wert bedeutet ein schnelleres Eintreffen.",
		"regiok.slowestLabel": "Langsamste Region · {prio}",
		"regiok.slowestTip":
			"Die nach der gewählten Kennzahl schwächste Region in diesem Monat: {month}.\n{calc}: der größte der regionalen Werte.\nHier musste am längsten auf den Rettungswagen gewartet werden.",
		"regiok.natLabel": "Landesweit · {prio} {metric}",
		"regiok.natTip":
			"Der landesweite Wert für dieselbe Dringlichkeit und Kennzahl, ein Bezugspunkt für die regionalen Zahlen.\n{calc}: der landesweite Wert des letzten Monats im Zeitraum ({month}).\n{metric}: {desc}.",
		"regiok.gapLabel": "Unterschied zwischen den Regionen",
		"regiok.gapFoot": "zwischen {fastest} und {slowest}",
		"regiok.gapTip":
			"Der Abstand zwischen der schnellsten und der langsamsten Region in diesem Monat: {month}.\n{calc}: vom größten regionalen Wert wird der kleinste abgezogen.\nJe größer er ist, desto ungleicher ist die Versorgung.",

		"regiok.trendTitle": "Regionale Ausrückzeiten · {prio} {metric}",
		"regiok.trendTitleShort": "Regionale Ausrückzeiten",
		"regiok.trendSub":
			"Monatswerte von {n} Regionen zwischen {from} und {to} · die gestrichelte Linie markiert die 15-Minuten-Orientierungsmarke",
		"regiok.trendTip":
			"Der Monatswert jeder Region für die gewählte Dringlichkeit und Kennzahl.\n{calc}: die regionale Zeitreihe, gemessen vom Notruf bis zum Eintreffen am Einsatzort.\nGewählter Zeitraum: {from} - {to}.\nDie regionale Aufschlüsselung deckt nur die letzten Monate ab.",
		"regiok.min15": "15 Minuten",

		"regiok.rankTitle": "Rangfolge der Regionen · {prio} {metric}",
		"regiok.rankTitleShort": "Rangfolge der Regionen",
		"regiok.rankSub": "{month} · der kürzere Balken ist der bessere",
		"regiok.rankTip":
			"Die Reihenfolge der Regionen nach der gewählten Kennzahl in diesem Monat: {month}.\n{calc}: der Wert der Kennzahl je Region, aufsteigend sortiert.\nEin kürzerer Balken bedeutet ein schnelleres Eintreffen.",

		"regiok.spreadTitle": "Regionale Schere · {prio} {metric}",
		"regiok.spreadTitleShort": "Regionale Schere",
		"regiok.spreadSub":
			"Monatlicher Unterschied zwischen der langsamsten und der schnellsten Region",
		"regiok.spreadSubWith":
			"Monatlicher Unterschied zwischen der langsamsten und der schnellsten Region · im Monat {month} war {fastest} am schnellsten und {slowest} am langsamsten",
		"regiok.spreadSeries": "Unterschied",
		"regiok.spreadTip":
			"Wie ungleich die Regionen von Monat zu Monat abschneiden.\n{calc}: pro Monat wird vom Wert der langsamsten Region der Wert der schnellsten abgezogen.\nSteigt er, entfernen sich die Regionen voneinander, sinkt er, nähern sie sich an.",

		"regiok.changeTitle": "Veränderung der Regionen · {prio} {metric}",
		"regiok.changeTitleShort": "Veränderung der Regionen",
		"regiok.changeSub":
			"Zwischen {from} und {to} · ein Balken nach links ist eine Verbesserung, einer nach rechts eine Verschlechterung",
		"regiok.changeSeries": "Veränderung",
		"regiok.changeTip":
			"Wie stark sich der Wert jeder Region im Zeitraum bewegt hat.\n{calc}: je Region wird vom Wert des letzten verfügbaren Monats der des ersten abgezogen.\nEin negativer Wert, also ein Balken nach links, bedeutet eine kürzere Ausrückzeit.\nSichtbar ist nur die Differenz der beiden Endpunkte, nicht die Schwankung dazwischen.\nBei einem kurzen abgedeckten Zeitraum ist das eine Gerade zwischen zwei Punkten, kein Trend.",

		"regiok.tableTitle": "Regionale Übersicht · {prio}, {month}",
		"regiok.tableTitleShort": "Regionale Übersicht",
		"regiok.tableSub":
			"Gemessen ab dem Notruf · die Regionen sind nicht direkt vergleichbar, Siedlungsstruktur und Straßenverhältnisse unterscheiden sich",
		"regiok.tableTip":
			"Die regionalen Werte für die gewählte Dringlichkeit in diesem Monat: {month}.\n{median}: {medianDesc}.\n{p75}: {p75Desc}.\n{p90}: {p90Desc}.\nDie Regionen sind nicht direkt vergleichbar: Siedlungsstruktur und Straßenverhältnisse unterscheiden sich.",
		"regiok.colRegion": "Region",
	},
};
