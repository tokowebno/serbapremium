"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/components/storefront/providers";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import type { App } from "@/types";

export default function KeinginanPage() {
  const { ids } = useWishlist();
  const apps: App[] = ids
    .map((id) => api.apps.getBySlug(id))
    .filter((a): a is App => a !== undefined);

  if (apps.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Daftar keinginan masih kosong."
        description="Simpan aplikasi yang menarik minat Anda — kami kabari jika harganya berubah."
        action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">{apps.length} aplikasi disimpan.</p>
        {apps.some((a) => a.originalPrice != null) && (
          <Badge tone="accent">Sebagian sedang promo 🔥</Badge>
        )}
      </div>
      <ProductGrid apps={apps} columns={3} />
    </div>
  );
}