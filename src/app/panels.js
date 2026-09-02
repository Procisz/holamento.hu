import * as adatok from "../features/adatok.js";

export const PANELS = [
	{ id: "adatok", iconId: "i-info", load: () => adatok },
	{ id: "attekintes", iconId: "i-overview", load: () => import("../features/attekintes.js") },
	{ id: "trendek", iconId: "i-clock", load: () => import("../features/trendek.js") },
	{ id: "fazisok", iconId: "i-phone", load: () => import("../features/fazisok.js") },
	{ id: "regiok", iconId: "i-map", load: () => import("../features/regiok.js") },
	{ id: "bontas", iconId: "i-hourglass", load: () => import("../features/bontas.js") },
	{ id: "esetszamok", iconId: "i-pulse", load: () => import("../features/esetszamok.js") },
	{ id: "szoras", iconId: "i-gauge", load: () => import("../features/szoras.js") },
];
