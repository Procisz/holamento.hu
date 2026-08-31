# Adatforrás: stat.mentok.hu/data.json

Az oldal egyetlen adatforrásból dolgozik: az Országos Mentőszolgálat nyilvános statisztikai
oldala (https://stat.mentok.hu/) mögötti `data.json`-ból. Az adatokra nincs ráhatásunk, a
séma az OMSZ oldalához igazodik.

## Frissítési lánc

A `data.json` nem küld CORS fejlécet, ezért böngészőből másik domainről nem tölthető be
közvetlenül. Ráadásul a forrás IP-cím alapján szűr: a GitHub Actions futtatóiról `403
Forbidden` a válasz, magyar IP-ről viszont kiadja az adatot. Ezért nem GitHub-workflow,
hanem saját szerveren futó cron végzi a letöltést.

1. A szerveren napi cron futtatja a `scripts/server-update.sh`-t.
2. Az szinkronba hozza a klónt a main ággal, majd lefuttatja a `scripts/pull-data.mjs`-t,
   ami letölti és ellenőrzi a JSON szerkezetét.
3. Ha változott, elmenti `public/data.json`-ba (ezt tölti be az oldal, saját originről),
   és lerakja az `archive/<updatedDate>.json` pillanatképet is (azonos napi, de eltérő
   tartalmú újraközlés `-2`, `-3` utótagot kap, felülírás nincs).
4. A szerver commitol és pushol a main ágra. A push magától elindítja a deploy
   workflow-t, az oldal újraépül.

A szerver deploy kulcsa szerepel a `Protect main` ruleset bypass listáján, különben a
védett ágra nem tudna pusholni.

Az archívum azért fontos, mert az API gördülő ablakot ad: a legtöbb blokk csak 2026-tól
létezik, a `phases` blokk pedig mindig csak a legutolsó hónapra. A pillanatképekből idővel
olyan idősorok is összerakhatók, amiket az API önmagában sosem ad ki (fázisidők havi
trendje, előzetes és végleges adat eltérése).

Az app jelenleg nem használja az archívumot: egyetlen fájlt tölt be, a `public/data.json`-t.
Az `archive/` a repóban gyűlik, a build kimenetébe nem kerül bele.

Fejlesztéskor: `npm run pull` frissíti a `public/data.json`-t a live forrásból.

## A JSON szerkezete

Minden időérték perc, az idő a segélyhívás indításától a helyszínre érkezésig telik
(tartalmazza a 112-es hívásfelvételt és az átadást is).

| Kulcs | Tartalom |
|---|---|
| `meta` | `generatedAt`, `updatedDate`, `originMonth`, `latestMonth`, `latestIsPreliminary`, `months` (7 hónap, 2026-tól), `monthsFrom2025` (19 hónap), `priorities` (P1-P4), `areas` (Országos, Budapest), `regions` (7 régió, kód + név) |
| `topic1` | Az utolsó hónap P1 P90 értéke Országos + Budapest bontásban, előző havi értékkel (`p90Prev`) és esetszámmal |
| `phases` | A hívás 4 szakasza (`esr_cad`, `cad_cad`, `cad_bej`, `bej_erk`), mindegyikre átlag, medián, P75, P90. Csak az utolsó hónapra, csak P1, csak országos. `sum` a szakaszátlagok összege, `total` a közvetlenül mért teljes átlagidő, a kettő nem egyezik (lásd lent) |
| `topic2` | A mester-idősor: 19 hónap (2025-01-től), Országos + Budapest, mindkettőre medián / P75 / P90 / esetszám, prioritásonként (P1-P4) |
| `topic3` | REDUNDÁNS: a medián, P75 és P90 értékei bitre pontosan a `topic2` utolsó 7 hónapja (ellenőrizve mindkét area, minden prioritás). Esetszámot nem tartalmaz, az csak a `topic2`-ben van. A modell nem használja |
| `topic4` | Régiós bontás (7 régió x P1-P4 x medián/P75/P90) az utolsó LEZÁRT hónapra. FIGYELEM: más mérési alapú, lásd lent |
| `topic5` | Régiós bontás az utolsó (előzetes) hónapra, a segélyhívástól mérve. Értékei egyeznek a `regioTrend` megfelelő havi értékeivel |
| `regioTrend` | 7 régió x 7 hónap (2026-tól) x medián/P75/P90, prioritásonként. Esetszám NINCS régiós bontásban |

## A topic4 anomália

A `topic4` értékei szisztematikusan 3,5-5 perccel rövidebbek, mint ugyanazon hónap
`regioTrend` értékei (pl. DAR P1 medián: 9,82 vs 13,58 a 2026-06 hónapra). A különbség
nagyságrendje egyezik a hívásfeldolgozási szakaszok (esr_cad + cad_cad + cad_bej) idejével,
tehát a `topic4` nagy valószínűséggel a riasztástól mért idő, nem a segélyhívástól mért.
Az OMSZ oldala be sem tölti a felületre (az `app.js` beolvassa `map4`-ként, de csak a
`topic5`-öt rendereli). A hivatalos CSV-export `mk(row, label)` függvénye viszont
`'segélyhívástól'` címkét vár, tehát a két mérési alap megkülönböztetése náluk is
megvolt, csak kivették a felületről.

Az `Időbontás` fül (`src/features/bontas.js`) ezt a különbséget jeleníti meg
`derive.dispatchSplit` alapján: régiónként és prioritásonként a `regioTrend` adott havi
értékéből kivonja a `topic4` értékét, és a maradékot hívásfeldolgozási időként mutatja.
A fül maga is kiírja, hogy a percentilisek nem adódnak össze, tehát a különbség a két
mérés eltolódása, nem a hívásfeldolgozás önálló eloszlása. A mediánnál ez jó közelítés,
a P90-nél nem az.

A `topic4` egyetlen hónapra jön (az utolsó lezárt), így a bontás is egyhavi. Az archívum
viszont hónapról hónapra megőrzi, tehát idővel idősorrá áll össze.

## A phases.total maradék

A `sum` (a négy szakaszátlag összege) és a `total` (a közvetlenül közölt teljes átlagidő)
eltér: 17,30 vs 17,22 perc a 2026-07 közlésben. Négy, két tizedesre kerekített szakaszátlag
összege legfeljebb 0,02 percet téved, a `total` maga is kerekített (0,005), tehát a különbség
kerekítésből legfeljebb 0,025 perc lehet. A mért 0,08 perc ennél nagyobb, vagyis valódi maradék. Az okát a forrás nem magyarázza. A `fazisok` fül mindkét számot
kiírja, és jelzi az eltérést, magyarázat nélkül.

## Korlátok

- Csak 3 kvantilis (+ a fázisoknál átlag) érhető el, eset-szintű adat nincs.
- Esetszám csak Országos és Budapest bontásban van, régiónként nincs.
- Nincs megyei, települési, napszaki vagy mentőegység-típus szerinti bontás.
- A legfrissebb hónap előzetes (`latestIsPreliminary`), utólag változhat.
- Percentiliseket nem lehet kivonni egymásból: a "vidék" idői NEM számolhatók ki az
  Országos és Budapest értékekből. A vidéki esetszám viszont igen (Országos - Budapest).
- Ugyanez korlátozza a `topic4` és a `regioTrend` különbségét is: ugyanarra a
  sokaságra két különböző kezdőponttal mért percentilis különbsége a mérés eltolódása,
  nem egy harmadik eloszlás percentilise. Ezért mutatja az `Időbontás` fül a saját
  módszertanát, és ezért marad a medián az alapértelmezett mutatója.
