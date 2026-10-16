import { Link } from 'react-router-dom';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useLanguage } from '@/content/Language';

export function NotFound() {
  const { isKg } = useLanguage();
  const title = isKg ? 'Барак табылган жок' : 'Такой страницы нет';
  useDocumentMeta(`${title} — IT ADIS`, title, '/404');

  return (
    <main className="page" id="main">
      <div className="wrap page__inner">
        <div className="page__code">404</div>
        <h1 style={{ marginTop: 10 }}>{title}</h1>
        <p>
          {isKg
            ? 'Шилтеме эскирген болушу мүмкүн. IT ADIS франшизасы тууралуу маалымат үчүн башкы бетке кайтыңыз.'
            : 'Возможно, ссылка устарела. Вернитесь на главную — там всё о франшизе IT ADIS.'}
        </p>
        <Link className="btn" to="/">
          {isKg ? 'Башкы бетке' : 'На главную'}
        </Link>
      </div>
    </main>
  );
}
