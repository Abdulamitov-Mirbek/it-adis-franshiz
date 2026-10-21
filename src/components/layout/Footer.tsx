import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Copy, useLanguage } from '@/content/Language';
import { BUSINESS_CONTACT, CONTACT_LIST } from '@/lib/config';
import { track } from '@/lib/analytics';
import { openPrivacySettings } from '@/lib/privacyConsent';

export function Footer() {
  const { isKg } = useLanguage();
  const nav = [
    { target: 'why', label: 'navWhy' },
    { target: 'franchise', label: 'navFranchise' },
    { target: 'money', label: 'navMoney' },
    { target: 'steps', label: 'navSteps' },
  ] as const;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a className="footer__logo" href="/#top" aria-label="IT ADIS">
              <Logo height={56} />
            </a>
            <p>
              <Copy id="footerLine" />
            </p>
            <p>
              <a href={`tel:${BUSINESS_CONTACT.phone}`}>
                {BUSINESS_CONTACT.phoneDisplay}
              </a>
              <br />
              <a href={`mailto:${BUSINESS_CONTACT.email}`}>
                {BUSINESS_CONTACT.email}
              </a>
            </p>
          </div>

          <div className="footer__links">
            {nav.map((item) => (
              <a key={item.target} href={`/#${item.target}`}>
                <Copy id={item.label} />
              </a>
            ))}
            <Link to="/privacy">
              {isKg ? 'Купуялуулук саясаты' : 'Политика конфиденциальности'}
            </Link>
            <button
              className="footer__privacy-settings"
              type="button"
              onClick={openPrivacySettings}
            >
              {isKg ? 'Cookie жөндөөлөрү' : 'Настройки cookie'}
            </button>
            {CONTACT_LIST.map(([channel, href]) => (
              <a
                key={channel}
                href={href}
                target="_blank"
                rel="noopener"
                onClick={() => track('messenger_click', { channel })}
              >
                {channel}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <span>IT ADIS менен келечектин адиси бол!</span>
          <span>© {new Date().getFullYear()} IT ADIS</span>
        </div>
      </div>
    </footer>
  );
}
