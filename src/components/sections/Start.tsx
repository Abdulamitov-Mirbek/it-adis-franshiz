import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { START } from '@/content/content';

export function Start() {
  return (
    <section className="section" id="start">
      <span className="ghost-num" aria-hidden="true">
        04
      </span>
      <div className="wrap">
        <SectionHead eyebrow={START.eyebrow} index="04" title={START.title} />

        <div className="start-grid">
          <Reveal className="card fit">
            <h3 className="t-h3">{START.fitTitle}</h3>
            <ul className="fit__list">
              {START.fit.map((item) => (
                <li key={item}>
                  <span className="tick tick--yes">
                    <Icon name="check" size={13} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="fit__sub">{START.notFitTitle}</p>
            <ul className="fit__list">
              {START.notFit.map((item) => (
                <li key={item}>
                  <span className="tick tick--no">
                    <Icon name="warn" size={13} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="card steps" delay={80}>
            <h3 className="t-h3">{START.stepsTitle}</h3>
            <ol className="steps__list">
              {START.steps.map((step, index) => (
                <li className="step" key={step.title}>
                  <span className="step__num">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <b>{step.title}</b>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="now" delay={60}>
          <h3>
            {START.now.title} <em className="accent-i">{START.now.titleAccent}</em>
            {START.now.titleTail}
          </h3>
          <div className="now__grid">
            {START.now.items.map((item, index) => (
              <div className="now__item" key={item.title}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                <b>{item.title}</b>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
