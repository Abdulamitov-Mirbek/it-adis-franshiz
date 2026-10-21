import { CONFIG } from './config';
import { hasAnalyticsConsent } from './privacyConsent';

let loaded = false;

export function isTagManagerConfigured(): boolean {
  return /^GTM-[A-Z0-9]+$/.test(CONFIG.analytics.gtm);
}

/** Keep query strings and fragments (which may contain contact data) out of events. */
export function analyticsPageUrl(value = window.location.href): string {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? `${url.origin}${url.pathname}` : '';
  } catch {
    return '';
  }
}

function consentMode(command: 'default' | 'update', accepted: boolean): void {
  window.dataLayer ??= [];
  window.gtag ??= function (..._args: unknown[]) {
    // Google expects an Arguments object for gtag commands, not an event object.
    window.dataLayer!.push(arguments);
  };
  window.gtag('consent', command, {
    analytics_storage: accepted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });
}

export function startTagManager(): void {
  if (loaded || !isTagManagerConfigured() || !hasAnalyticsConsent()) return;
  consentMode('default', false);
  consentMode('update', true);
  window.dataLayer!.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.id = 'itadis-gtm';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${CONFIG.analytics.gtm}`;
  loaded = true;
  document.head.appendChild(script);
}

export function stopTagManager(): void {
  if (!loaded) return;
  consentMode('update', false);
  // Clear first-party analytics identifiers. Third-party cookies remain under
  // the provider/browser's control; no GTM code is loaded on the next page.
  try {
    const host = window.location.hostname.split('.');
    const domains = [
      '',
      ...host.slice(0, -1).map((_, i) => host.slice(i).join('.')),
    ];
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^(_ga($|_)|_gid$|_gat($|_)|_gac_|_ym_)/.test(name)) continue;
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`;
      }
    }
  } catch {
    // Browser settings may deny cookie access.
  }
  // Scripts installed by a GTM container cannot reliably be unloaded in place.
  // The saved refusal survives this reload, preventing any tags from restarting.
  window.location.reload();
}
