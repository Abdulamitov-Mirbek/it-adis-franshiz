import logoUrl from '@/assets/logo.webp';
import type { CSSProperties } from 'react';

interface Props {
  height?: number;
  className?: string;
}

/** Логотип-локап: знак + «ITADIS». Подпись «IT АКАДЕМИЯ» — живым текстом. */
export function Logo({ height = 42, className = '' }: Props) {
  return (
    <img
      src={logoUrl}
      alt="IT ADIS — IT-академия"
      width={Math.round((height * 699) / 440)}
      height={height}
      style={{ '--logo-height': `${height}px` } as CSSProperties}
      className={`brand-logo ${className}`}
      decoding="async"
    />
  );
}
