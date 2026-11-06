"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Dictionary, LanguageCode, dictionaries } from "@/lib/i18n/dictionaries";

interface I18nContextType {
  lang: LanguageCode;
  t: Dictionary;
  setLang: (code: LanguageCode) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  t: dictionaries.en,
  setLang: () => {},
});

export function I18nProvider({
  children,
  lang: initialLang = "en",
}: {
  children: ReactNode;
  lang?: LanguageCode;
}) {
  const [lang, setLangState] = useState<LanguageCode>(initialLang);

  useEffect(() => {
    // Membaca cookie atau localStorage jika ada di client, atau auto-detect dari Telegram WebApp / Browser
    const cookieMatch = document.cookie.match(/(?:serbapremium-lang|tokono-lang)=([^;]+)/);
    if (cookieMatch && cookieMatch[1] && dictionaries[cookieMatch[1] as LanguageCode]) {
      setLangState(cookieMatch[1] as LanguageCode);
      return;
    }
    const tgLang = (
      (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.language_code ||
      navigator.language ||
      "en"
    ).toLowerCase();
    if (tgLang.startsWith("id") || tgLang.startsWith("ms")) {
      setLangState("id");
    } else if (tgLang.startsWith("zh")) {
      setLangState("zh");
    } else {
      setLangState("en");
    }
  }, []);

  const setLang = (code: LanguageCode) => {
    const valid = dictionaries[code] ? code : "en";
    setLangState(valid);
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `serbapremium-lang=${valid}; path=/; expires=${expires}; SameSite=Lax;`;
    document.cookie = `tokono-lang=${valid}; path=/; expires=${expires}; SameSite=Lax;`;
    localStorage.setItem("serbapremium:lang", valid);
    window.location.reload();
  };

  const t = dictionaries[lang] ?? dictionaries.en;

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
