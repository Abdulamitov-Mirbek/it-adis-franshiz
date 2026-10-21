import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/content/Language';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import {
  PRIVACY_SETTINGS_EVENT,
  openPrivacyPolicy,
  setAnalyticsConsent,
} from '@/lib/privacyConsent';

export function PrivacyConsent() {
  const { isKg } = useLanguage();
  const choice = useAnalyticsConsent();
  const [open, setOpen] = useState(choice === null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      previousFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
      requestAnimationFrame(() => heading.current?.focus());
    };
    window.addEventListener(PRIVACY_SETTINGS_EVENT, show);
    return () => window.removeEventListener(PRIVACY_SETTINGS_EVENT, show);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('has-consent-banner', open);
    return () => document.body.classList.remove('has-consent-banner');
  }, [open]);

  useEffect(() => {
    setOpen(choice === null);
  }, [choice]);

  const close = () => {
    setOpen(false);
    previousFocus.current?.focus({ preventScroll: true });
  };
  const choose = (accepted: boolean) => {
    setAnalyticsConsent(accepted ? 'accepted' : 'rejected');
    close();
  };

  if (!open) return null;
  return (
    <aside
      className={`privacy-consent${choice !== null ? ' privacy-consent--settings' : ''}`}
      aria-labelledby="privacy-consent-title"
    >
      <div className="privacy-consent__copy">
        <h2
          className="visually-hidden"
          id="privacy-consent-title"
          ref={heading}
          tabIndex={-1}
        >
          {isKg ? 'Cookie жана купуялуулук' : 'Cookie и конфиденциальность'}
        </h2>
        <p>
          {isKg
            ? 'Сайттын иштеши үчүн cookie колдонобуз. Аналитика сиздин макулдугуңуз менен гана иштейт. '
            : 'Для работы сайта используем cookie. Аналитика включается с вашего согласия. '}
          <button
            className="privacy-policy-link"
            type="button"
            onClick={openPrivacyPolicy}
          >
            {isKg ? 'Кененирээк' : 'Подробнее'}
          </button>
        </p>
        {choice !== null && (
          <p className="privacy-consent__current">
            {isKg ? 'Учурдагы тандоо: ' : 'Текущий выбор: '}
            {choice === 'accepted'
              ? isKg
                ? 'аналитикага уруксат берилген'
                : 'аналитика разрешена'
              : isKg
                ? 'аналитикага уруксат берилген эмес'
                : 'аналитика отклонена'}
          </p>
        )}
      </div>
      <div className="privacy-consent__actions">
        <button className="btn" type="button" onClick={() => choose(true)}>
          {isKg ? 'Макулмун' : 'Согласен'}
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => choose(false)}
        >
          {isKg ? 'Аналитикасыз' : 'Без аналитики'}
        </button>
      </div>
      {choice !== null && (
        <button
          className="privacy-consent__close"
          type="button"
          onClick={close}
          aria-label={isKg ? 'Жөндөөлөрдү жабуу' : 'Закрыть настройки'}
        >
          ×
        </button>
      )}
    </aside>
  );
}
