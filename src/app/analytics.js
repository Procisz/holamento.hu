import { ANALYTICS_HOST, ANALYTICS_TOKEN } from '../config.js';

const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

export function initAnalytics() {
	if (!ANALYTICS_TOKEN || location.hostname !== ANALYTICS_HOST) return;
	const s = document.createElement('script');
	s.type = 'module';
	s.src = BEACON_SRC;
	s.setAttribute('data-cf-beacon', JSON.stringify({ token: ANALYTICS_TOKEN }));
	document.head.appendChild(s);
}
