import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/content/Language';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import {
  PRIVACY_SETTINGS_EVENT,
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
    <aside className="privacy-consent" aria-labelledby="privacy-consent-title">
      <div className="privacy-consent__copy">
        <span className="privacy-consent__eyebrow">IT ADIS · PRIVACY</span>
        <h2 id="privacy-consent-title" ref={heading} tabIndex={-1}>
          {isKg ? 'Купуялуулук жөндөөлөрү' : 'Настройки конфиденциальности'}
        </h2>
        <p>
          {isKg
            ? 'Сайтты жакшыртуу үчүн кирүүлөрдүн статистикасын чогултууга уруксат бересизби? Аналитикалык cookie файлдары сиздин макулдугуңуз менен гана колдонулат. Өтүнмөнү каалаган тандоодо жөнөтө аласыз. '
            : 'Разрешите собирать статистику посещений для улучшения сайта? Аналитические cookie используются только с вашего согласия. Отправить заявку можно при любом выборе. '}
          <Link to="/privacy">
            {isKg ? 'Купуялуулук саясаты' : 'Политика конфиденциальности'}
          </Link>
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
          {isKg ? 'Аналитикага уруксат берүү' : 'Разрешить аналитику'}
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => choose(false)}
        >
          {isKg ? 'Аналитикасыз улантуу' : 'Продолжить без аналитики'}
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
