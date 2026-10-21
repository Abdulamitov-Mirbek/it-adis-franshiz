export type AnalyticsConsent = 'accepted' | 'rejected' | null;

const STORAGE_KEY = 'itadis-analytics-consent';
const CHANGE_EVENT = 'itadis:analytics-consent';
export const PRIVACY_SETTINGS_EVENT = 'itadis:privacy-settings';
export const PRIVACY_POLICY_VERSION = '2026-10-21';

function readStoredConsent(): AnalyticsConsent {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return stored?.version === 1 &&
      (stored.choice === 'accepted' || stored.choice === 'rejected')
      ? stored.choice
      : null;
  } catch {
    return null;
  }
}

let choice = readStoredConsent();

export function getAnalyticsConsent(): AnalyticsConsent {
  return choice;
}

export function hasAnalyticsConsent(): boolean {
  return choice === 'accepted';
}

export function setAnalyticsConsent(
  next: Exclude<AnalyticsConsent, null>,
): void {
  choice = next;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        choice,
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // The choice still applies to this visit when storage is unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeAnalyticsConsent(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    choice = readStoredConsent();
    listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function openPrivacySettings(): void {
  window.dispatchEvent(new Event(PRIVACY_SETTINGS_EVENT));
}
