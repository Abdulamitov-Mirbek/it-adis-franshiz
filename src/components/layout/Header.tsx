import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { NAV } from '@/content/content';
import { track } from '@/lib/analytics';

interface Props {
  active?: string;
}

export function Header({ active }: Props) {
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
        <a className="header__logo" href="#top" aria-label="IT ADIS — наверх">
          <Logo height={52} />
        </a>

        <nav className="header__nav" aria-label="Основная навигация">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.target ? 'true' : undefined}
              onClick={() => track('nav_click', { target: item.target })}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn--sm"
          href="#apply"
          onClick={() => track('cta_click', { placement: 'header' })}
        >
          Получить КП
        </a>
      </div>
      <div className="header__progress" style={{ ['--progress' as string]: `${progress}%` }} />
    </header>
  );
}
