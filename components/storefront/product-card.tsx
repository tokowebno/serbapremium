"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import type { App } from "@/types";
import { AppIcon } from "@/components/ui/app-icon";
import { Rating } from "@/components/ui/rating";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { useWishlist } from "./providers";
import { useTranslation } from "./i18n-provider";
import { getLocalizedApp } from "@/lib/i18n/product-translations";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ app, index = 0 }: { app: App; index?: number }) {
  const { has, toggle } = useWishlist();
  const { lang, t } = useTranslation();
  const wished = has(app.id);
  const localized = getLocalizedApp(app, lang);

  // Cari harga termurah dari variasi (jika ada)
  const minPrice =
    app.variants && app.variants.length > 0
      ? Math.min(...app.variants.map((v) => v.price))
      : app.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25), ease: "easeOut" }}
      className="group relative h-full"
    >
      <div className="flex h-full flex-col rounded-md sm:rounded-lg border-2 border-border bg-surface p-3 sm:p-5 shadow-[2.5px_2.5px_0px_var(--shadow-color)] sm:shadow-[4px_4px_0px_var(--shadow-color)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 sm:hover:-translate-x-1 sm:hover:-translate-y-1 hover:shadow-[5px_5px_0px_var(--shadow-color)] sm:hover:shadow-[7px_7px_0px_var(--shadow-color)]">
        {/* Header card: Icon + Wishlist button */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/aplikasi/${app.slug}`} className="block transition-transform duration-100 group-hover:scale-105">
            <AppIcon icon={app.icon} size="md" />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(app.id);
            }}
            aria-label={wished ? "Hapus dari daftar keinginan" : "Tambahkan ke daftar keinginan"}
            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xs sm:rounded-sm border-1.5 sm:border-2 border-border bg-surface-2 text-fg shadow-[1.5px_1.5px_0px_var(--shadow-color)] sm:shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:bg-surface active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Heart
              size={14}
              strokeWidth={2.5}
              fill={wished ? "currentColor" : "none"}
              className={wished ? "text-discount sm:scale-110" : "text-fg sm:scale-110"}
            />
          </button>
        </div>

        {/* Info produk */}
        <div className="mt-2.5 sm:mt-4 flex-1">
          <Link href={`/aplikasi/${app.slug}`} className="block">
            <div className="flex items-center justify-between gap-1">
              <h3 className="truncate text-[13px] sm:text-[16px] font-black tracking-tight text-fg group-hover:text-accent-blue dark:group-hover:text-accent">
                {localized.name}
              </h3>
              <span className="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border border-border bg-surface-2 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                <ArrowUpRight size={14} strokeWidth={2.5} className="text-fg" />
              </span>
            </div>
            <p className="mt-0.5 sm:mt-1 line-clamp-1 text-[11px] sm:text-[13px] font-medium text-fg-muted">{localized.tagline}</p>
          </Link>

          {/* Rating & Stock */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
            <Rating value={app.rating} showValue={true} size={11} />
            <span
              className={`rounded-xs border border-border px-1 py-0.2 text-[9px] sm:text-[10px] font-black uppercase shadow-[1px_1px_0px_var(--shadow-color)] ${
                app.stock > 0
                  ? "bg-accent-soft text-fg"
                  : "bg-surface-3 text-fg-faint"
              }`}
            >
              {app.stock > 0
                ? `${t.product.stock} ${app.stock.toLocaleString(lang === "en" ? "en-US" : "id-ID")}`
                : t.product.outOfStock}
            </span>
          </div>

          {/* Platform badges */}
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
            {app.platforms.slice(0, 2).map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
            {app.platforms.length > 2 && (
              <span className="rounded-xs border border-border bg-surface-2 px-1 py-0.2 text-[9px] sm:text-[11px] font-bold text-fg">
                +{app.platforms.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Harga & Aksi Bawah: Mulai dari minPrice tanpa harga coret di card */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-end justify-between border-t-1.5 sm:border-t-2 border-border pt-2.5 sm:pt-3.5 gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-fg-muted">
              {lang === "en" ? "Starts from" : lang === "zh" ? "起价" : "Mulai dari"}
            </span>
            <span className="text-[13px] sm:text-base font-black tracking-tight tabular-nums text-fg">
              {formatPrice(minPrice, lang)}
            </span>
          </div>
          <Link
            href={`/aplikasi/${app.slug}`}
            className="text-center rounded-xs sm:rounded-sm border-1.5 border-border bg-accent-yellow px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-black text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {t.product.viewDetail || "Lihat Detail"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGrid({ apps, columns = 4 }: { apps: App[]; columns?: 2 | 3 | 4 }) {
  const cols = {
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];
  return (
    <div className={`grid ${cols} gap-2.5 sm:gap-5`}>
      {apps.map((app, i) => (
        <ProductCard key={app.id} app={app} index={i} />
      ))}
    </div>
  );
}
