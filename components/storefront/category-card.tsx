"use client";

import Link from "next/link";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Bot,
  Film,
  ShieldCheck,
  Mail,
  Heart,
  Database,
  PenTool,
  Zap,
  Gift,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "./i18n-provider";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

const categoryIconMap: Record<string, typeof Zap> = {
  ai: Bot,
  streaming: Film,
  vpn: ShieldCheck,
  akun: Mail,
  sosial: Heart,
  developer: Database,
  kreatif: PenTool,
  tools: Zap,
  lisensi: Gift,
  pendidikan: BookOpen,
};

export function CategoryCard({
  category,
  count,
  className,
}: {
  category: { id: string; slug: string; name: string; description?: string };
  count?: number;
  className?: string;
}) {
  const { lang, t } = useTranslation();
  const localized = getLocalizedCategory(category as Category, lang);
  const Icon = categoryIconMap[category.slug] || categoryIconMap[category.id] || Zap;

  return (
    <Link
      href={`/kategori/${category.slug}`}
      className={cn(
        "group flex flex-col justify-between rounded-lg border-2 border-border bg-surface p-5 shadow-[4px_4px_0px_var(--shadow-color)] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_var(--shadow-color)]",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-border bg-accent-yellow text-black shadow-[2px_2px_0px_var(--shadow-color)] transition-transform duration-100 group-hover:scale-105">
          <Icon size={22} strokeWidth={2.5} />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-xs border border-border bg-surface-2 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
          <ArrowUpRight size={15} strokeWidth={2.5} className="text-fg" />
        </span>
      </div>
      <div className="mt-6">
        <h3 className="text-[17px] font-black tracking-tight text-fg group-hover:text-accent-blue dark:group-hover:text-accent">
          {localized.name}
        </h3>
        {count != null && (
          <p className="mt-1 text-xs font-bold text-fg-muted">
            <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.2 text-fg tabular-nums">
              {count}
            </span>{" "}
            {t.navbar?.apps ? t.navbar.apps.toLowerCase() : "aplikasi"}
          </p>
        )}
      </div>
    </Link>
  );
}
