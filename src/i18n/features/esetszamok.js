export default {
	hu: {
		"esetszamok.areaLabel": "Terület",

		"esetszamok.subRange": "{from} - {to} · {area}",
		"esetszamok.subOneMonth": "{month} · {area}",

		"esetszamok.kpiTotal": "Összes eset · {area}",
		"esetszamok.kpiTotalTip":
			"A P1-P4 mentési feladatok száma a kiválasztott területen, {month} hónapban.",
		"esetszamok.kpiTotalCalc": "a négy sürgősségi kategória esetszámának összege.",

		"esetszamok.kpiPerDay": "Napi átlag",
		"esetszamok.kpiPerDayFoot": "riasztás naponta ({month})",
		"esetszamok.kpiPerDayTip": "{month} esetszáma egy napra vetítve.",
		"esetszamok.kpiPerDayCalc": "a havi összes eset osztva a hónap napjainak számával.",
		"esetszamok.kpiPerDayNote": "A hónapok hossza eltér, ezért ez a tisztább összehasonlítás.",

		"esetszamok.kpiP1": "P1 arány",
		"esetszamok.kpiP1Tip": "A legsúlyosabb, azonnali életveszélyt jelentő esetek aránya {month} hónapban.",
		"esetszamok.kpiP1Calc": "a P1 esetek száma osztva az összes esettel.",

		"esetszamok.kpiYoy": "Év/év változás",
		"esetszamok.kpiYoyFoot": "{curr}, tavaly ugyanezekben a hónapokban {prev}",
		"esetszamok.kpiYoyNone": "Nincs összevethető tavalyi hónap",
		"esetszamok.kpiYoyTip":
			"A kiválasztott időszak hónapjainak esetszáma a tavalyi azonos hónapokhoz mérve.",
		"esetszamok.kpiYoyCalc":
			"csak azok a hónapok számítanak, amelyekhez van tavalyi pár, a változás százalékban.",
		"esetszamok.kpiYoyNote":
			"A több vagy kevesebb eset önmagában nem jó vagy rossz, a terhelést mutatja.",

		"esetszamok.monthlyTitle": "Havi esetszámok sürgősségi kategóriánként",
		"esetszamok.monthlyTip": "A havi esetszámok alakulása sürgősségi kategóriánként.",
		"esetszamok.monthlyTipHeight": "Az oszlop teljes magassága az adott hónap összes esete.",

		"esetszamok.perDayTitle": "Napi átlagos esetszám",
		"esetszamok.perDaySub": "Egy napra vetített havi esetszám · {area}",
		"esetszamok.perDayTooltip": "{n} naponta",
		"esetszamok.perDayTip": "Az egy napra jutó átlagos esetszám havonta.",

		"esetszamok.mixTitle": "Sürgősségi összetétel",
		"esetszamok.mixSub": "A kategóriák aránya havonta · {area}",
		"esetszamok.mixTip": "A négy sürgősségi kategória aránya havonta.",
		"esetszamok.mixCalc": "az adott kategória esetszáma osztva a havi összes esettel.",
		"esetszamok.mixNote": "Azt mutatja, eltolódik-e az esetek összetétele.",

		"esetszamok.bpTitle": "Budapest részesedése",
		"esetszamok.bpSub": "A budapesti esetek aránya az országos esetszámból",
		"esetszamok.bpTip": "Budapest részesedése az országos esetszámból havonta.",
		"esetszamok.bpCalc": "a budapesti esetszám osztva az országossal.",
		"esetszamok.bpNote": "Ez országos adat, a fenti területválasztó nem változtat rajta.",

		"esetszamok.tableTitle": "Esetszámok · {month}",
		"esetszamok.tableSub": "{area} · változás az előző hónaphoz képest",
		"esetszamok.tableSubNoPrev": "{area} · nincs előző hónap az időszakban",
		"esetszamok.tableTip": "{month} esetszámai sürgősségi kategóriánként, a kiválasztott területen.",
		"esetszamok.tableTipDelta": "A változás az előző hónaphoz mért különbség, darabszámban.",
		"esetszamok.colPrio": "Prioritás",
		"esetszamok.colCases": "Esetszám",
		"esetszamok.colMix": "Megoszlás",
		"esetszamok.colDelta": "Változás",
		"esetszamok.total": "Összesen",

		"esetszamok.segPrio": "Prioritás",
		"esetszamok.loadSegSub":
			"{prio}: {prioDesc}. A választás csak az alábbi szórásdiagramra hat.",
		"esetszamok.loadTitle": "Terhelés és kiérkezési idő · {prio}",
		"esetszamok.loadEmptyTitle": "Terhelés és kiérkezési idő",
		"esetszamok.loadVidekHint":
			"A vidéki kiérkezési idő nem számolható ki: a percentilisek nem vonhatók ki egymásból, ezért csak országos és budapesti idő létezik. A vidéki esetszám viszont igen, azt a fenti kártyák mutatják.",
		"esetszamok.loadSub":
			"Egy pont egy hónap: vízszintesen a havi összes eset, függőlegesen a {metric} kiérkezési idő · {area}",
		"esetszamok.loadXTitle": "Havi összes eset, minden prioritás együtt",
		"esetszamok.loadSeries": "{prio} kiérkezési idő",
		"esetszamok.loadTooltipX": "{month} · {cases}",
		"esetszamok.loadTip":
			"Minden pont egy hónap: az adott hónap összes esete, minden prioritással együtt, és ugyanannak a hónapnak a {metric} kiérkezési ideje.",
		"esetszamok.loadCalc":
			"a havi összes eset és a {prio} {metric} kiérkezési idő hónaponként párba állítva.",
		"esetszamok.loadNote":
			"Ha a pontok jobbra felfelé rendeződnek, a nagyobb terhelés hosszabb kiérkezéssel jár együtt.",

		"esetszamok.corrTitle": "Együttmozgás a terheléssel",
		"esetszamok.corrSub": "Pearson-együttható {n} hónapból · {area}",
		"esetszamok.corrTip":
			"Az együttható azt méri, mennyire mozog együtt a havi összes esetszám és az adott prioritás kiérkezési ideje.",
		"esetszamok.corrTipScale":
			"Az 1-hez közeli érték együtt mozgást jelent, a nulla körüli azt, hogy egyenes irányú együttmozgás nincs köztük, a negatív pedig ellentétes irányt.",
		"esetszamok.corrTipWarn":
			"{n} hónap kevés az erős állításhoz: ez jelzés, nem bizonyíték, és az okot nem mutatja meg.",
	},

	en: {
		"esetszamok.areaLabel": "Area",

		"esetszamok.subRange": "{from} - {to} · {area}",
		"esetszamok.subOneMonth": "{month} · {area}",

		"esetszamok.kpiTotal": "All cases · {area}",
		"esetszamok.kpiTotalTip":
			"The number of P1 to P4 ambulance jobs in the selected area in {month}.",
		"esetszamok.kpiTotalCalc": "the cases of the four priority categories added up.",

		"esetszamok.kpiPerDay": "Daily average",
		"esetszamok.kpiPerDayFoot": "call-outs a day ({month})",
		"esetszamok.kpiPerDayTip": "The cases of {month} spread over the days of that month.",
		"esetszamok.kpiPerDayCalc": "the monthly total divided by the number of days in the month.",
		"esetszamok.kpiPerDayNote": "Months differ in length, so this is the cleaner comparison.",

		"esetszamok.kpiP1": "Share of P1",
		"esetszamok.kpiP1Tip":
			"The share of the most serious cases, those with an immediate danger to life, in {month}.",
		"esetszamok.kpiP1Calc": "the number of P1 cases divided by all cases.",

		"esetszamok.kpiYoy": "Year on year change",
		"esetszamok.kpiYoyFoot": "{curr}, against {prev} in the same months a year earlier",
		"esetszamok.kpiYoyNone": "No comparable months from last year",
		"esetszamok.kpiYoyTip":
			"The cases of the months in the selected period, measured against the same months a year earlier.",
		"esetszamok.kpiYoyCalc":
			"only months that have a counterpart a year earlier are counted, the change is given as a percentage.",
		"esetszamok.kpiYoyNote":
			"More or fewer cases is not in itself good or bad, it shows the load on the service.",

		"esetszamok.monthlyTitle": "Monthly cases by priority category",
		"esetszamok.monthlyTip": "How the monthly case numbers develop in each priority category.",
		"esetszamok.monthlyTipHeight": "The full height of a column is the total for that month.",

		"esetszamok.perDayTitle": "Average cases per day",
		"esetszamok.perDaySub": "The monthly total spread over the days of the month · {area}",
		"esetszamok.perDayTooltip": "{n} a day",
		"esetszamok.perDayTip": "The average number of cases per day, month by month.",

		"esetszamok.mixTitle": "Priority mix",
		"esetszamok.mixSub": "The share of each category by month · {area}",
		"esetszamok.mixTip": "The share of the four priority categories in each month.",
		"esetszamok.mixCalc": "the cases of that category divided by the monthly total.",
		"esetszamok.mixNote": "It shows whether the make up of the cases is shifting.",

		"esetszamok.bpTitle": "Budapest share",
		"esetszamok.bpSub": "Budapest cases as a share of the nationwide total",
		"esetszamok.bpTip": "The share of Budapest in the nationwide case numbers, month by month.",
		"esetszamok.bpCalc": "the Budapest cases divided by the nationwide ones.",
		"esetszamok.bpNote": "This is a nationwide figure, the area selector above does not change it.",

		"esetszamok.tableTitle": "Cases · {month}",
		"esetszamok.tableSub": "{area} · change compared with the previous month",
		"esetszamok.tableSubNoPrev": "{area} · no previous month within the period",
		"esetszamok.tableTip": "The cases of {month} by priority category, in the selected area.",
		"esetszamok.tableTipDelta":
			"The change is the difference from the previous month, counted in cases.",
		"esetszamok.colPrio": "Priority",
		"esetszamok.colCases": "Cases",
		"esetszamok.colMix": "Share",
		"esetszamok.colDelta": "Change",
		"esetszamok.total": "Total",

		"esetszamok.segPrio": "Priority",
		"esetszamok.loadSegSub":
			"{prio}: {prioDesc}. The choice only affects the scatter chart below.",
		"esetszamok.loadTitle": "Load and response time · {prio}",
		"esetszamok.loadEmptyTitle": "Load and response time",
		"esetszamok.loadVidekHint":
			"Response times outside Budapest cannot be worked out: percentiles cannot be subtracted from one another, so only nationwide and Budapest times exist. Case numbers outside Budapest can be, and the cards above show them.",
		"esetszamok.loadSub":
			"One dot is one month: the total cases of the month across, the {metric} response time up · {area}",
		"esetszamok.loadXTitle": "Monthly total cases, all priorities together",
		"esetszamok.loadSeries": "{prio} response time",
		"esetszamok.loadTooltipX": "{month} · {cases}",
		"esetszamok.loadTip":
			"Every dot is one month: the total cases of that month across all priorities, and the {metric} response time of the same month.",
		"esetszamok.loadCalc":
			"the monthly total paired with the {prio} {metric} response time, month by month.",
		"esetszamok.loadNote":
			"If the dots line up towards the upper right, a heavier load goes together with longer response times.",

		"esetszamok.corrTitle": "Movement together with the load",
		"esetszamok.corrSub": "Pearson coefficient from {n} months · {area}",
		"esetszamok.corrTip":
			"The coefficient measures how closely the monthly total case numbers and the response time of the given priority move together.",
		"esetszamok.corrTipScale":
			"A value near 1 means they move together, a value around zero means there is no straight line movement together, a negative one means opposite directions.",
		"esetszamok.corrTipWarn":
			"{n} months is too few for a strong claim: this is a signal, not proof, and it says nothing about the cause.",
	},

	de: {
		"esetszamok.areaLabel": "Gebiet",

		"esetszamok.subRange": "{from} - {to} · {area}",
		"esetszamok.subOneMonth": "{month} · {area}",

		"esetszamok.kpiTotal": "Fälle insgesamt · {area}",
		"esetszamok.kpiTotalTip":
			"Die Zahl der Rettungseinsätze P1 bis P4 im gewählten Gebiet im Monat {month}.",
		"esetszamok.kpiTotalCalc": "die Summe der Fälle aus den vier Dringlichkeitsstufen.",

		"esetszamok.kpiPerDay": "Tagesdurchschnitt",
		"esetszamok.kpiPerDayFoot": "Einsätze pro Tag ({month})",
		"esetszamok.kpiPerDayTip": "Die Fälle von {month}, verteilt auf die Tage dieses Monats.",
		"esetszamok.kpiPerDayCalc": "die Monatssumme geteilt durch die Zahl der Tage des Monats.",
		"esetszamok.kpiPerDayNote":
			"Die Monate sind unterschiedlich lang, daher ist das der sauberere Vergleich.",

		"esetszamok.kpiP1": "P1-Anteil",
		"esetszamok.kpiP1Tip":
			"Der Anteil der schwersten Fälle mit unmittelbarer Lebensgefahr im Monat {month}.",
		"esetszamok.kpiP1Calc": "die Zahl der P1-Fälle geteilt durch alle Fälle.",

		"esetszamok.kpiYoy": "Veränderung zum Vorjahr",
		"esetszamok.kpiYoyFoot": "{curr}, im Vorjahr in denselben Monaten {prev}",
		"esetszamok.kpiYoyNone": "Keine vergleichbaren Monate aus dem Vorjahr",
		"esetszamok.kpiYoyTip":
			"Die Fälle der Monate im gewählten Zeitraum, verglichen mit denselben Monaten des Vorjahres.",
		"esetszamok.kpiYoyCalc":
			"gezählt werden nur Monate mit einem Gegenstück im Vorjahr, die Veränderung erscheint in Prozent.",
		"esetszamok.kpiYoyNote":
			"Mehr oder weniger Fälle sind für sich genommen weder gut noch schlecht, sie zeigen die Belastung.",

		"esetszamok.monthlyTitle": "Monatliche Fallzahlen nach Dringlichkeitsstufe",
		"esetszamok.monthlyTip":
			"Die Entwicklung der monatlichen Fallzahlen in den einzelnen Dringlichkeitsstufen.",
		"esetszamok.monthlyTipHeight": "Die volle Höhe einer Säule ist die Gesamtzahl des Monats.",

		"esetszamok.perDayTitle": "Durchschnittliche Fallzahl pro Tag",
		"esetszamok.perDaySub": "Die Monatssumme auf die Tage des Monats verteilt · {area}",
		"esetszamok.perDayTooltip": "{n} pro Tag",
		"esetszamok.perDayTip": "Die durchschnittliche Zahl der Fälle pro Tag, Monat für Monat.",

		"esetszamok.mixTitle": "Zusammensetzung nach Dringlichkeit",
		"esetszamok.mixSub": "Der Anteil der einzelnen Stufen je Monat · {area}",
		"esetszamok.mixTip": "Der Anteil der vier Dringlichkeitsstufen in jedem Monat.",
		"esetszamok.mixCalc": "die Fälle der jeweiligen Stufe geteilt durch die Monatssumme.",
		"esetszamok.mixNote": "Sie zeigt, ob sich die Zusammensetzung der Fälle verschiebt.",

		"esetszamok.bpTitle": "Anteil von Budapest",
		"esetszamok.bpSub": "Die Budapester Fälle als Anteil an der landesweiten Fallzahl",
		"esetszamok.bpTip": "Der Anteil von Budapest an den landesweiten Fallzahlen, Monat für Monat.",
		"esetszamok.bpCalc": "die Budapester Fälle geteilt durch die landesweiten.",
		"esetszamok.bpNote":
			"Das ist eine landesweite Zahl, die Gebietsauswahl oben ändert daran nichts.",

		"esetszamok.tableTitle": "Fallzahlen · {month}",
		"esetszamok.tableSub": "{area} · Veränderung gegenüber dem Vormonat",
		"esetszamok.tableSubNoPrev": "{area} · kein Vormonat im Zeitraum",
		"esetszamok.tableTip":
			"Die Fälle von {month} nach Dringlichkeitsstufe, im gewählten Gebiet.",
		"esetszamok.tableTipDelta":
			"Die Veränderung ist der Unterschied zum Vormonat, gezählt in Fällen.",
		"esetszamok.colPrio": "Dringlichkeit",
		"esetszamok.colCases": "Fallzahl",
		"esetszamok.colMix": "Anteil",
		"esetszamok.colDelta": "Veränderung",
		"esetszamok.total": "Insgesamt",

		"esetszamok.segPrio": "Dringlichkeit",
		"esetszamok.loadSegSub":
			"{prio}: {prioDesc}. Die Auswahl wirkt nur auf das Streudiagramm unten.",
		"esetszamok.loadTitle": "Belastung und Ausrückzeit · {prio}",
		"esetszamok.loadEmptyTitle": "Belastung und Ausrückzeit",
		"esetszamok.loadVidekHint":
			"Die Ausrückzeit außerhalb von Budapest lässt sich nicht berechnen: Perzentile können nicht voneinander abgezogen werden, daher gibt es nur landesweite und Budapester Zeiten. Die Fallzahl außerhalb von Budapest dagegen schon, sie steht in den Karten oben.",
		"esetszamok.loadSub":
			"Ein Punkt ist ein Monat: waagerecht die gesamte Fallzahl des Monats, senkrecht die Ausrückzeit ({metric}) · {area}",
		"esetszamok.loadXTitle": "Fallzahl pro Monat, alle Stufen zusammen",
		"esetszamok.loadSeries": "Ausrückzeit {prio}",
		"esetszamok.loadTooltipX": "{month} · {cases}",
		"esetszamok.loadTip":
			"Jeder Punkt ist ein Monat: die gesamte Fallzahl dieses Monats über alle Stufen und die Ausrückzeit ({metric}) desselben Monats.",
		"esetszamok.loadCalc":
			"die Monatssumme und die Ausrückzeit {prio} ({metric}), Monat für Monat einander zugeordnet.",
		"esetszamok.loadNote":
			"Ordnen sich die Punkte nach rechts oben, geht eine höhere Belastung mit längerer Ausrückzeit einher.",

		"esetszamok.corrTitle": "Gleichlauf mit der Belastung",
		"esetszamok.corrSub": "Pearson-Koeffizient aus {n} Monaten · {area}",
		"esetszamok.corrTip":
			"Der Koeffizient misst, wie stark die monatliche Gesamtfallzahl und die Ausrückzeit der jeweiligen Stufe gemeinsam schwanken.",
		"esetszamok.corrTipScale":
			"Ein Wert nahe 1 bedeutet Gleichlauf, ein Wert um null, dass kein geradliniger Gleichlauf besteht, ein negativer Wert eine gegenläufige Richtung.",
		"esetszamok.corrTipWarn":
			"{n} Monate sind zu wenig für eine starke Aussage: das ist ein Hinweis, kein Beweis, und über die Ursache sagt es nichts.",
	},
};
