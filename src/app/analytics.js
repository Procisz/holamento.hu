import { ANALYTICS_ENDPOINT, ANALYTICS_HOST, CF_BEACON_TOKEN } from '../config.js';

const CF_BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

function addScript(setup) {
	const s = document.createElement('script');
	setup(s);
	document.head.appendChild(s);
}

export function initAnalytics() {
	if (location.hostname !== ANALYTICS_HOST) return;
	if (ANALYTICS_ENDPOINT) {
		addScript((s) => {
			s.async = true;
			s.src = `${ANALYTICS_ENDPOINT}/count.js`;
			s.setAttribute('data-goatcounter', `${ANALYTICS_ENDPOINT}/count`);
		});
	}
	if (CF_BEACON_TOKEN) {
		addScript((s) => {
			s.type = 'module';
			s.src = CF_BEACON_SRC;
			s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_BEACON_TOKEN }));
		});
	}
}

export function scheduleAnalytics() {
	const start = () => {
		if (typeof requestIdleCallback === 'function') requestIdleCallback(initAnalytics, { timeout: 2000 });
		else setTimeout(initAnalytics, 1);
	};
	if (document.readyState === 'complete') start();
	else addEventListener('load', start, { once: true });
}
