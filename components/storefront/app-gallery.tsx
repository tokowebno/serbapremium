"use client";

import { api } from "@/lib/api";
import { ProductGallery } from "./product-gallery";

/** Island klien: resolve app by slug, lalu render ProductGallery (client→client). */
export function AppGallery({ slug }: { slug: string }) {
  const app = api.apps.getBySlug(slug);
  if (!app) return null;
  return <ProductGallery app={app} />;
}
