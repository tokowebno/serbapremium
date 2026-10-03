"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, X } from "lucide-react";
import { LanguageCode } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function IndonesiaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={cn(
        "rounded-[4px] shadow-xs border border-black/15 dark:border-white/20 shrink-0 overflow-hidden",
        className,
      )}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="10" fill="#E11414" />
      <rect y="10" width="28" height="10" fill="#FFFFFF" />
    </svg>
  );
}

export function EnglishFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={cn(
        "rounded-[4px] shadow-xs border border-black/15 dark:border-white/20 shrink-0 overflow-hidden",
        className,
      )}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="20" fill="#B22234" />
      <rect y="3.1" width="28" height="3.1" fill="#FFFFFF" />
      <rect y="9.2" width="28" height="3.1" fill="#FFFFFF" />
      <rect y="15.4" width="28" height="3.1" fill="#FFFFFF" />
      <rect width="12" height="10.8" fill="#3C3B6E" />
      <circle cx="3.5" cy="3.2" r="0.8" fill="#FFFFFF" />
      <circle cx="8.5" cy="3.2" r="0.8" fill="#FFFFFF" />
      <circle cx="6" cy="5.4" r="0.8" fill="#FFFFFF" />
      <circle cx="3.5" cy="7.6" r="0.8" fill="#FFFFFF" />
      <circle cx="8.5" cy="7.6" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

export function ChinaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={cn(
        "rounded-[4px] shadow-xs border border-black/15 dark:border-white/20 shrink-0 overflow-hidden",
        className,
      )}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="20" fill="#DE2910" />
      <polygon
        points="5.5,2.5 6.6,5.8 10,5.8 7.3,7.8 8.3,11.1 5.5,9.1 2.7,11.1 3.7,7.8 1,5.8 4.4,5.8"
        fill="#FFDE00"
      />
      <circle cx="12" cy="3.5" r="0.8" fill="#FFDE00" />
      <circle cx="13.8" cy="5.8" r="0.8" fill="#FFDE00" />
      <circle cx="13.8" cy="8.8" r="0.8" fill="#FFDE00" />
      <circle cx="12" cy="11.2" r="0.8" fill="#FFDE00" />
    </svg>
  );
}

const UI_TEXT = {
  id: {
    title: "Pilih Bahasa",
    subtitle: "Pilih bahasa tampilan dan mata uang preferensi Anda",
    confirmBtn: "Simpan & Lanjutkan",
    closeAria: "Tutup",
    dialogAria: "Pilih Bahasa",
    languages: [
      {
        code: "id" as LanguageCode,
        name: "Bahasa Indonesia",
        desc: "Mata Uang Rupiah (IDR Rp)",
        currencyTag: "IDR (Rp)",
        Flag: IndonesiaFlag,
      },
      {
        code: "en" as LanguageCode,
        name: "English",
        desc: "Mata Uang Dolar AS (USD $)",
        currencyTag: "USD ($)",
        Flag: EnglishFlag,
      },
      {
        code: "zh" as LanguageCode,
        name: "简体中文",
        desc: "Mata Uang Dolar AS (USD $)",
        currencyTag: "USD ($)",
        Flag: ChinaFlag,
      },
    ],
  },
  en: {
    title: "Select Language",
    subtitle: "Choose your display language and preferred currency",
    confirmBtn: "Save & Continue",
    closeAria: "Close",
    dialogAria: "Select Language",
    languages: [
      {
        code: "id" as LanguageCode,
        name: "Bahasa Indonesia",
        desc: "Indonesian Rupiah Currency (IDR Rp)",
        currencyTag: "IDR (Rp)",
        Flag: IndonesiaFlag,
      },
      {
        code: "en" as LanguageCode,
        name: "English",
        desc: "US Dollar Currency (USD $)",
        currencyTag: "USD ($)",
        Flag: EnglishFlag,
      },
      {
        code: "zh" as LanguageCode,
        name: "Simplified Chinese (简体中文)",
        desc: "US Dollar Currency (USD $)",
        currencyTag: "USD ($)",
        Flag: ChinaFlag,
      },
    ],
  },
  zh: {
    title: "选择语言",
    subtitle: "选择您的首选显示语言与结算货币",
    confirmBtn: "保存并继续",
    closeAria: "关闭",
    dialogAria: "选择语言",
    languages: [
      {
        code: "id" as LanguageCode,
        name: "印度尼西亚语 (Bahasa Indonesia)",
        desc: "印尼盾结算 (IDR Rp)",
        currencyTag: "IDR (Rp)",
        Flag: IndonesiaFlag,
      },
      {
        code: "en" as LanguageCode,
        name: "英语 (English)",
        desc: "美元结算 (USD $)",
        currencyTag: "USD ($)",
        Flag: EnglishFlag,
      },
      {
        code: "zh" as LanguageCode,
        name: "简体中文",
        desc: "美元结算 (USD $)",
        currencyTag: "USD ($)",
        Flag: ChinaFlag,
      },
    ],
  },
};

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<LanguageCode>("id");
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("id");

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:serbapremium-lang|tokono-lang)=([^;]+)/);
    if (cookieMatch && cookieMatch[1]) {
      const lang = cookieMatch[1] as LanguageCode;
      setActiveLang(lang);
      setSelectedLang(lang);
    }

    const chosen =
      localStorage.getItem("serbapremium:lang-chosen") ||
      localStorage.getItem("tokono:lang-chosen");
    if (!chosen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-language-selector", handleOpen);
    return () => window.removeEventListener("open-language-selector", handleOpen);
  }, []);

  const handleApply = (codeToApply?: LanguageCode) => {
    const targetCode = codeToApply || selectedLang;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `serbapremium-lang=${targetCode}; path=/; expires=${expires}; SameSite=Lax;`;
    document.cookie = `tokono-lang=${targetCode}; path=/; expires=${expires}; SameSite=Lax;`;
    localStorage.setItem("serbapremium:lang", targetCode);
    localStorage.setItem("serbapremium:lang-chosen", "true");
    localStorage.setItem("tokono:lang-chosen", "true");
    setIsOpen(false);
    window.location.reload();
  };

  const handleClose = () => {
    localStorage.setItem("serbapremium:lang-chosen", "true");
    setIsOpen(false);
  };

  const currentUi = UI_TEXT[selectedLang] || UI_TEXT.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
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
            aria-label={currentUi.dialogAria}
            className="relative w-full max-w-md rounded-3xl border border-black/10 dark:border-white/15 bg-surface/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-7"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/20">
                  <Globe size={20} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-fg">
                    {currentUi.title}
                  </h2>
                  <p className="text-xs font-normal text-fg-muted mt-0.5">
                    {currentUi.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={currentUi.closeAria}
                className="rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg active:scale-95 cursor-pointer"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Language Options List */}
            <div className="mt-5 space-y-2.5">
              {currentUi.languages.map((item) => {
                const isSelected = selectedLang === item.code;
                const FlagComponent = item.Flag;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(item.code);
                    }}
                    onDoubleClick={() => handleApply(item.code)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer select-none",
                      isSelected
                        ? "border-accent bg-accent/[0.08] shadow-xs ring-1 ring-accent/30 text-fg"
                        : "border-border/80 bg-surface/60 text-fg hover:border-accent/40 hover:bg-surface-2/60",
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <FlagComponent className="w-8 h-5.5 shadow-sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-fg tracking-tight">
                            {item.name}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full",
                              isSelected
                                ? "bg-accent text-accent-fg"
                                : "bg-surface-2 text-fg-muted border border-border",
                            )}
                          >
                            {item.currencyTag}
                          </span>
                        </div>
                        <p className="text-xs font-normal text-fg-muted mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full transition-all shrink-0",
                        isSelected
                          ? "bg-accent text-accent-fg shadow-xs scale-100"
                          : "border border-border text-transparent scale-90",
                      )}
                    >
                      <Check size={13} strokeWidth={3} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-semibold text-fg-muted hover:text-fg transition-colors px-2 py-1 cursor-pointer"
              >
                {currentUi.closeAria}
              </button>

              <button
                type="button"
                onClick={() => handleApply()}
                className="rounded-full bg-fg text-surface px-6 py-2.5 text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm cursor-pointer"
              >
                {currentUi.confirmBtn}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
