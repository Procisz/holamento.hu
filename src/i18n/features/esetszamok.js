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
	},
};
