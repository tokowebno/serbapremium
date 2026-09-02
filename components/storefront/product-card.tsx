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
      <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-surface/90 p-3.5 sm:p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1">
        {/* Header card: Icon + Wishlist button */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/aplikasi/${app.slug}`} className="block transition-transform duration-200 group-hover:scale-105">
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
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-surface-2/80 text-fg-muted transition-all duration-200 hover:bg-surface hover:text-fg hover:shadow-sm active:scale-95"
          >
            <Heart
              size={15}
              strokeWidth={2}
              fill={wished ? "currentColor" : "none"}
              className={wished ? "text-discount scale-110" : "text-fg-muted"}
            />
          </button>
        </div>

        {/* Info produk */}
        <div className="mt-3 sm:mt-4 flex-1">
          <Link href={`/aplikasi/${app.slug}`} className="block">
            <div className="flex items-center justify-between gap-1">
              <h3 className="truncate text-[14px] sm:text-[16px] font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
                {localized.name}
              </h3>
              <span className="hidden sm:flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ArrowUpRight size={13} strokeWidth={2} className="text-fg-muted" />
              </span>
            </div>
            <p className="mt-0.5 sm:mt-1 line-clamp-1 text-[11.5px] sm:text-[13px] font-normal text-fg-muted">{localized.tagline}</p>
          </Link>

          {/* Rating & Stock */}
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Rating value={app.rating} showValue={true} size={11} />
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                app.stock > 0
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-3 text-fg-faint"
              }`}
            >
              {app.stock > 0
                ? `${t.product.stock} ${app.stock.toLocaleString(lang === "en" ? "en-US" : "id-ID")}`
                : t.product.outOfStock}
            </span>
          </div>

          {/* Platform badges */}
          <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1">
            {app.platforms.slice(0, 2).map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
            {app.platforms.length > 2 && (
              <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-fg-muted ring-1 ring-border/50">
                +{app.platforms.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Harga & Aksi Bawah */}
        <div className="mt-3.5 sm:mt-4 flex items-center justify-between border-t border-border/70 pt-3 gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-fg-muted">
              {lang === "en" ? "Starts from" : lang === "zh" ? "起价" : "Mulai dari"}
            </span>
            <span className="text-[14px] sm:text-[16px] font-bold tracking-tight tabular-nums text-fg">
              {formatPrice(minPrice, lang)}
            </span>
          </div>
          <Link
            href={`/aplikasi/${app.slug}`}
            className="rounded-full bg-accent px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-accent-fg shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-95"
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
    <div className={`grid ${cols} gap-3 sm:gap-5`}>
      {apps.map((app, i) => (
        <ProductCard key={app.id} app={app} index={i} />
      ))}
    </div>
  );
}
