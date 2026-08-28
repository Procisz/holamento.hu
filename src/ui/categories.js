import { cssToken } from './charts.js';

export const CATEGORIES = [
  { id: 'ido', label: 'Kiérkezési idők', cssVar: '--cat-ido', icon: 'i-clock' },
  { id: 'fazis', label: 'A hívás útja', cssVar: '--cat-fazis', icon: 'i-phone' },
  { id: 'regio', label: 'Régiók', cssVar: '--cat-regio', icon: 'i-map' },
  { id: 'eset', label: 'Esetszámok', cssVar: '--cat-eset', icon: 'i-pulse' },
  { id: 'szoras', label: 'Egyenlőtlenségek', cssVar: '--cat-szoras', icon: 'i-gauge' },
  { id: 'cel', label: '15 perces szint', cssVar: '--cat-cel', icon: 'i-target' },
  { id: 'adat', label: 'Adatokról', cssVar: '--cat-adat', icon: 'i-info' },
];

export function catColor(id) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cssToken(cat ? cat.cssVar : '--accent');
}

const PALETTE_VARS = ['--cat-ido', '--cat-regio', '--cat-eset', '--cat-fazis',
  '--cat-szoras', '--cat-cel', '--cat-adat'];

export function paletteColor(i) {
  return cssToken(PALETTE_VARS[i % PALETTE_VARS.length]);
}

export function prioColor(p) {
  return cssToken(`--prio-${String(p).toLowerCase()}`);
}
