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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pilih Bahasa / Select Language"
            className="glass-card relative w-full max-w-md rounded-2xl border border-border/80 bg-surface/95 p-6 shadow-2xl backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/20">
                  <Globe size={18} strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-fg">Pilih Bahasa / Language</h2>
                  <p className="text-xs font-medium text-fg-muted">Select your language & preferred currency</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Tutup"
                className="rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg active:scale-95"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <div className="mt-5 space-y-2.5">
              {languages.map((lang) => {
                const active = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                      active
                        ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent/30 text-fg"
                        : "border-border/80 bg-surface/60 text-fg hover:border-accent/40 hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-fg">{lang.name}</p>
                        <p className="text-xs font-normal text-fg-muted">{lang.local}</p>
                      </div>
                    </div>
                    {active && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-fg shadow-xs">
                        <Check size={14} strokeWidth={2.5} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end border-t border-border/70 pt-4">
              <button
                onClick={handleClose}
                className="rounded-full bg-surface-2 px-5 py-2 text-xs font-semibold text-fg transition-colors hover:bg-surface-3 active:scale-95"
              >
                Lanjutkan / Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
