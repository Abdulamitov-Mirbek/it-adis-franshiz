/**
 * Слой аналитики — раздел 9 ТЗ.
 *
 * Все события отправляются одной функцией track(). Если система не
 * подключена (нет идентификатора в .env), вызов просто ничего не делает.
 * Персональные данные (имя, телефон) в аналитику НЕ передаются.
 */

import { CONFIG } from './config';

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'nav_click'
  | 'format_select'
  | 'budget_calculate'
  | 'form_start'
  | 'form_error'
  | 'form_submit'
  | 'thanks_view'
  | 'messenger_click'
  | 'faq_open'
  | 'scroll_50'
  | 'scroll_75'
  | 'section_view';

type Params = Record<string, string | number | boolean | undefined>;

const PERSONAL_KEYS = ['name', 'phone', 'email', 'имя', 'телефон'];

function stripPersonal(params: Params): Params {
  const safe: Params = {};
  for (const [key, value] of Object.entries(params)) {
    if (PERSONAL_KEYS.includes(key.toLowerCase())) continue;
    if (value !== undefined) safe[key] = value;
  }
  return safe;
}

export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  const payload = stripPersonal(params);

  // Google Tag Manager / GA4
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });

  if (CONFIG.analytics.ga4 && typeof window.gtag === 'function') {
    // Лид в GA4 — стандартное событие generate_lead.
    window.gtag('event', event === 'form_submit' ? 'generate_lead' : event, payload);
  }

  if (CONFIG.analytics.metaPixel && typeof window.fbq === 'function') {
    if (event === 'form_submit') window.fbq('track', 'Lead', payload);
    else window.fbq('trackCustom', event, payload);
  }

  if (CONFIG.analytics.yandex && typeof window.ym === 'function') {
    window.ym(Number(CONFIG.analytics.yandex), 'reachGoal', event, payload);
  }

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
