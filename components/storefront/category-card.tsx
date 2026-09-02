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
        "group flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/20 transition-transform duration-200 group-hover:scale-105">
          <Icon size={20} strokeWidth={2} />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-fg-muted opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-105">
          <ArrowUpRight size={15} strokeWidth={2} />
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
          {localized.name}
        </h3>
        {localized.description && (
          <p className="mt-1 line-clamp-2 text-xs font-normal text-fg-muted">
            {localized.description}
          </p>
        )}
        {count !== undefined && (
          <span className="mt-3 inline-block rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-fg-muted">
            {count} {t.filter?.appsCount || "aplikasi"}
          </span>
        )}
      </div>
    </Link>
  );
}
