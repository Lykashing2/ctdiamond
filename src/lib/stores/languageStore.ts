import { create } from 'zustand';
import type { Language } from '@/lib/types';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: (typeof window !== 'undefined'
    ? (localStorage.getItem('ctd_lang') as Language)
    : null) || 'en',
  setLang: (lang: Language) => {
    localStorage.setItem('ctd_lang', lang);
    set({ lang });
  },
}));
