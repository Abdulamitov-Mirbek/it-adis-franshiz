import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { FOOTER, NAV } from '@/content/content';
import { CONTACT_LIST } from '@/lib/config';
import { track } from '@/lib/analytics';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a className="footer__logo" href="#top" aria-label="IT ADIS — наверх">
              <Logo height={56} />
            </a>
            <p>{FOOTER.text}</p>
          </div>

          <div className="footer__links">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <Link to="/privacy">{FOOTER.privacy}</Link>
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
          <span>{FOOTER.slogan}</span>
          <span>© {new Date().getFullYear()} IT ADIS</span>
        </div>
      </div>
    </footer>
  );
}
