export default {
	hu: {
		"attekintes.periodRange": "{from} - {to}",

		"attekintes.kpiP1": "P1 kiérkezés · {area}",
		"attekintes.kpiP1Tip":
			"{month}: a P1 esetek {metric} értéke {where}.\nP1: {prio}.\n{calc}: {desc}, a segélyhívás indításától mérve.",
		"attekintes.kpiCases": "Esetek · {area}",
		"attekintes.kpiCasesFoot": "{month} · naponta átlagosan {n} riasztás",
		"attekintes.kpiCasesTip":
			"{month}: a P1-P4 mentési feladatok száma {where}.\n{calc}: a négy sürgősségi kategória esetszámának összege.\nA napi átlag ebből és a hónap napjainak számából adódik.",
		"attekintes.kpiDispatch": "Hívásfeldolgozás",
		"attekintes.kpiDispatchFoot": "A teljes idő {pct}-a a vonulás előtt telik el",
		"attekintes.kpiDispatchTip":
			"{month}: ennyi idő telik el átlagosan a segélyhívástól a mentőegység riasztásáig, P1 esetekben, országosan.\n{calc}: a hívás első három szakaszának átlagideje összeadva.\nA szakaszidők csak a forrás legfrissebb hónapjára érhetők el, szűkített időszaknál hiányozhatnak.",
		"attekintes.kpiWorst": "Legnagyobb várakozás",
		"attekintes.kpiWorstFoot": "{region} régió, {prio} esetek",
		"attekintes.kpiWorstTip":
			"{month}: a legmagasabb {metric} érték a régiós bontásban.\n{calc}: a megjelenített régiók és sürgősségi kategóriák értékei közül a legnagyobb.\nEbben a régió és kategória párosban az esetek tizede ennél is tovább várt.",

		"attekintes.lineTitle": "P1 kiérkezési idő alakulása · {area}",
		"attekintes.lineSub":
			"{period} · a segélyhívás indításától mérve, a szaggatott vonal a 15 perces szint",
		"attekintes.lineTip":
			"{period}: a P1, vagyis a legsúlyosabb esetek kiérkezési ideje.\n{median}: {medianDesc}.\n{p90}: {p90Desc}.",
		"attekintes.lineEmpty": "P1 kiérkezési idő",
		"attekintes.line15": "15 perc",
		"attekintes.axisMinutes": "{v} p",

		"attekintes.mixTitle": "Esetek megoszlása",
		"attekintes.mixSub": "{month} · {where}",
		"attekintes.mixTip":
			"{month}: a négy sürgősségi kategória aránya.\nP1: {p1}. P2: {p2}.\nP3: {p3}. P4: {p4}.",

		"attekintes.factsTitle": "Érdemes tudni",
		"attekintes.factsSub": "Amit a kiválasztott időszak számai mutatnak: {period}",
		"attekintes.factsTip":
			"Ezek a mondatok a kiválasztott időszak adataiból készülnek.\nMás időszaknál más összefüggések kerülhetnek elő.\nAhol nincs elég adat, az adott mondat kimarad.",
		"attekintes.factYoyBetter":
			"Egy év alatt a <strong>{prio}</strong> esetek havi {metric} értékeinek átlaga javult a legtöbbet: {delta} ({pct}) a tavalyi év azonos hónapjaihoz képest, {n} hónap párba állításával.",
		"attekintes.factYoyWorse":
			"Egy év alatt a <strong>{prio}</strong> esetek havi {metric} értékeinek átlaga romlott a legjobban: {delta} ({pct}) a tavalyi év azonos hónapjaihoz képest, {n} hónap párba állításával.",
		"attekintes.factTravel":
			"{month}: a P1 esetek teljes kiérkezési idejéből {where} átlagosan <strong>{travel}</strong> a riasztás és a vonulás, a többi a hívás feldolgozása. A szakaszidők csak erre az egy hónapra érhetők el.",
		"attekintes.factBand":
			"{month}: a P1 esetek közül ennyi zárult 15 percen belül: <strong>{band}</strong>. A pontos arány a három percentilisből csak sávosan becsülhető.",
		"attekintes.factSpread":
			"{month}: a leggyorsabb és a leglassabb régió P1 mediánja között <strong>{gap}</strong> a különbség, {best} és {worst} között.",
		"attekintes.factNone": "Ehhez az időszakhoz most nincs kiemelhető összefüggés.",

		"attekintes.tableTitle": "Havi összkép: {month}",
		"attekintes.tableSub":
			"Országos értékek prioritásonként, zárójelben az előző hónaphoz mért változás · időszak: {period}",
		"attekintes.tableSubNoPrev":
			"Országos értékek prioritásonként, előző havi összehasonlítás nélkül · időszak: {period}",
		"attekintes.tableTip":
			"{month}: az időszak utolsó hónapjának országos kiérkezési idői, mind a négy sürgősségi kategóriára.\nA zárójeles érték az előző hónaphoz mért változás, percben.\nA zöld javulást, vagyis gyorsulást, a piros romlást, vagyis lassulást jelent.",
		"attekintes.tableEmpty": "Havi összkép",
		"attekintes.colPrio": "Prioritás",
		"attekintes.colCases": "Esetszám",
	},

	en: {
		"attekintes.periodRange": "{from} - {to}",

		"attekintes.kpiP1": "P1 response · {area}",
		"attekintes.kpiP1Tip":
			"{month}: the {metric} response time of P1 cases {where}.\nP1: {prio}.\n{calc}: {desc}, measured from the start of the emergency call.",
		"attekintes.kpiCases": "Cases · {area}",
		"attekintes.kpiCasesFoot": "{month} · on average {n} call-outs a day",
		"attekintes.kpiCasesTip":
			"{month}: the number of P1 to P4 ambulance jobs {where}.\n{calc}: the case numbers of the four urgency categories added up.\nThe daily average follows from that and the number of days in the month.",
		"attekintes.kpiDispatch": "Call handling",
		"attekintes.kpiDispatchFoot": "{pct} of the total time passes before the ambulance sets off",
		"attekintes.kpiDispatchTip":
			"{month}: how long it takes on average from the emergency call to alerting the ambulance unit, for P1 cases, nationwide.\n{calc}: the average times of the first three phases of the call added up.\nPhase times are published only for the most recent month of the source, so they can be missing for a narrowed period.",
		"attekintes.kpiWorst": "Longest wait",
		"attekintes.kpiWorstFoot": "{region} region, {prio} cases",
		"attekintes.kpiWorstTip":
			"{month}: the highest {metric} value in the regional breakdown.\n{calc}: the largest value across the regions and urgency categories shown.\nIn this region and category pair, one case in ten waited even longer than this.",

		"attekintes.lineTitle": "How P1 response times developed · {area}",
		"attekintes.lineSub":
			"{period} · measured from the start of the emergency call, the dashed line marks 15 minutes",
		"attekintes.lineTip":
			"{period}: the response time of the most serious cases, the P1 ones.\n{median}: {medianDesc}.\n{p90}: {p90Desc}.",
		"attekintes.lineEmpty": "P1 response time",
		"attekintes.line15": "15 minutes",
		"attekintes.axisMinutes": "{v} min",

		"attekintes.mixTitle": "Distribution of cases",
		"attekintes.mixSub": "{month} · {where}",
		"attekintes.mixTip":
			"{month}: the share of the four urgency categories.\nP1: {p1}. P2: {p2}.\nP3: {p3}. P4: {p4}.",

		"attekintes.factsTitle": "Worth knowing",
		"attekintes.factsSub": "What the figures of the selected period show: {period}",
		"attekintes.factsTip":
			"These sentences are built from the data of the selected period.\nA different period can bring different patterns to the surface.\nWhere there is not enough data, the sentence is left out.",
		"attekintes.factYoyBetter":
			"Over a year the average of the monthly {metric} values of <strong>{prio}</strong> cases improved the most: {delta} ({pct}) compared with the same months last year, based on {n} paired months.",
		"attekintes.factYoyWorse":
			"Over a year the average of the monthly {metric} values of <strong>{prio}</strong> cases worsened the most: {delta} ({pct}) compared with the same months last year, based on {n} paired months.",
		"attekintes.factTravel":
			"{month}: of the full response time of P1 cases {where}, <strong>{travel}</strong> is alerting and travelling on average, the rest is the handling of the call. Phase times are available for this one month only.",
		"attekintes.factBand":
			"{month}: this many P1 cases were reached within 15 minutes: <strong>{band}</strong>. The exact share can only be estimated as a band from the three percentiles.",
		"attekintes.factSpread":
			"{month}: there is a gap of <strong>{gap}</strong> between the P1 median of the fastest and the slowest region, {best} and {worst}.",
		"attekintes.factNone": "There is no pattern worth highlighting for this period at the moment.",

		"attekintes.tableTitle": "Monthly summary: {month}",
		"attekintes.tableSub":
			"Nationwide figures by priority, the change from the previous month in brackets · period: {period}",
		"attekintes.tableSubNoPrev":
			"Nationwide figures by priority, without a comparison with the previous month · period: {period}",
		"attekintes.tableTip":
			"{month}: the nationwide response times of the last month of the period, for all four urgency categories.\nThe value in brackets is the change from the previous month, in minutes.\nGreen marks an improvement, that is a faster arrival, red marks the opposite.",
		"attekintes.tableEmpty": "Monthly summary",
		"attekintes.colPrio": "Priority",
		"attekintes.colCases": "Cases",
	},

	de: {
		"attekintes.periodRange": "{from} - {to}",

		"attekintes.kpiP1": "P1-Ausrückzeit · {area}",
		"attekintes.kpiP1Tip":
			"{month}: der {metric}-Wert der P1-Fälle {where}.\nP1: {prio}.\n{calc}: {desc}, gemessen ab dem Beginn des Notrufs.",
		"attekintes.kpiCases": "Fälle · {area}",
		"attekintes.kpiCasesFoot": "{month} · durchschnittlich {n} Einsätze pro Tag",
		"attekintes.kpiCasesTip":
			"{month}: die Zahl der Rettungseinsätze von P1 bis P4 {where}.\n{calc}: die Fallzahlen der vier Dringlichkeitsstufen zusammengezählt.\nDer Tagesdurchschnitt ergibt sich daraus und aus der Zahl der Tage im Monat.",
		"attekintes.kpiDispatch": "Notrufbearbeitung",
		"attekintes.kpiDispatchFoot": "{pct} der Gesamtzeit vergeht vor der Anfahrt",
		"attekintes.kpiDispatchTip":
			"{month}: so viel Zeit vergeht im Durchschnitt vom Notruf bis zur Alarmierung des Rettungsmittels, bei P1-Fällen, landesweit.\n{calc}: die Durchschnittszeiten der ersten drei Abschnitte des Notrufs zusammengezählt.\nDie Abschnittszeiten gibt es nur für den aktuellsten Monat der Quelle, bei einem eingeschränkten Zeitraum können sie fehlen.",
		"attekintes.kpiWorst": "Längste Wartezeit",
		"attekintes.kpiWorstFoot": "Region {region}, {prio}-Fälle",
		"attekintes.kpiWorstTip":
			"{month}: der höchste {metric}-Wert in der regionalen Aufteilung.\n{calc}: der größte Wert aus den angezeigten Regionen und Dringlichkeitsstufen.\nIn dieser Kombination aus Region und Stufe wartete jeder zehnte Fall noch länger.",

		"attekintes.lineTitle": "Entwicklung der P1-Ausrückzeit · {area}",
		"attekintes.lineSub":
			"{period} · gemessen ab dem Beginn des Notrufs, die gestrichelte Linie markiert 15 Minuten",
		"attekintes.lineTip":
			"{period}: die Ausrückzeit der schwersten Fälle, also der P1-Fälle.\n{median}: {medianDesc}.\n{p90}: {p90Desc}.",
		"attekintes.lineEmpty": "P1-Ausrückzeit",
		"attekintes.line15": "15 Minuten",
		"attekintes.axisMinutes": "{v} Min",

		"attekintes.mixTitle": "Verteilung der Fälle",
		"attekintes.mixSub": "{month} · {where}",
		"attekintes.mixTip":
			"{month}: der Anteil der vier Dringlichkeitsstufen.\nP1: {p1}. P2: {p2}.\nP3: {p3}. P4: {p4}.",

		"attekintes.factsTitle": "Wissenswertes",
		"attekintes.factsSub": "Was die Zahlen des gewählten Zeitraums zeigen: {period}",
		"attekintes.factsTip":
			"Diese Sätze entstehen aus den Daten des gewählten Zeitraums.\nEin anderer Zeitraum kann andere Zusammenhänge zeigen.\nWo die Daten nicht ausreichen, entfällt der jeweilige Satz.",
		"attekintes.factYoyBetter":
			"Innerhalb eines Jahres hat sich der Durchschnitt der monatlichen {metric}-Werte der <strong>{prio}</strong>-Fälle am stärksten verbessert: {delta} ({pct}) gegenüber den gleichen Monaten des Vorjahres, auf Basis von {n} Monatspaaren.",
		"attekintes.factYoyWorse":
			"Innerhalb eines Jahres hat sich der Durchschnitt der monatlichen {metric}-Werte der <strong>{prio}</strong>-Fälle am stärksten verschlechtert: {delta} ({pct}) gegenüber den gleichen Monaten des Vorjahres, auf Basis von {n} Monatspaaren.",
		"attekintes.factTravel":
			"{month}: von der gesamten Ausrückzeit der P1-Fälle {where} entfallen im Durchschnitt <strong>{travel}</strong> auf Alarmierung und Anfahrt, der Rest auf die Bearbeitung des Notrufs. Die Abschnittszeiten gibt es nur für diesen einen Monat.",
		"attekintes.factBand":
			"{month}: so viele P1-Fälle wurden innerhalb von 15 Minuten erreicht: <strong>{band}</strong>. Der genaue Anteil lässt sich aus den drei Perzentilen nur als Spanne schätzen.",
		"attekintes.factSpread":
			"{month}: zwischen dem P1-Median der schnellsten und der langsamsten Region liegen <strong>{gap}</strong>, {best} und {worst}.",
		"attekintes.factNone":
			"Für diesen Zeitraum gibt es derzeit keinen Zusammenhang, der sich hervorheben ließe.",

		"attekintes.tableTitle": "Monatsüberblick: {month}",
		"attekintes.tableSub":
			"Landesweite Werte nach Dringlichkeitsstufe, in Klammern die Veränderung gegenüber dem Vormonat · Zeitraum: {period}",
		"attekintes.tableSubNoPrev":
			"Landesweite Werte nach Dringlichkeitsstufe, ohne Vergleich mit dem Vormonat · Zeitraum: {period}",
		"attekintes.tableTip":
			"{month}: die landesweiten Ausrückzeiten des letzten Monats im Zeitraum, für alle vier Dringlichkeitsstufen.\nDer Wert in Klammern ist die Veränderung gegenüber dem Vormonat, in Minuten.\nGrün steht für eine Verbesserung, also ein schnelleres Eintreffen, Rot für das Gegenteil.",
		"attekintes.tableEmpty": "Monatsüberblick",
		"attekintes.colPrio": "Dringlichkeitsstufe",
		"attekintes.colCases": "Fallzahl",
	},
};
