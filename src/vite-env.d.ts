/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEAD_ENDPOINT?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_CONTACT_WHATSAPP?: string;
  readonly VITE_CONTACT_TELEGRAM?: string;
  readonly VITE_CONTACT_INSTAGRAM?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_GA4_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_YANDEX_METRIKA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  ym?: (...args: unknown[]) => void;
}
