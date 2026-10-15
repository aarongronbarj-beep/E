import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'fi' | 'en';

export const LANGS: Lang[] = ['fi', 'en'];

/** Finnish unless the visitor has picked English before. */
const DEFAULT_LANG: Lang = 'fi';
const STORAGE_KEY = 'ealize-lang';

function storedLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'fi' || v === 'en') return v;
  } catch {
    // Storage blocked (private mode etc.): fall back to the default.
  }
  return DEFAULT_LANG;
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(storedLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Not remembered across visits, but the switch still works.
    }
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Picks this language's entry from a `{ fi, en }` copy table. */
export function useCopy<T>(copy: Record<Lang, T>): T {
  return copy[useLang().lang];
}
