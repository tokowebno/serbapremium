"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

/**
 * Strip kategori berjalan horizontal — berhenti saat cursor di atasnya.
 * Konten digandakan dua kali agar loop mulus (translateX -50%).
 */
export function CategoryMarquee({ className }: { className?: string }) {
  const { lang } = useTranslation();
  const rawCats = api.categories.withCount().filter((c) => c.count > 0);
  const cats = rawCats.map((c) => ({
    ...c,
    ...getLocalizedCategory(c, lang),
  }));
  const items = [...cats, ...cats]; // duplikat untuk loop mulus

  return (
    <div
      className={cn("marquee relative overflow-hidden border-y border-border/80 bg-surface-2/60 py-3.5 select-none backdrop-blur-sm", className)}
      aria-hidden="true"
    >
      <div className="marquee-track items-center gap-3 pr-3">
        {items.map((c, i) => (
          <span
            key={`${c.id}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-fg shadow-xs backdrop-blur-sm"
          >
            <c.icon size={14} className="text-accent" />
            {c.name}
            <span className="rounded-full bg-surface-2 px-1.5 py-0.2 text-[10px] font-semibold tabular-nums text-fg-muted">
              {c.count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
