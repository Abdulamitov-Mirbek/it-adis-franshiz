import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/content/Language';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { track } from '@/lib/analytics';

export function Thanks() {
  const { isKg, copy } = useLanguage();
  const location = useLocation();
  const name = (location.state as { name?: string } | null)?.name ?? '';

  const title = isKg
    ? `Рахмат${name ? `, ${name}` : ''}! Өтүнмө кабыл алынды`
    : `Спасибо${name ? `, ${name}` : ''}! Заявка получена`;
  useDocumentMeta(title, copy.finalText, '/thanks');

  useEffect(() => {
    track('thanks_view');
  }, []);

  return (
    <main className="page" id="main">
      <div className="wrap page__inner">
        <span className="eyebrow">
          <span className="dot" />
          {isKg ? 'Өтүнмө кабыл алынды' : 'Заявка принята'}
        </span>
        <h1 style={{ marginTop: 18 }}>{title}</h1>
        <p>{copy.finalText}</p>
        <Link className="btn" to="/">
          {isKg ? 'Башкы бетке кайтуу' : 'Вернуться на главную'}
        </Link>
      </div>
    </main>
  );
}
