import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import ru from './locales/ru.json';
import kg from './locales/kg.json';

export type Language = 'ru' | 'kg';
export type CopyKey = keyof typeof ru;
const dictionaries: Record<Language, typeof ru> = { ru, kg };
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('itadis-language') === 'kg' ? 'kg' : 'ru';
    } catch {
      return 'ru';
    }
  });
  useEffect(() => {
    document.documentElement.lang = language === 'kg' ? 'ky' : 'ru';
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', language === 'kg' ? 'ky_KG' : 'ru_RU');
    try {
      localStorage.setItem('itadis-language', language);
    } catch {
      /* Storage can be unavailable. */
    }
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return {
    ...context,
    copy: dictionaries[context.language],
    isKg: context.language === 'kg',
  };
}

/** The prototype's only rich-text markers are line breaks and emphasis. */
export function InlineText({ text }: { text: string }) {
  let emphasis = false;
  return (
    <>
      {text.split(/(<br\s*\/?\s*>|<\/?em>)/gi).map((part, index) => {
        if (/^<br/i.test(part)) return <br key={index} />;
        if (part === '<em>') {
          emphasis = true;
          return null;
        }
        if (part === '</em>') {
          emphasis = false;
          return null;
        }
        return emphasis ? (
          <em className="accent-lime" key={index}>
            {part}
          </em>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
}

export function Copy({ id }: { id: CopyKey }) {
  const { copy } = useLanguage();
  return (
    <span data-copy={id}>
      <InlineText text={copy[id]} />
    </span>
  );
}
