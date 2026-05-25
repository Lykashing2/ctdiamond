'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useLanguageStore } from '@/lib/stores/languageStore';
import { translations } from './translations';
import type { Language } from '@/lib/types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguageStore();

  function t(key: string): string {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
