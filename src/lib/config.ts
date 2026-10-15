/** Настройки окружения (см. .env.example). Пустое значение = выключено. */

const env = import.meta.env;

export const CONFIG = {
  leadEndpoint: (env.VITE_LEAD_ENDPOINT ?? '').trim(),
  siteUrl: (env.VITE_SITE_URL ?? 'https://franchise.itadis.kg').trim(),
  analytics: {
    ga4: (env.VITE_GA4_ID ?? '').trim(),
    metaPixel: (env.VITE_META_PIXEL_ID ?? '').trim(),
    yandex: (env.VITE_YANDEX_METRIKA_ID ?? '').trim(),
  },
} as const;

/** Раздел 8.5 ТЗ: кнопка показывается только для заполненной ссылки. */
export const CONTACTS: Record<string, string> = {
  WhatsApp: (env.VITE_CONTACT_WHATSAPP ?? '').trim(),
  Telegram: (env.VITE_CONTACT_TELEGRAM ?? '').trim(),
  Instagram: (env.VITE_CONTACT_INSTAGRAM ?? '').trim(),
};

export const CONTACT_LIST = Object.entries(CONTACTS).filter(([, href]) => href.length > 0);
