import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SCREEN_TOTAL } from '@/content/content';

interface Props {
  eyebrow: string;
  /** Номер экрана: «02» */
  index: string;
  title: ReactNode;
  sub?: string;
  tone?: 'light' | 'dark';
}

export function SectionHead({ eyebrow, index, title, sub, tone = 'light' }: Props) {
  const dark = tone === 'dark';

  return (
    <Reveal className="sec-head">
      <div className="sec-head__top">
        <span className="eyebrow" style={dark ? { color: 'var(--lime)' } : undefined}>
          <span className="dot" />
          {eyebrow}
        </span>
        <span
          className="sec-head__rule"
          style={dark ? { background: 'linear-gradient(90deg, rgb(255 255 255 / .25), transparent)' } : undefined}
        />
        <span className="sec-head__index" style={dark ? { color: '#9a9ed8' } : undefined}>
          <b>{index}</b> / {SCREEN_TOTAL}
        </span>
      </div>
      <h2 className="t-h2" style={dark ? { color: '#fff' } : undefined}>
        {title}
      </h2>
      {sub ? (
        <p className="sec-head__sub" style={dark ? { color: '#b9bcf0' } : undefined}>
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
