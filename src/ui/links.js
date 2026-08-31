import { t } from '../app/i18n.js';
import { COFFEE_URL, LINKEDIN_URL } from '../config.js';
import { icon } from './icons.js';
import { esc } from './ui.js';

const ITEMS = [
  { url: LINKEDIN_URL, iconId: 'i-linkedin', key: 'social.linkedin' },
  { url: COFFEE_URL, iconId: 'i-coffee', key: 'social.coffee' },
];

export function socialLinks() {
  const items = ITEMS.map(
    (it) =>
      `<a class="social-link" href="${esc(it.url)}" target="_blank" rel="noopener">${icon(it.iconId)}<span>${esc(t(it.key))}</span></a>`,
  ).join('');
  return `<div class="social-row">${items}</div>`;
}
