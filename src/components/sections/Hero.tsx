import { useCallback, useState } from 'react';
import { Counter } from '@/components/ui/Counter';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { HERO } from '@/content/content';
import { track } from '@/lib/analytics';

function CodeCard({
  className,
  lang,
  lines,
}: {
  className: string;
  lang: string;
  lines: readonly { t: string; v: string }[];
}) {
  return (
    <div className={`code-card ${className}`}>
      <span className="code-card__lang">{lang}</span>
      {lines.map((line) => (
        <div key={line.v} style={line.t === 'code-indent' ? { paddingLeft: 16 } : undefined}>
          <span className={line.t === 'comment' ? 'cm' : undefined}>
            {line.t === 'comment' ? line.v : line.v.split(/\b(for|in|const|await|void|main|runApp)\b/g).map((part, index) => (
              <span key={index} className={/^(for|in|const|await|void|main|runApp)$/.test(part) ? 'code-keyword' : undefined}>
                {part}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const [scene3d, setScene3d] = useState(false);
  const onReady = useCallback((ready: boolean) => setScene3d(ready), []);

  return (
    <section className={`hero ${scene3d ? 'is-3d' : ''}`} id="top">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__inner">
        <div className="wrap">
          <span className="hero__chip">
            <span className="dot" />
            {HERO.chip}
          </span>

          <h1 className="t-hero">
            {HERO.titleLead} <em className="mark">{HERO.titleAccent}</em>
          </h1>

          <p className="hero__lead">
            {HERO.lead} <strong>{HERO.leadStrong}</strong>
          </p>

          <p className="hero__sub">{HERO.sub}</p>

          <div className="hero__actions">
            <a className="btn" href="#apply" onClick={() => track('cta_click', { placement: 'hero' })}>
              {HERO.ctaPrimary}
            </a>
            <a className="btn btn--on-dark" href="#formats">
              {HERO.ctaSecondary}
            </a>
          </div>

          <p className="hero__micro">{HERO.micro}</p>

          <div className="hero__visual">
          <SceneCanvas variant="hero" className="hero__canvas" onReady={onReady} />
          {/* Запасная сцена: видна без WebGL и без JS */}
          <div className="fallback-scene" aria-hidden="true">
            <div className="code-stack">
            <CodeCard className="code-card--py" lang={HERO.cards.python.lang} lines={HERO.cards.python.lines} />
            <CodeCard
              className="code-card--js"
              lang={HERO.cards.javascript.lang}
              lines={HERO.cards.javascript.lines}
            />
            <CodeCard className="code-card--fl" lang={HERO.cards.flutter.lang} lines={HERO.cards.flutter.lines} />
            </div>

            <div className="diploma">
              <b>{HERO.diploma.title}</b>
              <small>{HERO.diploma.sub}</small>
              <div className="diploma__langs">
                {HERO.diploma.langs.map((lang) => (
                  <span key={lang}>{lang}</span>
                ))}
              </div>
            </div>

            <div className="sticker">
              <b>{HERO.sticker.top}</b>
              <span>{HERO.sticker.bottom}</span>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="stat-strip">
        <div className="wrap stat-strip__inner">
          {HERO.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="stat__value">
                <Counter value={stat.value} suffix={stat.suffix} plain={'plain' in stat && stat.plain} />
              </div>
              <span className="stat__label">{stat.label}</span>
            </div>
          ))}
          <div className="scroll-hint">
            <i />
            Листайте
          </div>
        </div>
      </div>
    </section>
  );
}
