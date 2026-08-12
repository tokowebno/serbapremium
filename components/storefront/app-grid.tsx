"use client";

import type { App } from "@/types";
import { api } from "@/lib/api";
import { ProductGrid } from "./product-card";

/**
 * Island klien: server hanya mengirim daftar slug (serializable).
 * `App` berisi referensi ikon (fungsi) yang tidak bisa diserialisasi
 * lintas batas server→client, jadi resolusi data dilakukan di sisi klien —
 * pola yang sama dengan halaman fondasi (search-dialog, pembayaran).
 */
export function AppGrid({ slugs, columns = 4 }: { slugs: string[]; columns?: 2 | 3 | 4 }) {
  const apps = slugs
    .map((s) => api.apps.getBySlug(s))
    .filter((a): a is App => a !== undefined);
  return <ProductGrid apps={apps} columns={columns} />;
}
