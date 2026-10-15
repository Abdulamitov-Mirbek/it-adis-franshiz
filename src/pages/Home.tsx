import { useEffect, useState } from 'react';
import { Hero } from '@/components/sections/Hero';
import { WhyItWorks } from '@/components/sections/WhyItWorks';
import { Formats } from '@/components/sections/Formats';
import { Start } from '@/components/sections/Start';
import { Apply } from '@/components/sections/Apply';
import { useSectionTracking } from '@/hooks/useSectionTracking';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { META, type FormatKey } from '@/content/content';
import { track } from '@/lib/analytics';
import type { LeadValues } from '@/components/form/leadSchema';

const SECTIONS = ['why', 'formats', 'start', 'apply'];

export function Home() {
  useDocumentMeta(META.title, META.description, '/');
  useSectionTracking(SECTIONS);

  /** Активная вкладка формата и значение поля «Формат» в форме. */
  const [tab, setTab] = useState<FormatKey>('center');
  const [formFormat, setFormFormat] = useState<LeadValues['format']>('center');

  useEffect(() => {
    track('page_view');
  }, []);

  const selectTab = (key: FormatKey) => {
    setTab(key);
    track('format_select', { format: key, source: 'tab' });
  };

  /** Кнопка «Получить КП по формату …» — подставляет формат в форму. */
  const chooseFormat = (key: FormatKey) => {
    setTab(key);
    setFormFormat(key);
  };

  /** Изменение поля «Формат» в форме переключает вкладку (кроме «Пока не знаю»). */
  const changeFormFormat = (value: LeadValues['format']) => {
    setFormFormat(value);
    if (value !== 'unknown') {
      setTab(value);
      track('format_select', { format: value, source: 'form' });
    }
  };

  return (
    <main id="main">
      <Hero />
      <WhyItWorks />
      <Formats active={tab} onSelectTab={selectTab} onChooseFormat={chooseFormat} />
      <Start />
      <Apply format={formFormat} onFormatChange={changeFormFormat} />
    </main>
  );
}
