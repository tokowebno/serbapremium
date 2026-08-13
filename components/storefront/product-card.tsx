"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { App } from "@/types";
import { AppIcon } from "@/components/ui/app-icon";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { useWishlist } from "./providers";

export function ProductCard({ app, index = 0 }: { app: App; index?: number }) {
  const { has, toggle } = useWishlist();
  const wished = has(app.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        href={`/aplikasi/${app.slug}`}
        className="glass-card glass-card-hover flex h-full flex-col rounded-xl p-5"
      >
        <div className="flex items-start justify-between">
          <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
            <AppIcon icon={app.icon} size="lg" />
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              toggle(app.id);
            }}
            aria-label={wished ? "Hapus dari daftar keinginan" : "Tambahkan ke daftar keinginan"}
            className="rounded-full p-2 text-fg-faint transition-colors hover:text-discount"
          >
            <motion.span
              key={wished ? "w" : "n"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="block"
            >
              <Heart size={17} fill={wished ? "currentColor" : "none"} className={wished ? "text-discount" : ""} />
            </motion.span>
          </motion.button>
        </div>

        <div className="mt-4">
          <h3 className="text-[15px] font-semibold tracking-tight">{app.name}</h3>
          <p className="text-[13px] text-fg-muted">{app.tagline}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Rating value={app.rating} showValue={false} size={12} />
          <span className="text-xs text-fg-muted tabular-nums">
            {app.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
          </span>
          <span
            className={`text-xs font-medium tabular-nums ${
              app.stock > 0 ? "text-success" : "text-fg-faint"
            }`}
          >
            {app.stock > 0 ? `Stok ${app.stock.toLocaleString("id-ID")}` : "Stok habis"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.platforms.slice(0, 3).map((p) => (
            <PlatformBadge key={p} platform={p} />
          ))}
          {app.platforms.length > 3 && (
            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-fg-muted">
              +{app.platforms.length - 3}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <Price value={app.price} original={app.originalPrice} size="sm" />
          <span className="translate-x-1 text-[13px] font-medium text-accent opacity-0 transition-all duration-300 ease-smooth group-hover:translate-x-0 group-hover:opacity-100">
            Lihat detail
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductGrid({ apps, columns = 4 }: { apps: App[]; columns?: 2 | 3 | 4 }) {
  const cols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];
  return (
    <div className={`grid ${cols} gap-3 sm:gap-4`}>
      {apps.map((app, i) => (
        <ProductCard key={app.id} app={app} index={i} />
      ))}
    </div>
  );
}
