import { Hero } from '@/components/sections/Hero';
import { PrototypeContent } from '@/components/sections/PrototypeContent';
import { useLanguage } from '@/content/Language';
import { useSectionTracking } from '@/hooks/useSectionTracking';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const SECTIONS = ['why', 'franchise', 'money', 'steps', 'apply'];
export function Home() {
  const { isKg } = useLanguage();
  useDocumentMeta(
    isKg
      ? 'IT ADIS франшизасы — Кыргызстанда IT-академия ачыңыз'
      : 'Франшиза IT ADIS (Айти Адис) — IT-академия для детей в Кыргызстане',
    isKg
      ? 'IT ADIS IT-академиясынын франшизасы: Бишкек, Ош жана бүт Кыргызстан. Эки формат: «Борбор» жана мектептеги класс (B2G). Франшиза төлөмү 200 000 сомдон, окутуу жана ишке киргизүүгө колдоо.'
      : 'Франшиза IT-академии IT ADIS в Бишкеке, Оше и по всему Кыргызстану. Два формата: «Центр» и класс в школе (B2G). Паушальный взнос от 200 000 сом, обучение и поддержка запуска, калькулятор окупаемости.',
    '/',
  );
  useSectionTracking(SECTIONS);
  return (
    <main id="main">
      <Hero />
      <PrototypeContent />
    </main>
  );
}
