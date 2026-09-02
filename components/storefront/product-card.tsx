"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import type { App } from "@/types";
import { AppIcon } from "@/components/ui/app-icon";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { useWishlist } from "./providers";
import { useTranslation } from "./i18n-provider";
import { getLocalizedApp } from "@/lib/i18n/product-translations";

export function ProductCard({ app, index = 0 }: { app: App; index?: number }) {
  const { has, toggle } = useWishlist();
  const { lang, t } = useTranslation();
  const wished = has(app.id);
  const localized = getLocalizedApp(app, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25), ease: "easeOut" }}
      className="group relative h-full"
    >
      <div className="flex h-full flex-col rounded-lg border-2 border-border bg-surface p-5 shadow-[4px_4px_0px_var(--shadow-color)] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_var(--shadow-color)]">
        {/* Header card: Icon + Wishlist button */}
        <div className="flex items-start justify-between gap-3">
          <Link href={`/aplikasi/${app.slug}`} className="block transition-transform duration-100 group-hover:scale-105">
            <AppIcon icon={app.icon} size="lg" />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(app.id);
            }}
            aria-label={wished ? "Hapus dari daftar keinginan" : "Tambahkan ke daftar keinginan"}
            className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface-2 text-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:bg-surface hover:shadow-[3px_3px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Heart
              size={17}
              strokeWidth={2.5}
              fill={wished ? "currentColor" : "none"}
              className={wished ? "text-discount" : "text-fg"}
            />
          </button>
        </div>

        {/* Info produk */}
        <div className="mt-4 flex-1">
          <Link href={`/aplikasi/${app.slug}`} className="block">
            <div className="flex items-center justify-between gap-1.5">
              <h3 className="truncate text-[16px] font-black tracking-tight text-fg group-hover:text-accent-blue dark:group-hover:text-accent">
                {localized.name}
              </h3>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border border-border bg-surface-2 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                <ArrowUpRight size={14} strokeWidth={2.5} className="text-fg" />
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-[13px] font-medium text-fg-muted">{localized.tagline}</p>
          </Link>

          {/* Rating & Stock */}
          <div className="mt-3 flex items-center gap-2">
            <Rating value={app.rating} showValue={false} size={13} />
            <span className="text-xs font-bold tabular-nums text-fg">
              {app.rating.toLocaleString(lang === "en" ? "en-US" : "id-ID", { minimumFractionDigits: 1 })}
            </span>
            <span
              className={`rounded-xs border border-border px-1.5 py-0.2 text-[10px] font-black uppercase shadow-[1px_1px_0px_var(--shadow-color)] ${
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
          <div className="mt-3 flex flex-wrap gap-1.5">
            {app.platforms.slice(0, 3).map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
            {app.platforms.length > 3 && (
              <span className="rounded-xs border-2 border-border bg-surface-2 px-1.5 py-0.5 text-[11px] font-bold text-fg">
                +{app.platforms.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Harga & Aksi Bawah */}
        <div className="mt-4 flex items-baseline justify-between border-t-2 border-border pt-3.5">
          <Price value={app.price} original={app.originalPrice} size="sm" />
          <Link
            href={`/aplikasi/${app.slug}`}
            className="rounded-sm border-1.5 border-border bg-accent-yellow px-2.5 py-1 text-xs font-black text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {t.product.viewDetail || "Detail"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGrid({ apps, columns = 4 }: { apps: App[]; columns?: 2 | 3 | 4 }) {
  const cols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];
  return (
    <div className={`grid ${cols} gap-4 sm:gap-5`}>
      {apps.map((app, i) => (
        <ProductCard key={app.id} app={app} index={i} />
      ))}
    </div>
  );
}
