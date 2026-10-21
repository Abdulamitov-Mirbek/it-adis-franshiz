/**
 * UTM-метки и служебные данные заявки — раздел 8.2 ТЗ.
 * Сохраняются при первом заходе на 30 дней и уходят вместе с формой.
 */

import { hasAnalyticsConsent } from './privacyConsent';

const STORAGE_KEY = 'itadis_attribution';
const TTL_DAYS = 30;

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;
const CLICK_IDS = ['fbclid', 'gclid', 'ttclid', 'yclid'] as const;

export interface Attribution {
  utm: Record<string, string>;
  clickIds: Record<string, string>;
  landingPage: string;
  referrer: string;
  savedAt: string;
}

function readStored(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    const age = Date.now() - new Date(parsed.savedAt).getTime();
    if (Number.isNaN(age) || age > TTL_DAYS * 864e5) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Вызывается один раз при загрузке страницы. */
export function captureAttribution(): Attribution {
  if (!hasAnalyticsConsent()) return emptyAttribution();
  const stored = readStored();
  const params = new URLSearchParams(window.location.search);

  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  const clickIds: Record<string, string> = {};
  for (const key of CLICK_IDS) {
    const value = params.get(key);
    if (value) clickIds[key] = value;
  }

  // Первый заход «побеждает»: перезаписываем только если в URL есть новые метки.
  if (
    stored &&
    Object.keys(utm).length === 0 &&
    Object.keys(clickIds).length === 0
  ) {
    return stored;
  }

  const fresh: Attribution = {
    utm: { ...stored?.utm, ...utm },
    clickIds: { ...stored?.clickIds, ...clickIds },
    landingPage: stored?.landingPage ?? window.location.href,
    referrer: stored?.referrer ?? document.referrer,
    savedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    /* приватный режим — просто не сохраняем */
  }

  return fresh;
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined' || !hasAnalyticsConsent())
    return emptyAttribution();
  return (
    readStored() ?? {
      utm: {},
      clickIds: {},
      landingPage: window.location.href,
      referrer: document.referrer,
      savedAt: new Date().toISOString(),
    }
  );
}

function emptyAttribution(): Attribution {
  return { utm: {}, clickIds: {}, landingPage: '', referrer: '', savedAt: '' };
}

export function clearAttribution(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Storage can be unavailable. */
  }
}

export function deviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/** Дата и время в часовом поясе Бишкека. */
export function bishkekTimestamp(): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Bishkek',
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date());
}
