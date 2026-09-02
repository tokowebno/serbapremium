"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Dictionary, LanguageCode, dictionaries } from "@/lib/i18n/dictionaries";

interface I18nContextType {
  lang: LanguageCode;
  t: Dictionary;
  setLang: (code: LanguageCode) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "id",
  t: dictionaries.id,
  setLang: () => {},
});

export function I18nProvider({
  children,
  lang: initialLang = "id",
}: {
  children: ReactNode;
  lang?: LanguageCode;
}) {
  const [lang, setLangState] = useState<LanguageCode>(initialLang);

  useEffect(() => {
    // Membaca cookie atau localStorage jika ada di client
    const cookieMatch = document.cookie.match(/(?:serbapremium-lang|tokono-lang)=([^;]+)/);
    if (cookieMatch && cookieMatch[1] && dictionaries[cookieMatch[1] as LanguageCode]) {
      setLangState(cookieMatch[1] as LanguageCode);
    }
  }, []);

  const setLang = (code: LanguageCode) => {
    const valid = dictionaries[code] ? code : "id";
    setLangState(valid);
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `serbapremium-lang=${valid}; path=/; expires=${expires}; SameSite=Lax;`;
    document.cookie = `tokono-lang=${valid}; path=/; expires=${expires}; SameSite=Lax;`;
    localStorage.setItem("serbapremium:lang", valid);
    window.location.reload();
  };

  const t = dictionaries[lang] ?? dictionaries.id;

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
