import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type Translations } from '../data/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('merantaw_lang') as Language | null;
    if (saved === 'en' || saved === 'id') {
      setLangState(saved);
      document.documentElement.lang = saved;
    } else {
      // Auto-detect browser language if Indonesian
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('id')) {
        setLangState('id');
        document.documentElement.lang = 'id';
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    try {
      localStorage.setItem('merantaw_lang', newLang);
    } catch {
      // fallback for private mode
    }
  };

  const currentTranslations = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Default fallback to English if used outside provider
    return {
      lang: 'en',
      setLang: () => {},
      t: translations.en
    };
  }
  return context;
};
