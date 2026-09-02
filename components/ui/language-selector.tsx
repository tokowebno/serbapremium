"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, X } from "lucide-react";
import { LanguageCode } from "@/lib/i18n/dictionaries";

const languages: Array<{ code: LanguageCode; name: string; local: string; flag: string; currency: string }> = [
  { code: "id", name: "Bahasa Indonesia", local: "Mata Uang Rupiah (IDR Rp)", flag: "🇮🇩", currency: "IDR" },
  { code: "en", name: "English", local: "US Dollar Currency (USD $)", flag: "🇬🇧", currency: "USD" },
  { code: "zh", name: "简体中文", local: "美元结算 (USD $)", flag: "🇨🇳", currency: "USD" },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>("id");

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:serbapremium-lang|tokono-lang)=([^;]+)/);
    if (cookieMatch && cookieMatch[1]) {
      setCurrentLang(cookieMatch[1] as LanguageCode);
    }

    // Cek apakah sudah pernah memilih bahasa sebelumnya
    const chosen = localStorage.getItem("serbapremium:lang-chosen") || localStorage.getItem("tokono:lang-chosen");
    if (!chosen) {
      // Buka popup bahasa saat pertama kali mengunjungi web
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-language-selector", handleOpen);
    return () => window.removeEventListener("open-language-selector", handleOpen);
  }, []);

  const selectLanguage = (code: LanguageCode) => {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `serbapremium-lang=${code}; path=/; expires=${expires}; SameSite=Lax;`;
    document.cookie = `tokono-lang=${code}; path=/; expires=${expires}; SameSite=Lax;`;
    localStorage.setItem("serbapremium:lang", code);
    localStorage.setItem("serbapremium:lang-chosen", "true");
    localStorage.setItem("tokono:lang-chosen", "true");
    setIsOpen(false);
    window.location.reload();
  };

  const handleClose = () => {
    localStorage.setItem("serbapremium:lang-chosen", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-overlay backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pilih Bahasa / Select Language"
            className="relative w-full max-w-md rounded-xl border-2 border-border bg-surface p-6 shadow-[8px_8px_0px_var(--shadow-color)] sm:p-7"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between border-b-2 border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-accent-yellow text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)]">
                  <Globe size={18} strokeWidth={2.5} />
                </span>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-fg">Pilih Bahasa / Language</h2>
                  <p className="text-xs font-bold text-fg-muted">Select your language & preferred currency</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Tutup"
                className="rounded-md border-2 border-border bg-surface-2 p-1.5 text-fg transition-colors hover:bg-discount hover:text-white shadow-[1px_1px_0px_var(--shadow-color)]"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-5 space-y-2.5">
              {languages.map((lang) => {
                const active = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md border-2 border-border p-3.5 text-left shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 ${
                      active ? "bg-accent text-black font-black" : "bg-surface text-fg hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{lang.flag}</span>
                      <div>
                        <p className="text-sm font-black leading-tight">{lang.name}</p>
                        <p className="text-xs font-semibold opacity-75">{lang.local}</p>
                      </div>
                    </div>
                    {active && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-xs border border-border bg-black text-white shadow-[1px_1px_0px_var(--shadow-color)]">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
