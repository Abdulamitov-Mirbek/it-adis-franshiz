/** Настройки окружения (см. .env.example). Пустое значение = выключено. */

const env = import.meta.env;

export const BUSINESS_CONTACT = {
  phone: '+996558553177',
  phoneDisplay: '+996 558 553 177',
  email: 'itadiskg11@gmail.com',
} as const;

export const CONFIG = {
  leadEndpoint: (env.VITE_LEAD_ENDPOINT ?? '').trim(),
  siteUrl: (env.VITE_SITE_URL ?? 'https://www.itadis-franshiza.kg').trim(),
  analytics: {
    gtm: (env.VITE_GTM_ID ?? 'GTM-NRL6QKJ8').trim().toUpperCase(),
  },
} as const;

/** Раздел 8.5 ТЗ: кнопка показывается только для заполненной ссылки. */
export const CONTACTS: Record<string, string> = {
  WhatsApp: (env.VITE_CONTACT_WHATSAPP ?? '').trim(),
  Telegram: (env.VITE_CONTACT_TELEGRAM ?? '').trim(),
  Instagram: (env.VITE_CONTACT_INSTAGRAM ?? '').trim(),
};

export const CONTACT_LIST = Object.entries(CONTACTS).filter(
  ([, href]) => href.length > 0,
);
