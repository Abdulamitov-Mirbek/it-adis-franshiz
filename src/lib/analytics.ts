/**
 * Слой аналитики — раздел 9 ТЗ.
 *
 * Все события отправляются одной функцией track(). Если система не
 * подключена (нет идентификатора в .env), вызов просто ничего не делает.
 * Персональные данные (имя, телефон) в аналитику НЕ передаются.
 */

import { hasAnalyticsConsent } from './privacyConsent';
import { analyticsPageUrl, isTagManagerConfigured } from './tagManager';

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'nav_click'
  | 'format_select'
  | 'budget_calculate'
  | 'form_start'
  | 'form_error'
  | 'form_submit'
  | 'whatsapp_draft_open'
  | 'thanks_view'
  | 'messenger_click'
  | 'faq_open'
  | 'scroll_50'
  | 'scroll_75'
  | 'section_view';

type Params = Record<string, string | number | boolean | undefined>;

const PERSONAL_KEYS = [
  'name',
  'phone',
  'email',
  'city',
  'имя',
  'телефон',
  'город',
];

function stripPersonal(params: Params): Params {
  const safe: Params = {};
  for (const [key, value] of Object.entries(params)) {
    if (PERSONAL_KEYS.includes(key.toLowerCase())) continue;
    if (value !== undefined) safe[key] = value;
  }
  return safe;
}

export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (
    typeof window === 'undefined' ||
    !hasAnalyticsConsent() ||
    !isTagManagerConfigured()
  )
    return;
  const payload = stripPersonal(params);

  // Container tags should consume these events; no direct analytics SDKs run here.
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    ...payload,
    event,
    ...(event === 'page_view'
      ? {
          page_location: analyticsPageUrl(),
          page_referrer: analyticsPageUrl(document.referrer),
        }
      : {}),
  });

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload);
  }
}

/** Прокрутка до 50% и 75% страницы — раздел 9 ТЗ. */
export function initScrollDepth(): () => void {
  if (typeof window === 'undefined') return () => {};
  const fired = new Set<number>();

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;
    for (const step of [50, 75] as const) {
      if (pct >= step && !fired.has(step)) {
        fired.add(step);
        track(step === 50 ? 'scroll_50' : 'scroll_75');
      }
    }
    if (fired.size === 2) window.removeEventListener('scroll', onScroll);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
