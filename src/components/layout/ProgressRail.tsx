import { useLanguage } from '@/content/Language';
import { track } from '@/lib/analytics';

interface Props {
  active: string;
}

/** Вертикальный рельс экранов слева (от 1240 px). */
export function ProgressRail({ active }: Props) {
  const { copy, isKg } = useLanguage();
  const screens = [
    { id: 'top', label: copy.eyebrow },
    { id: 'why', label: copy.navWhy },
    { id: 'franchise', label: copy.navFranchise },
    { id: 'money', label: copy.navMoney },
    { id: 'steps', label: copy.navSteps },
    { id: 'apply', label: copy.finalKicker },
  ];
  return (
    <nav
      className="rail"
      aria-label={isKg ? 'Барактын бөлүмдөрү' : 'Разделы страницы'}
    >
      {screens.map((screen, index) => (
        <span key={screen.id} style={{ display: 'contents' }}>
          {index > 0 ? (
            <span className="rail__line" aria-hidden="true" />
          ) : null}
          <a
            className={`rail__item ${active === screen.id ? 'is-active' : ''}`}
            href={`#${screen.id}`}
            title={screen.label}
            aria-label={screen.label}
            aria-current={active === screen.id ? 'true' : undefined}
            onClick={() => track('nav_click', { target: screen.id })}
          >
            {String(index + 1).padStart(2, '0')}
          </a>
        </span>
      ))}
    </nav>
  );
}
