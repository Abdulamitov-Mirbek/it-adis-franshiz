import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Copy, useLanguage } from '@/content/Language';
import { track } from '@/lib/analytics';

interface Props {
  active?: string;
}

export function Header({ active }: Props) {
  const { isKg } = useLanguage();
  const nav = [
    { target: 'why', label: 'navWhy' },
    { target: 'franchise', label: 'navFranchise' },
    { target: 'money', label: 'navMoney' },
    { target: 'steps', label: 'navSteps' },
  ] as const;
  const [stuck, setStuck] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${stuck ? 'is-stuck' : ''}`}>
      <div className="wrap header__inner">
        <a
          className="header__logo"
          href="/#top"
          aria-label={isKg ? 'IT ADIS — башына' : 'IT ADIS — наверх'}
        >
          <Logo height={52} />
        </a>

        <nav
          className="header__nav"
          aria-label={isKg ? 'Негизги навигация' : 'Основная навигация'}
        >
          {nav.map((item) => (
            <a
              key={item.target}
              href={`/#${item.target}`}
              aria-current={active === item.target ? 'true' : undefined}
              onClick={() => track('nav_click', { target: item.target })}
            >
              <Copy id={item.label} />
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher />
          <a
            className="btn btn--sm header__cta"
            href="/#lead"
            onClick={() => track('cta_click', { placement: 'header' })}
          >
            <Copy id="navCta" />
          </a>
        </div>
      </div>
      <div
        className="header__progress"
        style={{ ['--progress' as string]: `${progress}%` }}
      />
    </header>
  );
}
