import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** section_view — блок появился в зоне видимости на 50% (раздел 9 ТЗ). */
export function useSectionTracking(sections: string[]): void {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const seen = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            track('section_view', { section: id });
          }
        }
      },
      { threshold: 0.5 },
    );

    for (const id of sections) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [sections]);
}
