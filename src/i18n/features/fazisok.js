export default {
	hu: {
		"fazisok.outOfRangeTitle": "A szakaszbontás nem esik a kiválasztott időszakba",
		"fazisok.outOfRangeMsg":
			"A forrás a hívás szakaszait csak a legfrissebb hónapra teszi közzé, ez most {month}. A kiválasztott időszak viszont ez: {from} - {to}.",
		"fazisok.outOfRangeHint":
			"Bővítsd az időszakot úgy, hogy {month} is beleessen, és a szakaszok újra megjelennek. A szakaszok leírása lentebb így is elolvasható.",
		"fazisok.missingTitle": "A szakaszok adatai hiányoznak",
		"fazisok.missingMsg": "A hívás szakaszainak adatai most hiányoznak a forrásból.",
		"fazisok.missingHint": "A szakaszok leírása lentebb így is elolvasható.",

		"fazisok.avg": "Átlag",
		"fazisok.shareFoot": "A teljes idő {pct}-a",
		"fazisok.phaseTip":
			"{label}.\n{calc}: a szakasz átlagideje, P1 esetek, {area}, {month}.\nA teljes idő a négy szakasz átlagának összege.",
		"fazisok.totalLabel": "Teljes idő",
		"fazisok.totalFoot": "Átlag · {cases} · P1 · {area}",
		"fazisok.totalFootNoCases": "Átlag · P1 esetek · {area}",
		"fazisok.totalTip":
			"A segélyhívás indításától a helyszínre érkezésig eltelt idő.\n{calc}: a négy szakasz átlagideje összeadva.\nAz átlagot a kiugróan hosszú esetek felfelé húzhatják.",
		"fazisok.totalSourceTip": "A forrás közvetlenül is közöl teljes átlagidőt, az {value}.",

		"fazisok.detailTitle": "A szakaszok ideje részletesen",
		"fazisok.detailSub":
			"{month} · P1 esetek · {area} · a forrás a mediánt, a P75-öt és a P90-et is közli, a hivatalos felület viszont csak az átlagot jeleníti meg",
		"fazisok.detailTip":
			"A négy szakasz ideje négyféle mutatóval.\nA medián, a P75 és a P90 azt mutatja, mennyire szórnak az esetek.\n{calc}: a percentiliseket szakaszonként nem lehet összeadni, csak az átlagok adhatók össze teljes idővé.",
		"fazisok.shareTitle": "A szakaszok aránya",
		"fazisok.shareSub": "{month} · P1 esetek · {area}",
		"fazisok.shareTip":
			"Melyik szakasz mekkora részét adja a teljes időnek.\n{calc}: a szakasz átlagideje osztva a négy szakasz átlagidejének összegével.",

		"fazisok.explainTitle": "Mi történik a hívás alatt?",
		"fazisok.explainSub":
			"A segélyhívástól a helyszínre érkezésig négy szakasz követi egymást · {month}",
		"fazisok.explainSubPlain": "A segélyhívástól a helyszínre érkezésig négy szakasz követi egymást",
		"fazisok.explainTip":
			"A segélyhívás négy szakasza a hívástól a helyszínre érkezésig.\n{calc}: a szakaszok átlagideje összeadva adja ki a teljes időt.\nA forrás ezt csak a P1 esetekre és csak országosan közli.",
		"fazisok.stepNo": "{n}.",
		"fazisok.stepAvg": "Átlagosan {value}.",
		"fazisok.factSplit":
			"A hívás feldolgozása (az első három szakasz együtt) átlagosan {dispatch}, a riasztás és a helyszínre vonulás {travel}.",
		"fazisok.factTail":
			"A hosszú várakozások nagyrészt a vonulásból jönnek: a leglassabb esetekben (P90) a vonulás {travel} volt, a másik három szakasz közül egyik sem volt hosszabb ennél: {other}.",
		"fazisok.factTotalGap":
			"A négy szakasz átlagának összege {sum}, a forrás által közvetlenül közölt teljes átlagidő {total}, a kettő eltérése {diff}. Ez nagyobb, mint amennyit a kerekítés okozhat, tehát a négy szakasz nem fedi le hézagmentesen a teljes időt.",
		"fazisok.factScope":
			"Ezek az adatok csak a legsúlyosabb (P1) esetekre és csak {area} érhetők el, ráadásul egyetlen hónapra: {month}.",
		"fazisok.factScopePlain":
			"Ezek az adatok csak a legsúlyosabb (P1) esetekre, csak {area} és mindig csak egyetlen hónapra érhetők el.",

	},

	en: {
		"fazisok.outOfRangeTitle": "The phase breakdown falls outside the selected period",
		"fazisok.outOfRangeMsg":
			"The source publishes the phases of a call only for the most recent month, currently {month}. The selected period is this: {from} - {to}.",
		"fazisok.outOfRangeHint":
			"Widen the period so that it includes {month} and the phases will appear again. The description of the phases below can be read either way.",
		"fazisok.missingTitle": "The phase data is missing",
		"fazisok.missingMsg": "The data on the phases of the call is currently missing from the source.",
		"fazisok.missingHint": "The description of the phases below can be read either way.",

		"fazisok.avg": "Average",
		"fazisok.shareFoot": "{pct} of the total time",
		"fazisok.phaseTip":
			"{label}.\n{calc}: the average time of this phase, P1 cases, {area}, {month}.\nThe total time is the sum of the four phase averages.",
		"fazisok.totalLabel": "Total time",
		"fazisok.totalFoot": "Average · {cases} · P1 · {area}",
		"fazisok.totalFootNoCases": "Average · P1 cases · {area}",
		"fazisok.totalTip":
			"The time from the start of the emergency call until arrival at the scene.\n{calc}: the average times of the four phases added together.\nUnusually long cases can pull the average upwards.",
		"fazisok.totalSourceTip":
			"The source also publishes a total average time directly, that one is {value}.",

		"fazisok.detailTitle": "Phase times in detail",
		"fazisok.detailSub":
			"{month} · P1 cases · {area} · the source also publishes the median, P75 and P90, but the official site displays the average only",
		"fazisok.detailTip":
			"The length of the four phases shown with four different measures.\nThe median, P75 and P90 show how widely the cases vary.\n{calc}: percentiles cannot be added up phase by phase, only the averages can be summed into a total time.",
		"fazisok.shareTitle": "Share of each phase",
		"fazisok.shareSub": "{month} · P1 cases · {area}",
		"fazisok.shareTip":
			"How much of the total time each phase accounts for.\n{calc}: the average time of the phase divided by the sum of the four phase averages.",

		"fazisok.explainTitle": "What happens during the call?",
		"fazisok.explainSub":
			"From the emergency call to arrival at the scene, four phases follow one another · {month}",
		"fazisok.explainSubPlain":
			"From the emergency call to arrival at the scene, four phases follow one another",
		"fazisok.explainTip":
			"The four phases of an emergency call, from the call to arrival at the scene.\n{calc}: the average times of the phases added together give the total time.\nThe source publishes this for P1 cases only and nationwide only.",
		"fazisok.stepNo": "{n}.",
		"fazisok.stepAvg": "On average {value}.",
		"fazisok.factSplit":
			"Handling the call (the first three phases together) takes {dispatch} on average, alerting and travelling to the scene {travel}.",
		"fazisok.factTail":
			"Long waits come mostly from the journey: in the slowest cases (P90) travelling took {travel}, while none of the other three phases lasted longer than this: {other}.",
		"fazisok.factTotalGap":
			"The sum of the four phase averages is {sum}, the total average time published directly by the source is {total}, the difference between the two is {diff}. That is more than rounding alone could cause, so the four phases do not cover the total time without a gap.",
		"fazisok.factScope":
			"These figures are available for the most serious (P1) cases only, {area} only, and for a single month at that: {month}.",
		"fazisok.factScopePlain":
			"These figures are available for the most serious (P1) cases only, {area} only, and always for a single month only.",

	},

	de: {
		"fazisok.outOfRangeTitle": "Die Abschnittsaufteilung liegt außerhalb des gewählten Zeitraums",
		"fazisok.outOfRangeMsg":
			"Die Quelle veröffentlicht die Abschnitte eines Notrufs nur für den jüngsten Monat, derzeit {month}. Der gewählte Zeitraum ist dagegen: {from} - {to}.",
		"fazisok.outOfRangeHint":
			"Erweitere den Zeitraum so, dass {month} darin enthalten ist, dann erscheinen die Abschnitte wieder. Die Beschreibung der Abschnitte unten lässt sich ohnehin lesen.",
		"fazisok.missingTitle": "Die Daten zu den Abschnitten fehlen",
		"fazisok.missingMsg": "Die Daten zu den Abschnitten des Notrufs fehlen derzeit in der Quelle.",
		"fazisok.missingHint": "Die Beschreibung der Abschnitte unten lässt sich ohnehin lesen.",

		"fazisok.avg": "Mittelwert",
		"fazisok.shareFoot": "{pct} der Gesamtzeit",
		"fazisok.phaseTip":
			"{label}.\n{calc}: die Durchschnittsdauer dieses Abschnitts, P1-Fälle, {area}, {month}.\nDie Gesamtzeit ist die Summe der vier Abschnittsmittelwerte.",
		"fazisok.totalLabel": "Gesamtzeit",
		"fazisok.totalFoot": "Mittelwert · {cases} · P1 · {area}",
		"fazisok.totalFootNoCases": "Mittelwert · P1-Fälle · {area}",
		"fazisok.totalTip":
			"Die Zeit vom Beginn des Notrufs bis zum Eintreffen am Einsatzort.\n{calc}: die Durchschnittsdauern der vier Abschnitte addiert.\nBesonders lange Fälle können den Mittelwert nach oben ziehen.",
		"fazisok.totalSourceTip":
			"Die Quelle weist auch direkt eine gesamte Durchschnittszeit aus, diese beträgt {value}.",

		"fazisok.detailTitle": "Die Dauer der Abschnitte im Detail",
		"fazisok.detailSub":
			"{month} · P1-Fälle · {area} · die Quelle veröffentlicht auch Median, P75 und P90, die offizielle Seite zeigt jedoch nur den Mittelwert",
		"fazisok.detailTip":
			"Die Dauer der vier Abschnitte mit vier verschiedenen Kennzahlen.\nMedian, P75 und P90 zeigen, wie stark die Fälle streuen.\n{calc}: Perzentile lassen sich nicht abschnittsweise addieren, nur die Mittelwerte ergeben zusammen die Gesamtzeit.",
		"fazisok.shareTitle": "Anteil der einzelnen Abschnitte",
		"fazisok.shareSub": "{month} · P1-Fälle · {area}",
		"fazisok.shareTip":
			"Welchen Anteil an der Gesamtzeit jeder Abschnitt ausmacht.\n{calc}: die Durchschnittsdauer des Abschnitts geteilt durch die Summe der vier Abschnittsmittelwerte.",

		"fazisok.explainTitle": "Was passiert während des Notrufs?",
		"fazisok.explainSub":
			"Vom Notruf bis zum Eintreffen am Einsatzort folgen vier Abschnitte aufeinander · {month}",
		"fazisok.explainSubPlain":
			"Vom Notruf bis zum Eintreffen am Einsatzort folgen vier Abschnitte aufeinander",
		"fazisok.explainTip":
			"Die vier Abschnitte eines Notrufs, vom Anruf bis zum Eintreffen am Einsatzort.\n{calc}: die Durchschnittsdauern der Abschnitte ergeben zusammen die Gesamtzeit.\nDie Quelle weist das nur für P1-Fälle und nur landesweit aus.",
		"fazisok.stepNo": "{n}.",
		"fazisok.stepAvg": "Im Durchschnitt {value}.",
		"fazisok.factSplit":
			"Die Bearbeitung des Notrufs (die ersten drei Abschnitte zusammen) dauert im Durchschnitt {dispatch}, Alarmierung und Anfahrt zum Einsatzort {travel}.",
		"fazisok.factTail":
			"Lange Wartezeiten entstehen vor allem durch die Anfahrt: in den langsamsten Fällen (P90) dauerte die Anfahrt {travel}, keiner der anderen drei Abschnitte dauerte länger als das: {other}.",
		"fazisok.factTotalGap":
			"Die Summe der vier Abschnittsmittelwerte beträgt {sum}, die von der Quelle direkt ausgewiesene gesamte Durchschnittszeit {total}, die Differenz zwischen beiden {diff}. Das ist mehr, als die Rundung allein verursachen könnte, die vier Abschnitte decken die Gesamtzeit also nicht lückenlos ab.",
		"fazisok.factScope":
			"Diese Zahlen gibt es nur für die schwersten Fälle (P1), nur {area} und dazu nur für einen einzigen Monat: {month}.",
		"fazisok.factScopePlain":
			"Diese Zahlen gibt es nur für die schwersten Fälle (P1), nur {area} und immer nur für einen einzigen Monat.",

	},
};
