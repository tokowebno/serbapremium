"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { Banner } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";
import { getLocalizedBanner } from "@/lib/i18n/product-translations";

const tones: Record<Banner["tone"], string> = {
  accent: "bg-gradient-to-r from-emerald-800 to-teal-900 text-white",
  graphite: "bg-gradient-to-r from-[#18191f] to-[#252830] text-white",
  warm: "bg-gradient-to-r from-amber-800 to-amber-950 text-white",
};

export function PromoBanner({ banner, className }: { banner: Banner; className?: string }) {
  const { lang, t } = useTranslation();
  const localized = getLocalizedBanner(banner, lang);

  return (
    <Link
      href={localized.href}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:p-8",
        tones[banner.tone] || tones.accent,
        className,
      )}
    >
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Flame size={12} /> {t.home?.exploreBadge || "Promo"}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{localized.title}</h3>
        <p className="mt-1 max-w-lg text-sm font-normal leading-relaxed opacity-85">{localized.description}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-md transition-all group-hover:bg-neutral-100 active:scale-95">
        {localized.cta}
        <ArrowRight size={15} strokeWidth={2.5} />
      </span>
    </Link>
  );
}
