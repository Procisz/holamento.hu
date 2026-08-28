# Adatforrás: stat.mentok.hu/data.json

Az oldal egyetlen adatforrásból dolgozik: az Országos Mentőszolgálat nyilvános statisztikai
oldala (https://stat.mentok.hu/) mögötti `data.json`-ból. Az adatokra nincs ráhatásunk, a
séma az OMSZ oldalához igazodik.

## Frissítési lánc

A `data.json` nem küld CORS fejlécet, ezért böngészőből másik domainről nem tölthető be
közvetlenül. A megoldás:

1. A `.github/workflows/fetch-data.yml` naponta letölti a friss JSON-t.
2. Ha változott, elmenti `public/data.json`-ba (ezt tölti be az oldal, saját originről),
   és lerakja az `archive/<updatedDate>.json` pillanatképet is (azonos napi, de eltérő
   tartalmú újraközlés `-2`, `-3` utótagot kap, felülírás nincs).
3. A workflow ezután kézzel elindítja a deploy workflow-t (a GITHUB_TOKEN-nel készült
   push önmagában nem váltana ki workflow-futást, ez GitHub-korlát), az oldal újraépül.

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
| `phases` | A hívás 4 szakasza (`esr_cad`, `cad_cad`, `cad_bej`, `bej_erk`), mindegyikre átlag, medián, P75, P90. Csak az utolsó hónapra, csak P1, csak országos. `sum` és `total` a teljes átlagidő |
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
`topic5`-öt rendereli). Amíg a mérési alapja nem tisztázott, a dashboard nem jeleníti meg,
a séma-ellenőrzés viszont számon tartja.

## Korlátok

- Csak 3 kvantilis (+ a fázisoknál átlag) érhető el, eset-szintű adat nincs.
- Esetszám csak Országos és Budapest bontásban van, régiónként nincs.
- Nincs megyei, települési, napszaki vagy mentőegység-típus szerinti bontás.
- A legfrissebb hónap előzetes (`latestIsPreliminary`), utólag változhat.
- Percentiliseket nem lehet kivonni egymásból: a "vidék" idői NEM számolhatók ki az
  Országos és Budapest értékekből. A vidéki esetszám viszont igen (Országos - Budapest).
