import { createElement, type ElementType, type ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
}

/**
 * Появление блока: сдвиг 26px + прозрачность, 0.7s, один раз при 12%
 * видимости (раздел 7 ТЗ). Контент остаётся в разметке всегда:
 * без JS класс .is-visible не нужен — см. .no-js .rise в base.css.
 */
export function Reveal({ children, as = 'div', className = '', delay = 0, id }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return createElement(
    as,
    {
      ref,
      id,
      className: `rise ${inView ? 'is-visible' : ''} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
