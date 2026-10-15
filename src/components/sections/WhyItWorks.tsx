import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { useInView } from '@/hooks/useInView';
import { WHY } from '@/content/content';

function GrowthChart() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div className="chart" ref={ref}>
      <div className="chart__row chart__row--values">
        {WHY.about.bars.map((bar) => (
          <span className="chart__value" key={bar.value}>
            {bar.value}
          </span>
        ))}
      </div>

      <div className="chart__row chart__row--tracks" aria-hidden="true">
        {WHY.about.bars.map((bar) => (
          <div className="chart__track" key={bar.value}>
            <div className="chart__bar" style={{ height: inView ? `${bar.height}%` : 0 }} />
          </div>
        ))}
      </div>

      <div className="chart__row chart__row--captions">
        {WHY.about.bars.map((bar) => (
          <span className="chart__caption" key={bar.value}>
            {'year' in bar && bar.year ? <b>{bar.year}</b> : null}
            {bar.caption}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WhyItWorks() {
  return (
    <section className="section" id="why">
      <span className="ghost-num" aria-hidden="true">
        02
      </span>
      <div className="wrap">
        <SectionHead eyebrow={WHY.eyebrow} index="02" title={WHY.title} />

        <div className="ledger">
          <div className="ledger__head" aria-hidden="true">
            <span />
            <span>{WHY.colPain}</span>
            <span>{WHY.colFix}</span>
          </div>

          {WHY.pairs.map((pair, index) => (
            <Reveal className="row" key={pair.pain} delay={index * 50}>
              <span className="row__n">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="row__who">{pair.who}</span>
                <p className="row__pain">{pair.pain}</p>
              </div>
              <div className="row__fix">
                <b>{pair.fixTitle}</b>
                <p>{pair.fix}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="why-grid">
          <Reveal className="card about">
            <span className="eyebrow">
              <span className="dot" />
              {WHY.about.eyebrow}
            </span>
            <h3 className="t-h3" style={{ marginTop: 16 }}>
              {WHY.about.title}
            </h3>
            <p>{WHY.about.text}</p>
            <GrowthChart />
          </Reveal>

          <Reveal className="card mission" delay={80}>
            <span className="eyebrow">
              <span className="dot" />
              {WHY.mission.eyebrow}
            </span>
            <p className="mission__quote">
              {WHY.mission.quote.split(WHY.mission.quoteStrong).map((part, index, parts) => (
                <span key={`${part}-${index}`}>
                  {part}
                  {index < parts.length - 1 ? <strong>{WHY.mission.quoteStrong}</strong> : null}
                </span>
              ))}
            </p>
            <p className="mission__note">{WHY.mission.text}</p>
          </Reveal>
        </div>

        <div className="facts">
          {WHY.facts.map((fact, index) => (
            <Reveal className="fact" key={fact.value} delay={index * 50}>
              <b>{fact.value}</b>
              <p>{fact.text}</p>
              {'tags' in fact && fact.tags ? (
                <div className="fact__tags">
                  {fact.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
