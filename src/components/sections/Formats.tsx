import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Marquee } from '@/components/ui/Marquee';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import {
  FORMATS,
  FORMATS_SECTION,
  FORMAT_ORDER,
  TOOLS,
  type FormatKey,
} from '@/content/content';
import { track } from '@/lib/analytics';

interface Props {
  active: FormatKey;
  onSelectTab: (key: FormatKey) => void;
  onChooseFormat: (key: FormatKey) => void;
}

export function Formats({ active, onSelectTab, onChooseFormat }: Props) {
  const [swapping, setSwapping] = useState(false);
  const [shown, setShown] = useState<FormatKey>(active);

  useEffect(() => {
    if (active === shown) return;
    setSwapping(true);
    const timer = window.setTimeout(() => {
      setShown(active);
      setSwapping(false);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [active, shown]);

  const data = FORMATS[shown];

  return (
    <section className="section section--alt" id="formats">
      <span className="ghost-num" aria-hidden="true">
        03
      </span>
      <div className="wrap">
        <SectionHead
          eyebrow={FORMATS_SECTION.eyebrow}
          index="03"
          title={FORMATS_SECTION.title}
          sub={FORMATS_SECTION.sub}
        />

        <div className="tabs-wrap">
          <div className="tabs" role="tablist" aria-label="Форматы франшизы">
            {FORMAT_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`tab-${key}`}
                className="tabs__btn"
                aria-selected={active === key}
                aria-controls="format-panel"
                tabIndex={active === key ? 0 : -1}
                onClick={() => onSelectTab(key)}
              >
                {FORMATS[key].tab}
              </button>
            ))}
          </div>
        </div>

        <div className="formats-grid">
          <Reveal className={`card price swap ${swapping ? 'is-swapping' : ''}`} id="format-panel">
            <div role="tabpanel" aria-labelledby={`tab-${shown}`}>
              <span className="price__tag">Формат</span>
              <h3>{data.title}</h3>
              <p className="price__desc">{data.desc}</p>

              <dl className="price__list">
                {(
                  [
                    ['Помещение', data.area],
                    ['Паушальный взнос', data.fee],
                    ['Инвестиции в запуск', data.inv],
                    ['Роялти', data.roy],
                  ] as const
                ).map(([label, value]) => (
                  <div className="price__item" key={label}>
                    <dt>{label}</dt>
                    <i aria-hidden="true" />
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="price__hi">
                <span>Ориентир окупаемости</span>
                <b>{data.pay}</b>
              </div>

              <a
                className="btn btn--block"
                href="#apply"
                data-format={shown}
                onClick={() => {
                  onChooseFormat(shown);
                  track('cta_click', {
                    placement: shown === 'center' ? 'formats_center' : 'formats_b2g',
                    format: shown,
                  });
                }}
              >
                {data.cta}
              </a>
            </div>
          </Reveal>

          <Reveal className="card included" delay={80}>
            <h3 className="t-h3">{FORMATS_SECTION.includedTitle}</h3>
            <ul className="included__list">
              {FORMATS_SECTION.included.map((item) => (
                <li className="included__item" key={item.title}>
                  <span className="included__icon">
                    <Icon name={item.icon as IconName} size={19} />
                  </span>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="warn" delay={60}>
          <Icon name="warn" size={18} />
          <span>{FORMATS_SECTION.disclaimer}</span>
        </Reveal>

        <div className="tools">
          <p className="tools__title">
            {FORMATS_SECTION.toolsTitle} <span>{FORMATS_SECTION.toolsTitleMuted}</span>
          </p>
          <Marquee items={TOOLS} />
        </div>
      </div>
    </section>
  );
}
