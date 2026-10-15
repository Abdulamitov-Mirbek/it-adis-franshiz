import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { THANKS } from '@/content/content';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { track } from '@/lib/analytics';

export function Thanks() {
  const location = useLocation();
  const name = (location.state as { name?: string } | null)?.name ?? '';

  useDocumentMeta('Заявка получена — Франшиза IT ADIS', THANKS.text, '/thanks');

  useEffect(() => {
    track('thanks_view');
  }, []);

  return (
    <main className="page" id="main">
      <div className="wrap page__inner">
        <span className="eyebrow">
          <span className="dot" />
          Заявка принята
        </span>
        <h1 style={{ marginTop: 18 }}>{THANKS.title(name)}</h1>
        <p>{THANKS.text}</p>
        <Link className="btn" to="/">
          {THANKS.back}
        </Link>
      </div>
    </main>
  );
}
