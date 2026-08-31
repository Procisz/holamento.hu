export default {
	hu: {
		"trendek.segPrio": "Prioritás",
		"trendek.spreadTitle": "A három mutató együtt · {prio}",
		"trendek.spreadSub":
			"{prio}: medián, P75 és P90 havonta, {from} és {to} között · {area}",
		"trendek.spreadTip":
			"A fenti diagram egy mutatót mutat mind a négy prioritásra, ez a diagram fordítva: egy prioritást mind a három mutatóra.\n{calc}: a görbék közötti rés a tipikus és a leglassabb esetek távolságát mutatja.\nMinél szélesebb a rés, annál nagyobb a különbség a hívások között.",
		"trendek.spreadEmptyTitle": "Nincs adat a három mutatóhoz",

		"trendek.areaTitle": "Országos és budapesti érték: {prio} · {metric}",
		"trendek.areaSub":
			"{prio} {metric} havonta, {from} és {to} között, a két terület egymás mellett",
		"trendek.areaTip":
			"Mindkét vonal közölt érték, nem számított különbség, ezért közvetlenül összevethető.\nA budapesti szám benne van az országosban, a vidéki idő nem hozható ki a kettő különbségéből.\n{calc}: a két terület azonos havi értékei egy diagramon.\nA lényeg a két görbe távolsága és annak alakulása.",
		"trendek.areaEmptyTitle": "Országos és budapesti érték",
		"trendek.segArea": "Terület",
		"trendek.segMetric": "Mutató",

		"trendek.kpiLabel": "{prio} · {metric}",
		"trendek.kpiTip":
			"A {prio} ({desc}) esetek kiérkezési ideje {area}, ekkor: {month}.\n{calc}: {metric}, a segélyhívás indításától mérve. Vagyis: {metricDesc}.",

		"trendek.mainTitle": "Kiérkezési idő prioritásonként: {area}",
		"trendek.mainSub":
			"{metric} értékek {from} és {to} között, a segélyhívás indításától mérve, a szaggatott vonal a 15 perces tájékozódási szint",
		"trendek.mainTip":
			"Mind a négy sürgősségi kategória kiérkezési ideje havonta.\nP1: {p1}, P4: {p4}.\n{calc}: {metric}, azaz {metricDesc}.",
		"trendek.mainEmptyTitle": "Kiérkezési idő prioritásonként",
		"trendek.limit15": "15 perc",

		"trendek.yoyTitle": "Egy év alatt: {prev} és {curr}",
		"trendek.yoySub":
			"{metric}, {curr} elérhető hónapjainak átlaga {prev} azonos hónapjaihoz mérve: {area}",
		"trendek.yoyTip":
			"A két év összevetése prioritásonként.\n{calc}: a {curr} hónapjainak {metric} átlaga, a {prev} azonos hónapjainak átlagával párban.\nAz alacsonyabb oszlop a jobb.",
		"trendek.yoyEmptyTitle": "Éves összevetés",
		"trendek.yoyEmptyHint":
			"Ehhez a kiválasztott időszaknak két egymást követő év azonos hónapjait kell tartalmaznia.",

		"trendek.yoyTableTitle": "Éves változás számokban: {prev} és {curr}",
		"trendek.yoyTableSub":
			"{metric}, {area}, az azonos hónapok átlagai alapján",
		"trendek.yoyTableTip":
			"Az éves összevetés pontos értékei.\n{calc}: a {prev} és a {curr} azonos hónapjainak átlaga, a változás ezek különbsége, zárójelben százalékosan.\nA zöld érték gyorsulást, a piros lassulást jelent.",
		"trendek.yoyTableEmptyTitle": "Éves változás számokban",

		"trendek.colPrio": "Prioritás",
		"trendek.colYearAvg": "{year} átlag",
		"trendek.colChange": "Változás",

		"trendek.monthlyTitle": "Havi értékek: {area}",
		"trendek.monthlySub":
			"{metric} prioritásonként, {from} és {to} között, az utolsó oszlop becsült sávot ad arra, hogy a P1 esetek mekkora része fért 15 percbe",
		"trendek.monthlyTip":
			"Minden havi {metric} érték a négy sürgősségi kategóriára.\nAz utolsó oszlop a P1 esetek 15 percen belüli arányát mutatja, a három közölt percentilisből sávosan becsülve.",
		"trendek.monthlyEmptyTitle": "Havi értékek",
		"trendek.colMonth": "Hónap",
		"trendek.colBand": "P1 a 15 perchez képest",
	},

	en: {
		"trendek.segPrio": "Priority",
		"trendek.spreadTitle": "The three metrics together · {prio}",
		"trendek.spreadSub":
			"{prio}: median, P75 and P90 by month, between {from} and {to} · {area}",
		"trendek.spreadTip":
			"The chart above shows one metric for all four priorities, this one is the other way round: one priority across all three metrics.\n{calc}: the gap between the curves shows the distance between the typical and the slowest cases.\nThe wider the gap, the larger the difference between calls.",
		"trendek.spreadEmptyTitle": "No data for the three metrics",

		"trendek.areaTitle": "Nationwide and Budapest: {prio} · {metric}",
		"trendek.areaSub":
			"{prio} {metric} by month, from {from} to {to}, the two areas side by side",
		"trendek.areaTip":
			"Both lines are published values, not a computed difference, so they can be compared directly.\nThe Budapest figure is part of the nationwide one, and the time outside Budapest cannot be derived from the gap.\n{calc}: the monthly values of the two areas on one chart.\nWhat matters is the distance between the two curves and how it moves.",
		"trendek.areaEmptyTitle": "Nationwide and Budapest values",
		"trendek.segArea": "Area",
		"trendek.segMetric": "Measure",

		"trendek.kpiLabel": "{prio} · {metric}",
		"trendek.kpiTip":
			"Response time for {prio} cases ({desc}) {area}, in {month}.\n{calc}: {metric}, measured from the start of the emergency call. That is: {metricDesc}.\nA lower value is better.",

		"trendek.mainTitle": "Response time by priority: {area}",
		"trendek.mainSub":
			"{metric} values from {from} to {to}, measured from the start of the emergency call, the dashed line marks the 15 minute reference level",
		"trendek.mainTip":
			"The response time of all four priority categories, month by month.\nP1: {p1}, P4: {p4}.\n{calc}: {metric}, that is, {metricDesc}.",
		"trendek.mainEmptyTitle": "Response time by priority",
		"trendek.limit15": "15 minutes",

		"trendek.yoyTitle": "Year on year: {prev} and {curr}",
		"trendek.yoySub":
			"{metric}, the average of the available months of {curr} against the same months of {prev}: {area}",
		"trendek.yoyTip":
			"The two years compared, one priority category at a time.\n{calc}: the average of the {metric} values for the months of {curr}, paired with the average of the same months of {prev}.\nA lower column is better.",
		"trendek.yoyEmptyTitle": "Year on year comparison",
		"trendek.yoyEmptyHint":
			"This needs the selected period to cover the same months in two consecutive years.",

		"trendek.yoyTableTitle": "Yearly change in numbers: {prev} and {curr}",
		"trendek.yoyTableSub":
			"{metric}, {area}, based on the averages of the same months",
		"trendek.yoyTableTip":
			"The exact figures behind the yearly comparison.\n{calc}: the average of the same months in {prev} and {curr}, the change is the difference between them, with the percentage in brackets.\nGreen means the ambulance arrived faster, red means it arrived more slowly.",
		"trendek.yoyTableEmptyTitle": "Yearly change in numbers",

		"trendek.colPrio": "Priority",
		"trendek.colYearAvg": "{year} average",
		"trendek.colChange": "Change",

		"trendek.monthlyTitle": "Monthly values: {area}",
		"trendek.monthlySub":
			"{metric} by priority, from {from} to {to}, the last column gives an estimated band for how many P1 cases were reached within 15 minutes",
		"trendek.monthlyTip":
			"Every monthly {metric} value for the four priority categories.\nThe last column estimates the share of P1 cases reached within 15 minutes, in bands worked out from the three published percentiles.\nClick a column heading to reorder the table.",
		"trendek.monthlyEmptyTitle": "Monthly values",
		"trendek.colMonth": "Month",
		"trendek.colBand": "P1 against 15 minutes",
	},

	de: {
		"trendek.segPrio": "Dringlichkeitsstufe",
		"trendek.spreadTitle": "Die drei Kennzahlen zusammen · {prio}",
		"trendek.spreadSub":
			"{prio}: Median, P75 und P90 je Monat, zwischen {from} und {to} · {area}",
		"trendek.spreadTip":
			"Das Diagramm darüber zeigt eine Kennzahl für alle vier Stufen, dieses umgekehrt: eine Stufe über alle drei Kennzahlen.\n{calc}: der Abstand zwischen den Kurven zeigt die Distanz zwischen den typischen und den langsamsten Fällen.\nJe breiter der Abstand, desto größer der Unterschied zwischen den Anrufen.",
		"trendek.spreadEmptyTitle": "Keine Daten für die drei Kennzahlen",

		"trendek.areaTitle": "Landesweit und Budapest: {prio} · {metric}",
		"trendek.areaSub":
			"{prio} {metric} je Monat, von {from} bis {to}, beide Gebiete nebeneinander",
		"trendek.areaTip":
			"Beide Linien sind veröffentlichte Werte, keine berechnete Differenz, daher direkt vergleichbar.\nDer Budapester Wert steckt im landesweiten Wert, die Zeit außerhalb von Budapest lässt sich aus dem Abstand nicht ableiten.\n{calc}: die monatlichen Werte beider Gebiete in einem Diagramm.\nEntscheidend ist der Abstand der beiden Kurven und seine Entwicklung.",
		"trendek.areaEmptyTitle": "Landesweiter Wert und Budapest",
		"trendek.segArea": "Gebiet",
		"trendek.segMetric": "Kennzahl",

		"trendek.kpiLabel": "{prio} · {metric}",
		"trendek.kpiTip":
			"Ausrückzeit bei {prio}-Fällen ({desc}) {area}, im Monat {month}.\n{calc}: {metric}, gemessen ab dem Beginn des Notrufs. Das heißt: {metricDesc}.\nEin niedrigerer Wert ist besser.",

		"trendek.mainTitle": "Ausrückzeit nach Dringlichkeitsstufe: {area}",
		"trendek.mainSub":
			"{metric}-Werte von {from} bis {to}, gemessen ab dem Beginn des Notrufs, die gestrichelte Linie markiert die 15-Minuten-Orientierungslinie",
		"trendek.mainTip":
			"Die Ausrückzeit aller vier Dringlichkeitsstufen, Monat für Monat.\nP1: {p1}, P4: {p4}.\n{calc}: {metric}, das heißt: {metricDesc}.",
		"trendek.mainEmptyTitle": "Ausrückzeit nach Dringlichkeitsstufe",
		"trendek.limit15": "15 Minuten",

		"trendek.yoyTitle": "Im Jahresvergleich: {prev} und {curr}",
		"trendek.yoySub":
			"{metric}, Durchschnitt der verfügbaren Monate von {curr} gegenüber denselben Monaten von {prev}: {area}",
		"trendek.yoyTip":
			"Vergleich der beiden Jahre nach Dringlichkeitsstufe.\n{calc}: Durchschnitt der {metric}-Werte der Monate von {curr}, gepaart mit dem Durchschnitt derselben Monate von {prev}.\nEine niedrigere Säule ist besser.",
		"trendek.yoyEmptyTitle": "Jahresvergleich",
		"trendek.yoyEmptyHint":
			"Dafür muss der gewählte Zeitraum dieselben Monate aus zwei aufeinanderfolgenden Jahren enthalten.",

		"trendek.yoyTableTitle":
			"Jährliche Veränderung in Zahlen: {prev} und {curr}",
		"trendek.yoyTableSub":
			"{metric}, {area}, auf Basis der Durchschnitte derselben Monate",
		"trendek.yoyTableTip":
			"Die genauen Werte des Jahresvergleichs.\n{calc}: Durchschnitt derselben Monate in {prev} und {curr}, die Veränderung ist die Differenz, in Klammern in Prozent.\nGrün bedeutet, der Rettungswagen war schneller da, Rot bedeutet, er war langsamer.",
		"trendek.yoyTableEmptyTitle": "Jährliche Veränderung in Zahlen",

		"trendek.colPrio": "Dringlichkeit",
		"trendek.colYearAvg": "Durchschnitt {year}",
		"trendek.colChange": "Veränderung",

		"trendek.monthlyTitle": "Monatswerte: {area}",
		"trendek.monthlySub":
			"{metric} nach Dringlichkeitsstufe, von {from} bis {to}, die letzte Spalte gibt einen geschätzten Bereich dafür an, wie viele P1-Fälle innerhalb von 15 Minuten erreicht wurden",
		"trendek.monthlyTip":
			"Alle monatlichen {metric}-Werte für die vier Dringlichkeitsstufen.\nDie letzte Spalte schätzt den Anteil der P1-Fälle, die innerhalb von 15 Minuten erreicht wurden, in Stufen aus den drei veröffentlichten Perzentilen.\nEin Klick auf eine Spaltenüberschrift sortiert die Tabelle um.",
		"trendek.monthlyEmptyTitle": "Monatswerte",
		"trendek.colMonth": "Monat",
		"trendek.colBand": "P1 gegenüber 15 Minuten",
	},
};
