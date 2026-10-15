import logoUrl from '@/assets/logo.webp';
import { META } from '@/content/content';

interface Props {
  height?: number;
  className?: string;
}

/** Логотип-локап: знак + «ITADIS». Подпись «IT АКАДЕМИЯ» — живым текстом. */
export function Logo({ height = 42, className = '' }: Props) {
  return (
    <img
      src={logoUrl}
      alt={META.logoAlt}
      width={Math.round((height * 699) / 440)}
      height={height}
      style={{ height, width: 'auto' }}
      className={className}
      decoding="async"
    />
  );
}
