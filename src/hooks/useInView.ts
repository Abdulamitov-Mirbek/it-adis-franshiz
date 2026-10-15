import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Доля видимости, при которой считаем блок появившимся. */
  threshold?: number;
  /** Сработать один раз и отключиться. */
  once?: boolean;
  /**
   * Страховка из раздела 7 ТЗ: если блок не появился за N мс,
   * показываем его принудительно — контент виден всегда.
   */
  failSafeMs?: number;
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.12,
  once = true,
  failSafeMs = 6000,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold },
    );

    observer.observe(node);
    const timer = window.setTimeout(() => setInView(true), failSafeMs);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [threshold, once, failSafeMs]);

  return { ref, inView } as const;
}
