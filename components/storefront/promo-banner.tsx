"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { Banner } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";
import { getLocalizedBanner } from "@/lib/i18n/product-translations";

const tones: Record<Banner["tone"], string> = {
  accent: "bg-accent text-black",
  graphite: "bg-[#18191f] text-[#f4f4f0] border-white/80 dark:border-white",
  warm: "bg-accent-yellow text-black",
};

export function PromoBanner({ banner, className }: { banner: Banner; className?: string }) {
  const { lang, t } = useTranslation();
  const localized = getLocalizedBanner(banner, lang);

  return (
    <Link
      href={localized.href}
      className={cn(
        "group flex flex-col gap-4 rounded-lg border-2 border-border p-6 shadow-[5px_5px_0px_var(--shadow-color)] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] sm:flex-row sm:items-center sm:justify-between sm:p-8",
        tones[banner.tone] || tones.accent,
        className,
      )}
    >
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-xs border-1.5 border-current bg-black/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider">
            <Flame size={12} strokeWidth={2.8} /> {t.home.exploreBadge || "Promo"}
          </span>
        </div>
        <h3 className="text-2xl font-black tracking-tight">{localized.title}</h3>
        <p className="mt-1 max-w-lg text-[15px] font-medium leading-relaxed opacity-90">{localized.description}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-md border-2 border-current bg-white px-4 py-2.5 text-sm font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105">
        {localized.cta}
        <ArrowRight size={16} strokeWidth={2.8} />
      </span>
    </Link>
  );
}
