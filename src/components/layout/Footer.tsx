import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Copy, useLanguage } from '@/content/Language';
import { CONTACT_LIST } from '@/lib/config';
import { track } from '@/lib/analytics';

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
              <a href="tel:+996701882882">+996 701 882 882</a>
              <br />
              <a href="mailto:itadiskg1@gmail.com">itadiskg1@gmail.com</a>
            </p>
          </div>

          <div className="footer__links">
            {nav.map((item) => (
              <a key={item.target} href={`/#${item.target}`}>
                <Copy id={item.label} />
              </a>
            ))}
            <Link to="/privacy">
              {isKg ? 'Купуялык саясаты' : 'Политика конфиденциальности'}
            </Link>
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

        <div className="prototype-footer-note">
          <Copy id="footerDisclaimer" />
        </div>

        <div className="footer__bottom">
          <span>IT ADIS менен келечектин адиси бол!</span>
          <span>© {new Date().getFullYear()} IT ADIS</span>
        </div>
      </div>
    </footer>
  );
}
