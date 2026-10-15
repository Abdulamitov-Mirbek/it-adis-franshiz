import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  value: number;
  suffix?: string;
  /** 2022 — год: без разделителей разрядов. */
  plain?: boolean;
  durationMs?: number;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Счётчик от 0 до значения за 1.3 с, cubic ease-out (раздел 7 ТЗ).
 * При reduced-motion — сразу итоговое значение.
 */
export function Counter({ value, suffix = '', plain = false, durationMs = 1300 }: Props) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [shown, setShown] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setShown(value);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setShown(Math.round(easeOut(progress) * value));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [inView, reduced, value, durationMs]);

  const text = plain ? String(shown) : shown.toLocaleString('ru-RU');

  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}
