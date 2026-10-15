import type { SVGProps } from 'react';

export type IconName =
  | 'book'
  | 'chip'
  | 'users'
  | 'key'
  | 'shield'
  | 'pin'
  | 'check'
  | 'warn'
  | 'arrow'
  | 'chevron';

const PATHS: Record<IconName, string> = {
  book: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Zm2 13h10M8 7h7',
  chip: 'M7 7h10v10H7zM9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2',
  users: 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5 9v-1a4 4 0 0 0-3-3.87M15.5 3.6a3.5 3.5 0 0 1 0 6.8',
  key: 'M14.5 3a6.5 6.5 0 1 0-4.6 11.1L8 16H6v2H4v3H2v-3.6l7.1-7.1A6.5 6.5 0 0 0 14.5 3Zm1.5 4.5h.01',
  shield: 'M12 3 4 6v6c0 4.4 3.4 8.3 8 9 4.6-.7 8-4.6 8-9V6l-8-3Zm-3 9 2.2 2.2L15.5 10',
  pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  check: 'm4.5 12.5 5 5 10-11',
  warn: 'M12 4 2.5 20.5h19L12 4Zm0 6v5m0 3h.01',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  chevron: 'm6 9 6 6 6-6',
};

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 22, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
