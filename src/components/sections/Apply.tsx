import { Icon } from '@/components/ui/Icon';
import { LeadForm } from '@/components/form/LeadForm';
import { Reveal } from '@/components/ui/Reveal';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { SectionHead } from '@/components/ui/SectionHead';
import { APPLY } from '@/content/content';
import { track } from '@/lib/analytics';
import type { LeadValues } from '@/components/form/leadSchema';

interface Props {
  format: LeadValues['format'];
  onFormatChange: (value: LeadValues['format']) => void;
}

export function Apply({ format, onFormatChange }: Props) {
  return (
    <section className="apply" id="apply">
      <SceneCanvas variant="apply" className="apply__canvas" minWidth={900} />

      <div className="wrap">
        <div className="apply__grid">
          <div>
            <SectionHead
              eyebrow={APPLY.eyebrow}
              index="05"
              tone="dark"
              title={
                <>
                  {APPLY.titleLead} <em className="accent-i">{APPLY.titleAccent}</em>
                </>
              }
            />

            <p className="apply__lead">{APPLY.lead}</p>

            <div className="faq">
              {APPLY.faq.map((item, index) => (
                <details
                  key={item.q}
                  open={index === 0}
                  onToggle={(event) => {
                    if ((event.currentTarget as HTMLDetailsElement).open) {
                      track('faq_open', { question_index: index });
                    }
                  }}
                >
                  <summary>
                    {item.q}
                    <Icon name="chevron" size={18} />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <LeadForm format={format} onFormatChange={onFormatChange} />
        </div>
      </div>
    </section>
  );
}
