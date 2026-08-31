import { existsSync, writeFileSync } from "node:fs";

const URL = "https://stat.mentok.hu/data.json";

const res = await fetch(URL, { signal: AbortSignal.timeout(30000) });
if (!res.ok) {
	console.error(`Download failed: HTTP ${res.status}`);
	process.exit(1);
}
const text = await res.text();
const data = JSON.parse(text);
if (!data.meta?.latestMonth || !data.topic2 || !data.regioTrend) {
	console.error("The downloaded JSON does not have the expected shape.");
	process.exit(1);
}
writeFileSync("public/data.json", text);
const stamp = String(data.meta.updatedDate ?? "");
if (/^\d{4}-\d{2}-\d{2}$/.test(stamp)) {
	const target = `archive/${stamp}.json`;
	if (!existsSync(target)) {
		writeFileSync(target, text);
		console.log(`Archived: ${target}`);
	}
}
console.log(`OK: public/data.json updated (${data.meta.updatedDate}, latest month: ${data.meta.latestMonth})`);
