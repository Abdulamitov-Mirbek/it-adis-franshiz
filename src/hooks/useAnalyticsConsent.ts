import { useSyncExternalStore } from 'react';
import {
  getAnalyticsConsent,
  subscribeAnalyticsConsent,
} from '@/lib/privacyConsent';

export function useAnalyticsConsent() {
  return useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    () => null,
  );
}
