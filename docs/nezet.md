# Holamento: nézetmodul

Minden nézet a `src/features/<id>.js` fájlban él, és pontosan ezt exportálja:

```js
export const id = "...";
export const iconId = "i-...";
export function render(model, mount) {
	/* mount.innerHTML + makeChart hívások */
}
```

A tab felirata nem itt van, hanem az `src/i18n/core.js`-ben, a `tab.<id>` kulcs alatt.

A `render` az első aktiváláskor fut (lazy). Adatfrissítéskor, időszakváltáskor és
nyelvváltáskor a teljes app újrarenderel (main.js: destroyAllCharts + renderedTabs.clear),
a nézet nem tart modul-szintű állapotot.

## Szabályok

- Vanilla JS, semmilyen új függőség.
- **Nyelvek:** felhasználónak látszó szöveg nem lehet a kódban. Minden szöveg
  `t('<id>.kulcs')`, a fordítások az `src/i18n/features/<id>.js`-ben, mindhárom nyelven
  (hu, en, de). Ez vonatkozik a diagram-sorozatnevekre, tengelyfeliratokra és
  aria-label-ekre is. A közös kulcsokat (`common.*`, `metric*`, `prio.*`, `band*`,
  `phase.*`, `area.*`, `tab.*`) az `src/i18n/core.js` adja, azokat újra kell használni.
- **Időszak:** a `render` már a szűrt modellt kapja. Szöveg nem hivatkozhat rögzített
  időszakra, a hónapokat a `model.meta.range` és `model.meta.latestMonth` értékéből kell
  behelyettesíteni. Szűréskor a `model.phases` és a `model.regionSnapshot` lehet `null`,
  a `regionTrend.months` lehet üres: minden kártyának azonos span-ű `emptyState` a
  tartaléka, és minden `makeChart` hívást ugyanaz a feltétel véd, mint a `chartCard`-ot.
- Szín kizárólag `prioColor('P1')`, `catColor(id)`, `paletteColor(i)` vagy `cssToken('--token')`.
- Formázás kizárólag az `utils/fmt.js`-ből (locale-érzékeny): fmtMin, fmtMinShort,
  fmtSignedMin, fmtNum, fmtNum1, fmtPct, fmtYm, fmtYmFull, fmtDate, fmtCases, daysInMonth.
  Kézzel mértékegységet fűzni vagy hónapnevet írni tilos.
- Minden chart `makeChart(el, options)`-szal készül; a diagramadatok kerekítése a közös
  `roundOrNull` segédfüggvénnyel (`src/ui/charts.js`), nem fájlonkénti másolattal. Chart-id konvenció: `ch-<rövidítés>-<slug>`,
  az egész appban egyedi.
- Minden kártyán kötelező a `tip` (2-6 sor), kivéve az `adatok` fület, ahol tudatosan nincs.
- Perzisztens váltók: `loadSeg` / `segHtml` / `wireSeg` (`src/ui/segmented.js`), kulcs:
  `holamento-<tab>-<mi>`, rerender callback: `() => render(model, mount)`.
- Dinamikus szövegek `esc()`-elve; nyers rendezési érték a `cell(v, html)` első argumentuma.
- Nincs kódkomment. Tabulátor behúzás, dupla idézőjel.
- Gondolatjel (hosszú és rövid) sehol, semelyik nyelven.

## Nyelvek

`src/app/i18n.js` adja a motort: `t(key, vars)`, `tPlural(key, n, vars)`, `tList(key)`,
`currentLang()`, `currentLocale()`, `setLang(id)`. Darabszámot tartalmazó mondathoz
`tPlural` jár, `<kulcs>.one` és `<kulcs>.other` változattal, mert az angol és a német
egyes számban más alakot kíván, mint a magyar. Nyelvváltáskor `holamento:langchange` esemény szól, a
main.js újrarendereli a fejlécet és az aktív fület. A szótár `src/i18n/index.js`-ben áll
össze a `core.js`-ből és a hét feature-szótárból. Új kulcs mindhárom nyelven kötelező.

## Kategóriák és prioritások

- `data-cat` / `catColor` id-k: ido, fazis, regio, eset, szoras, cel, adat.
- Prioritás-színek: `--prio-p1..p4`, `prioColor('P1')`, badge: `prioBadge('P1')`.
- Új kategória négy helyen jár: `src/ui/categories.js` (CATEGORIES bejegyzés és
  PALETTE_VARS), tokens.css (`--cat-*` + `[data-cat]` blokk), charts.js THEME_TOKENS,
  scripts/check-themes.mjs PALETTE/PAIRS.

## Megjelenés

Egy világos és egy sötét paletta van (`src/styles/tokens.css`), nincs témaválasztó és nincs
elrendezés-választó: a fejléc ikonja csak világos / sötét / automatikus között vált
(`src/app/appearance.js`). Az `npm run check:themes` a két paletta kontrasztarányait méri.

## Adat API

A nyers `data.json` sémáját és a korlátokat a `docs/adatforras.md` írja le. A nézetek a
`src/data/derive.js` szelektoraiból számolnak. A szelektorok memoizáltak (WeakMap a
modell-objektumon, függvénynév-kulccsal), és az időszakszűrés friss modell-identitást ad,
ezért a memo magától ürül.
