import { CORE } from './core.js';
import adatok from './features/adatok.js';
import attekintes from './features/attekintes.js';
import esetszamok from './features/esetszamok.js';
import fazisok from './features/fazisok.js';
import regiok from './features/regiok.js';
import szoras from './features/szoras.js';
import trendek from './features/trendek.js';

const PARTS = [CORE, adatok, attekintes, esetszamok, fazisok, regiok, szoras, trendek];

export const DICT = ['hu', 'en', 'de'].reduce((acc, lang) => {
	acc[lang] = Object.assign({}, ...PARTS.map((p) => p[lang] ?? {}));
	return acc;
}, {});
