import { useCallback, useState } from 'react';
import { Counter } from '@/components/ui/Counter';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { getHeroVisual } from '@/content/heroVisual';
import { track } from '@/lib/analytics';
import { Copy, useLanguage } from '@/content/Language';

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
        <div
          key={line.v}
          style={line.t === 'code-indent' ? { paddingLeft: 16 } : undefined}
        >
          <span className={line.t === 'comment' ? 'cm' : undefined}>
            {line.t === 'comment'
              ? line.v
              : line.v
                  .split(/\b(for|in|const|await|void|main|runApp)\b/g)
                  .map((part, index) => (
                    <span
                      key={index}
                      className={
                        /^(for|in|const|await|void|main|runApp)$/.test(part)
                          ? 'code-keyword'
                          : undefined
                      }
                    >
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
  const { isKg } = useLanguage();
  const HERO = getHeroVisual(isKg);
  const [scene3d, setScene3d] = useState(false);
  const onReady = useCallback((ready: boolean) => setScene3d(ready), []);

  return (
    <section
      className={`hero hero--localized ${scene3d ? 'is-3d' : ''}`}
      id="top"
    >
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__inner">
        <div className="wrap">
          <span className="hero__chip">
            <span className="dot" />
            <Copy id="eyebrow" />
          </span>

          <h1 className="t-hero">
            <Copy id="heroTitle" />
          </h1>

          <p className="hero__lead">
            <Copy id="heroText" />
          </p>

          <div className="hero__actions">
            <a
              className="btn"
              href="#money"
              onClick={() => track('cta_click', { placement: 'hero' })}
            >
              <Copy id="heroCta" />
            </a>
            <a className="btn btn--on-dark" href="#franchise">
              <Copy id="heroSecondary" />
            </a>
          </div>

          <p className="hero__micro">
            <Copy id="heroNote" />
          </p>
          <div className="hero__summary">
            <span className="t-mono accent-lime">
              <Copy id="ready" />
            </span>
            <h2>
              <Copy id="cardTitle" />
            </h2>
            <p>
              <Copy id="cardText" />
            </p>
          </div>

          <div className="hero__visual">
            <SceneCanvas
              variant="hero"
              className="hero__canvas"
              onReady={onReady}
            />
            {/* Запасная сцена: видна без WebGL и без JS */}
            <div className="fallback-scene" aria-hidden="true">
              <div className="code-stack">
                <CodeCard
                  className="code-card--py"
                  lang={HERO.cards.python.lang}
                  lines={HERO.cards.python.lines}
                />
                <CodeCard
                  className="code-card--js"
                  lang={HERO.cards.javascript.lang}
                  lines={HERO.cards.javascript.lines}
                />
                <CodeCard
                  className="code-card--fl"
                  lang={HERO.cards.flutter.lang}
                  lines={HERO.cards.flutter.lines}
                />
              </div>

              <div className="diploma">
                <b>{isKg ? 'Диплом' : HERO.diploma.title}</b>
                <small>
                  {isKg ? 'Үч тилдеги сертификат' : HERO.diploma.sub}
                </small>
                <div className="diploma__langs">
                  {HERO.diploma.langs.map((lang) => (
                    <span key={lang}>{lang}</span>
                  ))}
                </div>
              </div>

              <div className="sticker">
                <b>{HERO.sticker.top}</b>
                <span>{isKg ? 'практика' : HERO.sticker.bottom}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-strip">
        <div className="wrap stat-strip__inner">
          {[
            { value: 3500, suffix: '+', label: 'students' },
            { value: 2022, suffix: '', label: 'founded', plain: true },
            { value: 2, suffix: '', label: 'formats' },
          ].map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="stat__value">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  plain={'plain' in stat && stat.plain}
                />
              </div>
              <span className="stat__label">
                <Copy id={stat.label as 'students' | 'founded' | 'formats'} />
              </span>
            </div>
          ))}
          <div className="scroll-hint">
            <i />
            {isKg ? 'Ылдый жылдырыңыз' : 'Листайте'}
          </div>
        </div>
      </div>
    </section>
  );
}
