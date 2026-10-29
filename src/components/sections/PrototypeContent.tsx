import { useEffect, useState } from 'react';
import { Copy, useLanguage, type CopyKey } from '@/content/Language';
import { Reveal } from '@/components/ui/Reveal';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { PrototypeLeadForm } from '@/components/form/PrototypeLeadForm';
import { PhotoGallery } from '@/components/sections/PhotoGallery';
import { track } from '@/lib/analytics';
import { BUSINESS_CONTACT } from '@/lib/config';
import { calculatePayback, PAYBACK_PLANS, type Rooms } from '@/lib/payback';
import type { LeadValues } from '@/components/form/leadSchema';

type Format = LeadValues['format'];
function Heading({
  kicker,
  title,
  sub,
  index,
}: {
  kicker: CopyKey;
  title: CopyKey;
  sub?: CopyKey;
  index: string;
}) {
  return (
    <Reveal className="sec-head">
      <div className="sec-head__top">
        <span className="eyebrow">
          <span className="dot" />
          <Copy id={kicker} />
        </span>
        <span className="sec-head__rule" />
        <span className="sec-head__index">
          <b>{index}</b> / 09
        </span>
      </div>
      <h2 className="t-h2">
        <Copy id={title} />
      </h2>
      {sub && (
        <p className="sec-head__sub">
          <Copy id={sub} />
        </p>
      )}
    </Reveal>
  );
}

function Checklist({
  items,
  negative = false,
}: {
  items: CopyKey[];
  negative?: boolean;
}) {
  return (
    <ul className="fit__list">
      {items.map((id) => (
        <li key={id}>
          <span
            className={`tick ${negative ? 'tick--no' : 'tick--yes'}`}
            aria-hidden="true"
          >
            {negative ? '×' : '✓'}
          </span>
          <Copy id={id} />
        </li>
      ))}
    </ul>
  );
}

export function PrototypeContent() {
  const { copy, isKg } = useLanguage();
  const [format, setFormat] = useState<Format>('b2g');
  const [rooms, setRooms] = useState<Rooms>(1);
  const [city, setCity] = useState('');
  const [leadCity, setLeadCity] = useState('');
  const [revenue, setRevenue] = useState(String(PAYBACK_PLANS[1].revenue.min));
  // Паушальный взнос 1 кабинета совпадает с B2G, 2 кабинетов — с «Центром».
  const calcFormat = rooms === 1 ? 'b2g' : 'center';
  const [leadVisible, setLeadVisible] = useState(false);
  useEffect(() => {
    const form = document.getElementById('lead');
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) =>
      setLeadVisible(entry.isIntersecting),
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  const revenueNumber = Number(revenue);
  const payback = calculatePayback(
    rooms,
    Number.isFinite(revenueNumber) ? Math.max(0, revenueNumber) : 0,
  );
  const changeRooms = (next: Rooms) => {
    setRooms(next);
    setRevenue(String(PAYBACK_PLANS[next].revenue.min));
  };
  const money = (value: number) =>
    `${new Intl.NumberFormat('ru-RU').format(Math.round(value))} сом`;
  const months = (value: number) =>
    `${new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)} ${isKg ? 'ай' : 'мес.'}`;
  const choose = (next: Format) => {
    setFormat(next);
    track('format_select', { format: next, source: 'formats' });
  };

  return (
    <>
      <section className="section" id="why">
        <div className="wrap">
          <Heading
            kicker="marketKicker"
            title="marketTitle"
            sub="marketSub"
            index="01"
          />
          <div className="prototype-stats">
            {(
              [
                [
                  '59%',
                  'stat1',
                  'World Economic Forum · Future of Jobs Report 2025',
                ],
                ['+178%', 'stat2', 'GitHub Octoverse 2025'],
                ['36 млн+', 'stat3', 'GitHub Octoverse 2025'],
              ] as const
            ).map(([value, id, source]) => (
              <Reveal className="card prototype-stat" key={id}>
                <strong>{value}</strong>
                <p>
                  <Copy id={id} />
                </p>
                <small>{source}</small>
              </Reveal>
            ))}
          </div>
          <p className="prototype-note">
            <Copy id="statDisclaimer" />
          </p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Heading
            kicker="problemKicker"
            title="problemTitle"
            sub="problemSub"
            index="02"
          />
          <div className="prototype-pair">
            <Reveal className="card fit">
              <h3 className="t-h3">
                <Copy id="aloneTitle" />
              </h3>
              <Checklist
                negative
                items={['alone1', 'alone2', 'alone3', 'alone4']}
              />
            </Reveal>
            <Reveal className="card fit prototype-highlight">
              <h3 className="t-h3">
                <Copy id="withTitle" />
              </h3>
              <Checklist items={['with1', 'with2', 'with3', 'with4']} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="franchise">
        <div className="wrap">
          <Heading
            kicker="includedKicker"
            title="includedTitle"
            sub="includedSub"
            index="03"
          />
          <div className="prototype-features">
            {(
              ['LEARN', 'TEAM', 'GROW', 'LAUNCH', 'QUALITY', 'AREA'] as const
            ).map((name, index) => (
              <Reveal className="card prototype-feature" key={name}>
                <span className="t-mono">
                  {String(index + 1).padStart(2, '0')} / {name}
                </span>
                <h3 className="t-h3">
                  <Copy id={`feat${index + 1}t` as CopyKey} />
                </h3>
                <p>
                  <Copy id={`feat${index + 1}p` as CopyKey} />
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <Heading
            kicker="aboutKicker"
            title="aboutTitle"
            sub="aboutText"
            index="04"
          />
          <div className="prototype-stats">
            {(
              [
                ['3 500+', 'aboutStat1', 'aboutSmall1'],
                ['80–90%', 'aboutStat2', 'aboutSmall2'],
                ['3', 'aboutStat3', null],
              ] as const
            ).map(([value, id, small]) => (
              <Reveal className="card prototype-stat" key={id}>
                <strong>{value}</strong>
                <p>
                  <Copy id={id} />
                </p>
                <small>
                  {small ? (
                    <Copy id={small} />
                  ) : (
                    'Python · JavaScript · Flutter'
                  )}
                </small>
              </Reveal>
            ))}
          </div>
          <p className="prototype-note">
            <Copy id="aboutDisclaimer" />
          </p>
        </div>
      </section>

      <PhotoGallery />

      <section className="section" id="money">
        <div className="wrap">
          <Heading
            kicker="moneyKicker"
            title="moneyTitle"
            sub="moneySub"
            index="05"
          />
          <div className="prototype-pair">
            {(['b2g', 'center'] as const).map((key) => (
              <Reveal className="card price prototype-price" key={key}>
                <span className="price__tag">
                  <Copy id={key === 'b2g' ? 'b2gTag' : 'fullTag'} />
                </span>
                <h3>
                  <Copy id={key === 'b2g' ? 'b2gTitle' : 'fullTitle'} />
                </h3>
                <p className="price__desc">
                  <Copy id={key === 'b2g' ? 'b2gDesc' : 'fullDesc'} />
                </p>
                <div className="prototype-price__value">
                  {money(key === 'b2g' ? 200000 : 500000)}
                </div>
                <dl className="price__list">
                  {(
                    [
                      ['fee', money(key === 'b2g' ? 200000 : 500000)],
                      [
                        'startInvestment',
                        money(PAYBACK_PLANS[key === 'b2g' ? 1 : 2].investment),
                      ],
                      [
                        'area',
                        `${PAYBACK_PLANS[key === 'b2g' ? 1 : 2].area} м²`,
                      ],
                    ] as const
                  ).map(([label, value]) => (
                    <div className="prototype-cost" key={label}>
                      <dt>
                        <Copy id={label} />
                      </dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  className="btn btn--block"
                  href="#lead"
                  onClick={() => choose(key)}
                >
                  <Copy id={key === 'b2g' ? 'chooseB2G' : 'chooseCenter'} />
                </a>
              </Reveal>
            ))}
          </div>
          <div className="prototype-pair prototype-calculator" id="calculator">
            <div className="card prototype-panel">
              <h3 className="t-h3">
                <Copy id="calcTitle" />
              </h3>
              <p className="prototype-note">
                <Copy id="calcText" />
              </p>
              <div className="field">
                <label htmlFor="calc-rooms">
                  <Copy id="roomsLabel" />
                </label>
                <select
                  id="calc-rooms"
                  value={rooms}
                  onChange={(e) => changeRooms(Number(e.target.value) as Rooms)}
                >
                  <option value={1}>1 кабинет · 25 м²</option>
                  <option value={2}>
                    {isKg ? '2 кабинет · 75 м²' : '2 кабинета · 75 м²'}
                  </option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="calc-revenue">
                  <Copy id="revenueLabel" />
                </label>
                <input
                  id="calc-revenue"
                  type="number"
                  min="0"
                  max="1000000000"
                  step="1000"
                  inputMode="numeric"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
                <input
                  className="prototype-range"
                  type="range"
                  aria-label={copy.revenueLabel}
                  min={PAYBACK_PLANS[rooms].revenue.min}
                  max={PAYBACK_PLANS[rooms].revenue.max}
                  step="10000"
                  value={Math.min(
                    PAYBACK_PLANS[rooms].revenue.max,
                    Math.max(PAYBACK_PLANS[rooms].revenue.min, revenueNumber || 0),
                  )}
                  onChange={(e) => setRevenue(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="calc-city">
                  <Copy id="cityLabel" />
                </label>
                <input
                  id="calc-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={
                    isKg ? 'Мисалы, Ош / Бишкек' : 'Например, Ош / Бишкек'
                  }
                  autoComplete="address-level2"
                />
              </div>
              <button
                className="btn btn--ghost btn--block"
                type="button"
                onClick={() =>
                  track('budget_calculate', { format: calcFormat, rooms })
                }
              >
                <Copy id="calcBtn" />
              </button>
            </div>
            <div className="card prototype-panel prototype-estimate">
              <span className="eyebrow">
                <Copy id="estimate" />
              </span>
              <div
                className="prototype-result"
                aria-live="polite"
                aria-atomic="true"
              >
                <p>
                  <Copy id="totalEstimate" />
                </p>
                <strong id="calc-total">
                  {payback.paybackMonths === null
                    ? '—'
                    : months(payback.paybackMonths)}
                </strong>
                {payback.paybackMonths === null && (
                  <p>
                    <Copy id="noPayback" />
                  </p>
                )}
                <dl className="prototype-result__list">
                  {(
                    [
                      ['netProfit', money(payback.netProfit)],
                      ['investmentLabel', money(payback.investment)],
                      ['fee', money(payback.fee)],
                      ['area', `${payback.area} м²`],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt>
                        <Copy id={label} />
                      </dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="prototype-note">
                <Copy id="calcDisclaimer" />
              </p>
              <a
                className="btn btn--block"
                href="#lead"
                onClick={() => {
                  choose(calcFormat);
                  setLeadCity(city);
                }}
              >
                <Copy id="getPersonal" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="steps">
        <div className="wrap">
          <Heading
            kicker="stepsKicker"
            title="stepsTitle"
            sub="stepsSub"
            index="06"
          />
          <div className="prototype-steps">
            {[1, 2, 3, 4, 5].map((n) => (
              <Reveal className="card prototype-step" key={n}>
                <span className="t-num accent-lime">0{n}</span>
                <h3 className="t-h3">
                  <Copy id={`step${n}t` as CopyKey} />
                </h3>
                <p>
                  <Copy id={`step${n}p` as CopyKey} />
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Heading kicker="partnerKicker" title="partnerTitle" index="07" />
          <div className="prototype-pair">
            <Reveal className="card fit">
              <h3 className="t-h3">
                <Copy id="goodFit" />
              </h3>
              <Checklist items={['fit1', 'fit2', 'fit3', 'fit4']} />
            </Reveal>
            <Reveal className="card fit">
              <h3 className="t-h3">
                <Copy id="notFit" />
              </h3>
              <Checklist negative items={['not1', 'not2', 'not3']} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="faq">
        <div className="wrap">
          <Heading kicker="faqKicker" title="faqTitle" index="08" />
          <div className="prototype-faq">
            {[1, 2, 3, 4, 5].map((n) => (
              <details className="card" key={n}>
                <summary>
                  <Copy id={`q${n}` as CopyKey} />
                  <span aria-hidden="true">+</span>
                </summary>
                <p>
                  <Copy id={`a${n}` as CopyKey} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="apply prototype-apply" id="apply">
        <SceneCanvas variant="apply" className="apply__canvas" />
        <div className="wrap apply__grid">
          <div>
            <Heading
              kicker="finalKicker"
              title="finalTitle"
              sub="finalText"
              index="09"
            />
            <div className="prototype-contact">
              <a href={`tel:${BUSINESS_CONTACT.phone}`}>
                {BUSINESS_CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${BUSINESS_CONTACT.email}`}>
                {BUSINESS_CONTACT.email}
              </a>
              <p>IT ADIS менен келечектин адиси бол!</p>
            </div>
          </div>
          <PrototypeLeadForm
            format={format}
            city={leadCity}
            onFormatChange={setFormat}
          />
        </div>
      </section>
      <a
        className={`btn mobile-lead-cta ${leadVisible ? 'is-hidden' : ''}`}
        href="#lead"
      >
        <Copy id="mobileCta" />
      </a>
    </>
  );
}
