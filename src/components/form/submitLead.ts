import { CONFIG } from '@/lib/config';
import { bishkekTimestamp, deviceType, getAttribution } from '@/lib/attribution';
import { normalizePhone } from '@/lib/phone';
import type { LeadValues } from './leadSchema';

export interface LeadPayload extends Omit<LeadValues, 'company'> {
  phoneNormalized: string;
  page: string;
  referrer: string;
  sentAt: string;
  device: string;
  placement: string;
  utm: Record<string, string>;
  clickIds: Record<string, string>;
}

export function buildPayload(values: LeadValues, placement: string): LeadPayload {
  const attribution = getAttribution();
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    phoneNormalized: normalizePhone(values.phone),
    city: values.city.trim(),
    format: values.format,
    consent: values.consent,
    page: typeof window === 'undefined' ? '' : window.location.href,
    referrer: attribution.referrer,
    sentAt: bishkekTimestamp(),
    device: deviceType(),
    placement,
    utm: attribution.utm,
    clickIds: attribution.clickIds,
  };
}

/**
 * Отправка заявки на бэкенд (раздел 8.3 ТЗ).
 * Пока VITE_LEAD_ENDPOINT пуст — работаем в демо-режиме: ничего не
 * отправляем, но проходим весь сценарий до страницы /thanks.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  if (!CONFIG.leadEndpoint) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info('[lead] демо-режим, заявка не отправлена:', payload);
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
    return;
  }

  const response = await fetch(CONFIG.leadEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Lead endpoint responded ${response.status}`);
}
