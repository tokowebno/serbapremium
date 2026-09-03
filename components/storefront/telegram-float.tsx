"use client";

import { MessageCircle, Send } from "lucide-react";
import { useTranslation } from "./i18n-provider";

export function TelegramFloat() {
  const { lang } = useTranslation();

  return (
    <aside
      aria-label="Kontak Telegram Admin"
      className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6"
    >
      <a
        href="https://t.me/serbapremiumy"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Admin Telegram @serbapremiumy"
        className="group flex items-center gap-2 rounded-full bg-[#229ED9] hover:bg-[#1E88E5] text-white px-3.5 py-2.5 shadow-lg shadow-[#229ED9]/30 hover:shadow-[#229ED9]/50 transition-all duration-200 active:scale-95"
      >
        <Send size={16} className="fill-current -rotate-12 transition-transform duration-200 group-hover:scale-110" />
        <span className="text-xs font-bold tracking-tight">
          {lang === "en" ? "Admin Telegram" : lang === "zh" ? "联系客服 Telegram" : "Admin Telegram"}
        </span>
        <span className="hidden sm:inline-block text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded-full">
          @serbapremiumy
        </span>
      </a>
    </aside>
  );
}
