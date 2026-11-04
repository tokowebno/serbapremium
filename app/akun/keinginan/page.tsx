"use client";

import { Heart, Sparkles } from "lucide-react";
import { useWishlist } from "@/components/storefront/providers";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/components/storefront/i18n-provider";
import type { App } from "@/types";

export default function KeinginanPage() {
  const { ids } = useWishlist();
  const { lang } = useTranslation();
  const L = (en: string, id: string, zh: string) => (lang === "en" ? en : lang === "zh" ? zh : id);
  const apps: App[] = ids
    .map((id) => api.apps.getBySlug(id))
    .filter((a): a is App => a !== undefined);

  if (apps.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={L("Your wishlist is empty.", "Daftar keinginan masih kosong.", "您的心愿单还是空的。")}
        description={L(
          "Save the apps you like — we'll let you know when the price changes.",
          "Simpan aplikasi yang menarik minat Anda — kami kabari jika harganya berubah.",
          "收藏您喜欢的应用 — 价格变动时我们会通知您。",
        )}
        action={{ label: L("Explore Apps", "Jelajahi Aplikasi", "浏览应用"), href: "/aplikasi" }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
          {apps.length} {L("apps saved.", "aplikasi disimpan.", "个应用已收藏。")}
        </p>
        {apps.some((a) => a.originalPrice != null) && (
          <Badge tone="accent" className="flex items-center gap-1">
            <Sparkles size={11} />
            <span>{L("Some are on sale", "Sebagian sedang promo", "部分正在促销")}</span>
          </Badge>
        )}
      </div>
      <ProductGrid apps={apps} columns={3} />
    </div>
  );
}
