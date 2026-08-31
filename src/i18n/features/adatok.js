export default {
	hu: {
		"adatok.about.title": "Mi ez az oldal?",
		"adatok.about.intro":
			"Az oldal célja, hogy átfogó statisztikai adatokat mutasson az OMSZ mentőinek kiérkezési idejéről.",
		"adatok.about.independent": "Az oldal {not} tartozik az Országos Mentőszolgálathoz, az üzemeltetést nem ők végzik.",
		"adatok.about.notWord": "nem",
		"adatok.about.source":
			"Az oldalon megjelenő statisztikák és számok ugyanabból a publikus adatforrásból származnak, amely az OMSZ hivatalos oldalán is megtalálható: {link}. A holamento.hu nem „jobb”, és nem akar konkurálni az OMSZ-szel, csupán kiegészíti azt. Amennyiben a jövőben az OMSZ is ilyen részletességgel fogja feltárni az összefüggéseket, úgy a holamento.hu-ra már nem is lesz szükség.",
		"adatok.about.contact": "A projekt ingyenes és nyilvános, a forráskód mindenki számára elérhető: {code}. Mint mindenhol, úgy itt is előfordulhatnak hibák. Amennyiben szerinted valami nem az elvárt módon működik, vagy kérdésed van, írj ide: {mail}.",
		"adatok.about.code": "Fejlesztő vagy? Nyiss feature- vagy hibajegyet, járulj hozzá a projekt sikeréhez: {link}.",

		"adatok.terms.title": "Mit jelentenek a számok?",
		"adatok.terms.responseName": "Kiérkezési idő",
		"adatok.terms.responseDesc":
			"akkor indul, amikor valaki felhívja a 112-t, és akkor áll meg, amikor a mentő odaér a helyszínre",
		"adatok.terms.responseNote":
			"A telefonos beszélgetés ideje is beleszámít, tehát ez az a várakozás, amit a hívó ténylegesen végigél.",
		"adatok.terms.avgName": "Átlag",
		"adatok.terms.avgDesc":
			"az összes kiérkezési idő összege elosztva az esetek számával",
		"adatok.terms.avgNote":
			"Néhány nagyon hosszú eset is érezhetően felhúzza, ezért önmagában félrevezető tud lenni. Ezen az oldalon csak a hívás szakaszainál szerepel, mert szakaszokra bontva csak az átlagok adhatók össze.",
		"adatok.terms.medianDesc":
			"a sorba rendezett idők közül a középső: az esetek felénél ennyi időn belül kiért a mentő",
		"adatok.terms.medianNote":
			"A másik felénél ennél tovább tartott. A tipikus esetet jobban jellemzi, mint az átlag, mert a szélső értékek nem húzzák el.",
		"adatok.terms.pctName": "Percentilis",
		"adatok.terms.pctDesc":
			"azt mondja meg, hogy az esetek adott százalékához mennyi időn belül értek ki",
		"adatok.terms.pctNote":
			"A medián maga is percentilis, az 50., mert az esetek felét fedi le. Minél magasabb a percentilis, annál inkább a hosszú várakozásokról szól.",
		"adatok.terms.p75Desc":
			"az az idő, ami alatt száz esetből hetvenötnél kiért a mentő",
		"adatok.terms.p75Note": "A maradék huszonöt esetben ennél tovább tartott.",
		"adatok.terms.p90Desc":
			"az az idő, ami alatt száz esetből kilencvennél kiért a mentő",
		"adatok.terms.p90Note":
			"A maradék tíz eset ennél is tovább várt. Ez a szám a nehéz eseteket mutatja, nem a tipikusat.",
		"adatok.terms.lineName": "15 perces vonal",
		"adatok.terms.lineDesc": "a diagramokon látható szaggatott vonal",
		"adatok.terms.lineNote": "Nem előírás, csak könnyebb hozzá mérni a számokat.",

		"adatok.prio.title": "Mennyire sürgős az eset?",
		"adatok.prio.intro":
			"A mentőszolgálatnál már a telefonban eldöntik, mennyire sürgős a hívás. Ez azért fontos, mert a legsúlyosabb betegekhez kell leghamarabb kiérni.",
		"adatok.prio.exLabel": "Példa",
		"adatok.prio.kp1Label": "Kiemelt P1",
		"adatok.prio.defKP1":
			"A legsürgősebb eset: a beteg élete csak azonnal megkezdett segítségnyújtással menthető meg.",
		"adatok.prio.exKP1": "újraélesztés",
		"adatok.prio.defP1":
			"Beavatkozás nélkül leállhat a légzés vagy a keringés, a beteg állapota instabil.",
		"adatok.prio.exP1": "súlyos sérülés, tüdővizenyő",
		"adatok.prio.defP2":
			"Az állapot bármikor romolhat, ezért gyors beavatkozás kell.",
		"adatok.prio.exP2": "alacsony vércukorszint tudatzavarral",
		"adatok.prio.defP3":
			"A beteg most stabil, de fennáll az esély az állapotromlásra.",
		"adatok.prio.exP3": "csonttörés",
		"adatok.prio.defP4":
			"Stabil állapot, az azonnali beavatkozás igénye alacsony. Jellemzően krónikus betegséghez kötődő panasz.",
		"adatok.prio.exP4": "kiszáradás",
		"adatok.prio.defP5":
			"Nem utal veszélyre, a vizsgálat halasztható vagy akár el is hagyható.",
		"adatok.prio.exP5": "torokgyulladás",
		"adatok.prio.note":
			"A közölt adat mindenhol P1-től P4-ig terjed: a Kiemelt P1 és a P5 külön nem szerepel benne.",

		"adatok.regions.title": "Mit jelentenek a régiók rövidítései?",
		"adatok.regions.intro":
			"A mentőszolgálat hét régióra bontva közli a kiérkezési időket. A rövidítések a régió nevéből jönnek.",
		"adatok.regions.note":
			"A forrás nem teszi közzé, pontosan melyik vármegye melyik régióhoz tartozik. Az itt látható beosztás a hét statisztikai régió szokásos felosztása.",

		"adatok.fresh.title": "Mikor frissülnek a számok?",
		"adatok.fresh.rhythm":
			"A mentőszolgálat havonta teszi közzé a friss számokat. Ez az oldal minden nap megnézi, megjelent-e új adat, és ha igen, átveszi.",
		"adatok.fresh.published": "Legutóbbi közzététel: {date}",
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
		"adatok.limits.split":
			"A hívásfeldolgozás és a vonulás régiós szétválasztása csak egyetlen hónapra érhető el.",
	},
	en: {
		"adatok.about.title": "What is this site?",
		"adatok.about.intro":
			"The purpose of this site is to show comprehensive statistics on the response times of the Hungarian National Ambulance Service.",
		"adatok.about.independent": "This site is {not} part of the National Ambulance Service, and it is not run by them.",
		"adatok.about.notWord": "not",
		"adatok.about.source":
			"The statistics and figures shown here come from the same public data source that is also used on the official site of the National Ambulance Service: {link}. This site is not “better” and does not want to compete with the ambulance service, it only complements it. If the service itself starts laying out these connections in the same detail, holamento.hu will no longer be needed.",
		"adatok.about.contact": "The project is free and public, the source code is available to everyone: {code}. As anywhere else, mistakes can happen here too. If you think something does not work the way it should, or you have a question, write to us here: {mail}.",
		"adatok.about.code": "Are you a developer? Open a feature request or a bug report, and help the project along: {link}.",

		"adatok.terms.title": "What do the numbers mean?",
		"adatok.terms.responseName": "Response time",
		"adatok.terms.responseDesc":
			"it starts when someone calls 112, and it stops when the ambulance reaches the scene",
		"adatok.terms.responseNote":
			"The time spent on the phone counts as well, so this is the wait the caller actually lives through.",
		"adatok.terms.avgName": "Average",
		"adatok.terms.avgDesc":
			"the sum of all response times divided by the number of cases",
		"adatok.terms.avgNote":
			"Even a few very long cases pull it up noticeably, so on its own it can mislead. On this site it only appears for the phases of the call, because once the time is split into phases only averages can be added up.",
		"adatok.terms.medianDesc":
			"the middle value of the sorted times: in half of the cases the ambulance arrived within this time",
		"adatok.terms.medianNote":
			"In the other half it took longer. It describes the typical case better than the average, because extreme values do not drag it around.",
		"adatok.terms.pctName": "Percentile",
		"adatok.terms.pctDesc":
			"it tells you within how much time a given percentage of the cases was reached",
		"adatok.terms.pctNote":
			"The median is itself a percentile, the 50th, because it covers half of the cases. The higher the percentile, the more it is about the long waits.",
		"adatok.terms.p75Desc":
			"the time within which the ambulance arrived in seventy five cases out of a hundred",
		"adatok.terms.p75Note": "In the remaining twenty five cases it took longer.",
		"adatok.terms.p90Desc":
			"the time within which the ambulance arrived in ninety cases out of a hundred",
		"adatok.terms.p90Note":
			"The remaining ten cases waited even longer. This number shows the hard cases, not the typical one.",
		"adatok.terms.lineName": "15 minute line",
		"adatok.terms.lineDesc": "the dashed line on the charts",
		"adatok.terms.lineNote": "It is not a rule, it just makes the numbers easier to measure against.",

		"adatok.prio.title": "How urgent is the case?",
		"adatok.prio.intro":
			"The ambulance service decides how urgent a call is while still on the phone. This matters, because the most serious cases have to be reached first.",
		"adatok.prio.exLabel": "Example",
		"adatok.prio.kp1Label": "Priority P1",
		"adatok.prio.defKP1":
			"The most urgent case: the patient can only be saved if help begins immediately.",
		"adatok.prio.exKP1": "resuscitation",
		"adatok.prio.defP1":
			"Without intervention breathing or circulation may stop, the patient is unstable.",
		"adatok.prio.exP1": "severe injury, pulmonary oedema",
		"adatok.prio.defP2":
			"The condition may deteriorate at any moment, so quick intervention is needed.",
		"adatok.prio.exP2": "low blood sugar with altered consciousness",
		"adatok.prio.defP3":
			"The patient is stable for now, but there is a chance of deterioration.",
		"adatok.prio.exP3": "bone fracture",
		"adatok.prio.defP4":
			"Stable condition, little need for immediate intervention. Typically a complaint tied to a chronic illness.",
		"adatok.prio.exP4": "dehydration",
		"adatok.prio.defP5":
			"A mild complaint with no sign of danger. The examination can be postponed or skipped.",
		"adatok.prio.exP5": "sore throat",
		"adatok.prio.note":
			"The published data covers P1 to P4 everywhere: Priority P1 and P5 are not listed separately in it.",

		"adatok.regions.title": "What do the region codes mean?",
		"adatok.regions.intro":
			"The ambulance service publishes response times split across seven regions. The codes come from the names of the regions.",
		"adatok.regions.note":
			"The source does not publish exactly which county belongs to which region. The mapping shown here is the usual layout of the seven statistical regions.",

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
		"adatok.limits.split":
			"Separating call handling from travel time by region is available for a single month only.",
	},
	de: {
		"adatok.about.title": "Was ist diese Seite?",
		"adatok.about.intro":
			"Diese Seite hat das Ziel, umfassende Statistiken zu den Ausrückzeiten des ungarischen Landesrettungsdienstes zu zeigen.",
		"adatok.about.independent":
			"Diese Seite gehört {not} zum Landesrettungsdienst, und sie wird auch nicht von ihm betrieben.",
		"adatok.about.notWord": "nicht",
		"adatok.about.source":
			"Die hier gezeigten Statistiken und Zahlen stammen aus derselben öffentlichen Datenquelle, die auch auf der offiziellen Seite des Landesrettungsdienstes zu finden ist: {link}. Diese Seite ist nicht „besser“ und will nicht mit dem Rettungsdienst konkurrieren, sie ergänzt ihn nur. Sollte der Rettungsdienst diese Zusammenhänge künftig selbst in dieser Ausführlichkeit darlegen, wird holamento.hu nicht mehr gebraucht.",
		"adatok.about.contact":
			"Das Projekt ist kostenlos und öffentlich, der Quellcode ist für alle einsehbar: {code}. Wie überall können auch hier Fehler auftreten. Wenn etwas deiner Meinung nach nicht so funktioniert, wie es sollte, oder wenn du eine Frage hast, schreib uns hier: {mail}.",
		"adatok.about.code":
			"Du entwickelst selbst? Melde einen Fehler oder schlag eine neue Funktion vor und hilf dem Projekt weiter: {link}.",

		"adatok.terms.title": "Was bedeuten die Zahlen?",
		"adatok.terms.responseName": "Ausrückzeit",
		"adatok.terms.responseDesc":
			"sie beginnt, wenn jemand die 112 anruft, und endet, wenn der Rettungswagen am Einsatzort ankommt",
		"adatok.terms.responseNote":
			"Das Telefongespräch zählt mit, es ist also die Wartezeit, die der Anrufer tatsächlich erlebt.",
		"adatok.terms.avgName": "Durchschnitt",
		"adatok.terms.avgDesc":
			"die Summe aller Ausrückzeiten geteilt durch die Zahl der Fälle",
		"adatok.terms.avgNote":
			"Schon wenige sehr lange Fälle ziehen ihn spürbar nach oben, allein genommen kann er also in die Irre führen. Auf dieser Seite steht er nur bei den Abschnitten des Notrufs, denn in Abschnitte zerlegt lassen sich nur Durchschnitte addieren.",
		"adatok.terms.medianDesc":
			"der mittlere Wert der sortierten Zeiten: bei der Hälfte der Fälle war der Rettungswagen innerhalb dieser Zeit da",
		"adatok.terms.medianNote":
			"Bei der anderen Hälfte hat es länger gedauert. Er beschreibt den typischen Fall besser als der Durchschnitt, weil Extremwerte ihn nicht verzerren.",
		"adatok.terms.pctName": "Perzentil",
		"adatok.terms.pctDesc":
			"es sagt, innerhalb welcher Zeit ein bestimmter Prozentsatz der Fälle erreicht wurde",
		"adatok.terms.pctNote":
			"Der Median ist selbst ein Perzentil, das 50., weil er die Hälfte der Fälle abdeckt. Je höher das Perzentil, desto mehr geht es um die langen Wartezeiten.",
		"adatok.terms.p75Desc":
			"die Zeit, in der bei fünfundsiebzig von hundert Fällen der Rettungswagen da war",
		"adatok.terms.p75Note":
			"Bei den übrigen fünfundzwanzig Fällen hat es länger gedauert.",
		"adatok.terms.p90Desc":
			"die Zeit, in der bei neunzig von hundert Fällen der Rettungswagen da war",
		"adatok.terms.p90Note":
			"Die übrigen zehn Fälle haben noch länger gewartet. Diese Zahl zeigt die schweren Fälle, nicht den typischen.",
		"adatok.terms.lineName": "15-Minuten-Linie",
		"adatok.terms.lineDesc": "die gestrichelte Linie in den Diagrammen",
		"adatok.terms.lineNote":
			"Sie ist keine Vorschrift, die Zahlen lassen sich nur leichter daran messen.",

		"adatok.prio.title": "Wie dringend ist der Fall?",
		"adatok.prio.intro":
			"Der Rettungsdienst entscheidet schon am Telefon, wie dringend ein Anruf ist. Das ist wichtig, denn bei den schwersten Fällen muss der Rettungswagen am schnellsten da sein.",
		"adatok.prio.exLabel": "Beispiel",
		"adatok.prio.kp1Label": "Vorrangiges P1",
		"adatok.prio.defKP1":
			"Der dringendste Fall: das Leben des Patienten ist nur zu retten, wenn sofort geholfen wird.",
		"adatok.prio.exKP1": "Wiederbelebung",
		"adatok.prio.defP1":
			"Ohne Eingreifen können Atmung oder Kreislauf aussetzen, der Zustand ist instabil.",
		"adatok.prio.exP1": "schwere Verletzung, Lungenödem",
		"adatok.prio.defP2":
			"Der Zustand kann sich jederzeit verschlechtern, deshalb ist schnelles Eingreifen nötig.",
		"adatok.prio.exP2": "niedriger Blutzucker mit Bewusstseinsstörung",
		"adatok.prio.defP3":
			"Der Patient ist derzeit stabil, eine Verschlechterung ist aber möglich.",
		"adatok.prio.exP3": "Knochenbruch",
		"adatok.prio.defP4":
			"Stabiler Zustand, kaum Bedarf an sofortigem Eingreifen. Meist Beschwerden im Zusammenhang mit einer chronischen Erkrankung.",
		"adatok.prio.exP4": "Austrocknung",
		"adatok.prio.defP5":
			"Leichte Beschwerden ohne Hinweis auf eine Gefahr. Die Untersuchung kann verschoben oder ausgelassen werden.",
		"adatok.prio.exP5": "Halsentzündung",
		"adatok.prio.note":
			"Die veröffentlichten Daten reichen überall von P1 bis P4: das vorrangige P1 und das P5 sind darin nicht gesondert enthalten.",

		"adatok.regions.title": "Was bedeuten die Kürzel der Regionen?",
		"adatok.regions.intro":
			"Der Rettungsdienst veröffentlicht die Ausrückzeiten aufgeteilt auf sieben Regionen. Die Kürzel stammen aus den Namen der Regionen.",
		"adatok.regions.note":
			"Die Quelle veröffentlicht nicht, welches Komitat genau zu welcher Region gehört. Die hier gezeigte Zuordnung ist die übliche Aufteilung der sieben statistischen Regionen.",

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
		"adatok.limits.split":
			"Die regionale Trennung von Anrufbearbeitung und Anfahrt liegt nur für einen einzigen Monat vor.",
	},
};
