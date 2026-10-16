import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useLanguage, type Language } from '@/content/Language';

export function LanguageSwitcher() {
  const { language, setLanguage, isKg } = useLanguage();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    container.current
      ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ?.focus();
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const choose = (next: Language) => {
    setLanguage(next);
    setOpen(false);
    trigger.current?.focus();
  };
  const navigate = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ),
    ];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp')
      next = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next]?.focus();
  };

  return (
    <div
      className="language-picker"
      ref={container}
      onBlur={(event) => {
        // Safari can blur a tapped option without focusing another element.
        // Outside taps are handled by the document pointerdown listener.
        const nextTarget = event.relatedTarget;
        if (nextTarget && !event.currentTarget.contains(nextTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        id={`${id}-trigger`}
        type="button"
        className="language-switch"
        aria-label={isKg ? 'Тилди тандоо' : 'Выбрать язык'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {isKg ? 'RU / KG' : 'KG / RU'}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m3 4.5 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          className="language-menu"
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          onKeyDown={navigate}
        >
          {(
            [
              { value: 'ru', code: 'RU' },
              { value: 'kg', code: 'KG' },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              className="language-option"
              type="button"
              role="menuitemradio"
              aria-checked={language === option.value}
              lang={option.value === 'kg' ? 'ky' : 'ru'}
              onClick={() => choose(option.value)}
            >
              <span className="language-option__code">{option.code}</span>
              <span className="language-option__check" aria-hidden="true">
                {language === option.value ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
