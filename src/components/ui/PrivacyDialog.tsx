import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/content/Language';
import { Privacy } from '@/pages/Privacy';
import {
  openPrivacySettings,
  PRIVACY_POLICY_EVENT,
  PRIVACY_POLICY_VERSION,
  setAnalyticsConsent,
} from '@/lib/privacyConsent';

export function PrivacyDialog() {
  const { isKg } = useLanguage();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      previousFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener(PRIVACY_POLICY_EVENT, show);
    return () => window.removeEventListener(PRIVACY_POLICY_EVENT, show);
  }, []);

  useEffect(() => {
    // Mobile browsers can restore a page's open dialogs from their back cache.
    const dismiss = () => {
      if (dialog.current?.open) dialog.current.close();
      setOpen(false);
    };
    const onVisibility = () => {
      if (document.hidden) dismiss();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) dismiss();
    };
    window.addEventListener('pagehide', dismiss);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', dismiss);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const node = dialog.current;
    if (open && node && !node.open) node.showModal();
    document.documentElement.classList.toggle('has-privacy-dialog', open);
    return () => {
      document.documentElement.classList.remove('has-privacy-dialog');
      if (node?.open) node.close();
    };
  }, [open]);

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      className="privacy-dialog"
      aria-labelledby="privacy-policy-title"
      onClose={() => {
        setOpen(false);
        if (previousFocus.current?.isConnected)
          previousFocus.current.focus({ preventScroll: true });
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {open && (
        <>
          <header className="privacy-dialog__header">
            <div>
              <h2 id="privacy-policy-title">
                {isKg ? 'Купуялуулук саясаты' : 'Политика конфиденциальности'}
              </h2>
              <p>
                {isKg ? 'Жаңыртылган күнү: ' : 'Дата обновления: '}
                <time dateTime={PRIVACY_POLICY_VERSION}>21.10.2026</time>
              </p>
            </div>
            <button
              className="privacy-dialog__close"
              type="button"
              onClick={close}
              aria-label={isKg ? 'Жабуу' : 'Закрыть политику'}
            >
              ×
            </button>
          </header>
          <div className="privacy-dialog__content">
            <Privacy
              onSettings={() => {
                close();
                requestAnimationFrame(openPrivacySettings);
              }}
            />
          </div>
          <footer className="privacy-dialog__footer">
            <p id="privacy-dialog-consent-note">
              {isKg
                ? 'Аналитикага макулдугуңузду каалаган убакта өзгөртө аласыз.'
                : 'Согласие на аналитику можно изменить в любой момент.'}
            </p>
            <div className="privacy-dialog__actions">
              <button className="btn btn--ghost" type="button" onClick={close}>
                {isKg ? 'Сайтка кайтуу' : 'Вернуться на сайт'}
              </button>
              <button
                className="btn"
                type="button"
                aria-describedby="privacy-dialog-consent-note"
                onClick={() => {
                  setAnalyticsConsent('accepted');
                  close();
                }}
              >
                {isKg ? 'Макулмун' : 'Согласен'}
              </button>
            </div>
          </footer>
        </>
      )}
    </dialog>
  );
}
