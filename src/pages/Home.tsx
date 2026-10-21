import { Hero } from '@/components/sections/Hero';
import { PrototypeContent } from '@/components/sections/PrototypeContent';
import { useLanguage } from '@/content/Language';
import { useSectionTracking } from '@/hooks/useSectionTracking';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const SECTIONS = ['why', 'franchise', 'money', 'steps', 'apply'];
export function Home() {
  const { isKg, copy } = useLanguage();
  useDocumentMeta(
    isKg
      ? 'IT ADIS франшизасы — IT-академия ачыңыз'
      : 'Франшиза IT ADIS — Откройте IT-академию',
    copy.heroText,
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
