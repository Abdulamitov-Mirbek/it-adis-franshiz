import { Link } from 'react-router-dom';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export function NotFound() {
  useDocumentMeta('Страница не найдена — Франшиза IT ADIS', 'Страница не найдена.', '/404');

  return (
    <main className="page" id="main">
      <div className="wrap page__inner">
        <div className="page__code">404</div>
        <h1 style={{ marginTop: 10 }}>Такой страницы нет</h1>
        <p>Возможно, ссылка устарела. Вернитесь на главную — там всё о франшизе IT ADIS.</p>
        <Link className="btn" to="/">
          На главную
        </Link>
      </div>
    </main>
  );
}
