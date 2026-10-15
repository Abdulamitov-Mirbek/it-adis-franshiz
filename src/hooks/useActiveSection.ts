import { useEffect, useState } from 'react';

/** Какой экран сейчас на виду — для рельса прогресса и меню. */
export function useActiveSection(ids: readonly string[], offset = 0.45): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * offset;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return active;
}
