export default {
	hu: {
		"bontas.segPrio": "Prioritás",
		"bontas.segMetric": "Mutató",

		"bontas.kpiFastLabel": "Legrövidebb hívásfeldolgozás · {prio}",
		"bontas.kpiFastTip":
			"Ebben a régióban telt el a legkevesebb idő a segélyhívás és a mentőegység riasztása között.\n{calc}: a segélyhívástól mért érték mínusz a riasztástól mért érték, {month} hónapra.",
		"bontas.kpiSlowLabel": "Leghosszabb hívásfeldolgozás · {prio}",
		"bontas.kpiSlowTip":
			"Ebben a régióban telt el a legtöbb idő a segélyhívás és a mentőegység riasztása között.\n{calc}: a segélyhívástól mért érték mínusz a riasztástól mért érték, {month} hónapra.",
		"bontas.kpiShareLabel": "A hívásfeldolgozás aránya",
		"bontas.kpiShareFoot": "{min} a hét régió átlagában",
		"bontas.kpiShareTip":
			"A teljes kiérkezési időnek ekkora része telik el még a mentőegység riasztása előtt.\n{calc}: a hét régió arányainak átlaga, {month} hónapra.",
		"bontas.kpiGapLabel": "Régiós különbség",
		"bontas.kpiGapFoot": "{fastest} és {slowest} között",
		"bontas.kpiGapTip":
			"Mennyivel tart tovább a hívásfeldolgozás a leglassabb régióban a leggyorsabbhoz képest.\n{calc}: a legnagyobb régiós érték mínusz a legkisebb, {month} hónapra.",

		"bontas.stackTitle": "Hol telik el az idő? · {prio} {metric}",
		"bontas.stackTitleShort": "Hol telik el az idő?",
		"bontas.stackSub":
			"{month} · a teljes kiérkezési idő két részre bontva, régiónként",
		"bontas.stackTip":
			"A forrás kétféle mérési alapon közli a régiós kiérkezést: a segélyhívás indításától és a mentőegység riasztásától.\n{calc}: a sötétebb rész a kettő különbsége, a világosabb a riasztástól mért idő.\nEgyütt a teljes kiérkezési időt adják ki.",
		"bontas.seriesBefore": "Riasztásig",
		"bontas.seriesAfter": "Riasztástól kiérkezésig",

		"bontas.shareTitle": "A hívásfeldolgozás aránya · {prio} {metric}",
		"bontas.shareTitleShort": "A hívásfeldolgozás aránya",
		"bontas.shareSub":
			"{month} · a teljes kiérkezési idő hányad része telik el a riasztás előtt",
		"bontas.shareTip":
			"Minél magasabb az oszlop, annál nagyobb részt vesz ki a hívásfeldolgozás a teljes várakozásból.\n{calc}: a különbség osztva a segélyhívástól mért teljes idővel.",

		"bontas.methodTitle": "Hogyan jön ki ez a szám?",
		"bontas.methodTip":
			"A fülön látható hívásfeldolgozási idő nem közvetlenül közölt adat, hanem két közölt adat különbsége.\n{calc}: a segélyhívástól mért régiós érték mínusz a riasztástól mért régiós érték.\nAz alábbi pontok végigveszik, mit jelent ez és hol vannak a határai.",
		"bontas.method1":
			"A forrás a régiós kiérkezést kétféle kezdőponttal is közli: az egyik a segélyhívás indításától mér, a másik a mentőegység riasztásától.",
		"bontas.method2":
			"A kettő különbsége az az idő, ami a hívásfogadással, az esetlap megnyitásával, a kikérdezéssel és a sürgősségi besorolással telik el.",
		"bontas.method3":
			"A percentilisek nem adódnak össze, ezért a különbség a két mérés eltolódását mutatja, nem a hívásfeldolgozás önálló eloszlását. A mediánnál ez jó közelítés, a P90-nél óvatosabban kezelendő.",
		"bontas.method4":
			"A hivatalos oldal betölti ezt az adatot, de sehol nem jeleníti meg. Az itt látható bontás a nyers forrásból készül.",

		"bontas.tableTitle": "Régiók és prioritások · {metric}",
		"bontas.tableTitleShort": "Régiók és prioritások",
		"bontas.tableSub":
			"{month} · mind a hét régió és mind a négy prioritás, a két mérési alap egymás mellett",
		"bontas.tableTip":
			"Minden régió és prioritás párosa egy sorban.\n{calc}: a különbség oszlop a segélyhívástól mért és a riasztástól mért érték eltérése.\nAz arány azt mutatja, hogy ez a teljes időnek hányad része.",
		"bontas.colRegion": "Régió",
		"bontas.colPrio": "Prioritás",
		"bontas.colTotal": "Segélyhívástól",
		"bontas.colFromAlarm": "Riasztástól",
		"bontas.colBefore": "Különbség",
		"bontas.colShare": "Arány",

		"bontas.emptyTitle": "Nincs kétféle mérési alap az időszakban",
		"bontas.emptyHint":
			"Ez a bontás egyetlen hónapra érhető el, és az nem esik a kiválasztott időszakba. Bővítsd az időszakot.",
		"bontas.emptyMissing":
			"A forrás ebben a közlésben nem adta meg a riasztástól mért régiós értékeket.",
	},

	en: {
		"bontas.segPrio": "Priority",
		"bontas.segMetric": "Metric",

		"bontas.kpiFastLabel": "Shortest call handling · {prio}",
		"bontas.kpiFastTip":
			"This region had the least time between the emergency call and the alerting of the ambulance.\n{calc}: the value measured from the call minus the value measured from the alert, for {month}.",
		"bontas.kpiSlowLabel": "Longest call handling · {prio}",
		"bontas.kpiSlowTip":
			"This region had the most time between the emergency call and the alerting of the ambulance.\n{calc}: the value measured from the call minus the value measured from the alert, for {month}.",
		"bontas.kpiShareLabel": "Share of call handling",
		"bontas.kpiShareFoot": "{min} on average across the seven regions",
		"bontas.kpiShareTip":
			"This much of the total response time passes before the ambulance is even alerted.\n{calc}: the average of the seven regional shares, for {month}.",
		"bontas.kpiGapLabel": "Regional difference",
		"bontas.kpiGapFoot": "between {fastest} and {slowest}",
		"bontas.kpiGapTip":
			"How much longer call handling takes in the slowest region than in the fastest.\n{calc}: the largest regional value minus the smallest, for {month}.",

		"bontas.stackTitle": "Where does the time go? · {prio} {metric}",
		"bontas.stackTitleShort": "Where does the time go?",
		"bontas.stackSub":
			"{month} · the total response time split in two, by region",
		"bontas.stackTip":
			"The source publishes regional response times on two measurement bases: from the start of the emergency call and from the alerting of the ambulance.\n{calc}: the darker part is the difference between the two, the lighter one is the time measured from the alert.\nTogether they make up the total response time.",
		"bontas.seriesBefore": "Until the alert",
		"bontas.seriesAfter": "From the alert to arrival",

		"bontas.shareTitle": "Share of call handling · {prio} {metric}",
		"bontas.shareTitleShort": "Share of call handling",
		"bontas.shareSub":
			"{month} · what fraction of the total response time passes before the alert",
		"bontas.shareTip":
			"The taller the bar, the larger the part call handling takes out of the total wait.\n{calc}: the difference divided by the total time measured from the call.",

		"bontas.methodTitle": "How is this number derived?",
		"bontas.methodTip":
			"The call handling time shown on this tab is not published directly, it is the difference between two published figures.\n{calc}: the regional value measured from the call minus the regional value measured from the alert.\nThe points below go through what that means and where its limits are.",
		"bontas.method1":
			"The source publishes regional response times with two different starting points: one measures from the start of the emergency call, the other from the alerting of the ambulance.",
		"bontas.method2":
			"The difference between the two is the time spent on picking up the call, opening the case record, questioning the caller and assigning a priority.",
		"bontas.method3":
			"Percentiles are not additive, so the difference shows the shift between the two measurements, not the distribution of call handling on its own. For the median this is a good approximation, for the P90 it should be treated with more care.",
		"bontas.method4":
			"The official site loads this data but never displays it anywhere. The breakdown shown here is built from the raw source.",

		"bontas.tableTitle": "Regions and priorities · {metric}",
		"bontas.tableTitleShort": "Regions and priorities",
		"bontas.tableSub":
			"{month} · all seven regions and all four priorities, the two measurement bases side by side",
		"bontas.tableTip":
			"Every region and priority pair in one row.\n{calc}: the difference column is the gap between the value measured from the call and the value measured from the alert.\nThe share shows what fraction of the total time that is.",
		"bontas.colRegion": "Region",
		"bontas.colPrio": "Priority",
		"bontas.colTotal": "From the call",
		"bontas.colFromAlarm": "From the alert",
		"bontas.colBefore": "Difference",
		"bontas.colShare": "Share",

		"bontas.emptyTitle": "No second measurement basis within the period",
		"bontas.emptyHint":
			"This breakdown is available for a single month, and that month falls outside the selected period. Widen the period.",
		"bontas.emptyMissing":
			"In this release the source did not provide regional values measured from the alert.",
	},

	de: {
		"bontas.segPrio": "Dringlichkeitsstufe",
		"bontas.segMetric": "Kennzahl",

		"bontas.kpiFastLabel": "Kürzeste Anrufbearbeitung · {prio}",
		"bontas.kpiFastTip":
			"In dieser Region verging die wenigste Zeit zwischen dem Notruf und der Alarmierung des Rettungsmittels.\n{calc}: der ab dem Notruf gemessene Wert minus der ab der Alarmierung gemessene Wert, für {month}.",
		"bontas.kpiSlowLabel": "Längste Anrufbearbeitung · {prio}",
		"bontas.kpiSlowTip":
			"In dieser Region verging die meiste Zeit zwischen dem Notruf und der Alarmierung des Rettungsmittels.\n{calc}: der ab dem Notruf gemessene Wert minus der ab der Alarmierung gemessene Wert, für {month}.",
		"bontas.kpiShareLabel": "Anteil der Anrufbearbeitung",
		"bontas.kpiShareFoot": "{min} im Schnitt der sieben Regionen",
		"bontas.kpiShareTip":
			"So viel der gesamten Ausrückzeit vergeht, bevor das Rettungsmittel überhaupt alarmiert wird.\n{calc}: der Durchschnitt der sieben regionalen Anteile, für {month}.",
		"bontas.kpiGapLabel": "Regionaler Unterschied",
		"bontas.kpiGapFoot": "zwischen {fastest} und {slowest}",
		"bontas.kpiGapTip":
			"Um wie viel länger die Anrufbearbeitung in der langsamsten Region dauert als in der schnellsten.\n{calc}: der größte regionale Wert minus der kleinste, für {month}.",

		"bontas.stackTitle": "Wo vergeht die Zeit? · {prio} {metric}",
		"bontas.stackTitleShort": "Wo vergeht die Zeit?",
		"bontas.stackSub":
			"{month} · die gesamte Ausrückzeit in zwei Teile zerlegt, nach Region",
		"bontas.stackTip":
			"Die Quelle veröffentlicht die regionale Ausrückzeit auf zwei Messgrundlagen: ab dem Beginn des Notrufs und ab der Alarmierung des Rettungsmittels.\n{calc}: der dunklere Teil ist die Differenz zwischen beiden, der hellere die ab der Alarmierung gemessene Zeit.\nZusammen ergeben sie die gesamte Ausrückzeit.",
		"bontas.seriesBefore": "Bis zur Alarmierung",
		"bontas.seriesAfter": "Von der Alarmierung bis zum Eintreffen",

		"bontas.shareTitle": "Anteil der Anrufbearbeitung · {prio} {metric}",
		"bontas.shareTitleShort": "Anteil der Anrufbearbeitung",
		"bontas.shareSub":
			"{month} · welcher Teil der gesamten Ausrückzeit vor der Alarmierung vergeht",
		"bontas.shareTip":
			"Je höher der Balken, desto größer der Anteil der Anrufbearbeitung an der gesamten Wartezeit.\n{calc}: die Differenz geteilt durch die ab dem Notruf gemessene Gesamtzeit.",

		"bontas.methodTitle": "Wie entsteht diese Zahl?",
		"bontas.methodTip":
			"Die auf diesem Tab gezeigte Anrufbearbeitungszeit wird nicht direkt veröffentlicht, sie ist die Differenz zweier veröffentlichter Werte.\n{calc}: der regionale Wert ab dem Notruf minus der regionale Wert ab der Alarmierung.\nDie Punkte unten erklären, was das bedeutet und wo die Grenzen liegen.",
		"bontas.method1":
			"Die Quelle veröffentlicht die regionale Ausrückzeit mit zwei verschiedenen Startpunkten: einer misst ab dem Beginn des Notrufs, der andere ab der Alarmierung des Rettungsmittels.",
		"bontas.method2":
			"Die Differenz zwischen beiden ist die Zeit für die Anrufannahme, das Öffnen des Einsatzdatensatzes, die Abfrage und die Einstufung nach Dringlichkeit.",
		"bontas.method3":
			"Perzentile lassen sich nicht addieren, daher zeigt die Differenz die Verschiebung zwischen den beiden Messungen, nicht die eigenständige Verteilung der Anrufbearbeitung. Beim Median ist das eine gute Näherung, beim P90 ist Vorsicht geboten.",
		"bontas.method4":
			"Die offizielle Seite lädt diese Daten, zeigt sie aber nirgends an. Die hier sichtbare Aufteilung entsteht aus der Rohquelle.",

		"bontas.tableTitle": "Regionen und Dringlichkeitsstufen · {metric}",
		"bontas.tableTitleShort": "Regionen und Dringlichkeitsstufen",
		"bontas.tableSub":
			"{month} · alle sieben Regionen und alle vier Stufen, die beiden Messgrundlagen nebeneinander",
		"bontas.tableTip":
			"Jedes Paar aus Region und Dringlichkeitsstufe in einer Zeile.\n{calc}: die Spalte Differenz ist der Abstand zwischen dem ab dem Notruf und dem ab der Alarmierung gemessenen Wert.\nDer Anteil zeigt, welcher Bruchteil der Gesamtzeit das ist.",
		"bontas.colRegion": "Region",
		"bontas.colPrio": "Stufe",
		"bontas.colTotal": "Ab dem Notruf",
		"bontas.colFromAlarm": "Ab der Alarmierung",
		"bontas.colBefore": "Differenz",
		"bontas.colShare": "Anteil",

		"bontas.emptyTitle": "Keine zweite Messgrundlage im Zeitraum",
		"bontas.emptyHint":
			"Diese Aufteilung liegt nur für einen Monat vor, und dieser fällt nicht in den gewählten Zeitraum. Erweitere den Zeitraum.",
		"bontas.emptyMissing":
			"In dieser Veröffentlichung hat die Quelle keine ab der Alarmierung gemessenen regionalen Werte angegeben.",
	},
};
