"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

export function CategoryShelf({ className }: { className?: string }) {
  const { lang } = useTranslation();
  const cats = api.categories.withCount().filter((c) => c.count > 0);

  return (
    <div className={cn("no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:px-0 py-2", className)}>
      {cats.map((c) => {
        const Icon = c.icon;
        const localized = getLocalizedCategory(c, lang);
        return (
          <Link
            key={c.id}
            href={`/kategori/${c.slug}`}
            className="group flex shrink-0 items-center gap-2.5 rounded-full border border-border/80 bg-surface/80 px-4 py-2 text-fg shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-accent/40 hover:bg-surface hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon size={13} strokeWidth={2} />
            </span>
            <span className="text-[13px] font-medium whitespace-nowrap">{localized.name}</span>
            <span className="rounded-full bg-surface-2 px-2 py-0.2 text-[10px] font-semibold tabular-nums text-fg-muted">
              {c.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
