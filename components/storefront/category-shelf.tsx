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
            className="group flex shrink-0 items-center gap-2.5 rounded-md border-2 border-border bg-surface px-3.5 py-2 text-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent-yellow hover:text-black hover:shadow-[4px_4px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-xs border border-border bg-surface-2 group-hover:bg-black group-hover:text-yellow-300">
              <Icon size={14} strokeWidth={2.5} />
            </span>
            <span className="text-[13.5px] font-bold whitespace-nowrap">{localized.name}</span>
            <span className="rounded-xs border border-border bg-surface-2 px-1 py-0.2 text-[10px] font-black tabular-nums text-fg group-hover:bg-black group-hover:text-white">
              {c.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
